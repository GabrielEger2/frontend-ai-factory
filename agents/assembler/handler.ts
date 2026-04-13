import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AssemblerInputSchema } from "./types";
import type { AssemblerResult } from "./types";
import type { ContentOutput } from "../shared/types";
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
    .map(([key, value]) => `        ${key}=${serializeSlotValue(value)}`)
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
 * Generate a stub component file for each component ID.
 * In production these would come from the component library,
 * but the assembler produces standalone deployable code.
 */
function generateComponentStub(
  componentId: string,
  slots: Record<string, unknown>,
): string {
  const name = toComponentName(componentId);
  const propsInterface = Object.keys(slots)
    .map((key) => `  ${key}?: unknown;`)
    .join("\n");

  return `interface ${name}Props {
${propsInterface}
}

export default function ${name}(props: ${name}Props) {
  return (
    <section data-component="${componentId}">
      {Object.entries(props).map(([key, value]) => (
        <div key={key} data-slot={key}>
          {typeof value === "string" ? value : JSON.stringify(value)}
        </div>
      ))}
    </section>
  );
}
`;
}

/**
 * Generate a minimal package.json for the Next.js app.
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
      },
      devDependencies: {
        "@types/node": "^20",
        "@types/react": "^18",
        typescript: "^5",
        tailwindcss: "^3",
        autoprefixer: "^10",
        postcss: "^8",
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
 * Generate tailwind.config.ts for the Next.js app.
 */
function generateTailwindConfig(): string {
  return `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
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
`;
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

  // App source files
  files["src/app/globals.css"] = generateGlobalsCss();
  files["src/app/layout.tsx"] = generateLayoutTsx();
  files["src/app/page.tsx"] = generatePageTsx(input.contentOutput);

  // Component stubs
  for (const component of input.contentOutput.components) {
    files[`src/components/${component.componentId}/index.tsx`] =
      generateComponentStub(component.componentId, component.slots);
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
