import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/actions/get-project";
import { initializeDraft } from "@/lib/actions/initialize-draft";
import { VisualEditorShell } from "@/components/editor/VisualEditorShell";
import type { WorkingDraft } from "@/types/project";

/**
 * Visual editor page — edits the project's workingDraft live. When the
 * project has no workingDraft yet (never edited), we bootstrap one from
 * the frozen pipeline outputs via initializeDraftAction before rendering
 * the shell.
 *
 * Gated on project.status in {"ready_for_review", "deployed"}: the editor
 * opens once the pipeline has assembled a draft (ready_for_review) or the
 * project has been deployed at least once. Mid-pipeline states fall through
 * to a "not yet ready" message with a link back to the detail page.
 */
export default async function VisualEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const isEditable =
    project.status === "ready_for_review" || project.status === "deployed";

  if (!isEditable) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="mb-4 text-lg text-slate-600">
          Visual editor available after initial generation completes.
        </p>
        <Link
          href={`/projects/${id}`}
          className="text-sm text-slate-600 underline hover:text-slate-900"
        >
          Back to Project
        </Link>
      </div>
    );
  }

  let draft: WorkingDraft | null = project.workingDraft;
  if (!draft) {
    const result = await initializeDraft(id);
    if ("error" in result) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="mb-4 text-lg text-red-600">{result.error}</p>
          <Link
            href={`/projects/${id}`}
            className="text-sm text-slate-600 underline hover:text-slate-900"
          >
            Back to Project
          </Link>
        </div>
      );
    }
    draft = result.workingDraft;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="editor-chrome mb-4 flex items-center justify-between">
        <Link
          href={`/projects/${id}`}
          className="text-sm text-slate-500 transition-colors hover:text-slate-700"
        >
          &larr; Back to Project
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">
          {project.companyName ?? `Project ${id}`} — Visual Editor
        </h1>
      </div>
      <div className="min-h-0 flex-1">
        <VisualEditorShell
          projectId={id}
          initialDraft={draft}
          paletteSuggestions={project.styleOutput?.paletteSuggestions}
        />
      </div>
    </div>
  );
}
