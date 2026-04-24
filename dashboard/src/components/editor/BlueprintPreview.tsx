"use client";

import { Component as ReactComponent, type ReactNode } from "react";
import { componentsById } from "@components/library";
import { paletteToCssVars } from "@/lib/palette-to-css";
import type { WorkingDraft } from "@/types/project";

export type PreviewViewportWidth = 1280 | 768 | 375;

interface BlueprintPreviewProps {
  /** The WorkingDraft to render — blueprint order, contentSlots, palette, typography. */
  draft: WorkingDraft;
  /**
   * Desktop / tablet / mobile preview width. Parent (VisualEditorShell)
   * owns the toggle state; default is desktop.
   */
  viewportWidth?: PreviewViewportWidth;
  /**
   * When false, the preview wrapper disables pointer events so hover/click
   * interactions inside library components don't fire. Used by the public
   * /share/[token] page for read-only client previews.
   */
  interactive?: boolean;
}

/**
 * Per-section error boundary so that a render-time crash in one library
 * component (e.g. a swapped section whose required slots haven't been
 * written by the Humanizer yet) doesn't take down the whole preview.
 */
class SectionErrorBoundary extends ReactComponent<
  { componentId: string; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (typeof console !== "undefined") {
      console.warn(
        `[BlueprintPreview] section "${this.props.componentId}" failed to render`,
        error,
      );
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="border-b border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <p className="font-medium">
            Section can't render with current content.
          </p>
          <p className="mt-1 text-amber-800/80">
            <code>{this.props.componentId}</code> — try editing its copy in the
            right panel, or rerun the pipeline so the Humanizer can fill in the
            required content.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Live in-dashboard renderer for a seller's working draft. Renders each
 * component in `draft.blueprint.components` in order, passing the matching
 * content slots from `draft.contentSlots` as props.
 *
 * DaisyUI token bridge: library components are tagged with classes like
 * `bg-primary`, `text-base-content` compiled against `oklch(var(--color-*))`.
 * We inject those custom properties on `.preview-root` via inline style
 * from `paletteToCssVars(draft.palette, draft.typography)` so the preview
 * honors the seller's palette edits without a full rebuild.
 *
 * If a component ID is present in the blueprint but not registered in
 * `componentsById`, we render a warning placeholder instead of crashing.
 * If a registered component throws while rendering (e.g. missing required
 * slot data), `SectionErrorBoundary` catches it and shows a placeholder
 * for that section only — the rest of the preview keeps rendering.
 */
export function BlueprintPreview({
  draft,
  viewportWidth = 1280,
  interactive = true,
}: BlueprintPreviewProps) {
  const cssVars = paletteToCssVars(draft.palette, draft.typography);

  return (
    <div
      className="preview-root mx-auto overflow-auto rounded-md border border-slate-200 bg-white shadow-sm"
      style={{
        ...cssVars,
        width: viewportWidth,
        maxWidth: "100%",
        maxHeight: "80vh",
        pointerEvents: interactive ? "auto" : "none",
      }}
    >
      {draft.blueprint.components.map((componentId, index) => {
        const Component = componentsById[componentId];
        if (!Component) {
          return (
            <div
              key={`${componentId}-${index}`}
              className="p-4 text-sm text-yellow-800 bg-yellow-50 border-b border-yellow-200"
            >
              Unknown component: <code>{componentId}</code>
            </div>
          );
        }

        const contentEntry = draft.contentSlots.components.find(
          (c) => c.componentId === componentId,
        );
        const slots = (contentEntry?.slots ?? {}) as Record<string, unknown>;
        const variant = draft.blueprint.variantSelections?.[componentId];

        return (
          <SectionErrorBoundary
            key={`${componentId}-${index}`}
            componentId={componentId}
          >
            <Component {...slots} {...(variant ? { variant } : {})} />
          </SectionErrorBoundary>
        );
      })}
    </div>
  );
}
