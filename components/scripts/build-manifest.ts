/**
 * Build a static manifest of all components in the library.
 *
 * Walks components/library/**\/metadata.json, parses each file, and emits
 * components/library/manifest.json as a JSON array of metadata objects.
 *
 * Consumed by the dashboard's ComponentPicker and SectionList at build
 * time via a static `import manifest from "@components/library/manifest.json"`.
 *
 * Runs as part of the dashboard's `prebuild` npm hook. Also runnable
 * standalone via `npx ts-node scripts/build-manifest.ts` from the
 * components workspace.
 *
 * Entries with parse errors or missing `id` fields are skipped with a
 * warning — the script never throws on individual file issues so a
 * single malformed metadata.json cannot break the dashboard build.
 */

import * as fs from "node:fs";
import * as path from "node:path";

// Resolve the script's own directory using process.argv[1] — works under
// both CommonJS and ESM ts-node without needing __dirname or import.meta.
// When invoked as `ts-node scripts/build-manifest.ts` from the components
// workspace, argv[1] points at the script's absolute path.
const SCRIPT_PATH = process.argv[1] ?? "";
const SCRIPT_DIR = SCRIPT_PATH
  ? path.dirname(path.resolve(SCRIPT_PATH))
  : path.resolve(process.cwd(), "scripts");
const COMPONENTS_ROOT = path.resolve(SCRIPT_DIR, "..");
const LIBRARY_DIR = path.join(COMPONENTS_ROOT, "library");
const MANIFEST_PATH = path.join(LIBRARY_DIR, "manifest.json");

/**
 * Recursively walk a directory, yielding all files that match predicate.
 */
function* walkFiles(
  dir: string,
  predicate: (filePath: string) => boolean,
): Generator<string> {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkFiles(full, predicate);
    } else if (entry.isFile() && predicate(full)) {
      yield full;
    }
  }
}

function main(): void {
  const manifest: unknown[] = [];
  let skipped = 0;

  for (const filePath of walkFiles(
    LIBRARY_DIR,
    (p) => path.basename(p) === "metadata.json",
  )) {
    const relative = path.relative(LIBRARY_DIR, filePath);

    let raw: string;
    try {
      raw = fs.readFileSync(filePath, "utf-8");
    } catch (err) {
      console.warn(`[build-manifest] skip ${relative}: read failed`, err);
      skipped++;
      continue;
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch (err) {
      console.warn(`[build-manifest] skip ${relative}: parse failed`, err);
      skipped++;
      continue;
    }

    if (typeof parsed.id !== "string" || parsed.id.length === 0) {
      console.warn(`[build-manifest] skip ${relative}: missing or invalid id`);
      skipped++;
      continue;
    }

    manifest.push(parsed);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");

  console.log(
    `[build-manifest] wrote ${manifest.length} entries to ${path.relative(
      COMPONENTS_ROOT,
      MANIFEST_PATH,
    )} (skipped: ${skipped})`,
  );
}

main();
