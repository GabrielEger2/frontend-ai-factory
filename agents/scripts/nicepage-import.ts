// NicePage Importer — local dev tool, single-author (Gabriel only)
// IMPORTANT: This script NEVER copies NicePage HTML or CSS into the generated component.
//            HTML is read ONLY for structural signals. All component code is regenerated
//            from the SiteGen design system.

import * as fs from "fs";
import * as path from "path";

// `__dirname` is `<repo>/agents/scripts` under ts-node CJS. Two levels
// up lands at the repo root.
const repoRoot = path.resolve(__dirname, "../../");
if (!fs.existsSync(path.join(repoRoot, "package.json"))) {
  console.error(
    `[nicepage-import] Could not locate repo root from ${__dirname} — package.json missing at ${repoRoot}.`,
  );
  process.exit(1);
}

async function main(): Promise<void> {
  console.log("[nicepage-import] modes are wired in the next commit");
}

main().catch((err) => {
  console.error("[nicepage-import] Fatal:", err);
  process.exit(1);
});
