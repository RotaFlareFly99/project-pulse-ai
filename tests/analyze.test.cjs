const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createAnalyzeHandler, createAdmissionControl, MAX_REQUEST_BYTES, MAX_RESPONSE_CHARS } = require("../.test-build/analyze-handler.js");
const { ProjectUpdateSchema, AnalysisResultSchema, SHORT_TEXT_MAX, NARRATIVE_TEXT_MAX } = require("../.test-build/schemas.js");
const { readStoredReport } = require("../.test-build/stored-report.js");
const { defaultProjectData } = require("../.test-build/constants.js");

const input = Object.fromEntries(Object.keys(ProjectUpdateSchema.shape).map(key => [key, "Synthetic project update for testing."]));
const analysis = {
  executiveSummary: "Synthetic summary for a test of response handling.",
  healthStatus: "Yellow", confidence: 65,
  topRisks: ["Synthetic risk requiring review."],
  recommendedNextActions: ["Review the supplied evidence."],
  executiveBrief: "Synthetic executive brief for response contract verification."
};
function harness(overrides = {}) {
  const calls = [];
  const logs = [];
  const handler = createAnalyzeHandler({
    configured: () => true,
    generate: async (data, signal) => { calls.push({ data, signal }); return { text: JSON.stringify(analysis), status: "completed" }; },
    admit: createAdmissionControl(),
    log: (...args) => logs.push(args),
    ...overrides
  });
  return { handler, calls, logs };
}
function request(body = JSON.stringify(input), headers = {}) {
  return new Request("http://localhost/api/analyze", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body });
}
async function safeFailure(h, req, status, secret = "sensitive-marker") {
  const response = await h.handler(req);
  assert.equal(response.status, status);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.match(response.headers.get("x-request-id"), /^[0-9a-f-]{36}$/);
  const body = await response.json();
  assert.equal(typeof body.error, "string");
  assert.equal(JSON.stringify(body).includes(secret), false);
  assert.equal(JSON.stringify(h.logs).includes(secret), false);
  assert.equal("raw" in body, false);
  return response;
}

test("valid input preserves the analysis response and strips unknown output fields", async () => {
  const h = harness({ generate: async () => ({ text: JSON.stringify({ ...analysis, private: "sensitive-marker" }), status: "completed" }) });
  const response = await h.handler(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), analysis);
  assert.equal(response.headers.get("cache-control"), "no-store");
});
test("schema trims input, accepts exact limits and rejects above-limit/whitespace text", () => {
  for (const key of Object.keys(input)) {
    const max = ["projectName", "reportingPeriod", "projectPhase", "projectSponsor", "projectManager", "milestoneStatus"].includes(key) ? SHORT_TEXT_MAX : NARRATIVE_TEXT_MAX;
    assert.equal(ProjectUpdateSchema.safeParse({ ...input, [key]: "x".repeat(max) }).success, true);
    assert.equal(ProjectUpdateSchema.safeParse({ ...input, [key]: "x".repeat(max + 1) }).success, false);
    assert.equal(ProjectUpdateSchema.safeParse({ ...input, [key]: " ".repeat(20) }).success, false);
  }
  assert.equal(ProjectUpdateSchema.parse({ ...input, projectName: "  Demo  " }).projectName, "Demo");
  assert.equal(AnalysisResultSchema.safeParse({ ...analysis, confidence: 101 }).success, false);
});
test("existing bundled demo remains valid and reaches the model adapter", async () => {
  const h = harness();
  assert.equal((await h.handler(request(JSON.stringify(defaultProjectData)))).status, 200);
  assert.deepEqual(h.calls[0].data, defaultProjectData);
});
test("malformed JSON returns 400 without invoking model", async () => {
  const h = harness(); await safeFailure(h, request('{"sensitive-marker":'), 400); assert.equal(h.calls.length, 0);
});
test("invalid schema returns 400 without echoing values or invoking model", async () => {
  const h = harness(); await safeFailure(h, request(JSON.stringify({ ...input, projectName: ["sensitive-marker"] })), 400); assert.equal(h.calls.length, 0);
});
test("wrong media type returns 415", async () => {
  const h = harness(); await safeFailure(h, request("sensitive-marker", { "Content-Type": "text/plain" }), 415); assert.equal(h.calls.length, 0);
});
test("JSON charset content type is accepted", async () => {
  assert.equal((await harness().handler(request(JSON.stringify(input), { "Content-Type": "Application/JSON; charset=utf-8" }))).status, 200);
});
test("missing configuration returns generic 503", async () => {
  await safeFailure(harness({ configured: () => false }), request(), 503, "OPENAI_API_KEY");
});
test("declared oversized body is rejected before model invocation", async () => {
  const h = harness(); await safeFailure(h, request("{}", { "Content-Length": String(MAX_REQUEST_BYTES + 1) }), 413); assert.equal(h.calls.length, 0);
});
test("streamed multibyte body is limited by bytes even with understated length", async () => {
  const h = harness();
  const bytes = new TextEncoder().encode("é".repeat(MAX_REQUEST_BYTES / 2 + 1));
  const stream = new ReadableStream({ start(c) { c.enqueue(bytes.slice(0, 100)); c.enqueue(bytes.slice(100)); c.close(); } });
  const req = new Request("http://localhost/api/analyze", { method: "POST", body: stream, duplex: "half", headers: { "Content-Type": "application/json", "Content-Length": "2" } });
  await safeFailure(h, req, 413); assert.equal(h.calls.length, 0);
});
test("body without Content-Length is bounded", async () => {
  const h = harness(); await safeFailure(h, request("x".repeat(MAX_REQUEST_BYTES + 1)), 413); assert.equal(h.calls.length, 0);
});
test("invalid UTF-8 returns 400", async () => {
  await safeFailure(harness(), request(new Uint8Array([0xff])), 400);
});
test("slow body returns 408 and releases admission slot", async () => {
  const admit = createAdmissionControl(10, 60000, 1);
  const h = harness({ admit, bodyTimeoutMs: 10 });
  const body = new ReadableStream({ start() {} });
  const req = new Request("http://localhost/api/analyze", { method: "POST", body, duplex: "half", headers: { "Content-Type": "application/json" } });
  await safeFailure(h, req, 408);
  assert.equal((await h.handler(request())).status, 200);
});
for (const [name, output] of [
  ["non-JSON", { text: "sensitive-marker", status: "completed" }],
  ["schema-invalid", { text: JSON.stringify({ executiveSummary: "sensitive-marker" }), status: "completed" }],
  ["empty", { text: "", status: "completed" }],
  ["truncated", { text: JSON.stringify(analysis), status: "incomplete" }],
  ["oversized", { text: "sensitive-marker".padEnd(MAX_RESPONSE_CHARS + 1, "x"), status: "completed" }]
]) test(name + " model output returns sanitized 502", async () => {
  await safeFailure(harness({ generate: async () => output }), request(), 502);
});
test("upstream exception is sanitized in response and logs", async () => {
  const h = harness({ generate: async () => { throw new Error("sensitive-marker"); } });
  await safeFailure(h, request(), 502);
  assert.equal(h.logs[0][0], "upstream_failure");
});
test("unexpected internal exception is sanitized", async () => {
  await safeFailure(harness({ configured: () => { throw new Error("sensitive-marker"); } }), request(), 500);
});
test("model timeout returns 504 and aborts upstream request", async () => {
  let signal;
  const h = harness({ modelTimeoutMs: 10, generate: async (_, s) => { signal = s; return new Promise(() => {}); } });
  await safeFailure(h, request(), 504);
  assert.equal(signal.aborted, true);
});
test("quota rejection returns 429 with Retry-After and makes no model call", async () => {
  const h = harness({ admit: createAdmissionControl(1) });
  await safeFailure(h, request("{"), 400);
  const response = await safeFailure(h, request(), 429);
  assert.ok(Number(response.headers.get("retry-after")) >= 1);
  assert.equal(h.calls.length, 0);
});
test("admission control limits concurrency, releases once, resets window", () => {
  let now = 0;
  const admit = createAdmissionControl(2, 1000, 1, () => now);
  const first = admit(); assert.equal(first.allowed, true);
  assert.equal(admit().allowed, false);
  first.release(); first.release();
  const second = admit(); assert.equal(second.allowed, true); second.release();
  assert.equal(admit().allowed, false);
  now = 1000;
  assert.equal(admit().allowed, true);
});
test("schema failure releases concurrency slot", async () => {
  const h = harness({ admit: createAdmissionControl(10, 60000, 1) });
  await safeFailure(h, request("{}"), 400);
  assert.equal((await h.handler(request())).status, 200);
});
test("stored report accepts valid data and safely rejects absent, corrupt or unavailable storage", () => {
  const valid = { pulseInput: JSON.stringify(input), pulseAnalysis: JSON.stringify(analysis) };
  assert.deepEqual(readStoredReport({ getItem: key => valid[key] }), { input, analysis });
  assert.equal(readStoredReport({ getItem: () => null }), null);
  assert.equal(readStoredReport({ getItem: () => "{" }), null);
  assert.equal(readStoredReport({ getItem: () => "{}" }), null);
  assert.equal(readStoredReport({ getItem: () => { throw new Error("blocked"); } }), null);
});
