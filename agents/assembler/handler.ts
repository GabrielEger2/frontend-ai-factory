import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AssemblerInputSchema } from "./types";
import type { AssemblerResult } from "./types";
import type { HumanizerOutput } from "../shared/types";
import { buildTarBuffer } from "../shared/tar-utils";
import {
  COMPONENT_SOURCES,
  COMPONENT_ID_TO_PATH,
  COMPONENT_METADATA,
} from "./component-sources.generated";
import * as zlib from "zlib";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});

/* ------------------------------------------------------------------ */
/*  File Generators (deterministic string concatenation)               */
/* ------------------------------------------------------------------ */

/**
 * Convert a component ID like "hero-split-image-01" to a PascalCase
 * import name like "HeroSplitImage01".
 */
function toComponentName(componentId: string): string {
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
function sanitizeSlotValue(
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
function generateComponentSection(
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
 * Generate the full page.tsx file that imports and renders all components.
 */
function generatePageTsx(humanizerOutput: HumanizerOutput): string {
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
    .map((c) => generateComponentSection(c.componentId, c.slots))
    .join("\n");

  return `${imports}

export default function Home() {
  return (
    <main>
${sections}
    </main>
  );
}
`;
}

/**
 * Generate package.json with real component library dependencies.
 */
function generatePackageJson(projectId: string): string {
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
function generateNextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
`;
}

/**
 * Generate tailwind.config.ts with the full design token set
 * matching the components workspace configuration.
 */
function generateTailwindConfig(): string {
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
function generateTsConfig(): string {
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
function generatePostCssConfig(): string {
  return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
}

/**
 * Generate globals.css with Tailwind directives.
 */
function generateGlobalsCss(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-base-100: 0.97 0.001 106.42;
  --color-base-200: 0.93 0.002 106.42;
  --color-base-300: 0.87 0.003 106.42;
  --color-base-content: 0.27 0.02 261.3;
  --color-primary: 0.49 0.16 264.38;
  --color-primary-content: 0.98 0.005 264.38;
  --color-secondary: 0.62 0.08 230.5;
  --color-secondary-content: 0.98 0.005 230.5;
  --color-accent: 0.55 0.18 280.12;
  --color-accent-content: 0.98 0.005 280.12;
  --color-neutral: 0.32 0.02 261.3;
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
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
`;
}

/**
 * Generate a minimal placeholder SVG for image slots that received null
 * from the Content Agent. Served from /placeholder.svg in the public dir.
 */
function generatePlaceholderSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <rect width="600" height="400" fill="#e2e8f0"/>
  <text x="300" y="200" text-anchor="middle" dominant-baseline="central" font-family="system-ui,sans-serif" font-size="18" fill="#94a3b8">Imagem</text>
</svg>`;
}

/**
 * Generate layout.tsx for the Next.js app.
 */
function generateLayoutTsx(): string {
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
/*  Handler                                                            */
/* ------------------------------------------------------------------ */

/**
 * Assembler Lambda handler.
 *
 * DETERMINISTIC — zero LLM calls. Takes content output from the
 * Content Agent, generates Next.js source files as strings, creates
 * a tar.gz archive, and uploads to S3.
 *
 * Invoked by Step Functions.
 */
export const handler = async (event: unknown): Promise<AssemblerResult> => {
  const tableName = process.env.PROJECTS_TABLE_NAME;
  if (!tableName) {
    throw new Error("PROJECTS_TABLE_NAME environment variable is not set");
  }

  const bucketName = process.env.PIPELINE_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("PIPELINE_BUCKET_NAME environment variable is not set");
  }

  /* ---- Validate input ---- */
  const input = AssemblerInputSchema.parse(event);

  console.log(
    JSON.stringify({
      message: "Assembler started",
      projectId: input.projectId,
      componentCount: input.humanizerOutput.components.length,
    }),
  );

  /* ---- Generate files ---- */
  const files: Record<string, string> = {};

  // Root config files
  files["package.json"] = generatePackageJson(input.projectId);
  files["next.config.js"] = generateNextConfig();
  files["tailwind.config.ts"] = generateTailwindConfig();
  files["tsconfig.json"] = generateTsConfig();
  files["postcss.config.js"] = generatePostCssConfig();

  // Public static assets
  files["public/placeholder.svg"] = generatePlaceholderSvg();

  // App source files
  files["src/app/globals.css"] = generateGlobalsCss();
  files["src/app/layout.tsx"] = generateLayoutTsx();
  files["src/app/page.tsx"] = generatePageTsx(input.humanizerOutput);

  // Only bundle component sources actually used in the page + shared libs.
  // Component paths start with "src/components/", shared libs with "src/lib/".
  const usedComponentDirs = new Set(
    input.humanizerOutput.components
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

  /* ---- Create tar.gz archive ---- */
  const tarBuffer = buildTarBuffer(files);
  const gzBuffer = zlib.gzipSync(tarBuffer);

  /* ---- Upload to S3 ---- */
  const s3Key = `projects/${input.projectId}/site.tar.gz`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: gzBuffer,
      ContentType: "application/gzip",
    }),
  );

  console.log(
    JSON.stringify({
      message: "Site archive uploaded to S3",
      projectId: input.projectId,
      s3Key,
      s3Bucket: bucketName,
      archiveSize: gzBuffer.length,
      fileCount: Object.keys(files).length,
    }),
  );

  /* ---- Update DynamoDB ---- */
  const now = new Date().toISOString();

  await ddb.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        pk: `PROJECT#${input.projectId}`,
        sk: `PROJECT#${input.projectId}`,
      },
      UpdateExpression:
        "SET assemblerOutput = :ao, #st = :status, updatedAt = :now",
      ExpressionAttributeNames: { "#st": "status" },
      ExpressionAttributeValues: {
        ":ao": { s3Key, s3Bucket: bucketName },
        ":status": "qa",
        ":now": now,
      },
    }),
  );

  /* ---- Return pipeline state ---- */
  return {
    projectId: input.projectId,
    status: "qa",
    companyName: input.companyName,
    segment: input.segment,
    description: input.description,
    humanizerOutput: input.humanizerOutput,
    assemblerOutput: { s3Key, s3Bucket: bucketName },
  };
};
