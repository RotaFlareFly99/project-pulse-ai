import Link from "next/link";
import { ArrowRight, ClipboardList, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-border bg-card p-8 shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight">Project Pulse AI Dashboard</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Convert weekly project updates into an executive-ready health assessment using AI.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/form">
            <Button>
              Start New Analysis <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="secondary">About Submission</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="h-5 w-5 text-primary" /> Structured Intake
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Capture milestone, timeline, budget, scope, resourcing, and stakeholder signals in one form.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-accent" /> AI Insight
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Generate concise executive summary, confidence score, top risks, and next actions.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Executive Ready</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Copy and export a complete brief to share with leadership and governance stakeholders.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
