import type { HumanizerOutput, Palette, Typography } from "../shared/types";
import {
  COMPONENT_SOURCES,
  COMPONENT_ID_TO_PATH,
  COMPONENT_METADATA,
} from "./component-sources.generated";

/* ------------------------------------------------------------------ */
/*  File Generators (deterministic string concatenation)               */
/* ------------------------------------------------------------------ */

/**
 * Convert a component ID like "hero-split-image-01" to a PascalCase
 * import name like "HeroSplitImage01".
 */
export function toComponentName(componentId: string): string {
  return componentId
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Slot metadata passed through recursive sanitization.
 * Mirrors the structure of metadata.json slot definitions so enum
 * constraints inside itemSchema are propagated to nested fields.
 */
interface SlotMeta {
  enum?: unknown[];
  itemSchema?: Record<string, SlotMeta>;
}

/**
 * Replace null/undefined values with safe defaults based on key name.
 *
 * The Content Agent returns null for "url" and "image" slot types.
 * When those nulls are nested inside arrays/objects (e.g. navbar links),
 * JSON.stringify preserves them, causing TypeScript build failures.
 * This function walks the value tree and replaces nulls with defaults.
 *
 * Also clamps enum values: if a slot (or nested itemSchema field) has an
 * enum constraint and the value is not in it, clamp to the first allowed value.
 */
export function sanitizeSlotValue(
  value: unknown,
  key?: string,
  slotMeta?: SlotMeta,
): unknown {
  if (value === null || value === undefined) {
    if (key && /url|href|src/i.test(key)) return "#";
    if (key && /image|img|banner|photo|avatar|logo|icon/i.test(key))
      return "/placeholder.svg";
    if (key && /alt/i.test(key)) return "";
    return undefined;
  }

  // Enum clamping: if slot has an enum constraint and the value is not in it,
  // clamp to the first allowed value (defense-in-depth after Content Agent validation)
  if (
    slotMeta?.enum &&
    slotMeta.enum.length > 0 &&
    typeof value === "string" &&
    !slotMeta.enum.includes(value)
  ) {
    const clamped = String(slotMeta.enum[0]);
    console.warn("[assembler] enum clamped:", {
      slot: key,
      from: value,
      to: clamped,
    });
    return clamped;
  }

  if (Array.isArray(value)) {
    return value.map((item) => {
      // Unwrap metadata-shaped objects: {type:"text", maxLength:40, text:"cão"} → "cão"
      if (typeof item === "object" && item !== null && !Array.isArray(item)) {
        const obj = item as Record<string, unknown>;
        if (typeof obj.text === "string" && obj.type === "text") {
          return obj.text;
        }
      }
      // Pass itemSchema so nested object fields get their enum constraints
      return sanitizeSlotValue(
        item,
        key,
        slotMeta?.itemSchema ? { itemSchema: slotMeta.itemSchema } : undefined,
      );
    });
  }
  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      // Look up field-specific metadata from itemSchema (e.g. network.enum)
      const fieldMeta = slotMeta?.itemSchema?.[k] as SlotMeta | undefined;
      const sanitized = sanitizeSlotValue(v, k, fieldMeta);
      if (sanitized !== undefined) {
        result[k] = sanitized;
      }
    }
    return result;
  }
  return value;
}

/**
 * Serialize a slot value for embedding in JSX props.
 */
function serializeSlotValue(value: unknown): string {
  if (typeof value === "string") {
    // Escape curly braces and quotes for JSX
    const escaped = value
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$/g, "\\$");
    return `{\`${escaped}\`}`;
  }
  if (value === null || value === undefined) {
    return "{undefined}";
  }
  return `{${JSON.stringify(value)}}`;
}

/**
 * Generate a JSX section for a single component with its slot props.
 * Looks up COMPONENT_METADATA to pass slot-level enum constraints
 * to sanitizeSlotValue for defense-in-depth clamping.
 */
export function buildPageSlots(
  componentId: string,
  slots: Record<string, unknown>,
): string {
  const name = toComponentName(componentId);
  const propsEntries = Object.entries(slots);

  if (propsEntries.length === 0) {
    return `      <${name} />`;
  }

  // Look up component slot definitions for enum clamping (including nested itemSchema)
  const componentMeta = COMPONENT_METADATA[componentId];
  const slotDefs = (componentMeta?.slots ?? []) as Array<{
    name?: string;
    enum?: unknown[];
    itemSchema?: Record<string, SlotMeta>;
  }>;

  const propsStr = propsEntries
    .map(([key, value]) => {
      const slotDef = slotDefs.find((s) => s.name === key);
      const slotMeta: SlotMeta | undefined =
        slotDef?.enum || slotDef?.itemSchema
          ? { enum: slotDef.enum, itemSchema: slotDef.itemSchema }
          : undefined;
      return `        ${key}=${serializeSlotValue(sanitizeSlotValue(value, key, slotMeta))}`;
    })
    .join("\n");

  return `      <${name}\n${propsStr}\n      />`;
}

/**
 * Generate PageClient.tsx — a Client Component that imports all section
 * components and renders them with slot data baked in. This keeps all
 * interactive rendering inside the client boundary, matching the
 * compre-pronto pattern: page.tsx (Server) → PageClient (Client) → sections.
 */
export function generatePageClientTsx(
  humanizerOutput: HumanizerOutput,
): string {
  const imports = humanizerOutput.components
    .map((c) => {
      const name = toComponentName(c.componentId);
      // Use COMPONENT_ID_TO_PATH for real component directory paths.
      // The map stores "src/components/category/Name" — strip "src/" for @/ alias.
      const mappedPath = COMPONENT_ID_TO_PATH[c.componentId];
      if (mappedPath) {
        const importPath = `@/${mappedPath.replace(/^src\//, "")}`;
        return `import ${name} from "${importPath}";`;
      }
      // Fallback for unmapped components
      return `import ${name} from "@/components/${c.componentId}";`;
    })
    .join("\n");

  const sections = humanizerOutput.components
    .map((c) => buildPageSlots(c.componentId, c.slots))
    .join("\n");

  return `"use client";

${imports}

export default function PageClient() {
  return (
    <main>
${sections}
    </main>
  );
}
`;
}

/**
 * Generate page.tsx — a thin Server Component shell that renders
 * PageClient. Stays a Server Component so it can export metadata
 * and participate in static generation without RSC serialization issues.
 */
export function generatePageTsx(): string {
  return `import PageClient from "./PageClient";

export default function Home() {
  return <PageClient />;
}
`;
}

/**
 * Generate package.json with real component library dependencies.
 */
export function generatePackageJson(projectId: string): string {
  return JSON.stringify(
    {
      name: `sitegen-${projectId}`,
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
      },
      dependencies: {
        next: "^15",
        react: "^18",
        "react-dom": "^18",
        clsx: "^2.1.1",
        "framer-motion": "^12.38.0",
        lenis: "^1.3.21",
        motion: "^12.38.0",
        "react-icons": "^5.6.0",
        "rough-notation": "^0.5.1",
        "tailwind-merge": "^3.5.0",
      },
      devDependencies: {
        "@types/node": "^20",
        "@types/react": "^18",
        typescript: "^5",
        tailwindcss: "^3",
        autoprefixer: "^10",
        postcss: "^8",
        "tailwindcss-animate": "^1.0.7",
      },
    },
    null,
    2,
  );
}

/**
 * Generate next.config.js for the Next.js app.
 */
export function generateNextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
`;
}

/**
 * Generate tailwind.config.ts with the full design token set
 * matching the components workspace configuration.
 */
export function generateTailwindConfig(): string {
  return `import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

function oklch(variable: string): string {
  return \`oklch(var(\${variable}) / <alpha-value>)\`;
}

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "base-100": oklch("--color-base-100"),
        "base-200": oklch("--color-base-200"),
        "base-300": oklch("--color-base-300"),
        "base-content": oklch("--color-base-content"),

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
`;
}

/**
 * Generate tsconfig.json for the Next.js app.
 */
export function generateTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./src/*"] },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    },
    null,
    2,
  );
}

/**
 * Generate postcss.config.js for Tailwind CSS.
 */
export function generatePostCssConfig(): string {
  return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
}

/* ------------------------------------------------------------------ */
/*  Color Conversion: hex → OKLCH                                      */
/* ------------------------------------------------------------------ */

/**
 * Convert an sRGB channel in [0..1] to a linear-RGB channel.
 */
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Convert a hex color like "#4A90E2" or "4a90e2" (3- or 6-digit) into
 * a DaisyUI v4-compatible OKLCH string of three space-separated floats:
 * "L C H" (e.g. "0.62 0.14 243.65"). Returns fallbacks for invalid input.
 */
export function hexToOklch(hex: string): string {
  // Normalize input
  let cleaned = hex.trim().replace(/^#/, "");
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    // Fallback to neutral gray
    return "0.5 0 0";
  }

  const rInt = parseInt(cleaned.slice(0, 2), 16);
  const gInt = parseInt(cleaned.slice(2, 4), 16);
  const bInt = parseInt(cleaned.slice(4, 6), 16);

  // sRGB → linear RGB
  const r = srgbToLinear(rInt / 255);
  const g = srgbToLinear(gInt / 255);
  const b = srgbToLinear(bInt / 255);

  // Linear RGB → LMS (OKLab matrix)
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  // LMS → OKLab
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bLab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  // OKLab → OKLCH
  const C = Math.sqrt(a * a + bLab * bLab);
  let H = (Math.atan2(bLab, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  const round = (n: number, p: number): number =>
    Math.round(n * Math.pow(10, p)) / Math.pow(10, p);

  return `${round(L, 3)} ${round(C, 3)} ${round(H, 2)}`;
}

/**
 * Generate globals.css with Tailwind directives and palette CSS vars.
 *
 * Injects hex palette values as OKLCH triplets matching DaisyUI v4's
 * `L C H` format (three space-separated floats, NOT the oklch() function).
 * Typography.heading/body drive --font-sans / --font-serif.
 */
export function generateGlobalsCss(
  palette: Palette,
  typography: Typography,
): string {
  // DaisyUI v4 contrast/content colors — keep hardcoded since Palette doesn't
  // carry per-semantic contrast values. These are near-white / near-black
  // approximations that read well on top of the corresponding semantic color.
  const primaryOklch = hexToOklch(palette.primary);
  const secondaryOklch = hexToOklch(palette.secondary);
  const accentOklch = hexToOklch(palette.accent);
  const neutralOklch = hexToOklch(palette.neutral);
  const base100Oklch = hexToOklch(palette.primaryLight);
  const base300Oklch = hexToOklch(palette.primaryDark);

  // Escape font family strings for CSS custom property values.
  const headingFont = typography.heading;
  const bodyFont = typography.body;

  return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-base-100: ${base100Oklch};
  --color-base-200: ${base100Oklch};
  --color-base-300: ${base300Oklch};
  --color-base-content: 0.27 0.02 261.3;
  --color-primary: ${primaryOklch};
  --color-primary-content: 0.98 0.005 264.38;
  --color-secondary: ${secondaryOklch};
  --color-secondary-content: 0.98 0.005 230.5;
  --color-accent: ${accentOklch};
  --color-accent-content: 0.98 0.005 280.12;
  --color-neutral: ${neutralOklch};
  --color-neutral-content: 0.94 0.005 106.42;
  --color-info: 0.62 0.14 243.65;
  --color-info-content: 0.98 0.005 243.65;
  --color-success: 0.62 0.17 152.55;
  --color-success-content: 0.98 0.005 152.55;
  --color-warning: 0.75 0.16 75.84;
  --color-warning-content: 0.27 0.04 75.84;
  --color-error: 0.58 0.22 27.33;
  --color-error-content: 0.98 0.005 27.33;
  --radius-selector: 1rem;
  --radius-field: 0.25rem;
  --radius-box: 0.5rem;
  --font-sans: ${bodyFont}, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-serif: ${headingFont}, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
`;
}

/**
 * Generate a minimal placeholder SVG for image slots that received null
 * from the Content Agent. Served from /placeholder.svg in the public dir.
 */
export function generatePlaceholderSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <rect width="600" height="400" fill="#e2e8f0"/>
  <text x="300" y="200" text-anchor="middle" dominant-baseline="central" font-family="system-ui,sans-serif" font-size="18" fill="#94a3b8">Imagem</text>
</svg>`;
}

/**
 * Generate layout.tsx for the Next.js app.
 */
export function generateLayoutTsx(): string {
  return `import type { Metadata } from "next";
import { ReactLenis } from "@/lib/ui/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generated Site",
  description: "Generated by SiteGen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ReactLenis root>{children}</ReactLenis>
      </body>
    </html>
  );
}
`;
}

/* ------------------------------------------------------------------ */
/*  Public API — generateSiteFiles                                     */
/* ------------------------------------------------------------------ */

/**
 * Assemble the full file map for a generated Next.js site.
 *
 * This is the primary public API used by the assembler handler
 * (Step Functions pipeline) and the deploy-draft API handler
 * (editor-driven redeploys). Takes humanizer-shaped content plus
 * palette + typography; returns a map of file paths to content.
 *
 * Only component source files whose IDs appear in humanizerOutput
 * are bundled, to keep archive size small.
 */
export function generateSiteFiles(
  projectId: string,
  humanizerOutput: HumanizerOutput,
  palette: Palette,
  typography: Typography,
): Record<string, string> {
  const files: Record<string, string> = {};

  // Root config files
  files["package.json"] = generatePackageJson(projectId);
  files["next.config.js"] = generateNextConfig();
  files["tailwind.config.ts"] = generateTailwindConfig();
  files["tsconfig.json"] = generateTsConfig();
  files["postcss.config.js"] = generatePostCssConfig();

  // Public static assets
  files["public/placeholder.svg"] = generatePlaceholderSvg();

  // App source files
  files["src/app/globals.css"] = generateGlobalsCss(palette, typography);
  files["src/app/layout.tsx"] = generateLayoutTsx();
  files["src/app/page.tsx"] = generatePageTsx();
  files["src/app/PageClient.tsx"] = generatePageClientTsx(humanizerOutput);

  // Only bundle component sources actually used in the page + shared libs.
  // Component paths start with "src/components/", shared libs with "src/lib/".
  const usedComponentDirs = new Set(
    humanizerOutput.components
      .map((c) => COMPONENT_ID_TO_PATH[c.componentId])
      .filter(Boolean),
  );

  for (const [filePath, content] of Object.entries(COMPONENT_SOURCES)) {
    // Always include shared lib files (utilities, UI primitives, etc.)
    if (filePath.startsWith("src/lib/")) {
      files[filePath] = content;
      continue;
    }
    // Only include component files for components used in the page
    if (
      filePath.startsWith("src/components/") &&
      [...usedComponentDirs].some((dir) => filePath.startsWith(dir + "/"))
    ) {
      files[filePath] = content;
    }
  }

  return files;
}
