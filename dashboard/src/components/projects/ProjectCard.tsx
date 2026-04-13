import Link from "next/link";
import type { ProjectSummary } from "@/types/project";
import { SEGMENT_LABELS } from "@/types/project";
import { StatusBadge } from "@/components/projects/StatusBadge";

interface ProjectCardProps {
  project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const segmentLabel = SEGMENT_LABELS[project.segment] ?? project.segment;
  const formattedDate = new Date(project.createdAt).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

  return (
    <Link href={`/projects/${project.projectId}`}>
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-slate-900">
            {project.companyName}
          </h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-sm text-slate-500">{segmentLabel}</p>
        <p className="text-xs text-slate-400 mt-2">{formattedDate}</p>
      </div>
    </Link>
  );
}
