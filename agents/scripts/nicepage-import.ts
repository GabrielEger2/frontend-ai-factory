// NicePage Importer — local dev tool, single-author (Gabriel only)
// IMPORTANT: This script NEVER copies NicePage HTML or CSS into the generated component.
//            HTML is read ONLY for structural signals. All component code is regenerated
//            from the SiteGen design system.

import * as fs from "fs";
import * as path from "path";

import { captureNicePage } from "./lib/browser";
import { extractSignals } from "./lib/signals";
import { ClaudeResponseSchema } from "./lib/types";
import { writeComponent } from "./lib/writeComponent";

// `__dirname` is `<repo>/agents/scripts` under ts-node CJS. Two levels
// up lands at the repo root.
const repoRoot = path.resolve(__dirname, "../../");
if (!fs.existsSync(path.join(repoRoot, "package.json"))) {
  console.error(
    `[nicepage-import] Could not locate repo root from ${__dirname} — package.json missing at ${repoRoot}.`,
  );
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/*  Usage                                                              */
/* ------------------------------------------------------------------ */

const USAGE = [
  "Usage:",
  '  npm run import:nicepage --workspace=agents -- --capture-only "<url>"',
  "  npm run import:nicepage --workspace=agents -- --write-from <slug>",
  "",
  "Invoke via the frontend-design skill: /frontend-design import-nicepage <url>",
].join("\n");

function printUsageAndExit(message?: string): never {
  if (message) {
    console.error(`[nicepage-import] ${message}`);
  }
  console.error(USAGE);
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/*  Slug computation                                                   */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Argv parsing — mode-first dispatch                                 */
/* ------------------------------------------------------------------ */

const mode = process.argv[2];
if (mode !== "--capture-only" && mode !== "--write-from") {
  printUsageAndExit(
    "First argument must be --capture-only <url> or --write-from <slug>.",
  );
}

/* ------------------------------------------------------------------ */
/*  Orchestration                                                      */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  if (mode === "--capture-only") {
    const url = process.argv[3];
    if (!url || !/^https?:/i.test(url)) {
      printUsageAndExit("--capture-only requires a URL starting with http(s).");
    }
    const slug = buildSlug(url);
    const artifactDir = path.join(repoRoot, ".claude/work/imports", slug);
    fs.mkdirSync(artifactDir, { recursive: true });

    try {
      const { html, cssPalette } = await captureNicePage(url, artifactDir);
      const signals = extractSignals(html);
      fs.writeFileSync(
        path.join(artifactDir, "signals.json"),
        JSON.stringify({ signals, cssPalette }, null, 2),
        "utf-8",
      );
      console.log(`[capture] artifactDir=${artifactDir}`);
    } catch (err) {
      console.error("[nicepage-import] capture failed:", err);
      process.exit(4);
    }
    return;
  }

  // --write-from
  const slug = process.argv[3];
  if (!slug || slug.length === 0) {
    printUsageAndExit("--write-from requires a non-empty slug.");
  }
  if (slug.includes("/") || slug.includes("\\") || slug.includes("..")) {
    printUsageAndExit(
      `--write-from slug "${slug}" must not contain path separators (/, \\, ..).`,
    );
  }
  const artifactDir = path.join(repoRoot, ".claude/work/imports", slug);
  if (!fs.existsSync(artifactDir)) {
    console.error(
      `[nicepage-import] artifact directory not found: ${artifactDir}`,
    );
    process.exit(1);
  }

  const briefPath = path.join(artifactDir, "brief.json");
  let rawBrief: string;
  try {
    rawBrief = fs.readFileSync(briefPath, "utf-8");
  } catch (err) {
    console.error(
      "[nicepage-import] brief.json not found in",
      artifactDir,
      err,
    );
    process.exit(1);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBrief);
  } catch (err) {
    console.error("[nicepage-import] brief.json is not valid JSON:", err);
    process.exit(1);
  }

  const result = ClaudeResponseSchema.safeParse(parsed);
  if (!result.success) {
    console.error("[nicepage-import] brief.json failed schema validation:");
    console.error(result.error.format());
    process.exit(2);
  }

  const libraryRoot = path.join(repoRoot, "components/library");
  const componentDir = writeComponent(result.data, libraryRoot, {
    dryRun: false,
  });

  console.log(`Component written to: ${componentDir}`);
  console.log("Next: npm run components:storybook");
}

main().catch((err) => {
  console.error("[nicepage-import] Fatal:", err);
  process.exit(1);
});
