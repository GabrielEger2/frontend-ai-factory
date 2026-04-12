import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

function oklch(variable: string): string {
  return `oklch(var(${variable}) / <alpha-value>)`;
}

const config: Config = {
  content: [
    "./library/**/*.{ts,tsx}",
    "./ui/**/*.{ts,tsx}",
    "./@ui/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Base surface colors ──────────────────────────────────
        "base-100": oklch("--color-base-100"),
        "base-200": oklch("--color-base-200"),
        "base-300": oklch("--color-base-300"),
        "base-content": oklch("--color-base-content"),

        // ── Semantic colors (object form: DEFAULT + foreground + content) ─
        primary: {
          DEFAULT: oklch("--color-primary"),
          foreground: oklch("--color-primary-content"),
        },
        "primary-content": oklch("--color-primary-content"),

        secondary: {
          DEFAULT: oklch("--color-secondary"),
          foreground: oklch("--color-secondary-content"),
        },
        "secondary-content": oklch("--color-secondary-content"),

        accent: {
          DEFAULT: oklch("--color-accent"),
          foreground: oklch("--color-accent-content"),
        },
        "accent-content": oklch("--color-accent-content"),

        neutral: {
          DEFAULT: oklch("--color-neutral"),
          foreground: oklch("--color-neutral-content"),
        },
        "neutral-content": oklch("--color-neutral-content"),

        // ── State colors ─────────────────────────────────────────
        info: {
          DEFAULT: oklch("--color-info"),
          foreground: oklch("--color-info-content"),
        },
        "info-content": oklch("--color-info-content"),

        success: {
          DEFAULT: oklch("--color-success"),
          foreground: oklch("--color-success-content"),
        },
        "success-content": oklch("--color-success-content"),

        warning: {
          DEFAULT: oklch("--color-warning"),
          foreground: oklch("--color-warning-content"),
        },
        "warning-content": oklch("--color-warning-content"),

        error: {
          DEFAULT: oklch("--color-error"),
          foreground: oklch("--color-error-content"),
        },
        "error-content": oklch("--color-error-content"),
      },
      borderRadius: {
        lg: "var(--radius-box)",
        md: "calc(var(--radius-box) - 2px)",
        sm: "calc(var(--radius-box) - 4px)",
        selector: "var(--radius-selector)",
        field: "var(--radius-field)",
        box: "var(--radius-box)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        serif: "var(--font-serif)",
        mono: "var(--font-mono)",
      },
      keyframes: {
        "line-shadow": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "100% -100%" },
        },
      },
      animation: {
        "line-shadow": "line-shadow 15s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
