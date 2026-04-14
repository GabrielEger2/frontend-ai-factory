import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/project";
import type { BadgeProps } from "@/components/ui/badge";

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  queued: "Queued",
  researching: "Researching...",
  styling: "Generating Style...",
  awaiting_style_approval: "Awaiting Style Approval",
  composing: "Composing Layout...",
  content: "Generating Content...",
  humanizing: "Humanizing...",
  assembling: "Assembling...",
  qa: "Running QA...",
  deploying: "Deploying...",
  deployed: "Deployed",
  failed: "Failed",
  qa_failed: "QA Failed",
};

type BadgeMapping = {
  variant: BadgeProps["variant"];
  className?: string;
};

const STATUS_BADGE_MAP: Record<ProjectStatus, BadgeMapping> = {
  queued: { variant: "secondary" },
  researching: {
    variant: "default",
    className:
      "border-transparent bg-blue-100 text-blue-700 animate-pulse hover:bg-blue-100",
  },
  styling: {
    variant: "default",
    className:
      "border-transparent bg-purple-100 text-purple-700 animate-pulse hover:bg-purple-100",
  },
  awaiting_style_approval: {
    variant: "default",
    className:
      "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-100",
  },
  composing: {
    variant: "default",
    className:
      "border-transparent bg-violet-100 text-violet-700 animate-pulse hover:bg-violet-100",
  },
  content: {
    variant: "default",
    className:
      "border-transparent bg-blue-100 text-blue-700 animate-pulse hover:bg-blue-100",
  },
  humanizing: {
    variant: "default",
    className:
      "border-transparent bg-blue-100 text-blue-700 animate-pulse hover:bg-blue-100",
  },
  assembling: {
    variant: "default",
    className:
      "border-transparent bg-blue-100 text-blue-700 animate-pulse hover:bg-blue-100",
  },
  qa: {
    variant: "default",
    className:
      "border-transparent bg-purple-100 text-purple-700 animate-pulse hover:bg-purple-100",
  },
  deploying: {
    variant: "default",
    className:
      "border-transparent bg-blue-100 text-blue-700 animate-pulse hover:bg-blue-100",
  },
  deployed: {
    variant: "default",
    className:
      "border-transparent bg-green-100 text-green-700 hover:bg-green-100",
  },
  failed: { variant: "destructive" },
  qa_failed: { variant: "destructive" },
};

interface StatusBadgeProps {
  status: ProjectStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { variant, className } = STATUS_BADGE_MAP[status];

  return (
    <Badge variant={variant} className={cn(className)}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
