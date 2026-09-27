# Portfolio audit and asset checklist

## Positioning

This repository is a focused AI-enabled operational workflow sample. Its strongest evidence for solutions roles is the path from intake requirements to a validated service response and leadership-facing export. For analytics roles it currently demonstrates qualitative synthesis and communication, but not SQL, BI modeling, numerical analysis, or work on an independently sourced dataset.

The highest-value documentation additions are the worked decision example, explicit evidence boundaries, and evaluation record. A feature list alone cannot show whether conclusions are trustworthy or useful. A synthetic demo remains useful, but should not be represented as a real-world outcome study.

## Prioritized next assets

All unchecked items are pending. Proposed filenames below are not links to existing assets.

- [x] README business question, role relevance, limitations, and measurement plan.
- [x] Worked example with input-to-decision traceability and illustrative-output labeling.
- [x] Source-based evaluation record separating observations from unexecuted tests.
- [ ] **P1: Actual run bundle** under `docs/evidence/run-<date>/`: exact input JSON, unedited response JSON, exported report, and manifest with source commit, date, model configuration, and live/stubbed label. Use the existing demo; exclude keys and employer material.
- [ ] **P1: Completed review results** under `docs/evidence/`: apply the evaluation rubric, retain failed cases and review notes, and publish counts with denominators. Link the README only once artifacts exist.
- [ ] **P1: Actual screenshots** under `docs/images/`: capture the running app's preloaded form, results with key risks/actions, and validation or empty state. Include readable captions, alt text, viewport, source commit, and capture date. Label any seeded/stubbed result visibly; do not present a mockup as a live screenshot.
- [ ] **P2: Build and lint evidence**: record exact commands, runtime/dependency versions, exit codes, and relevant logs. Document failures honestly. Resolve installation and script compatibility in a separate code change if needed.
- [ ] **P2: Business pilot record**: measure preparation time including review, factual corrections, decision usefulness, and API cost using approved paired cases. Report sample selection and limitations; do not extrapolate demo observations into employer savings.
- [ ] **P2: Analytics extension within this project**: once real evaluation runs exist, summarize schema failures, unsupported claims, and status disagreements by case type using a reproducible analysis. Preserve raw records and avoid implying that this small sample establishes general accuracy.

## Screenshot acceptance checklist

- Capture the existing app, not generated imagery or a reconstructed screen.
- Use only demo inputs; remove browser account details, secrets, and unrelated tabs.
- Keep the output provenance beside the image: live API run or explicitly seeded fixture.
- Show enough input context to interpret the result; a green badge alone is not evidence.
- Check readability in GitHub's rendered README before adding image links.

## Reviewer handoff

The documentation change preserves the original app, dependencies, setup instructions, and feature list. It adds no claimed employer results, synthetic performance percentages, fabricated confidence score, or purported live screenshots. Review and merge through the draft PR when ready; runtime evidence remains a clearly identified follow-up.
