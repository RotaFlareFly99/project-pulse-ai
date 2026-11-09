import { AnalysisResultSchema, ProjectUpdateSchema } from "./schemas";

export function readStoredReport(storage: Pick<Storage, "getItem">) {
  try {
    const input = ProjectUpdateSchema.safeParse(JSON.parse(storage.getItem("pulseInput") ?? "null"));
    const analysis = AnalysisResultSchema.safeParse(JSON.parse(storage.getItem("pulseAnalysis") ?? "null"));
    return input.success && analysis.success ? { input: input.data, analysis: analysis.data } : null;
  } catch {
    // Missing, inaccessible or malformed session data uses the existing empty state.
    return null;
  }
}
