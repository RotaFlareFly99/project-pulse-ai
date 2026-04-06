import { AnalysisResult, ProjectUpdateInput } from "@/lib/schemas";

export function buildReportText(input: ProjectUpdateInput, analysis: AnalysisResult) {
  return `Project Pulse AI - Executive Report
=================================
Project: ${input.projectName}
Reporting Period: ${input.reportingPeriod}
Project Phase: ${input.projectPhase}
Sponsor: ${input.projectSponsor}
Project Manager: ${input.projectManager}

Health Status: ${analysis.healthStatus}
Confidence: ${analysis.confidence}%

Executive Summary
-----------------
${analysis.executiveSummary}

Top Risks
---------
${analysis.topRisks.map((risk, idx) => `${idx + 1}. ${risk}`).join("\n")}

Recommended Next Actions
------------------------
${analysis.recommendedNextActions.map((act, idx) => `${idx + 1}. ${act}`).join("\n")}

Executive Brief
---------------
${analysis.executiveBrief}
`;
}
