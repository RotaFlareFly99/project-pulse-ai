import { ProjectUpdateInput } from "@/lib/schemas";

export const defaultProjectData: ProjectUpdateInput = {
  projectName: "Warehouse Scanning Upgrade",
  reportingPeriod: "Week of March 24, 2026",
  projectPhase: "Testing",
  projectSponsor: "Operations Leadership",
  projectManager: "Ronald Johnson",
  milestoneStatus: "Behind Schedule",
  recentAccomplishments:
    "Completed device configuration for 80 percent of sites and finished initial test scripts.",
  currentBlockers:
    "Two vendor delays, incomplete user acceptance testing, and unresolved scanner integration defects.",
  timelineConcerns: "Go-live may slip by two weeks if defects are not closed this week.",
  budgetConcerns: "No current overrun, but delay may increase support and labor costs.",
  resourceConcerns:
    "Testing team has limited bandwidth and one technical SME is shared across multiple projects.",
  scopeChanges:
    "No formal scope change, but additional validation requests from operations may expand effort.",
  stakeholderCommunicationIssues:
    "Stakeholders need clearer visibility into readiness and escalation ownership.",
  supportNeeded:
    "Leadership help resolving vendor dependency and prioritizing technical support."
};
