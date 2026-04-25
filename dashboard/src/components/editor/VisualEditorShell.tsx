"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  LayoutList,
  Maximize2,
  Minimize2,
  Palette as PaletteIcon,
  Type,
} from "lucide-react";
import { BlueprintPreview } from "./BlueprintPreview";
import { SectionList } from "./SectionList";
import { ComponentPicker } from "./ComponentPicker";
import { PaletteSwitcher } from "./PaletteSwitcher";
import { InlineCopyEditor } from "./InlineCopyEditor";
import { useFullscreenHotkeys } from "./useFullscreenHotkeys";
import { patchDraft } from "@/lib/actions/patch-draft";
import { deployProject } from "@/lib/actions/deploy-project";
import type { Palette, Typography, WorkingDraft } from "@/types/project";

type Viewport = 1280 | 768 | 375;

interface VisualEditorShellProps {
  projectId: string;
  initialDraft: WorkingDraft;
  /** Optional Style Agent palette suggestions — forwarded to PaletteSwitcher. */
  paletteSuggestions?: Palette[];
}

const PATCH_DEBOUNCE_MS = 400;

/**
 * Two-panel visual editor shell:
 *   - Left:   tabbed panel — Sections (list + deploy) | Style | Content
 *   - Center: viewport toggle + BlueprintPreview
 *
 * Edits mutate a local `draft` copy and schedule a debounced patchDraft
 * call. Non-typing edits (reorder, swap, palette preset, variant change,
 * density radio) fire immediately. Deploy calls deployProjectAction and,
 * on success, routes the seller back to the project detail page where
 * they can see the new previewUrl.
 */
export function VisualEditorShell({
  projectId,
  initialDraft,
  paletteSuggestions,
}: VisualEditorShellProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<WorkingDraft>(initialDraft);
  const [viewport, setViewport] = useState<Viewport>(1280);
  const [activePicker, setActivePicker] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"sections" | "style" | "content">(
    "sections",
  );
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [status, setStatus] = useState<
    | { type: "idle" }
    | { type: "saving" }
    | { type: "saved" }
    | { type: "error"; text: string }
  >({ type: "idle" });
  const [isDeploying, startDeploy] = useTransition();

  const patchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "editor-fullscreen",
      isFullscreen,
    );
    return () => document.documentElement.classList.remove("editor-fullscreen");
  }, [isFullscreen]);
  useFullscreenHotkeys(isFullscreen, setIsFullscreen);

  // Flush a draft patch to the server. `immediate` skips the debounce
  // (used for non-typing edits like reorder / palette preset swap).
  const schedulePatch = useCallback(
    (next: WorkingDraft, immediate = false) => {
      if (patchTimer.current) clearTimeout(patchTimer.current);
      const run = async () => {
        setStatus({ type: "saving" });
        const result = await patchDraft(projectId, next);
        if ("error" in result) {
          setStatus({ type: "error", text: result.error });
        } else {
          setStatus({ type: "saved" });
        }
      };
      if (immediate) {
        void run();
      } else {
        patchTimer.current = setTimeout(run, PATCH_DEBOUNCE_MS);
      }
    },
    [projectId],
  );

  function applyDraft(next: WorkingDraft, immediate = false) {
    setDraft(next);
    schedulePatch(next, immediate);
  }

  function handleReorder(newOrder: string[]) {
    applyDraft(
      {
        ...draft,
        blueprint: { ...draft.blueprint, components: newOrder },
        updatedAt: new Date().toISOString(),
      },
      true,
    );
  }

  function handleVariantChange(componentId: string, variantId: string) {
    const nextSelections = {
      ...(draft.blueprint.variantSelections ?? {}),
      [componentId]: variantId,
    };
    applyDraft(
      {
        ...draft,
        blueprint: { ...draft.blueprint, variantSelections: nextSelections },
        updatedAt: new Date().toISOString(),
      },
      true,
    );
  }

  function handleSwap(newComponentId: string) {
    if (!activePicker) return;
    const components = draft.blueprint.components.map((id) =>
      id === activePicker ? newComponentId : id,
    );

    // Reset variant selection for the replaced component (variants are
    // component-specific and don't carry across a swap).
    const nextSelections = { ...(draft.blueprint.variantSelections ?? {}) };
    delete nextSelections[activePicker];

    // Slot schemas differ across components, so carrying the old slots over
    // would feed wrong/undefined props into the new component (e.g. a Hero's
    // headline keys into a testimonial layout) and crash the preview. Reset
    // to an empty slot entry; the seller can edit inline or wait for the
    // next Humanizer rerun to repopulate.
    const nextContentComponents = draft.contentSlots.components.map((entry) =>
      entry.componentId === activePicker
        ? { componentId: newComponentId, slots: {} }
        : entry,
    );

    applyDraft(
      {
        ...draft,
        blueprint: {
          ...draft.blueprint,
          components,
          variantSelections: nextSelections,
        },
        contentSlots: {
          ...draft.contentSlots,
          components: nextContentComponents,
        },
        updatedAt: new Date().toISOString(),
      },
      true,
    );

    if (selectedId === activePicker) setSelectedId(newComponentId);
  }

  const handleStyleChange = useCallback(
    (
      update: Partial<Pick<WorkingDraft, "palette" | "typography" | "density">>,
    ) => {
      setDraft((prev) => {
        const next: WorkingDraft = {
          ...prev,
          ...(update.palette ? { palette: update.palette as Palette } : {}),
          ...(update.typography
            ? { typography: update.typography as Typography }
            : {}),
          ...(update.density ? { density: update.density } : {}),
          updatedAt: new Date().toISOString(),
        };
        schedulePatch(next);
        return next;
      });
    },
    [schedulePatch],
  );

  const handleSlotsChange = useCallback(
    (componentId: string, newSlots: Record<string, unknown>) => {
      setDraft((prev) => {
        const components = prev.contentSlots.components.map((c) =>
          c.componentId === componentId ? { ...c, slots: newSlots } : c,
        );
        const next: WorkingDraft = {
          ...prev,
          contentSlots: { ...prev.contentSlots, components },
          updatedAt: new Date().toISOString(),
        };
        schedulePatch(next);
        return next;
      });
    },
    [schedulePatch],
  );

  function handleDeploy() {
    setStatus({ type: "idle" });
    startDeploy(async () => {
      const result = await deployProject(projectId);
      if ("error" in result) {
        setStatus({ type: "error", text: result.error });
      } else {
        router.push(`/projects/${projectId}`);
      }
    });
  }

  const selectedSlots = useMemo(() => {
    if (!selectedId) return null;
    const entry = draft.contentSlots.components.find(
      (c) => c.componentId === selectedId,
    );
    return entry ? entry.slots : null;
  }, [selectedId, draft.contentSlots.components]);

  return (
    <div className="flex h-full min-h-[80vh] gap-4">
      {!isFullscreen && (
        <>
          {/* Left panel — tabbed */}
          <aside
            className={`flex shrink-0 flex-col gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-200 ${panelCollapsed ? "w-10" : "w-80"}`}
          >
            {panelCollapsed ? (
              <div className="flex flex-col items-center gap-2 py-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("sections");
                    setPanelCollapsed(false);
                  }}
                  title="Sections"
                  className="flex h-8 w-8 items-center justify-center rounded hover:bg-slate-100"
                >
                  <LayoutList className="h-4 w-4 text-slate-600" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("style");
                    setPanelCollapsed(false);
                  }}
                  title="Style"
                  className="flex h-8 w-8 items-center justify-center rounded hover:bg-slate-100"
                >
                  <PaletteIcon className="h-4 w-4 text-slate-600" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("content");
                    setPanelCollapsed(false);
                  }}
                  title="Content"
                  className="flex h-8 w-8 items-center justify-center rounded hover:bg-slate-100"
                >
                  <Type className="h-4 w-4 text-slate-600" />
                </button>
              </div>
            ) : (
              <>
                {/* Tab buttons */}
                <div className="flex shrink-0 border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab("sections")}
                    className={
                      "flex-1 py-2 text-xs font-medium transition-colors " +
                      (activeTab === "sections"
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-50")
                    }
                  >
                    Sections
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("style")}
                    className={
                      "flex-1 py-2 text-xs font-medium transition-colors " +
                      (activeTab === "style"
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-50")
                    }
                  >
                    Style
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedId) setActiveTab("content");
                    }}
                    className={
                      "flex-1 py-2 text-xs font-medium transition-colors " +
                      (activeTab === "content"
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-50") +
                      (selectedId === null
                        ? " opacity-50 cursor-not-allowed pointer-events-none"
                        : "")
                    }
                  >
                    Content
                  </button>
                </div>

                {/* Tab body — overflow-y-auto so dnd-kit drag ghosts don't clip */}
                <div className="flex-1 overflow-y-auto p-3">
                  {activeTab === "sections" && (
                    <>
                      <div className="mb-2 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-slate-800">
                          Sections
                        </h2>
                        <StatusLabel status={status} />
                      </div>
                      <SectionList
                        components={draft.blueprint.components}
                        variantSelections={
                          draft.blueprint.variantSelections ?? {}
                        }
                        onReorder={handleReorder}
                        onSwapRequest={(id) => setActivePicker(id)}
                        onVariantChange={handleVariantChange}
                        onSelect={(id) => {
                          setSelectedId(id);
                          setActiveTab("content");
                        }}
                        selectedId={selectedId}
                      />
                      <button
                        type="button"
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        className="mt-3 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeploying ? "Deploying..." : "Deploy"}
                      </button>
                    </>
                  )}
                  {activeTab === "style" && (
                    <PaletteSwitcher
                      palette={draft.palette}
                      typography={draft.typography}
                      density={draft.density}
                      paletteSuggestions={paletteSuggestions}
                      onChange={handleStyleChange}
                    />
                  )}
                  {activeTab === "content" && selectedId && selectedSlots && (
                    <InlineCopyEditor
                      componentId={selectedId}
                      slots={selectedSlots}
                      onSlotsChange={handleSlotsChange}
                    />
                  )}
                </div>
              </>
            )}
          </aside>

          {/* Collapse toggle */}
          <button
            type="button"
            onClick={() => setPanelCollapsed((p) => !p)}
            className="-mx-2 z-10 flex h-8 w-4 items-center justify-center self-center rounded-sm bg-slate-200 hover:bg-slate-300"
            title={panelCollapsed ? "Expand panel" : "Collapse panel"}
          >
            <ChevronLeft
              className={`h-3 w-3 transition-transform ${panelCollapsed ? "rotate-180" : ""}`}
            />
          </button>
        </>
      )}

      {/* Center panel */}
      <section className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center justify-center gap-2">
          {([1280, 768, 375] as const).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setViewport(w)}
              className={
                "rounded px-3 py-1 text-xs " +
                (viewport === w
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50")
              }
            >
              {w === 1280 ? "Desktop" : w === 768 ? "Tablet" : "Mobile"}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsFullscreen((f) => !f)}
            className="ml-2 rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
            title={
              isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen preview (F)"
            }
          >
            {isFullscreen ? (
              <Minimize2 className="h-3 w-3" />
            ) : (
              <Maximize2 className="h-3 w-3" />
            )}
          </button>
        </div>
        <div className="flex min-h-0 flex-1 items-start justify-center overflow-auto rounded-lg bg-slate-100 p-4">
          <BlueprintPreview draft={draft} viewportWidth={viewport} />
        </div>
      </section>

      {activePicker && (
        <ComponentPicker
          targetComponentId={activePicker}
          currentNeighbors={neighborsOf(
            draft.blueprint.components,
            activePicker,
          )}
          onSelect={handleSwap}
          onClose={() => setActivePicker(null)}
        />
      )}
    </div>
  );
}

function neighborsOf(components: string[], id: string): string[] {
  const idx = components.indexOf(id);
  if (idx < 0) return [];
  const out: string[] = [];
  if (idx > 0) out.push(components[idx - 1]);
  if (idx < components.length - 1) out.push(components[idx + 1]);
  return out;
}

function StatusLabel({
  status,
}: {
  status:
    | { type: "idle" }
    | { type: "saving" }
    | { type: "saved" }
    | { type: "error"; text: string };
}) {
  if (status.type === "idle") return null;
  if (status.type === "saving")
    return <span className="text-xs text-slate-500">Saving…</span>;
  if (status.type === "saved")
    return <span className="text-xs text-green-600">Saved</span>;
  return (
    <span className="truncate text-xs text-red-600" title={status.text}>
      {status.text}
    </span>
  );
}
