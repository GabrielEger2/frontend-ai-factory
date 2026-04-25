"use client";

import { useMemo, useState, useTransition } from "react";
import manifest from "@components/library/manifest.json";
import { BlueprintPreview } from "@/components/editor/BlueprintPreview";
import { ComponentPicker } from "@/components/editor/ComponentPicker";
import { approveLayout } from "@/lib/actions/approve-layout";
import { regenerateLayout } from "@/lib/actions/regenerate-layout";
import { swapComponent } from "@/lib/actions/swap-component";
import type {
  ComposerOutput,
  StyleOutput,
  WorkingDraft,
} from "@/types/project";

interface ManifestEntry {
  id: string;
  name?: string;
  category?: string;
}

const MANIFEST = manifest as unknown as ManifestEntry[];

function manifestEntry(componentId: string): ManifestEntry | undefined {
  return MANIFEST.find((e) => e.id === componentId);
}

interface LayoutApprovalPanelProps {
  projectId: string;
  initialComposerOutput: ComposerOutput;
  styleOutput: StyleOutput;
}

export function LayoutApprovalPanel({
  projectId,
  initialComposerOutput,
  styleOutput,
}: LayoutApprovalPanelProps) {
  const [composerOutput, setComposerOutput] = useState<ComposerOutput>(
    initialComposerOutput,
  );
  const [selectedSwapTarget, setSelectedSwapTarget] = useState<string | null>(
    null,
  );
  const [showRegenerateConfirm, setShowRegenerateConfirm] =
    useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Synthesize a WorkingDraft each render — BlueprintPreview needs the full
  // shape (palette + typography + density + blueprint), not just composerOutput.
  const draft: WorkingDraft = useMemo(
    () => ({
      blueprint: composerOutput.layouts[composerOutput.selectedLayout],
      contentSlots: { components: [] },
      palette: styleOutput.palette,
      typography: styleOutput.typography,
      density: styleOutput.density,
      updatedAt: new Date().toISOString(),
    }),
    [composerOutput, styleOutput],
  );

  const sectionIds = draft.blueprint?.components ?? [];

  function getNeighbors(targetId: string): string[] {
    const idx = sectionIds.indexOf(targetId);
    if (idx === -1) return [];
    const neighbors: string[] = [];
    if (idx > 0) neighbors.push(sectionIds[idx - 1]);
    if (idx < sectionIds.length - 1) neighbors.push(sectionIds[idx + 1]);
    return neighbors;
  }

  function handleApprove() {
    setFeedback(null);
    startTransition(async () => {
      const result = await approveLayout(projectId);
      if ("message" in result) {
        setFeedback({
          type: "success",
          text: "Layout approved — pipeline continuing.",
        });
      } else {
        setFeedback({ type: "error", text: result.error });
      }
    });
  }

  function handleRegenerateConfirm() {
    setShowRegenerateConfirm(false);
    setFeedback(null);
    startTransition(async () => {
      const result = await regenerateLayout(projectId);
      if ("composerOutput" in result) {
        setComposerOutput(result.composerOutput);
        setFeedback({
          type: "success",
          text: "Layout regenerated. Review the new blueprint below.",
        });
      } else {
        setFeedback({ type: "error", text: result.error });
      }
    });
  }

  function handleSwap(newComponentId: string) {
    if (!selectedSwapTarget) return;
    const target = selectedSwapTarget;
    setFeedback(null);
    startTransition(async () => {
      const result = await swapComponent(projectId, target, newComponentId);
      if ("composerOutput" in result) {
        setComposerOutput(result.composerOutput);
        setSelectedSwapTarget(null);
        setFeedback({
          type: "success",
          text: "Section swapped.",
        });
      } else {
        setFeedback({ type: "error", text: result.error });
      }
    });
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Layout Approval
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Review the AI-composed blueprint. Swap individual sections, regenerate
          the whole layout, or approve to continue the pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6">
        {/* Left column: section list */}
        <aside className="lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-auto">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            Sections
          </h3>
          {sectionIds.length === 0 ? (
            <p className="text-sm text-slate-500">No sections in layout.</p>
          ) : (
            <ol className="flex flex-col gap-2">
              {sectionIds.map((componentId, index) => {
                const entry = manifestEntry(componentId);
                const name = entry?.name ?? componentId;
                const category = entry?.category ?? "unknown";
                return (
                  <li
                    key={`${componentId}-${index}`}
                    className="rounded-md border border-slate-200 bg-white p-3 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-xs text-slate-400">
                          #{index + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-900 truncate">
                          {name}
                        </span>
                        <span className="inline-block self-start rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600">
                          {category}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedSwapTarget(componentId)}
                        disabled={isPending}
                        className="shrink-0 rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Swap
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </aside>

        {/* Right column: blueprint preview */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Preview</h3>
          <BlueprintPreview draft={draft} interactive={false} />
        </div>
      </div>

      {/* Feedback + action buttons */}
      <div className="flex flex-col gap-3">
        {feedback && (
          <p
            className={
              feedback.type === "success"
                ? "text-sm text-green-600"
                : "text-sm text-red-600"
            }
            role="alert"
          >
            {feedback.text}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleApprove}
            disabled={isPending}
            className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Working..." : "Approve Layout"}
          </button>
          <button
            type="button"
            onClick={() => setShowRegenerateConfirm(true)}
            disabled={isPending}
            className="border border-slate-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Regenerate Layout
          </button>
        </div>
      </div>

      {/* Regenerate confirm modal */}
      {showRegenerateConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm regenerate layout"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowRegenerateConfirm(false)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-slate-900">
              Regenerate layout?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Regenerating will discard your component swaps. Continue?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRegenerateConfirm(false)}
                disabled={isPending}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRegenerateConfirm}
                disabled={isPending}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Regenerating..." : "Regenerate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Component picker overlay */}
      {selectedSwapTarget && (
        <ComponentPicker
          targetComponentId={selectedSwapTarget}
          currentNeighbors={getNeighbors(selectedSwapTarget)}
          onSelect={handleSwap}
          onClose={() => setSelectedSwapTarget(null)}
        />
      )}
    </div>
  );
}
