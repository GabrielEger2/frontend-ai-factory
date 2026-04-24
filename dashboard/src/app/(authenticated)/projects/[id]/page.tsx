import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getProject } from "@/lib/actions/get-project";
import { listShareTokens } from "@/lib/actions/list-share-tokens";
import { listFeedback } from "@/lib/actions/list-feedback";
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
import { DeployDraftButton } from "@/components/projects/DeployDraftButton";
import { SharePanel } from "@/components/share/SharePanel";
import type { FeedbackItem, ProjectStatus } from "@/types/project";

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
  { status: "ready_for_review", label: "Ready for Review" },
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
    project.status === "ready_for_review" ||
    project.status === "deployed" ||
    project.status === "failed" ||
    project.status === "qa_failed";

  const isReadyForReview = project.status === "ready_for_review";
  const isDeployed = project.status === "deployed";
  const hasEditableDraft = isReadyForReview || isDeployed;
  const hasVersions =
    project.currentVersionNumber != null && project.currentVersionNumber > 0;

  // Share tokens + feedback are only meaningful post-deploy. Fetch them
  // in parallel here so the server component renders a complete page.
  const [shareTokensResult, feedbackResult] = isDeployed
    ? await Promise.all([listShareTokens(id), listFeedback(id)])
    : [null, null];

  const shareTokens =
    shareTokensResult && "tokens" in shareTokensResult
      ? shareTokensResult.tokens
      : [];
  const feedbackItems: FeedbackItem[] =
    feedbackResult && "feedback" in feedbackResult
      ? feedbackResult.feedback
      : [];

  return (
    <div>
      <Link
        href="/projects"
        className="text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4 inline-block"
      >
        &larr; Back to Projects
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          {project.companyName ?? `Project ${id}`}
        </h1>
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

      {isReadyForReview && (
        <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h2 className="mb-1 text-sm font-semibold text-amber-900">
            Draft ready for your review
          </h2>
          <p className="mb-4 text-sm text-amber-800">
            The pipeline has assembled a draft site. Edit sections, copy, or
            palette in the visual editor, then deploy when ready.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <DeployDraftButton projectId={id} />
            <Link
              href={`/projects/${id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Open Visual Editor
            </Link>
          </div>
        </div>
      )}

      {(hasEditableDraft || hasVersions) && !isReadyForReview && (
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {isDeployed && (
            <Link
              href={`/projects/${id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Open Visual Editor
            </Link>
          )}
          {hasVersions && (
            <Link
              href={`/projects/${id}/versions`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              View Versions
              {project.currentVersionNumber != null && (
                <span className="text-xs text-slate-500">
                  (v{project.currentVersionNumber})
                </span>
              )}
            </Link>
          )}
        </div>
      )}

      {isDeployed && (
        <section className="mb-8">
          <SharePanel projectId={id} initialTokens={shareTokens} />
        </section>
      )}

      {isDeployed && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Client Feedback
          </h2>
          {feedbackItems.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">
              No feedback submitted yet.
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {feedbackItems.map((item) => (
                <li
                  key={item.sk}
                  className="rounded-lg border border-slate-200 bg-white p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span>
                      {item.clientName ? item.clientName : "Anonymous"}
                    </span>
                    <time dateTime={item.submittedAt}>
                      {formatFeedbackDate(item.submittedAt)}
                    </time>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-slate-800">
                    {item.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
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
          {project.failureReason && (
            <p className="text-sm text-red-700 mt-2 font-mono text-xs">
              {project.failureReason}
            </p>
          )}
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

function formatFeedbackDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  } catch {
    return iso;
  }
}
