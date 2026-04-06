import { NextResponse } from "next/server";
import OpenAI from "openai";
import { AnalysisResultSchema, ProjectUpdateSchema } from "@/lib/schemas";

const model = "gpt-4.1-mini";

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Server is missing OPENAI_API_KEY." }, { status: 500 });
    }

    const rawInput = await req.json();
    const parsedInput = ProjectUpdateSchema.safeParse(rawInput);

    if (!parsedInput.success) {
      return NextResponse.json({ error: "Invalid input payload.", details: parsedInput.error.flatten() }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `You are Project Pulse AI, an executive PMO analyst.
Given this project update JSON, return ONLY valid JSON with keys:
executiveSummary (string), healthStatus (Green|Yellow|Red), confidence (0-100 number), topRisks (string[]), recommendedNextActions (string[]), executiveBrief (string).

Assess:
- schedule realism
- blockers severity
- budget/resource/scope pressure
- stakeholder alignment

Project Update:
${JSON.stringify(parsedInput.data, null, 2)}`;

    const completion = await client.responses.create({
      model,
      input: prompt,
      temperature: 0.2
    });

    const text = completion.output_text;
    const parsedJson = JSON.parse(text);
    const parsedOutput = AnalysisResultSchema.safeParse(parsedJson);

    if (!parsedOutput.success) {
      return NextResponse.json({ error: "AI output schema validation failed.", raw: text }, { status: 502 });
    }

    return NextResponse.json(parsedOutput.data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to analyze project update."
      },
      { status: 500 }
    );
  }
}
