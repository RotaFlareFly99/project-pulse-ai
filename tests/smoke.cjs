const { spawn } = require("node:child_process");
const assert = require("node:assert/strict");
const env = { ...process.env, NEXT_TELEMETRY_DISABLED: "1" };
delete env.OPENAI_API_KEY;
const base = "http://127.0.0.1:3127";
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3127"], { env, stdio: ["ignore", "pipe", "pipe"] });
let exited = false;
let listening = false;
server.stdout.on("data", data => { if (data.toString().includes("Ready in")) listening = true; });
server.on("exit", () => { exited = true; });
server.stderr.on("data", data => process.stderr.write(data));

(async () => {
  try {
    let ready = false;
    for (let i = 0; i < 60; i++) {
      if (exited) throw new Error("Smoke server exited before becoming ready.");
      try { if (listening) { await fetch(base); ready = true; break; } await new Promise(resolve => setTimeout(resolve, 250)); }
      catch { await new Promise(resolve => setTimeout(resolve, 250)); }
    }
    assert.equal(ready, true);
    for (const path of ["/", "/form", "/results", "/about"]) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200);
      console.log("PASS GET " + path + ": 200");
    }
    for (const [type, status] of [["application/json", 503], ["text/plain", 415]]) {
      const response = await fetch(base + "/api/analyze", {
        method: "POST", headers: { "Content-Type": type }, body: "{}"
      });
      const body = await response.json();
      assert.equal(response.status, status);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.equal(JSON.stringify(body).includes("OPENAI_API_KEY"), false);
      assert.equal("raw" in body, false);
      console.log("PASS POST " + type + ": " + status);
    }
  } finally { server.kill("SIGTERM"); }
})().catch(error => { console.error(error); process.exitCode = 1; });
