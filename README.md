# Project Pulse AI

Project Pulse AI is a challenge-ready MVP web app that transforms structured project updates into executive-ready health intelligence:

- Executive Summary
- Health Status (Green / Yellow / Red)
- Confidence score
- Top Risks
- Recommended Next Actions
- Executive Brief

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
