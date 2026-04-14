import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getProject } from "@/lib/actions/get-project";
import { StatusBadge } from "@/components/projects/StatusBadge";
import { StatusPoller } from "@/components/projects/StatusPoller";
import { StepPanel } from "@/components/pipeline/StepPanel";
import { StyleApprovalPanel } from "@/components/pipeline/StyleApprovalPanel";
import { ContentSlotTable } from "@/components/pipeline/ContentSlotTable";
import { QAIssuesList } from "@/components/pipeline/QAIssuesList";
import { AssemblerFileTree } from "@/components/pipeline/AssemblerFileTree";
import type { ProjectStatus } from "@/types/project";

const PIPELINE_STEPS: { status: ProjectStatus; label: string }[] = [
  { status: "queued", label: "Queued" },
  { status: "researching", label: "Researching" },
  { status: "styling", label: "Generating Style" },
  { status: "awaiting_style_approval", label: "Awaiting Style Approval" },
  { status: "composing", label: "Composing Layout" },
  { status: "content", label: "Generating Content" },
  { status: "humanizing", label: "Humanizing" },
  { status: "assembling", label: "Assembling" },
  { status: "qa", label: "Running QA" },
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

  if (currentStatus === "failed" || currentStatus === "qa_failed") {
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
    project.status === "deployed" ||
    project.status === "failed" ||
    project.status === "qa_failed";

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

      {project.status === "awaiting_style_approval" && project.styleOutput && (
        <div className="mb-8">
          <StyleApprovalPanel
            projectId={id}
            initialStyle={project.styleOutput}
          />
        </div>
      )}

      {/* Step Outputs */}
      {(project.styleOutput ||
        project.composerOutput ||
        project.contentOutput ||
        project.humanizerOutput ||
        project.assemblerOutput ||
        project.qaOutput) && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-slate-500 mb-4">
            Step Outputs
          </h2>
          <div className="space-y-3">
            {project.styleOutput &&
              project.status !== "awaiting_style_approval" && (
                <StepPanel title="Style Output" stepName="style" projectId={id}>
                  <pre className="text-xs text-slate-600 overflow-auto">
                    {JSON.stringify(project.styleOutput, null, 2)}
                  </pre>
                </StepPanel>
              )}

            {project.composerOutput && (
              <StepPanel
                title="Composer Output"
                stepName="composer"
                projectId={id}
              >
                <pre className="text-xs text-slate-600 overflow-auto">
                  {JSON.stringify(project.composerOutput, null, 2)}
                </pre>
              </StepPanel>
            )}

            {project.contentOutput && (
              <StepPanel
                title="Content Output"
                stepName="content"
                projectId={id}
              >
                <ContentSlotTable output={project.contentOutput} />
              </StepPanel>
            )}

            {project.humanizerOutput && (
              <StepPanel
                title="Humanizer Output"
                stepName="humanizer"
                projectId={id}
              >
                <ContentSlotTable output={project.humanizerOutput} />
              </StepPanel>
            )}

            {project.assemblerOutput && (
              <StepPanel
                title="Assembler Output"
                stepName="assembler"
                projectId={id}
              >
                <AssemblerFileTree projectId={id} />
              </StepPanel>
            )}

            {project.qaOutput && (
              <StepPanel title="QA Output" stepName="qa" projectId={id}>
                <QAIssuesList output={project.qaOutput} />
              </StepPanel>
            )}
          </div>
        </div>
      )}

      {project.assemblerOutput && (
        <div className="mb-8">
          <Link
            href={`/projects/${id}/editor`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Open Code Editor
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
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
