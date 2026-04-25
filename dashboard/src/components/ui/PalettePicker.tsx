"use client";

import type { Palette } from "@/types/project";

const PALETTE_KEYS: { key: keyof Palette; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "accent", label: "Accent" },
  { key: "neutral", label: "Neutral" },
  { key: "primaryLight", label: "Primary Light" },
  { key: "primaryDark", label: "Primary Dark" },
];

interface PalettePickerProps {
  palette: Palette;
  onChange: (key: keyof Palette, value: string) => void;
  /**
   * When true, render a tighter 2-col grid sized for narrow containers
   * (e.g. the ~320px editor side panel) instead of the default
   * responsive 1/2/3-col layout used in wider approval panels.
   */
  compact?: boolean;
}

/**
 * Shared palette editor — a grid of the 6 palette color roles, each
 * with a native color picker and a matching hex text input.
 *
 * Used by both the approval-time StyleApprovalPanel and the
 * post-generation PaletteSwitcher in the visual editor.
 */
export function PalettePicker({
  palette,
  onChange,
  compact = false,
}: PalettePickerProps) {
  const gridClass = compact
    ? "grid grid-cols-2 gap-3"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";
  const swatchClass = compact
    ? "h-8 w-8 shrink-0 cursor-pointer rounded border border-slate-300"
    : "h-9 w-12 shrink-0 cursor-pointer rounded border border-slate-300";
  const inputClass = compact
    ? "w-full min-w-0 border border-slate-300 rounded-md px-2 py-1.5 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-slate-400"
    : "w-full min-w-0 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400";

  return (
    <div className={gridClass}>
      {PALETTE_KEYS.map(({ key, label }) => (
        <div key={key} className="flex min-w-0 flex-col gap-1">
          <label className="block text-xs font-medium text-slate-600">
            {label}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={palette[key]}
              onChange={(e) => onChange(key, e.target.value)}
              className={swatchClass}
              aria-label={`${label} color picker`}
            />
            <input
              type="text"
              value={palette[key]}
              onChange={(e) => onChange(key, e.target.value)}
              className={inputClass}
              placeholder="#000000"
              aria-label={`${label} hex value`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
