import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About / Submission</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          Project Pulse AI is designed for challenge scenarios where project updates need fast, consistent,
          executive-level interpretation.
        </p>
        <p>
          This MVP demonstrates end-to-end capability: structured intake, secure server-side AI processing,
          validated output, and board-ready report export.
        </p>
      </CardContent>
    </Card>
  );
}
