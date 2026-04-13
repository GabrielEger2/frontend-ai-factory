import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/project";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  queued: "bg-slate-100 text-slate-700",
  content: "bg-blue-100 text-blue-700 animate-pulse",
  humanizing: "bg-blue-100 text-blue-700 animate-pulse",
  assembling: "bg-blue-100 text-blue-700 animate-pulse",
  qa: "bg-purple-100 text-purple-700 animate-pulse",
  deploying: "bg-blue-100 text-blue-700 animate-pulse",
  deployed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  qa_failed: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  queued: "Queued",
  content: "Generating Content...",
  humanizing: "Humanizing...",
  assembling: "Assembling...",
  qa: "Running QA...",
  deploying: "Deploying...",
  deployed: "Deployed",
  failed: "Failed",
  qa_failed: "QA Failed",
};

interface StatusBadgeProps {
  status: ProjectStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
