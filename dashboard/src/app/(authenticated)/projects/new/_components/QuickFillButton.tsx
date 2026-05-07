"use client";

import { useEffect, useRef, useState } from "react";
import { PRESETS, type PresetValues } from "../_presets";

interface QuickFillButtonProps {
  onSelect: (preset: PresetValues) => void;
}

/**
 * Dev-only Quick Fill panel.
 *
 * Renders a fixed amber button in the top-right corner of the create-project
 * page. When clicked it expands a dropdown listing every preset from
 * `_presets.ts`. Choosing one calls `onSelect(preset.values)` so the parent
 * page can hydrate every form-state slice in a single batch.
 *
 * Production builds short-circuit to `null` via the NODE_ENV gate. Next.js
 * inlines `process.env.NODE_ENV` at build time, so the entire component (and
 * the imported preset data) tree-shakes out of the prod bundle.
 */
export function QuickFillButton({ onSelect }: QuickFillButtonProps) {
  const [open, setOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!containerRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open]);

  // NODE_ENV is a Next.js compile-time constant; in production builds the
  // condition becomes a literal `true` and the whole component (plus the
  // imported preset data) tree-shakes out of the bundle.
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div ref={containerRef} className="fixed top-4 right-4 z-50">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="rounded-md border-2 border-amber-400 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
      >
        🧪 Load preset…
      </button>

      {open ? (
        <ul
          role="listbox"
          className="mt-2 w-64 max-h-80 overflow-y-auto rounded-md border border-amber-300 bg-white shadow-lg"
        >
          {PRESETS.map((preset) => (
            <li key={preset.key}>
              <button
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => {
                  onSelect(preset.values);
                  setOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-amber-50 border-b border-amber-100 last:border-b-0"
              >
                {preset.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
