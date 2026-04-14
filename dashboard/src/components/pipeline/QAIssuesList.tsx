import { Check, X } from "lucide-react";
import type { QAOutput } from "@/types/project";

interface QAIssuesListProps {
  output: QAOutput;
}

export function QAIssuesList({ output }: QAIssuesListProps) {
  if (output.passed) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
        <Check className="h-3 w-3" />
        Passed
      </div>
    );
  }

  if (!output.issues || output.issues.length === 0) {
    return (
      <p className="text-sm text-slate-500">No issue details available.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {output.issues.map((issue, index) => (
        <li
          key={`${issue.componentId}-${issue.slot}-${index}`}
          className="flex items-start gap-2 rounded-md bg-red-50 px-3 py-2 text-sm"
        >
          <X className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-red-500" />
          <div>
            <span className="font-mono text-xs text-red-700">
              {issue.componentId}
            </span>
            {issue.slot && (
              <span className="text-red-500"> &middot; {issue.slot}</span>
            )}
            <p className="text-red-600">{issue.message}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
