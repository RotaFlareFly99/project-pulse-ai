# Worked example: warehouse scanning readiness

## Provenance

Input source: [`defaultProjectData`](../lib/constants.ts) at reviewed commit `65dc01e2d642b37dd957366119d0ab80f1042da4`. This is the project's existing preloaded demo. The reporting period, project manager name, and completion percentage are demo fields, not verified employer records. No new employer data is used here.

The sample output below is a manually authored illustration for reviewing reasoning and communication. It was not returned by the application or OpenAI API. No confidence number is supplied because there is no measured basis for one. This excerpt is not a schema-complete API response.

## Input signals and checks

| Demo input | Reasonable interpretation | What a reviewer must not assume |
| --- | --- | --- |
| Device configuration completed for 80 percent of sites | Configuration has progressed | 80 percent overall project completion or production readiness |
| Milestone status: Behind Schedule | Schedule needs attention | A confirmed revised launch date |
| Two vendor delays, incomplete UAT, unresolved integration defects | Dependencies and acceptance work remain open | Defect severity or specific vendor delivery dates |
| Go-live may slip by two weeks if defects are not closed this week | Conditional schedule exposure | A slip has already occurred |
| No current overrun; delay may increase support and labor costs | Potential cost pressure | A quantified budget overrun or dollar savings |
| Limited testing bandwidth and a shared technical SME | Resource prioritization may be needed | Extra staff are already approved |
| Additional validation requests; no formal scope change | Clarification and change control may be needed | Scope expansion has already been authorized |
| Unclear readiness visibility and escalation ownership | Leadership needs an explicit decision and ownership discussion | Named owners or commitments not provided in the input |

## Illustrative output excerpt

**Executive summary:** The Warehouse Scanning Upgrade is behind schedule despite device configuration progress. Vendor delays, incomplete user acceptance testing, and unresolved scanner integration defects place go-live at risk. The possible two-week slip is conditional, and no current budget overrun is reported. Leadership support is requested to resolve dependencies and prioritize technical support.

**Illustrative health assessment: Yellow.** This is a reviewer's provisional judgment, not a measured model result. Unresolved blockers justify escalation, but the input does not establish an unrecoverable launch failure. Red could be justified if follow-up confirms a critical gate cannot be met. The current app does not enforce this rubric.

**Top risks**

1. Vendor dependencies and integration defects may delay readiness.
2. Limited testing capacity may prevent completion of acceptance work in time.
3. Additional validation requests may increase effort without an agreed scope decision.

**Recommended next actions**

1. Confirm vendor recovery dates and defect severity with accountable teams.
2. Ask leadership to prioritize technical support and testing capacity.
3. Establish acceptance criteria and review remaining UAT evidence before reaffirming launch readiness.
4. Clarify whether additional validation requests require formal scope approval.
5. Agree escalation ownership and the next readiness review; do not present proposed assignments as existing commitments.

**Executive brief:** Decide whether to prioritize vendor resolution and testing support now. Reassess go-live once recovery dates, defect closure evidence, and acceptance-test readiness are known. Maintain the distinction between a possible delay and a confirmed schedule change; do not report a budget overrun without evidence.

## What this example proves

It makes the intended decision support visible and shows how to distinguish input facts, conditional risks, and proposed actions. It does not prove that the model reliably produces this reasoning. The next evidence step is to capture an actual response and review it against these input signals using the [evaluation protocol](evaluation.md).

## Reproduce with the existing app

1. Follow the README setup and open `/form`.
2. Select **Reset to Demo Data** and confirm the fields match `lib/constants.ts`.
3. Select **Analyze Project Health**. This makes a live API request.
4. On `/results`, review every claim against the input. Record disagreements, especially health status and confidence.
5. Use **Export .txt** to save the actual report. Preserve it unchanged alongside the exact input, run date, source commit, model configuration, and review notes.
6. Label the captured report as an actual run only after completing these steps. Do not substitute this illustrative excerpt for runtime evidence.
