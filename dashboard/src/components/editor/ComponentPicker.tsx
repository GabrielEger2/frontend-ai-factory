"use client";

import { useMemo } from "react";
import manifest from "@components/library/manifest.json";

interface ManifestEntry {
  id: string;
  name?: string;
  category?: string;
  style?: string[];
  mood?: string[];
  pairsWell?: string[];
  pairsPoorly?: string[];
}

const MANIFEST = manifest as unknown as ManifestEntry[];

interface ComponentPickerProps {
  /** ID of the section being replaced — excluded from candidate list. */
  targetComponentId: string;
  /**
   * Category to restrict candidates to. When omitted we fall back to
   * the target's own category from the manifest.
   */
  category?: string;
  /**
   * Neighboring component IDs in the blueprint (usually the sibling
   * before and after the target). Used to rank candidates by how well
   * they "pair with" the neighbors via the `pairsWell` metadata.
   */
  currentNeighbors: string[];
  onSelect: (newComponentId: string) => void;
  onClose: () => void;
}

/**
 * Alternatives picker — shows up to 6 components in the same category,
 * ranked by `pairsWell` overlap with the current neighboring sections.
 *
 * Rendered as a simple overlay card (no shadcn Dialog dependency) so
 * we avoid adding another Radix primitive in this wave. The parent shell
 * controls open/close via the `activePicker` state.
 */
export function ComponentPicker({
  targetComponentId,
  category,
  currentNeighbors,
  onSelect,
  onClose,
}: ComponentPickerProps) {
  const targetEntry = useMemo(
    () => MANIFEST.find((e) => e.id === targetComponentId),
    [targetComponentId],
  );
  const effectiveCategory = category ?? targetEntry?.category;

  const candidates = useMemo(() => {
    const pool = MANIFEST.filter(
      (entry) =>
        entry.id !== targetComponentId &&
        (!effectiveCategory || entry.category === effectiveCategory),
    );

    const neighborSet = new Set(currentNeighbors);

    const scored = pool.map((entry) => {
      const pairs = entry.pairsWell ?? [];
      const score = pairs.reduce(
        (acc, id) => (neighborSet.has(id) ? acc + 1 : acc),
        0,
      );
      return { entry, score };
    });

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (a.entry.name ?? a.entry.id).localeCompare(
        b.entry.name ?? b.entry.id,
      );
    });

    return scored.slice(0, 6);
  }, [effectiveCategory, targetComponentId, currentNeighbors]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pick an alternative component"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Swap{" "}
              <code className="text-sm text-slate-600">
                {targetComponentId}
              </code>
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Alternatives in{" "}
              <span className="font-medium text-slate-700">
                {effectiveCategory ?? "any category"}
              </span>
              , ranked by compatibility with neighboring sections.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        {candidates.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No alternatives available for this category.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {candidates.map(({ entry, score }) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(entry.id);
                    onClose();
                  }}
                  className="flex w-full flex-col gap-1 rounded-md border border-slate-200 p-3 text-left hover:border-slate-900 hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-900">
                      {entry.name ?? entry.id}
                    </span>
                    {score > 0 && (
                      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                        pairs {score}
                      </span>
                    )}
                  </div>
                  <code className="text-xs text-slate-500">{entry.id}</code>
                  {(entry.mood?.length || entry.style?.length) && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {entry.mood?.slice(0, 3).map((m) => (
                        <span
                          key={`mood-${m}`}
                          className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] text-blue-800"
                        >
                          {m}
                        </span>
                      ))}
                      {entry.style?.slice(0, 3).map((s) => (
                        <span
                          key={`style-${s}`}
                          className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-800"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
