"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { defaultProjectData } from "@/lib/constants";
import { ProjectUpdateInput, ProjectUpdateSchema, AnalysisResultSchema } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const fields: Array<{ name: keyof ProjectUpdateInput; label: string; type?: "textarea" }> = [
  { name: "projectName", label: "Project Name" },
  { name: "reportingPeriod", label: "Reporting Period" },
  { name: "projectPhase", label: "Project Phase" },
  { name: "projectSponsor", label: "Project Sponsor" },
  { name: "projectManager", label: "Project Manager" },
  { name: "milestoneStatus", label: "Milestone Status" },
  { name: "recentAccomplishments", label: "Recent Accomplishments", type: "textarea" },
  { name: "currentBlockers", label: "Current Blockers", type: "textarea" },
  { name: "timelineConcerns", label: "Timeline Concerns", type: "textarea" },
  { name: "budgetConcerns", label: "Budget Concerns", type: "textarea" },
  { name: "resourceConcerns", label: "Resource Concerns", type: "textarea" },
  { name: "scopeChanges", label: "Scope Changes", type: "textarea" },
  { name: "stakeholderCommunicationIssues", label: "Stakeholder / Communication Issues", type: "textarea" },
  { name: "supportNeeded", label: "Support Needed", type: "textarea" }
];

export default function ProjectUpdateFormPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<ProjectUpdateInput>({
    resolver: zodResolver(ProjectUpdateSchema),
    defaultValues: defaultProjectData
  });

  const onSubmit = async (values: ProjectUpdateInput) => {
    setSubmitError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || "Failed to generate analysis.");
      }

      const data = await response.json();
      const parsed = AnalysisResultSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error("AI output did not match expected schema.");
      }

      sessionStorage.setItem("pulseInput", JSON.stringify(values));
      sessionStorage.setItem("pulseAnalysis", JSON.stringify(parsed.data));
      router.push("/results");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unexpected error occurred.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Update Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          {fields.map((field) => {
            const error = form.formState.errors[field.name]?.message;
            return (
              <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea id={field.name} className="mt-2" {...form.register(field.name)} />
                ) : (
                  <Input id={field.name} className="mt-2" {...form.register(field.name)} />
                )}
                {error ? <p className="mt-1 text-xs text-red-300">{error}</p> : null}
              </div>
            );
          })}

          {submitError ? <p className="md:col-span-2 text-sm text-red-300">{submitError}</p> : null}

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Analysis...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Analyze Project Health
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset(defaultProjectData)}
              disabled={form.formState.isSubmitting}
            >
              Reset to Demo Data
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
