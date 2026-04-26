// NicePage Importer — Component writer + manifest rebuild
//
// Takes a validated `ClaudeResponse` and writes the three component
// files (`index.tsx`, `metadata.json`, `<Name>.stories.tsx`) into the
// correct directory under `components/library/`. After files land, it
// shells out to `npx ts-node scripts/build-manifest.ts` from the
// components workspace to refresh `manifest.json`.
//
// IMPORTANT — manifest invocation: we deliberately bypass
// `npm run build:manifest --workspace=components` because the npm
// script in `components/package.json` carries inline single-quoted
// JSON (`--compiler-options '{"module":"CommonJS"}'`) that does not
// survive Windows shell quoting. The `ts-node` field in
// `components/package.json` already declares CommonJS as the default,
// so a bare `npx ts-node scripts/build-manifest.ts` works on every
// platform.
//
// Exit codes:
//   2 — unknown category, name uniqueness exhausted, or invalid input
//   3 — manifest rebuild failed (component files were still written)

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

import {
  CATEGORY_TO_DIR,
  CATEGORY_TO_PREFIX,
  Category,
  ClaudeResponse,
} from "./types";

/**
 * Convert a PascalCase identifier to kebab-case.
 *   `HeroGeometric` → `hero-geometric`
 *   `ContactMapInfo` → `contact-map-info`
 */
export function pascalToKebab(s: string): string {
  return s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function writeComponent(
  response: ClaudeResponse,
  libraryRoot: string,
  options: {
    categoryOverride?: Category;
    nameOverride?: string;
    dryRun: boolean;
  },
): string {
  // 1. Resolve category — CLI override wins over Claude's choice.
  const category: Category = options.categoryOverride ?? response.category;
  const dirSegment = CATEGORY_TO_DIR[category];
  if (!dirSegment) {
    console.error(
      `[nicepage-import] unknown category "${category}" — no entry in CATEGORY_TO_DIR`,
    );
    process.exit(2);
  }

  // 2. Resolve component name — CLI override wins. PascalCase guard
  //    matches the regex on `ClaudeResponseSchema.componentName`, but
  //    we re-validate here in case `nameOverride` was passed in.
  const requestedName = options.nameOverride ?? response.componentName;
  if (!/^[A-Z][A-Za-z0-9]+$/.test(requestedName)) {
    console.error(
      `[nicepage-import] componentName "${requestedName}" is not PascalCase`,
    );
    process.exit(2);
  }

  // 3. Uniqueness — if `<libraryRoot>/<dirSegment>/<Name>` already
  //    exists, try `<Name>02`..`<Name>09`. If all 9 are taken, fail.
  const categoryDir = path.join(libraryRoot, dirSegment);
  let componentName = requestedName;
  if (fs.existsSync(path.join(categoryDir, componentName))) {
    let resolved: string | null = null;
    for (let i = 2; i <= 9; i++) {
      const candidate = `${requestedName}0${i}`;
      if (!fs.existsSync(path.join(categoryDir, candidate))) {
        resolved = candidate;
        break;
      }
    }
    if (!resolved) {
      console.error(
        `[nicepage-import] All name suffixes 02–09 taken; choose a different --name`,
      );
      process.exit(2);
    }
    componentName = resolved;
  }

  const targetDir = path.join(categoryDir, componentName);

  // 4. Generate `id`. Pattern: `<prefix>-<kebab-name>-<seq>`.
  //    Examples: `hero-geometric-01`, `contact-map-info-01`,
  //    `layout-simplegrid-01`, `footer-reveal-01`.
  //
  //    Note the plural-asymmetry: category `"footers"` uses prefix
  //    `"footer"` (singular). `CATEGORY_TO_PREFIX` is the source of
  //    truth.
  //
  //    For the seq number we scan existing component dirs in
  //    `categoryDir` and read their metadata.json `id` fields. We look
  //    for ids starting with `${prefix}-${kebabName}-` and take the
  //    next 2-digit suffix above any we find. In practice the
  //    kebabName already encodes uniqueness, so this almost always
  //    resolves to `01`.
  const prefix = CATEGORY_TO_PREFIX[category];
  const kebabName = pascalToKebab(componentName);
  const idPrefix = `${prefix}-${kebabName}-`;

  let maxSeq = 0;
  if (fs.existsSync(categoryDir)) {
    const entries = fs.readdirSync(categoryDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const metadataPath = path.join(categoryDir, entry.name, "metadata.json");
      if (!fs.existsSync(metadataPath)) continue;
      try {
        const raw = fs.readFileSync(metadataPath, "utf-8");
        const parsed = JSON.parse(raw) as { id?: unknown };
        if (typeof parsed.id !== "string") continue;
        if (!parsed.id.startsWith(idPrefix)) continue;
        const suffix = parsed.id.slice(idPrefix.length);
        const n = parseInt(suffix, 10);
        if (Number.isFinite(n) && n > maxSeq) {
          maxSeq = n;
        }
      } catch {
        // Skip unreadable / unparseable metadata — same lenient
        // behavior as `components/scripts/build-manifest.ts`.
      }
    }
  }

  const seq = String(maxSeq + 1).padStart(2, "0");
  const id = `${idPrefix}${seq}`;

  // 5. Construct the metadata payload — strip the source-code +
  //    componentName fields off the response, add `id`. We deliberately
  //    enumerate the metadata fields rather than spreading-and-deleting
  //    so the shape exactly matches `MetadataSchema`.
  const metadata = {
    id,
    name: response.name,
    category: response.category,
    purpose: response.purpose,
    acceptsStyleKit: response.acceptsStyleKit,
    style: response.style,
    mood: response.mood,
    layout: response.layout,
    density: response.density,
    slots: response.slots,
    mobileBehavior: response.mobileBehavior,
    pairsWell: response.pairsWell,
    pairsPoorly: response.pairsPoorly,
    ...(response.variants ? { variants: response.variants } : {}),
  };

  // 6. Dry-run: log what we would do and bail out without writing.
  if (options.dryRun) {
    console.log(`[dry-run] Would write to ${targetDir} with id=${id}`);
    return targetDir;
  }

  // 7. Write the three component files.
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, "index.tsx"), response.indexTsx);
  fs.writeFileSync(
    path.join(targetDir, "metadata.json"),
    JSON.stringify(metadata, null, 2),
  );
  fs.writeFileSync(
    path.join(targetDir, `${componentName}.stories.tsx`),
    response.storiesTsx,
  );

  // 8. Rebuild the manifest. We resolve the components workspace as
  //    `<libraryRoot>/..` (i.e. `components/`) and invoke ts-node
  //    directly to avoid the Windows quoting bug in
  //    `npm run build:manifest`.
  try {
    execSync("npx ts-node scripts/build-manifest.ts", {
      cwd: path.resolve(libraryRoot, ".."),
      stdio: "inherit",
    });
  } catch (err) {
    console.error(
      `Manifest rebuild failed; component files written but manifest.json is stale: ${String(
        err,
      )}`,
    );
    process.exit(3);
  }

  return targetDir;
}
