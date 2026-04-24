"use client";

import { PalettePicker } from "@/components/ui/PalettePicker";
import { FALLBACK_PALETTES } from "@/lib/fallback-palettes";
import type { Palette, Typography, WorkingDraft } from "@/types/project";

type DraftStyleSlice = Pick<WorkingDraft, "palette" | "typography" | "density">;

interface PaletteSwitcherProps {
  palette: Palette;
  typography: Typography;
  density: "low" | "medium" | "high";
  /** Optional suggestions from the Style Agent — shown as preset swatches. */
  paletteSuggestions?: Palette[];
  onChange: (update: Partial<DraftStyleSlice>) => void;
}

const FONT_OPTIONS = [
  "Inter",
  "Poppins",
  "Lora",
  "Playfair Display",
  "Nunito",
  "Montserrat",
  "Roboto",
  "Raleway",
];

/**
 * Right-panel control cluster for the visual editor: palette presets,
 * custom palette picker, typography inputs, and density radio group.
 *
 * Presets prefer the Style Agent's `paletteSuggestions` (up to 3) and
 * fall back to `FALLBACK_PALETTES` so the panel always renders three
 * preview chips. Each subsection emits a partial draft patch via
 * `onChange`, which the parent merges into the WorkingDraft before
 * debouncing it to the patch-draft endpoint.
 */
export function PaletteSwitcher({
  palette,
  typography,
  density,
  paletteSuggestions,
  onChange,
}: PaletteSwitcherProps) {
  const presets: Palette[] = (
    paletteSuggestions && paletteSuggestions.length > 0
      ? paletteSuggestions
      : FALLBACK_PALETTES
  ).slice(0, 3);

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-slate-200 bg-white p-4">
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-slate-800">Presets</h3>
        <div className="flex gap-2">
          {presets.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange({ palette: preset })}
              className="group flex flex-col items-stretch gap-1 rounded border border-slate-200 p-2 hover:border-slate-900"
              aria-label={`Apply preset ${i + 1}`}
            >
              <div className="flex h-6 w-24 overflow-hidden rounded">
                <span
                  className="flex-1"
                  style={{ backgroundColor: preset.primary }}
                />
                <span
                  className="flex-1"
                  style={{ backgroundColor: preset.secondary }}
                />
                <span
                  className="flex-1"
                  style={{ backgroundColor: preset.accent }}
                />
                <span
                  className="flex-1"
                  style={{ backgroundColor: preset.neutral }}
                />
              </div>
              <span className="text-[10px] uppercase tracking-wide text-slate-500 group-hover:text-slate-900">
                Preset {i + 1}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-slate-800">Custom Palette</h3>
        <PalettePicker
          palette={palette}
          onChange={(key, value) =>
            onChange({ palette: { ...palette, [key]: value } })
          }
        />
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-slate-800">Typography</h3>
        <div className="grid grid-cols-1 gap-3">
          {(["heading", "body"] as const).map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-700">
                {field === "heading" ? "Heading Font" : "Body Font"}
              </label>
              <input
                type="text"
                list={`ps-font-options-${field}`}
                value={typography[field]}
                onChange={(e) =>
                  onChange({
                    typography: { ...typography, [field]: e.target.value },
                  })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="Select or type a font..."
              />
              <datalist id={`ps-font-options-${field}`}>
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font} />
                ))}
              </datalist>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-slate-800">Density</h3>
        <div className="flex gap-4">
          {(["low", "medium", "high"] as const).map((level) => (
            <label
              key={level}
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              <input
                type="radio"
                name="ps-density"
                value={level}
                checked={density === level}
                onChange={() => onChange({ density: level })}
                className="accent-slate-900"
              />
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
