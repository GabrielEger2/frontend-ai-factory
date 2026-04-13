import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getProject } from "@/lib/actions/get-project";
import { StatusBadge } from "@/components/projects/StatusBadge";
import { StatusPoller } from "@/components/projects/StatusPoller";
import type { ProjectStatus } from "@/types/project";

const PIPELINE_STEPS: { status: ProjectStatus; label: string }[] = [
  { status: "queued", label: "Queued" },
  { status: "content", label: "Generating Content" },
  { status: "assembling", label: "Assembling" },
  { status: "deploying", label: "Deploying" },
  { status: "deployed", label: "Deployed" },
];

function getStepState(
  stepStatus: ProjectStatus,
  currentStatus: ProjectStatus,
): "completed" | "current" | "pending" {
  const stepIndex = PIPELINE_STEPS.findIndex((s) => s.status === stepStatus);
  const currentIndex = PIPELINE_STEPS.findIndex(
    (s) => s.status === currentStatus,
  );

  if (currentStatus === "failed") {
    return stepIndex <= currentIndex ? "completed" : "pending";
  }

  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "current";
  return "pending";
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg text-slate-500 mb-4">Project not found</p>
        <Link
          href="/projects"
          className="text-sm text-slate-600 hover:text-slate-900 underline"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  const isTerminal =
    project.status === "deployed" || project.status === "failed";

  return (
    <div>
      <Link
        href="/projects"
        className="text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4 inline-block"
      >
        &larr; Back to Projects
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Project {id}</h1>
        <StatusBadge status={project.status} />
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-medium text-slate-500 mb-4">
          Pipeline Progress
        </h2>
        <ol className="space-y-3">
          {PIPELINE_STEPS.map((step) => {
            const state = getStepState(step.status, project.status);
            return (
              <li key={step.status} className="flex items-center gap-3">
                {state === "completed" && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">
                    &#10003;
                  </span>
                )}
                {state === "current" && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold animate-pulse">
                    &#9679;
                  </span>
                )}
                {state === "pending" && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 text-xs">
                    &#9679;
                  </span>
                )}
                <span
                  className={
                    state === "pending"
                      ? "text-sm text-slate-400"
                      : state === "current"
                        ? "text-sm font-medium text-blue-700"
                        : "text-sm text-slate-700"
                  }
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {!isTerminal && (
        <StatusPoller projectId={id} initialStatus={project.status} />
      )}

      {project.status === "deployed" && project.previewUrl && (
        <a
          href={project.previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          View Site
          <ExternalLink className="h-4 w-4" />
        </a>
      )}

      {project.status === "failed" && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-700 mb-2">
            Generation failed. Please try again.
          </p>
          <Link
            href="/projects/new"
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            Create a new project
          </Link>
        </div>
      )}
    </div>
  );
}
