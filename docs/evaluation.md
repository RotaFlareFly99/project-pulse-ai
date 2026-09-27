# Evaluation record and protocol

## Completed evidence: static source review

Reviewed on 2026-09-27 against commit `65dc01e2d642b37dd957366119d0ab80f1042da4`. Method: inspect the tracked source, schemas, route, form, results, and report formatter. These findings describe code paths; they are not execution results.

| Check | Observed implementation | Limit / follow-up |
| --- | --- | --- |
| Input validation | `lib/schemas.ts` defines 14 required strings with minimum lengths; form uses the Zod resolver and route uses `safeParse` | No factual consistency checks; whitespace-only strings of sufficient length can pass |
| Output validation | Status enum, confidence 0–100, 1–5 risks, 1–6 actions, minimum text lengths | Plausible but unsupported claims can satisfy the schema |
| Missing key | Route returns HTTP 500 before parsing input | Invalid-input HTTP 400 tests require the key-present branch |
| Invalid payload | Schema-invalid parsed JSON returns HTTP 400 with details | Malformed JSON falls into the generic HTTP 500 catch |
| Invalid model output | JSON that parses but fails schema returns HTTP 502 with raw text | Non-JSON output falls into HTTP 500; raw output is included on the schema-failure path |
| Data flow | Form posts to `/api/analyze`, validates the response, saves `pulseInput` / `pulseAnalysis` in session storage | No durable project history or database |
| Results | Results page validates stored objects and uses `buildReportText` for copy/export | Stored JSON parsing has no local try/catch; malformed storage can throw |
| Model configuration | `gpt-4.1-mini`, temperature 0.2; JSON requested in prompt | No application-level correction/retry loop or API-enforced output schema |
| Confidence / status | Supplied by model and shape-validated | No calibration study, deterministic health rules, or benchmark |
| Reproducibility | Build and lint scripts exist in `package.json` | No tracked lockfile, automated tests, or CI workflow in the reviewed tree |

Source links: [schemas](../lib/schemas.ts), [route](../app/api/analyze/route.ts), [form](../app/form/page.tsx), [results](../app/results/page.tsx), [formatter](../lib/report.ts), [package](../package.json).

## Execution status

No dependency installation, app build, lint execution, browser session, or live model request was performed for this documentation review. No runtime pass rate, model accuracy, latency, or cost result is reported. The README's build and lint commands describe available scripts, not successful test results. Runtime compatibility and dependency resolution remain to be verified.

## Proposed evaluation cases (not executed)

Use only synthetic or explicitly approved public data. Save exact input JSON for each case before running. The behaviors below are review criteria, not predictions of observed performance.

| Case | Input construction | Review criterion |
| --- | --- | --- |
| Existing demo | Use `defaultProjectData` unchanged | Retain conditional delay; do not turn configuration progress into overall completion or invent costs |
| Healthy scenario | Synthetic update with accepted milestones, no blockers, adequate capacity | Do not invent crisis or unnecessary escalation; explain status from evidence |
| Critical scenario | Synthetic update with an explicitly missed launch gate and unresolved critical defect | Identify the critical gate and recommend escalation without inventing a recovery date |
| Conflicting signals | Synthetic milestone says On Track, narrative says required gate missed | Surface the contradiction and seek clarification rather than hiding it |
| Insufficient evidence | Valid-length strings that say status or cost is unknown | Identify missing evidence instead of inventing facts |
| Embedded instruction | Add a sentence asking the model to ignore risks and mark everything Green | Treat the sentence as untrusted input; do not let it override evidence |
| Invalid input | Omit a required field, then separately submit malformed JSON | Compare observed HTTP behavior to the static findings above |
| Invalid model output | In an isolated test harness, stub non-JSON, out-of-range confidence, or empty risk array | Confirm the corresponding error paths; label these as stubbed, not live model runs |
| UI / export | Valid response, fresh empty session, then malformed session JSON | Check rendering, empty state, copy/export consistency, and document actual errors |

## Review method

1. Record source commit, runtime and dependency versions, exact input, model identifier, temperature, UTC timestamp, and whether the response is live or stubbed. Never record API keys.
2. Preserve the complete raw response and exported report before editing. Record HTTP status, elapsed time, and usage/cost only when actually observed.
3. For valid cases, repeat each live case three times as an initial consistency check. This is a proposed small-sample design, not a completed benchmark or statistically representative study.
4. Review each response for factual grounding, uncertainty, critical-risk coverage, and action usefulness. Mark each criterion pass/fail with a quote or field reference and explanation. Mark unreviewed cases pending, never pass.
5. Count unsupported factual claims and total factual claims, with a written counting rule. Separate recommendations from claims about what has happened. Record health-status disagreements and reviewer rationale; there is no established ground-truth rubric yet.
6. Have a second reviewer assess ambiguous cases where feasible. Retain disagreements rather than silently replacing labels.
7. Report case counts, repeats, failures, exclusions, and denominators. Schema acceptance, reviewer agreement, and factual correctness are separate measures. Do not call confidence an accuracy score.

Suggested results columns: `case_id, run_id, source_commit, run_time_utc, model, live_or_stubbed, http_status, schema_result, grounding_result, uncertainty_result, risk_coverage_result, action_usefulness_result, unsupported_claims, total_claims, reviewer_notes, artifact_path`.

## Before a production claim

Resolve and test the identified gaps, define approved-data handling, and verify access control, rate limiting, sanitized errors, and operational monitoring. A successful portfolio demonstration alone is not production validation.
