"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { ContentOutput, HumanizerOutput } from "@/types/project";

interface ContentSlotTableProps {
  output: ContentOutput | HumanizerOutput;
}

export function ContentSlotTable({ output }: ContentSlotTableProps) {
  const [showJson, setShowJson] = useState(false);

  if (!output.components || output.components.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No component data available.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Component ID</TableHead>
            <TableHead>Slot Name</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {output.components.map((component) =>
            Object.entries(component.slots).map(([slotName, slotValue]) => (
              <TableRow key={`${component.componentId}-${slotName}`}>
                <TableCell className="font-mono text-xs">
                  {component.componentId}
                </TableCell>
                <TableCell>{slotName}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {String(slotValue)}
                </TableCell>
              </TableRow>
            )),
          )}
        </TableBody>
      </Table>

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
