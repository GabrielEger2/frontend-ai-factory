import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AssemblerInputSchema } from "./types";
import type { AssemblerResult } from "./types";
import type { ContentOutput } from "../shared/types";
import {
  COMPONENT_SOURCES,
  COMPONENT_ID_TO_PATH,
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
 * Replace null/undefined values with safe defaults based on key name.
 *
 * The Content Agent returns null for "url" and "image" slot types.
 * When those nulls are nested inside arrays/objects (e.g. navbar links),
 * JSON.stringify preserves them, causing TypeScript build failures.
 * This function walks the value tree and replaces nulls with defaults.
 */
function sanitizeSlotValue(value: unknown, key?: string): unknown {
  if (value === null || value === undefined) {
    if (key && /url|href|src/i.test(key)) return "#";
    if (key && /image|img|banner|photo|avatar|logo|icon/i.test(key))
      return "/placeholder.svg";
    if (key && /alt/i.test(key)) return "";
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeSlotValue(item, key));
  }
  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const sanitized = sanitizeSlotValue(v, k);
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

  const propsStr = propsEntries
    .map(
      ([key, value]) =>
        `        ${key}=${serializeSlotValue(sanitizeSlotValue(value, key))}`,
    )
    .join("\n");

  return `      <${name}\n${propsStr}\n      />`;
}

/**
 * Generate the full page.tsx file that imports and renders all components.
 */
function generatePageTsx(contentOutput: ContentOutput): string {
  const imports = contentOutput.components
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

  const sections = contentOutput.components
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
        next: "^14",
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
      <body>{children}</body>
    </html>
  );
}
`;
}

/* ------------------------------------------------------------------ */
/*  Tar Archive Builder                                                */
/* ------------------------------------------------------------------ */

/**
 * Build a minimal tar archive from a map of file paths to contents.
 *
 * Uses the POSIX ustar format. Each file entry consists of a 512-byte
 * header followed by the file content padded to a 512-byte boundary.
 * The archive ends with two 512-byte zero blocks.
 */
function buildTarBuffer(files: Record<string, string>): Buffer {
  const blocks: Buffer[] = [];

  for (const [filePath, content] of Object.entries(files)) {
    const contentBuf = Buffer.from(content, "utf-8");
    const size = contentBuf.length;

    // Build 512-byte tar header
    const header = Buffer.alloc(512, 0);

    // File name (100 bytes)
    header.write(filePath, 0, Math.min(filePath.length, 100), "utf-8");

    // File mode (8 bytes) — 0644
    header.write("0000644\0", 100, 8, "utf-8");

    // Owner/group UID/GID (8+8 bytes)
    header.write("0000000\0", 108, 8, "utf-8");
    header.write("0000000\0", 116, 8, "utf-8");

    // File size in octal (12 bytes)
    header.write(size.toString(8).padStart(11, "0") + "\0", 124, 12, "utf-8");

    // Modification time (12 bytes)
    const mtime = Math.floor(Date.now() / 1000);
    header.write(mtime.toString(8).padStart(11, "0") + "\0", 136, 12, "utf-8");

    // Checksum placeholder (8 bytes of spaces)
    header.write("        ", 148, 8, "utf-8");

    // Type flag: '0' = regular file
    header.write("0", 156, 1, "utf-8");

    // USTAR indicator
    header.write("ustar\0", 257, 6, "utf-8");
    header.write("00", 263, 2, "utf-8");

    // Compute checksum (sum of all bytes in header treated as unsigned)
    let checksum = 0;
    for (let i = 0; i < 512; i++) {
      checksum += header[i];
    }
    header.write(
      checksum.toString(8).padStart(6, "0") + "\0 ",
      148,
      8,
      "utf-8",
    );

    blocks.push(header);

    // File content padded to 512-byte boundary
    const paddedSize = Math.ceil(size / 512) * 512;
    const contentBlock = Buffer.alloc(paddedSize, 0);
    contentBuf.copy(contentBlock);
    blocks.push(contentBlock);
  }

  // Two 512-byte zero blocks to end the archive
  blocks.push(Buffer.alloc(1024, 0));

  return Buffer.concat(blocks);
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
      componentCount: input.contentOutput.components.length,
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
  files["src/app/page.tsx"] = generatePageTsx(input.contentOutput);

  // Real component library source files (bundled at build time)
  for (const [filePath, content] of Object.entries(COMPONENT_SOURCES)) {
    files[filePath] = content;
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
        ":status": "deploying",
        ":now": now,
      },
    }),
  );

  /* ---- Return pipeline state ---- */
  return {
    projectId: input.projectId,
    status: "deploying",
    companyName: input.companyName,
    segment: input.segment,
    description: input.description,
    contentOutput: input.contentOutput,
    assemblerOutput: { s3Key, s3Bucket: bucketName },
  };
};
