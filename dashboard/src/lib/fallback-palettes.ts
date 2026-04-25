import type { Palette } from "@/types/project";

/**
 * Hand-picked palette presets used by the visual editor's palette
 * switcher when `styleOutput.paletteSuggestions` is undefined.
 *
 * Three presets cover common brand moods: cool blue (trustworthy/modern),
 * warm terracotta (friendly/energetic), and neutral minimal (elegant/calm).
 */
export const FALLBACK_PALETTES: Palette[] = [
  {
    primary: "#1d4ed8",
    secondary: "#60a5fa",
    accent: "#f59e0b",
    neutral: "#1e293b",
    primaryLight: "#f8fafc",
    primaryDark: "#0f172a",
  },
  {
    primary: "#b45309",
    secondary: "#f97316",
    accent: "#14b8a6",
    neutral: "#292524",
    primaryLight: "#fef7ed",
    primaryDark: "#431407",
  },
  {
    primary: "#18181b",
    secondary: "#71717a",
    accent: "#a855f7",
    neutral: "#27272a",
    primaryLight: "#fafafa",
    primaryDark: "#09090b",
  },
];
