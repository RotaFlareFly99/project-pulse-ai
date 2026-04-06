import { z } from "zod";

export const HealthStatusSchema = z.enum(["Green", "Yellow", "Red"]);

export const ProjectUpdateSchema = z.object({
  projectName: z.string().min(2),
  reportingPeriod: z.string().min(2),
  projectPhase: z.string().min(2),
  projectSponsor: z.string().min(2),
  projectManager: z.string().min(2),
  milestoneStatus: z.string().min(2),
  recentAccomplishments: z.string().min(10),
  currentBlockers: z.string().min(10),
  timelineConcerns: z.string().min(5),
  budgetConcerns: z.string().min(5),
  resourceConcerns: z.string().min(5),
  scopeChanges: z.string().min(5),
  stakeholderCommunicationIssues: z.string().min(5),
  supportNeeded: z.string().min(5)
});

export const AnalysisResultSchema = z.object({
  executiveSummary: z.string().min(20),
  healthStatus: HealthStatusSchema,
  confidence: z.number().min(0).max(100),
  topRisks: z.array(z.string().min(8)).min(1).max(5),
  recommendedNextActions: z.array(z.string().min(8)).min(1).max(6),
  executiveBrief: z.string().min(30)
});

export type ProjectUpdateInput = z.infer<typeof ProjectUpdateSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
