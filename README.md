# Project Pulse AI

Project Pulse AI is a challenge-ready MVP web app that transforms structured project updates into executive-ready health intelligence:

- Executive Summary
- Health Status (Green / Yellow / Red)
- Confidence score
- Top Risks
- Recommended Next Actions
- Executive Brief

## Portfolio walkthrough

**Business question:** How can an operations or PMO leader turn a weekly project update into a clear escalation decision, while retaining human review of the evidence?

This MVP demonstrates structured intake, server-side AI integration, validation, and executive communication. Its warehouse-scanning demo is relevant to operational implementations. Treat the bundled demo as a portfolio scenario, not an employer case study or evidence of an actual deployment.

### Review in 90 seconds

1. Read the [worked example](docs/worked-example.md): input signals, an illustrative executive brief, and the decision each signal supports.
2. Inspect the [evaluation record](docs/evaluation.md): source-backed findings, limitations, and a repeatable evaluation protocol.
3. Follow the existing setup below to try the preloaded form. Live analysis requires your own OpenAI API key and may incur API charges.

| Portfolio evidence | What it demonstrates | Evidence boundary |
| --- | --- | --- |
| [Structured input and output schemas](lib/schemas.ts) | Data contracts and validation design | Shape and length checks do not establish factual accuracy |
| [Analysis route](app/api/analyze/route.ts) | Server-side service integration and error handling | Model responses and health judgments still require review |
| [Worked example](docs/worked-example.md) | Translating operational risks into a leadership decision | Illustrative, manually authored output; not a captured model run |
| [Report formatter](lib/report.ts) and [results page](app/results/page.tsx) | Stakeholder communication through copy and text export | No measured adoption or time savings |
| [Evaluation record](docs/evaluation.md) | Critical review and a plan for reproducible evidence | Static review completed; runtime and model-quality tests pending |

### Business value and how to measure it

The intended benefit is a more consistent weekly briefing and clearer escalation requests. For the demo, the decision is whether to prioritize vendor resolution and scarce testing support before reaffirming go-live readiness. The app drafts a brief; a project owner verifies facts, assigns owners, and approves communication.

No production usage, cost savings, accuracy rate, or delivery improvement is claimed. A future pilot should compare manual and AI-assisted briefs for the same approved inputs:

- **Review-inclusive preparation time:** median minutes from intake to an approved brief, including corrections, in each workflow.
- **Factual quality:** unsupported factual claims divided by reviewed factual claims; retain the underlying counts and review notes.
- **Decision usefulness:** reviewer assessment of whether the brief identifies the key blocker, a concrete decision, and a proposed next action without inventing commitments.
- **Operating cost:** observed API cost per accepted brief, including retries; assess alongside reviewer time.

Use a predefined rubric, record sample size and case selection, and report failures as well as successes. A small demo cannot establish employer ROI or general model accuracy.

### Scope and limitations

- Best positioned as an AI-enabled solutions and operational decision-support prototype. It does not yet demonstrate SQL, BI analysis, statistical inference, or analysis of an independently sourced dataset.
- The dashboard is an entry page, not a historical KPI dashboard. Inputs and results are retained in browser session storage; there is no project database or longitudinal analysis.
- The route requests `gpt-4.1-mini` at temperature `0.2`; it parses JSON and validates the output afterward. It does not configure API-enforced structured output or automatic correction/retry logic in application code.
- The displayed confidence is a model-generated number constrained to 0–100. It is **not calibrated probability, measured accuracy, or a guarantee**. Health status has no deterministic scoring rubric in the current implementation.
- Authentication, rate limiting, and production monitoring are not implemented in the reviewed application. Use non-sensitive demo inputs for portfolio review. A server-side key alone does not make an endpoint production-ready.
- Actual app screenshots and captured model responses remain pending. The [asset checklist](docs/portfolio-assets.md) specifies how to add them with provenance and honest labels.

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui-style reusable components
- React Hook Form + Zod validation
- OpenAI API (secure server-side route)
- Lucide React icons

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
cp .env.example .env.local
```

3. Add your key:

```bash
OPENAI_API_KEY=your_key_here
```

4. Run development server:

```bash
npm run dev
```

Open http://localhost:3000.

## App Pages

- `/` Dashboard
- `/form` Project Update Form (preloaded with demo data)
- `/results` AI analysis results with copy + export
- `/about` About / submission details

## Validation and Safety

- Client + server input validation with Zod
- AI output schema validation before returning results
- API key is only used in a server-side route (`app/api/analyze/route.ts`)

## Build & Lint

```bash
npm run lint
npm run build
```
