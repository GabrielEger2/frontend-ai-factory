"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { QAOutput } from "@/types/project";

interface QAViewProps {
  output: QAOutput;
}

export function QAView({ output }: QAViewProps) {
  const [showJson, setShowJson] = useState(false);

  return (
    <div className="space-y-4">
      {output.passed ? (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">All QA checks passed</span>
        </div>
      ) : output.issues && output.issues.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component ID</TableHead>
              <TableHead>Slot</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {output.issues.map((issue, index) => (
              <TableRow key={`${issue.componentId}-${issue.slot}-${index}`}>
                <TableCell className="font-mono text-xs">
                  {issue.componentId}
                </TableCell>
                <TableCell className="text-sm">{issue.slot}</TableCell>
                <TableCell className="text-sm">{issue.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-muted-foreground">
          QA failed but no issue details are available.
        </p>
      )}

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
