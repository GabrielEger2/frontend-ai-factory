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
}

/**
 * Shared palette editor — a grid of the 6 palette color roles, each
 * with a native color picker and a matching hex text input.
 *
 * Used by both the approval-time StyleApprovalPanel and the
 * post-generation PaletteSwitcher in the visual editor.
 */
export function PalettePicker({ palette, onChange }: PalettePickerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {PALETTE_KEYS.map(({ key, label }) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {label}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={palette[key]}
              onChange={(e) => onChange(key, e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-slate-300"
            />
            <input
              type="text"
              value={palette[key]}
              onChange={(e) => onChange(key, e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="#000000"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
