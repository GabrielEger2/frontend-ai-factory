"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { ResearchOutput } from "@/types/project";

interface ResearchViewProps {
  output: ResearchOutput;
}

export function ResearchView({ output }: ResearchViewProps) {
  const [showJson, setShowJson] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Company Summary
          </p>
          <p className="text-sm">{output.companySummary}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Segment</p>
          <p className="text-sm">{output.segment}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Target Audience
          </p>
          <p className="text-sm">{output.targetAudience}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Differentiators
          </p>
          <p className="text-sm">{output.differentiators}</p>
        </div>

        <div className="md:col-span-2 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Competitor Insights
          </p>
          <p className="text-sm">{output.competitorInsights}</p>
        </div>
      </div>

      {output.toneKeywords.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Tone Keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {output.toneKeywords.map((keyword) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowJson(!showJson)}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {showJson ? "Hide raw JSON" : "Show raw JSON"}
      </button>

      {showJson && (
        <pre className="rounded-md bg-muted p-3 text-xs overflow-auto max-h-80">
          {JSON.stringify(output, null, 2)}
        </pre>
      )}
    </div>
  );
}
