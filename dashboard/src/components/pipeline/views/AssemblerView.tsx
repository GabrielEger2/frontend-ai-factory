"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { AssemblerOutput } from "@/types/project";

interface AssemblerViewProps {
  output: AssemblerOutput;
  projectId: string;
}

export function AssemblerView({ output, projectId }: AssemblerViewProps) {
  const [showJson, setShowJson] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            S3 Bucket
          </span>
          <span className="font-mono text-sm">{output.s3Bucket}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            S3 Key
          </span>
          <span className="font-mono text-sm">{output.s3Key}</span>
        </div>
      </div>

      <Button variant="outline" size="sm" asChild>
        <Link href={`/projects/${projectId}/code-editor`}>
          Open Code Editor
        </Link>
      </Button>

      <div>
        <button
          type="button"
          onClick={() => setShowJson((v) => !v)}
          className="text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          {showJson ? "Hide raw JSON" : "Show raw JSON"}
        </button>
        {showJson && (
          <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-muted p-3 text-xs">
            {JSON.stringify(output, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
