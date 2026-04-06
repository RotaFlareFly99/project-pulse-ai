"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Download, RefreshCw } from "lucide-react";
import { AnalysisResult, AnalysisResultSchema, ProjectUpdateInput, ProjectUpdateSchema } from "@/lib/schemas";
import { buildReportText } from "@/lib/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";

export default function ResultsPage() {
  const router = useRouter();
  const [input, setInput] = useState<ProjectUpdateInput | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const rawInput = sessionStorage.getItem("pulseInput");
    const rawAnalysis = sessionStorage.getItem("pulseAnalysis");

    const parsedInput = ProjectUpdateSchema.safeParse(rawInput ? JSON.parse(rawInput) : null);
    const parsedAnalysis = AnalysisResultSchema.safeParse(rawAnalysis ? JSON.parse(rawAnalysis) : null);

    if (parsedInput.success) setInput(parsedInput.data);
    if (parsedAnalysis.success) setAnalysis(parsedAnalysis.data);
  }, []);

  const reportText = useMemo(() => {
    if (!input || !analysis) return "";
    return buildReportText(input, analysis);
  }, [input, analysis]);

  const copyReport = async () => {
    await navigator.clipboard.writeText(reportText);
    setMessage("Report copied to clipboard.");
  };

  const exportTxt = () => {
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${input?.projectName?.replace(/\s+/g, "-").toLowerCase() || "project-pulse"}-report.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Report exported as .txt.");
  };

  if (!input || !analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Results Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Submit the Project Update Form to generate your executive report.</p>
          <Button onClick={() => router.push("/form")}>Go to Form</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="text-2xl">{input.projectName}</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{input.reportingPeriod}</p>
          </div>
          <div className="space-y-2 text-right">
            <StatusBadge status={analysis.healthStatus} />
            <p className="text-sm text-muted-foreground">Confidence: {analysis.confidence}%</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Executive Summary</h3>
            <p>{analysis.executiveSummary}</p>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Top Risks</h3>
            <ul className="list-disc space-y-1 pl-5">
              {analysis.topRisks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Recommended Next Actions</h3>
            <ul className="list-disc space-y-1 pl-5">
              {analysis.recommendedNextActions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Executive Brief</h3>
            <p className="whitespace-pre-wrap">{analysis.executiveBrief}</p>
          </section>

          <div className="flex flex-wrap gap-3">
            <Button onClick={copyReport}>
              <Copy className="mr-2 h-4 w-4" /> Copy Report
            </Button>
            <Button variant="secondary" onClick={exportTxt}>
              <Download className="mr-2 h-4 w-4" /> Export .txt
            </Button>
            <Button variant="outline" onClick={() => router.push("/form")}>
              <RefreshCw className="mr-2 h-4 w-4" /> Run New Analysis
            </Button>
          </div>
          {message ? <p className="text-xs text-emerald-300">{message}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
