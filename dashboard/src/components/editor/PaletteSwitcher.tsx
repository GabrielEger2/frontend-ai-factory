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

  const sectionClass =
    "flex flex-col gap-3 border-t border-slate-100 pt-5 first:border-t-0 first:pt-0";
  const headingClass =
    "text-[11px] font-semibold uppercase tracking-wider text-slate-500";

  return (
    <div className="flex flex-col gap-5">
      <section className={sectionClass}>
        <h3 className={headingClass}>Presets</h3>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset, i) => {
            const isActive =
              preset.primary === palette.primary &&
              preset.secondary === palette.secondary &&
              preset.accent === palette.accent;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onChange({ palette: preset })}
                className={`group flex flex-col items-stretch gap-1.5 rounded-md border p-1.5 transition-colors ${
                  isActive
                    ? "border-slate-900 ring-1 ring-slate-900"
                    : "border-slate-200 hover:border-slate-400"
                }`}
                aria-label={`Apply preset ${i + 1}`}
                aria-pressed={isActive}
              >
                <div className="flex h-7 w-full overflow-hidden rounded">
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
                <span className="text-[10px] font-medium text-slate-500 group-hover:text-slate-900">
                  Preset {i + 1}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className={headingClass}>Custom Palette</h3>
        <PalettePicker
          palette={palette}
          compact
          onChange={(key, value) =>
            onChange({ palette: { ...palette, [key]: value } })
          }
        />
      </section>

      <section className={sectionClass}>
        <h3 className={headingClass}>Typography</h3>
        <div className="grid grid-cols-1 gap-3">
          {(["heading", "body"] as const).map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">
                {field === "heading" ? "Heading" : "Body"}
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
                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
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

      <section className={sectionClass}>
        <h3 className={headingClass}>Density</h3>
        <div
          role="radiogroup"
          aria-label="Density"
          className="grid grid-cols-3 gap-1 rounded-md border border-slate-200 bg-slate-50 p-1"
        >
          {(["low", "medium", "high"] as const).map((level) => {
            const checked = density === level;
            return (
              <button
                key={level}
                type="button"
                role="radio"
                aria-checked={checked}
                onClick={() => onChange({ density: level })}
                className={`rounded px-2 py-1.5 text-xs font-medium transition-colors ${
                  checked
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
