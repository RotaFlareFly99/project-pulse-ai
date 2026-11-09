# Targeted security and reliability review — 2026-11-09

## Scope and evidence

Baseline: main commit `65dc01e2d642b37dd957366119d0ab80f1042da4`. Reviewed the analysis route, schemas, intake form, result storage, package manifest and repository tree. This is a targeted source review plus local tests, not a penetration test, dependency audit or deployment assessment. No public deployment, compromise or ongoing error is established.

Documentation PR [#2](https://github.com/RotaFlareFly99/project-pulse-ai/pull/2) was verified open and draft. It changes README and three documentation files. This change starts separately from main, leaves that PR and its files unchanged, and adds this dated record. Its prior static observations describe the old baseline and remain historical evidence.

## Findings and changes

| Priority | Verified source finding at baseline | Proposed implementation |
| --- | --- | --- |
| High | Schema-invalid AI output returns raw model text; exceptions return their message | Fixed client errors; no raw response or exception details in error payloads or application logs; safe event names and request IDs only |
| High | Request JSON parsing, upstream failures and model JSON parsing share one catch | Invalid request JSON/UTF-8: 400; wrong content type: 415; oversized body: 413; body timeout: 408; model parsing/schema/incomplete response or upstream failure: 502; model deadline: 504; missing configuration: generic 503; unexpected errors: generic 500 |
| High | Input strings have only minimum lengths; body is buffered without a cap | Trim input, retain minimums, add 200-character short-field and 4,000-character narrative limits; mirror limits in form controls; limit streamed UTF-8 request bytes to 160 KiB before JSON parsing, including without/with understated Content-Length |
| High | No admission control or application-level deadline/token cap | Per-process limit of 10 admitted requests per fixed 60-second window and 2 concurrent handlers; 429 with Retry-After; 5-second body deadline, 30-second model deadline/abort, SDK retries disabled, 2,400 output tokens |
| Medium | Output strings unbounded and JSON completion status unchecked | Preserve successful response shape and existing array/confidence constraints; bound output strings and raw response to 40,000 characters; reject incomplete/empty/invalid JSON |
| Medium | Malformed/inaccessible session storage can throw on the results page | Safely parse both stored objects; use existing empty state when either is unavailable or invalid |
| Critical follow-up | Manifest pins Next.js 15.0.3 with App Router | The [official advisory](https://nextjs.org/blog/CVE-2025-66478) identifies affected App Router releases and remote-code-execution risk. Dependency remains unchanged in this focused PR. Upgrade to a currently supported, patched release and verify all current advisories before any public deployment |
| Reliability follow-up | Plain dependency installation fails | Existing Next.js/React peer conflict; no baseline lockfile. Dependency compatibility and reproducibility require a separate resolved dependency set and committed lockfile |

Responses set Cache-Control: no-store and X-Request-Id. Input validation details use only fixed-schema Zod constraint messages; submitted values are not echoed. Unknown input properties are stripped before forwarding. Unknown output properties are stripped before returning a successful response.

The same model, temperature, intake fields, result fields, report format and navigation are retained. The model request separates instructions from untrusted project data and sets store: false. This does not establish zero data retention across all provider systems. API references: [Responses parameters](https://developers.openai.com/api/reference/resources/responses/methods/create), [storage option](https://developers.openai.com/api/docs/guides/migrate-to-responses).

## Executed local verification

Environment: Node 24.22.1, npm 11.9.0. Resolved key packages: Next.js 15.0.3, React/React DOM 19.0.0, OpenAI 4.104.0, Zod 3.25.76, TypeScript 5.9.3, ESLint 9.39.5.

| Command/check | Observed result |
| --- | --- |
| npm install --ignore-scripts --fetch-retries=0 --fetch-timeout=20000 | Failed ERESOLVE: Next.js 15.0.3 peer range does not accept stable React 19.0.0 |
| npm install --ignore-scripts --legacy-peer-deps --package-lock=false --fetch-retries=0 --fetch-timeout=20000 | Installed 390 packages; warned about Next.js security advisory. Peer checks bypassed only for local verification |
| npm test | 25 tests passed, 0 failed; TypeScript-compiled handler/schema/storage tests with synthetic model responses and exceptions |
| npm run typecheck | Passed |
| npm run lint | Passed; no ESLint warnings/errors |
| npm run build | Passed compilation, lint/type validation, static page generation and build finalization |
| Local production-server HTTP smoke check | GET /, /form, /results, /about: 200. With API key explicitly removed: POST JSON returned generic 503; POST text/plain returned 415. no-store verified |
| git diff --check | Passed |

The tests cover schema boundaries and whitespace, existing bundled demo acceptance, preserved success contract, sanitized error bodies/logs, malformed JSON/UTF-8, body byte accounting, content type, slow body timeout, malformed/schema-invalid/empty/oversized/incomplete model output, upstream/internal errors, model abort deadline, rate/concurrency limits, slot release and stored-report failures.

These are local execution results against the proposed source. Mocked model tests are not successful live API calls. HTTP page responses do not establish browser rendering, interaction, clipboard/export behavior or accessibility. No live API request, API billing/latency measurement, exploit attempt, model-quality evaluation, load test, business-impact measurement or deployment was performed.

## Reproduce

Use Node 22 or later with the repository checkout. The recorded environment used Node 24.22.1. The temporary peer bypass below reproduces the test environment; it is not the dependency resolution recommended for release:

```sh
npm install --ignore-scripts --legacy-peer-deps --package-lock=false
npm test
npm run typecheck
npm run lint
npm run build
npm run test:smoke
```

The smoke script uses local port 3127 and removes OPENAI_API_KEY from its child server. Model tests inject stubs and make no OpenAI calls. Do not substitute a real API key for automated tests.

## Remaining boundaries and release checks

- The limiter is deliberately global per process and does not trust client-supplied IP headers. It resets on restart and is independent across replicas/serverless instances. One caller can consume the shared allowance. It is defense in depth, not authentication, a global spending cap or distributed abuse protection.
- Before exposing a paid endpoint, choose authenticated access or a server-verified challenge plus trusted-edge/shared rate limits, concurrency limits and provider budget controls. Verify these in the actual hosting environment. No external account settings were inspected or modified.
- Prompt separation reduces instruction ambiguity; it does not prove resistance to prompt injection. Schema validation checks shape and lengths, not truth, calibrated confidence or sound project judgments. Preserve human review and evaluate live responses with approved synthetic inputs separately.
- New size/token/deadline limits deliberately reject excessive requests or incomplete responses. The token cap may require tuning after actual model evaluation. No performance or cost savings are claimed.
- Resolve the critical framework advisory and peer conflict, introduce a reproducible lockfile, review the resolved dependency advisories, then repeat checks and browser/live-model evaluation before a public demo. A successful local build does not remove these blockers.
- Merge, deployment, account changes and any further consequential application changes require RJ's explicit approval. This branch/PR is for review only; auto-merge is not enabled.
