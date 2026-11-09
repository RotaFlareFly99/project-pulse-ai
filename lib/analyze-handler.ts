import { randomUUID } from "node:crypto";
import { AnalysisResultSchema, ProjectUpdateSchema, type ProjectUpdateInput } from "./schemas";

export const MAX_REQUEST_BYTES = 160 * 1024;
export const MAX_RESPONSE_CHARS = 40000;

class RequestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function readJson(req: Request, timeoutMs: number): Promise<unknown> {
  const length = req.headers.get("content-length");
  if (length && /^\d+$/.test(length) && Number(length) > MAX_REQUEST_BYTES) {
    throw new RequestError(413, "Request body is too large.");
  }
  if (!req.body) throw new RequestError(400, "Invalid JSON request.");
  const reader = req.body.getReader();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const read = async () => {
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_REQUEST_BYTES) throw new RequestError(413, "Request body is too large.");
        chunks.push(value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
      catch { throw new RequestError(400, "Invalid JSON request."); }
    };
    return await Promise.race([
      read(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new RequestError(408, "Request body timed out."));
          void reader.cancel().catch(() => {});
        }, timeoutMs);
      })
    ]);
  } finally {
    clearTimeout(timer);
    void reader.cancel().catch(() => {});
  }
}

// Global per process: avoids trusting spoofable forwarding/IP headers.
// Not a distributed limiter or an authentication boundary.
export function createAdmissionControl(limit = 10, windowMs = 60000, concurrency = 2, now = Date.now) {
  let start = now();
  let count = 0;
  let active = 0;
  return () => {
    const time = now();
    if (time - start >= windowMs) { start = time; count = 0; }
    if (count >= limit || active >= concurrency) {
      return { allowed: false as const, retryAfter: Math.max(1, Math.ceil((start + windowMs - time) / 1000)) };
    }
    count++;
    active++;
    let released = false;
    return {
      allowed: true as const,
      release() { if (!released) { active--; released = true; } }
    };
  };
}

type Dependencies = {
  configured: () => boolean;
  generate: (input: ProjectUpdateInput, signal: AbortSignal) => Promise<{ text: string; status: string }>;
  admit: ReturnType<typeof createAdmissionControl>;
  log: (event: string, requestId: string) => void;
  bodyTimeoutMs?: number;
  modelTimeoutMs?: number;
};

export function createAnalyzeHandler(deps: Dependencies) {
  return async (req: Request): Promise<Response> => {
    const requestId = randomUUID();
    const reply = (body: unknown, status: number, headers: Record<string, string> = {}) =>
      Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Request-Id": requestId, ...headers } });
    const fail = (error: string, status: number) => reply({ error }, status);
    let release: (() => void) | undefined;
    try {
      if (req.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
        return fail("Content-Type must be application/json.", 415);
      }
      if (!deps.configured()) return fail("Analysis service is unavailable.", 503);
      const admission = deps.admit();
      if (!admission.allowed) return reply({ error: "Too many requests. Please try again later." }, 429, { "Retry-After": String(admission.retryAfter) });
      release = admission.release;
      const rawInput = await readJson(req, deps.bodyTimeoutMs ?? 5000);
      const parsedInput = ProjectUpdateSchema.safeParse(rawInput);
      if (!parsedInput.success) {
        return reply({ error: "Invalid input payload.", details: parsedInput.error.flatten() }, 400);
      }
      const controller = new AbortController();
      let timer: ReturnType<typeof setTimeout> | undefined;
      let output: { text: string; status: string };
      try {
        output = await Promise.race([
          deps.generate(parsedInput.data, controller.signal),
          new Promise<never>((_, reject) => {
            timer = setTimeout(() => {
              controller.abort();
              reject(new Error("timeout"));
            }, deps.modelTimeoutMs ?? 30000);
          })
        ]);
      } catch {
        deps.log(controller.signal.aborted ? "model_timeout" : "upstream_failure", requestId);
        return fail(controller.signal.aborted ? "Analysis timed out. Please try again." : "Unable to generate analysis. Please try again.", controller.signal.aborted ? 504 : 502);
      } finally { clearTimeout(timer); }

      let json: unknown;
      try {
        if (output.status !== "completed" || typeof output.text !== "string" || output.text.length > MAX_RESPONSE_CHARS) throw new Error();
        json = JSON.parse(output.text);
      } catch {
        deps.log("invalid_model_output", requestId);
        return fail("Unable to generate a valid analysis. Please try again.", 502);
      }
      const parsedOutput = AnalysisResultSchema.safeParse(json);
      if (!parsedOutput.success) {
        deps.log("invalid_model_output", requestId);
        return fail("Unable to generate a valid analysis. Please try again.", 502);
      }
      return reply(parsedOutput.data, 200);
    } catch (error) {
      if (error instanceof RequestError) return fail(error.message, error.status);
      deps.log("internal_failure", requestId);
      return fail("Unable to analyze the project update. Please try again.", 500);
    } finally { release?.(); }
  };
}
