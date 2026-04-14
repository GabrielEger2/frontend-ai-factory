import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getProject } from "@/lib/actions/get-project";
import { StatusBadge } from "@/components/projects/StatusBadge";
import { StatusPoller } from "@/components/projects/StatusPoller";
import { StepCard } from "@/components/pipeline/StepCard";
import { StyleApprovalPanel } from "@/components/pipeline/StyleApprovalPanel";
import { ResearchView } from "@/components/pipeline/views/ResearchView";
import { StyleView } from "@/components/pipeline/views/StyleView";
import { ComposerView } from "@/components/pipeline/views/ComposerView";
import { ContentSlotTable } from "@/components/pipeline/views/ContentSlotTable";
import { HumanizerView } from "@/components/pipeline/views/HumanizerView";
import { SeoView } from "@/components/pipeline/views/SeoView";
import { AssemblerView } from "@/components/pipeline/views/AssemblerView";
import { QAView } from "@/components/pipeline/views/QAView";
import type { ProjectStatus } from "@/types/project";

const PIPELINE_STEPS: {
  status: ProjectStatus;
  label: string;
  stepName?: string;
}[] = [
  { status: "queued", label: "Queued" },
  { status: "researching", label: "Researching" },
  { status: "styling", label: "Generating Style" },
  { status: "awaiting_style_approval", label: "Awaiting Style Approval" },
  { status: "composing", label: "Composing Layout" },
  { status: "content", label: "Generating Content" },
  { status: "content" as ProjectStatus, label: "SEO", stepName: "seo" },
  { status: "humanizing", label: "Humanizing" },
  { status: "assembling", label: "Assembling" },
  { status: "qa", label: "Running QA" },
  { status: "deploying", label: "Deploying" },
  { status: "deployed", label: "Deployed" },
];

function getStepState(
  stepIndex: number,
  currentStatus: ProjectStatus,
): "completed" | "current" | "pending" {
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

      {!isTerminal && (
        <StatusPoller projectId={id} initialStatus={project.status} />
      )}

      <div className="space-y-4 mb-8">
        {PIPELINE_STEPS.map((step, index) => {
          const state = getStepState(index, project.status);
          const stepName = step.stepName || step.status;

          return (
            <StepCard
              key={`${step.status}-${step.stepName ?? index}`}
              stepNumber={index + 1}
              title={step.label}
              stepName={stepName}
              projectId={id}
              state={state}
            >
              {/* Researching step */}
              {step.status === "researching" &&
                state === "completed" &&
                project.researchOutput && (
                  <ResearchView output={project.researchOutput} />
                )}

              {/* Styling step — show StyleApprovalPanel when awaiting approval, otherwise StyleView */}
              {step.status === "styling" &&
                project.status === "awaiting_style_approval" &&
                project.styleOutput && (
                  <StyleApprovalPanel
                    projectId={id}
                    initialStyle={project.styleOutput}
                  />
                )}
              {step.status === "styling" &&
                project.status !== "awaiting_style_approval" &&
                state === "completed" &&
                project.styleOutput && (
                  <StyleView output={project.styleOutput} />
                )}

              {/* Composing step */}
              {step.status === "composing" &&
                state === "completed" &&
                project.composerOutput && (
                  <ComposerView output={project.composerOutput} />
                )}

              {/* Content step */}
              {step.status === "content" &&
                step.stepName === undefined &&
                state === "completed" &&
                project.contentOutput && (
                  <ContentSlotTable output={project.contentOutput} />
                )}

              {/* SEO step (always placeholder) */}
              {step.stepName === "seo" && state === "completed" && <SeoView />}

              {/* Humanizing step */}
              {step.status === "humanizing" &&
                state === "completed" &&
                project.humanizerOutput && (
                  <HumanizerView output={project.humanizerOutput} />
                )}

              {/* Assembling step */}
              {step.status === "assembling" &&
                state === "completed" &&
                project.assemblerOutput && (
                  <AssemblerView
                    output={project.assemblerOutput}
                    projectId={id}
                  />
                )}

              {/* QA step */}
              {step.status === "qa" &&
                state === "completed" &&
                project.qaOutput && <QAView output={project.qaOutput} />}
            </StepCard>
          );
        })}
      </div>

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
