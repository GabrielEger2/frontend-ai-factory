"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { StyleOutput } from "@/types/project";

interface StyleViewProps {
  output: StyleOutput;
}

const PALETTE_KEYS = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "primaryLight",
  "primaryDark",
] as const;

const PALETTE_LABELS: Record<(typeof PALETTE_KEYS)[number], string> = {
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
  neutral: "Neutral",
  primaryLight: "Primary Light",
  primaryDark: "Primary Dark",
};

export function StyleView({ output }: StyleViewProps) {
  const [showJson, setShowJson] = useState(false);

  return (
    <div className="space-y-5">
      {/* Palette */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Palette</p>
        <div className="flex flex-wrap gap-3">
          {PALETTE_KEYS.map((key) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border border-border"
                style={{ backgroundColor: output.palette[key] }}
              />
              <div>
                <p className="text-xs font-medium">{PALETTE_LABELS[key]}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {output.palette[key]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Typography</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground">Heading:</span>
            <span className="text-sm">{output.typography.heading}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground">Body:</span>
            <span className="text-sm">{output.typography.body}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Tags</p>
        <div className="space-y-1.5">
          {output.mood.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Mood:</span>
              {output.mood.map((m) => (
                <Badge key={m} variant="secondary">
                  {m}
                </Badge>
              ))}
            </div>
          )}
          {output.style.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Style:</span>
              {output.style.map((s) => (
                <Badge key={s} variant="outline">
                  {s}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground">Density:</span>
            <span className="text-sm">{output.density}</span>
          </div>
        </div>
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
