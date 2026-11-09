import { z } from "zod";

export const HealthStatusSchema = z.enum(["Green", "Yellow", "Red"]);

export const SHORT_TEXT_MAX = 200;
export const NARRATIVE_TEXT_MAX = 4000;

export const ProjectUpdateSchema = z.object({
  projectName: z.string().trim().min(2).max(SHORT_TEXT_MAX),
  reportingPeriod: z.string().trim().min(2).max(SHORT_TEXT_MAX),
  projectPhase: z.string().trim().min(2).max(SHORT_TEXT_MAX),
  projectSponsor: z.string().trim().min(2).max(SHORT_TEXT_MAX),
  projectManager: z.string().trim().min(2).max(SHORT_TEXT_MAX),
  milestoneStatus: z.string().trim().min(2).max(SHORT_TEXT_MAX),
  recentAccomplishments: z.string().trim().min(10).max(NARRATIVE_TEXT_MAX),
  currentBlockers: z.string().trim().min(10).max(NARRATIVE_TEXT_MAX),
  timelineConcerns: z.string().trim().min(5).max(NARRATIVE_TEXT_MAX),
  budgetConcerns: z.string().trim().min(5).max(NARRATIVE_TEXT_MAX),
  resourceConcerns: z.string().trim().min(5).max(NARRATIVE_TEXT_MAX),
  scopeChanges: z.string().trim().min(5).max(NARRATIVE_TEXT_MAX),
  stakeholderCommunicationIssues: z.string().trim().min(5).max(NARRATIVE_TEXT_MAX),
  supportNeeded: z.string().trim().min(5).max(NARRATIVE_TEXT_MAX)
});

export const AnalysisResultSchema = z.object({
  executiveSummary: z.string().trim().min(20).max(6000),
  healthStatus: HealthStatusSchema,
  confidence: z.number().min(0).max(100),
  topRisks: z.array(z.string().trim().min(8).max(2000)).min(1).max(5),
  recommendedNextActions: z.array(z.string().trim().min(8).max(2000)).min(1).max(6),
  executiveBrief: z.string().trim().min(30).max(8000)
});

export type ProjectUpdateInput = z.infer<typeof ProjectUpdateSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
