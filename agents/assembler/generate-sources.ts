/**
 * generate-sources.ts
 *
 * Build-time script that reads the components workspace (library, ui, lib)
 * and generates a TypeScript module exporting:
 *
 *   COMPONENT_SOURCES  — Record<generatedSitePath, fileContent>
 *   COMPONENT_ID_TO_PATH — Record<metadataId, generatedSitePath>
 *
 * The assembler handler imports these at runtime so deployed sites
 * contain real component code instead of stubs.
 *
 * Run: `npm run generate-sources` (from agents/)
 */

import * as fs from "fs";
import * as path from "path";

/* ------------------------------------------------------------------ */
/*  Paths                                                              */
/* ------------------------------------------------------------------ */

const COMPONENTS_ROOT = path.resolve(__dirname, "../../components");
const LIBRARY_DIR = path.join(COMPONENTS_ROOT, "library");
const UI_DIR = path.join(COMPONENTS_ROOT, "ui");
const LIB_DIR = path.join(COMPONENTS_ROOT, "lib");
const HOOKS_DIR = path.join(COMPONENTS_ROOT, "hooks");

const OUTPUT_FILE = path.resolve(__dirname, "component-sources.generated.ts");

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Files to skip when walking directories */
const EXCLUDED_PATTERNS = [
  /\.stories\.tsx?$/,
  /\.test\.tsx?$/,
  /\.spec\.tsx?$/,
  /node_modules/,
];

function isExcluded(filePath: string): boolean {
  return EXCLUDED_PATTERNS.some((re) => re.test(filePath));
}

/**
 * Recursively walk a directory and return all .ts/.tsx file paths.
 */
function walkDir(dir: string): string[] {
  const results: string[] = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      results.push(...walkDir(fullPath));
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      if (!isExcluded(fullPath)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

/**
 * Rewrite component workspace alias imports to generated-site paths.
 *
 * @ui/...  -> @/lib/ui/...
 * @lib/... -> @/lib/...
 * @components/... -> @/components/...
 */
function rewriteAliasImports(source: string): string {
  return source
    .replace(/(from\s+["'])@ui\//g, "$1@/lib/ui/")
    .replace(/(from\s+["'])@lib\//g, "$1@/lib/")
    .replace(/(from\s+["'])@hooks\//g, "$1@/lib/hooks/")
    .replace(/(from\s+["'])@components\//g, "$1@/components/");
}

/**
 * Map a file from the components workspace to its generated-site path.
 *
 * library/heroes/HeroGeometric/index.tsx -> src/components/heroes/HeroGeometric/index.tsx
 * ui/button.tsx                          -> src/lib/ui/button.tsx
 * lib/utils.ts                           -> src/lib/utils.ts
 */
function toGeneratedSitePath(
  absolutePath: string,
  sourceRoot: string,
  prefix: string,
): string {
  const relative = path.relative(sourceRoot, absolutePath);
  // Normalize to forward slashes for the generated file
  const normalized = relative.split(path.sep).join("/");
  return `${prefix}${normalized}`;
}

/**
 * Escape a string for embedding inside a template literal.
 * Handles backticks and ${} interpolation.
 */
function escapeForTemplateLiteral(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

interface MetadataJson {
  id?: string;
  slots?: unknown[];
  acceptsStyleKit?: {
    card?: boolean;
    background?: boolean;
    textDecoration?: boolean;
    button?: boolean;
  };
  pairsWell?: string[];
  pairsPoorly?: string[];
  category?: string;
  nativeMotif?: string | null;
}

interface MetadataEntry {
  slots: unknown[];
  acceptsStyleKit: NonNullable<MetadataJson["acceptsStyleKit"]>;
  pairsWell: string[];
  pairsPoorly: string[];
  category: string;
  nativeMotif: string | null;
}

function main() {
  const sources: Record<string, string> = {};
  const idToPath: Record<string, string> = {};
  const metadataMap: Record<string, MetadataEntry> = {};

  // 1. Walk components/library/
  const libraryFiles = walkDir(LIBRARY_DIR);
  for (const filePath of libraryFiles) {
    const sitePath = toGeneratedSitePath(
      filePath,
      LIBRARY_DIR,
      "src/components/",
    );
    const content = fs.readFileSync(filePath, "utf-8");
    sources[sitePath] = rewriteAliasImports(content);
  }

  // 2. Walk components/ui/
  const uiFiles = walkDir(UI_DIR);
  for (const filePath of uiFiles) {
    const sitePath = toGeneratedSitePath(filePath, UI_DIR, "src/lib/ui/");
    const content = fs.readFileSync(filePath, "utf-8");
    sources[sitePath] = rewriteAliasImports(content);
  }

  // 3. Walk components/lib/
  const libFiles = walkDir(LIB_DIR);
  for (const filePath of libFiles) {
    const sitePath = toGeneratedSitePath(filePath, LIB_DIR, "src/lib/");
    const content = fs.readFileSync(filePath, "utf-8");
    sources[sitePath] = rewriteAliasImports(content);
  }

  // 3b. Walk components/hooks/
  const hooksFiles = walkDir(HOOKS_DIR);
  for (const filePath of hooksFiles) {
    const sitePath = toGeneratedSitePath(filePath, HOOKS_DIR, "src/lib/hooks/");
    const content = fs.readFileSync(filePath, "utf-8");
    sources[sitePath] = rewriteAliasImports(content);
  }

  // 4. Read metadata.json files to build COMPONENT_ID_TO_PATH
  const metadataFiles = libraryFiles
    .filter((f) => f.endsWith("index.tsx"))
    .map((f) => {
      const dir = path.dirname(f);
      return path.join(dir, "metadata.json");
    })
    .filter((f) => fs.existsSync(f));

  for (const metaPath of metadataFiles) {
    const meta: MetadataJson = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    if (meta.id) {
      const indexPath = path.join(path.dirname(metaPath), "index.tsx");
      const sitePath = toGeneratedSitePath(
        indexPath,
        LIBRARY_DIR,
        "src/components/",
      );
      // Strip the /index.tsx suffix for the import path
      const importDir = sitePath.replace(/\/index\.tsx$/, "");
      idToPath[meta.id] = importDir;
      metadataMap[meta.id] = {
        slots: meta.slots ?? [],
        acceptsStyleKit: meta.acceptsStyleKit ?? {},
        pairsWell: meta.pairsWell ?? [],
        pairsPoorly: meta.pairsPoorly ?? [],
        category: meta.category ?? "",
        nativeMotif: meta.nativeMotif ?? null,
      };
    }
  }

  // 5. Generate the output file
  const lines: string[] = [
    "/* eslint-disable */",
    "/* AUTO-GENERATED by generate-sources.ts — do not edit */",
    "",
    "/**",
    " * Map of generated-site file paths to their source code.",
    " * Keys are paths like 'src/components/heroes/HeroGeometric/index.tsx'.",
    " */",
    "export const COMPONENT_SOURCES: Record<string, string> = {",
  ];

  for (const [sitePath, content] of Object.entries(sources)) {
    const escaped = escapeForTemplateLiteral(content);
    lines.push(`  ${JSON.stringify(sitePath)}: \`${escaped}\`,`);
  }

  lines.push("};");
  lines.push("");
  lines.push("/**");
  lines.push(
    " * Map of component metadata IDs to their import directory path.",
  );
  lines.push(" * Keys are IDs from metadata.json (e.g. 'hero-geometric-01').");
  lines.push(
    " * Values are directory paths (e.g. 'src/components/heroes/HeroGeometric').",
  );
  lines.push(" */");
  lines.push("export const COMPONENT_ID_TO_PATH: Record<string, string> = {");

  for (const [id, sitePath] of Object.entries(idToPath)) {
    lines.push(`  ${JSON.stringify(id)}: ${JSON.stringify(sitePath)},`);
  }

  lines.push("};");
  lines.push("");
  lines.push("/**");
  lines.push(
    " * Map of component metadata IDs to their parsed slot definitions.",
  );
  lines.push(
    " * Used by the Assembler for enum clamping and by the QA Agent for structural validation.",
  );
  lines.push(" */");
  lines.push(
    "export const COMPONENT_METADATA: Record<string, { slots: unknown[]; acceptsStyleKit: { card?: boolean; background?: boolean; textDecoration?: boolean; button?: boolean }; pairsWell: string[]; pairsPoorly: string[]; category: string; nativeMotif: string | null }> = {",
  );

  for (const [id, meta] of Object.entries(metadataMap)) {
    lines.push(`  ${JSON.stringify(id)}: ${JSON.stringify(meta)},`);
  }

  lines.push("};");
  lines.push("");

  fs.writeFileSync(OUTPUT_FILE, lines.join("\n"), "utf-8");

  // Summary
  console.log(`Generated ${OUTPUT_FILE}`);
  console.log(`  Sources: ${Object.keys(sources).length} files`);
  console.log(`  Component IDs: ${Object.keys(idToPath).length} mappings`);
  console.log(`  Metadata entries: ${Object.keys(metadataMap).length}`);
}

main();
