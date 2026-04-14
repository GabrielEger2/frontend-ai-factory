"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { ComposerOutput } from "@/types/project";

interface ComposerViewProps {
  output: ComposerOutput;
}

export function ComposerView({ output }: ComposerViewProps) {
  const [showJson, setShowJson] = useState(false);

  const selectedLayout = output.layouts[output.selectedLayout];

  if (!selectedLayout) {
    return (
      <p className="text-sm text-muted-foreground">No layout data available.</p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Source and Score */}
      <div className="flex items-center gap-3">
        <Badge variant={output.source === "graph" ? "default" : "secondary"}>
          {output.source}
        </Badge>
        <span className="text-xs text-muted-foreground">
          Score: {selectedLayout.score}
        </span>
      </div>

      {/* Component List */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Components</p>
        <ol className="list-decimal list-inside space-y-0.5">
          {selectedLayout.components.map((componentId, index) => (
            <li key={`${componentId}-${index}`} className="text-sm font-mono">
              {componentId}
            </li>
          ))}
        </ol>
      </div>

      {/* Rationale */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Rationale</p>
        <p className="text-sm">{selectedLayout.rationale}</p>
      </div>

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
