import type { CSSProperties } from "react";
import type { Palette, Typography } from "@/types/project";

/**
 * Dashboard-local mirror of agents/assembler/core.ts `hexToOklch`.
 *
 * Library components are styled with DaisyUI tokens (e.g. `bg-primary`,
 * `text-base-content`). The compiled Tailwind classes reference CSS
 * custom properties like `--color-primary` expressed as three
 * space-separated OKLCH floats (`L C H`) — NOT the `oklch()` function.
 *
 * We mirror the same conversion here so the dashboard's BlueprintPreview
 * can inject the WorkingDraft palette into those custom properties at
 * runtime without importing Node-only agent code.
 */

/** sRGB [0..1] → linear-RGB [0..1]. */
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Convert a hex color (`#4A90E2`, `4a90e2`, or `#abc`) into DaisyUI v4's
 * `L C H` triplet. Returns a neutral-gray fallback for malformed input.
 */
export function hexToOklch(hex: string): string {
  let cleaned = hex.trim().replace(/^#/, "");
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return "0.5 0 0";
  }

  const rInt = parseInt(cleaned.slice(0, 2), 16);
  const gInt = parseInt(cleaned.slice(2, 4), 16);
  const bInt = parseInt(cleaned.slice(4, 6), 16);

  const r = srgbToLinear(rInt / 255);
  const g = srgbToLinear(gInt / 255);
  const b = srgbToLinear(bInt / 255);

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bLab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.sqrt(a * a + bLab * bLab);
  let H = (Math.atan2(bLab, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  const round = (n: number, p: number): number =>
    Math.round(n * Math.pow(10, p)) / Math.pow(10, p);

  return `${round(L, 3)} ${round(C, 3)} ${round(H, 2)}`;
}

/**
 * Build an inline-style object that maps a WorkingDraft palette onto the
 * DaisyUI custom properties consumed by library components. Keys are
 * typed as React `CSSProperties` with a string index for the custom vars.
 */
export function paletteToCssVars(
  palette: Palette,
  typography?: Typography,
): CSSProperties {
  const style: Record<string, string> = {
    "--color-primary": hexToOklch(palette.primary),
    "--color-primary-content": "0.98 0.005 264.38",
    "--color-secondary": hexToOklch(palette.secondary),
    "--color-secondary-content": "0.98 0.005 230.5",
    "--color-accent": hexToOklch(palette.accent),
    "--color-accent-content": "0.98 0.005 280.12",
    "--color-neutral": hexToOklch(palette.neutral),
    "--color-neutral-content": "0.94 0.005 106.42",
    "--color-base-100": hexToOklch(palette.primaryLight),
    "--color-base-200": hexToOklch(palette.primaryLight),
    "--color-base-300": hexToOklch(palette.primaryDark),
    "--color-base-content": "0.27 0.02 261.3",
    "--color-info": "0.62 0.14 243.65",
    "--color-info-content": "0.98 0.005 243.65",
    "--color-success": "0.62 0.17 152.55",
    "--color-success-content": "0.98 0.005 152.55",
    "--color-warning": "0.75 0.16 75.84",
    "--color-warning-content": "0.27 0.04 75.84",
    "--color-error": "0.58 0.22 27.33",
    "--color-error-content": "0.98 0.005 27.33",
    "--radius-selector": "1rem",
    "--radius-field": "0.25rem",
    "--radius-box": "0.5rem",
  };

  if (typography) {
    style["--font-sans"] =
      `${typography.body}, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
    style["--font-serif"] =
      `${typography.heading}, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`;
  }

  return style as CSSProperties;
}
