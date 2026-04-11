import type { Config } from "tailwindcss";

function oklch(variable: string): string {
  return `oklch(var(${variable}) / <alpha-value>)`;
}

const config: Config = {
  content: ["./library/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base surface colors
        "base-100": oklch("--color-base-100"),
        "base-200": oklch("--color-base-200"),
        "base-300": oklch("--color-base-300"),
        "base-content": oklch("--color-base-content"),

        // Semantic colors
        primary: oklch("--color-primary"),
        "primary-content": oklch("--color-primary-content"),
        secondary: oklch("--color-secondary"),
        "secondary-content": oklch("--color-secondary-content"),
        accent: oklch("--color-accent"),
        "accent-content": oklch("--color-accent-content"),
        neutral: oklch("--color-neutral"),
        "neutral-content": oklch("--color-neutral-content"),

        // State colors
        info: oklch("--color-info"),
        "info-content": oklch("--color-info-content"),
        success: oklch("--color-success"),
        "success-content": oklch("--color-success-content"),
        warning: oklch("--color-warning"),
        "warning-content": oklch("--color-warning-content"),
        error: oklch("--color-error"),
        "error-content": oklch("--color-error-content"),
      },
      borderRadius: {
        selector: "var(--radius-selector)",
        field: "var(--radius-field)",
        box: "var(--radius-box)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        serif: "var(--font-serif)",
        mono: "var(--font-mono)",
      },
    },
  },
  plugins: [],
};

export default config;
