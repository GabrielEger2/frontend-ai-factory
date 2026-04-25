// NicePage Importer — local dev tool, single-author (Gabriel only)
// IMPORTANT: This script NEVER copies NicePage HTML or CSS into the generated component.
//            HTML is read ONLY for structural signals. All component code is regenerated
//            from the SiteGen design system.
// Requires: ANTHROPIC_API_KEY=sk-ant-... in your shell environment.

import * as fs from "fs";
import * as path from "path";

import { captureNicePage } from "./lib/browser";
import { extractSignals } from "./lib/signals";
import { buildSystemPrompt } from "./lib/promptBuilder";
import { generateComponent } from "./lib/generate";
import { writeComponent } from "./lib/writeComponent";
import { CATEGORY_TO_DIR, Category } from "./lib/types";

/* ------------------------------------------------------------------ */
/*  Usage                                                              */
/* ------------------------------------------------------------------ */

const USAGE = [
  "Usage: npm run nicepage:import -- <url> [--category <cat>] [--name <PascalName>] [--dry-run]",
  "",
  "  <url>             NicePage preview URL (must start with http/https).",
  "  --category <cat>  Override Claude's category choice. Valid values:",
  `                    ${Object.keys(CATEGORY_TO_DIR).join(", ")}`,
  "                    Aliases (Windows shell): layout-grid, layout-scroll, layout-split.",
  "  --name <Name>     Override component name (PascalCase only).",
  "  --dry-run         Run capture + generation but do not write files.",
].join("\n");

function printUsageAndExit(message?: string): never {
  if (message) {
    console.error(`[nicepage-import] ${message}`);
  }
  console.error(USAGE);
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/*  Argv parsing                                                       */
/* ------------------------------------------------------------------ */

const url = process.argv[2];
if (!url || !/^https?:/i.test(url)) {
  printUsageAndExit("URL is required and must start with http(s).");
}

// Walk the rest of argv for --category, --name, --dry-run.
let categoryArg: string | undefined;
let nameOverride: string | undefined;
let dryRun = false;

const rest = process.argv.slice(3);
for (let i = 0; i < rest.length; i++) {
  const arg = rest[i];
  if (arg === "--dry-run") {
    dryRun = true;
    continue;
  }
  if (arg === "--category") {
    const value = rest[i + 1];
    if (!value) printUsageAndExit("--category requires a value.");
    categoryArg = value;
    i += 1;
    continue;
  }
  if (arg === "--name") {
    const value = rest[i + 1];
    if (!value) printUsageAndExit("--name requires a value.");
    nameOverride = value;
    i += 1;
    continue;
  }
  // Unknown flag — surface it instead of silently ignoring so a typo
  // like `--dryrun` is caught.
  printUsageAndExit(`Unknown argument: ${arg}`);
}

// Category alias normalization. Windows shell quoting on `npm run` makes
// `--category "layout/grid"` lose its quoting in transit; the dash-form
// aliases dodge that. Normalize before validation/lookup.
let categoryOverride: Category | undefined;
if (categoryArg !== undefined) {
  const normalized = categoryArg
    .replace(/^layout-grid$/, "layout/grid")
    .replace(/^layout-scroll$/, "layout/scroll")
    .replace(/^layout-split$/, "layout/split");
  if (!(normalized in CATEGORY_TO_DIR)) {
    printUsageAndExit(
      `Invalid --category "${categoryArg}". Valid values: ${Object.keys(
        CATEGORY_TO_DIR,
      ).join(", ")} (or aliases layout-grid, layout-scroll, layout-split).`,
    );
  }
  categoryOverride = normalized as Category;
}

// PascalCase guard on --name. The writer also re-validates, but failing
// fast here keeps the error close to the user's input.
if (nameOverride !== undefined && !/^[A-Z][A-Za-z0-9]+$/.test(nameOverride)) {
  printUsageAndExit(
    `Invalid --name "${nameOverride}". Must be PascalCase (e.g. ContactShapesForm).`,
  );
}

/* ------------------------------------------------------------------ */
/*  Path computation                                                   */
/* ------------------------------------------------------------------ */

// `__dirname` is `<repo>/agents/scripts` under ts-node CJS. Two levels
// up lands at the repo root.
const repoRoot = path.resolve(__dirname, "../../");
if (!fs.existsSync(path.join(repoRoot, "package.json"))) {
  console.error(
    `[nicepage-import] Could not locate repo root from ${__dirname} — package.json missing at ${repoRoot}.`,
  );
  process.exit(1);
}

// Slug: <YYYY-MM-DD>-<sanitized-template-id>. Pulled from the URL's
// last path segment (before `?`), stripped of non-alphanumeric except
// hyphens, capped at 60 chars.
function buildSlug(rawUrl: string): string {
  const today = new Date().toISOString().slice(0, 10);
  let lastSegment = "import";
  try {
    const parsed = new URL(rawUrl);
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length > 0) {
      lastSegment = segments[segments.length - 1];
    }
  } catch {
    // Fall through with the default — argv parsing already validated
    // the URL starts with http, so this catch is a safety belt only.
  }
  const sanitized =
    lastSegment
      .replace(/[^a-zA-Z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "import";
  return `${today}-${sanitized}`;
}

const slug = buildSlug(url);
const artifactDir = path.join(repoRoot, ".claude/work/imports", slug);
fs.mkdirSync(artifactDir, { recursive: true });

const skillsRoot = path.join(repoRoot, ".claude/skills/frontend-design");
const libraryRoot = path.join(repoRoot, "components/library");

/* ------------------------------------------------------------------ */
/*  Orchestration                                                      */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  console.log(
    "[nicepage-import] Starting — using claude-opus-4-7 (~$0.05–0.15 per import)",
  );

  const { desktopJpegBuffer, mobileJpegBuffer, html, cssPalette } =
    await captureNicePage(url, artifactDir);

  const signals = extractSignals(html);

  const systemPrompt = buildSystemPrompt(skillsRoot);

  const response = await generateComponent(
    { desktopJpegBuffer, mobileJpegBuffer, signals, cssPalette },
    systemPrompt,
    artifactDir,
  );

  const componentDir = writeComponent(response, libraryRoot, {
    categoryOverride,
    nameOverride,
    dryRun,
  });

  // For a dry-run, writeComponent already logged "[dry-run] Would write
  // to ..." — no need to repeat. For a real run, surface the final path
  // and the next step.
  if (!dryRun) {
    console.log(`Component written to: ${componentDir}`);
    console.log("Next: npm run components:storybook");
  }
}

main().catch((err) => {
  console.error("[nicepage-import] Fatal:", err);
  process.exit(1);
});
