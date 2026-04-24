"use client";

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
          <Component
            key={`${componentId}-${index}`}
            {...slots}
            {...(variant ? { variant } : {})}
          />
        );
      })}
    </div>
  );
}
