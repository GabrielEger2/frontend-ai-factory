/**
 * Validate every metadata.json in components/library/ against the canonical
 * Stage 0 taxonomy.
 *
 * Usage (from `components/`):
 *   npm run validate:metadata
 *   npx ts-node scripts/validate-metadata.ts
 *
 * Walks `components/library/` recursively. For each metadata.json, enforces:
 *   1. Required fields present and well-typed.
 *   2. style[] is a subset of CANONICAL_STYLE.
 *   3. mood[] is a subset of CANONICAL_MOOD.
 *   4. purpose[] is a subset of CANONICAL_PURPOSE.
 *   5. Every purpose token has no interior whitespace.
 *   6. category is one of CANONICAL_CATEGORY.
 *   7. style[] and mood[] each have at least MIN_TAG_FLOOR entries.
 *   8. pairsWell / pairsPoorly IDs all resolve to a real component id in the
 *      library (no ghosts).
 *
 * Exits 1 on any failure. Prints per-file errors and a summary count.
 *
 * The MetadataJson interface mirrors the schema-of-record at
 * `agents/scripts/seed-components.ts` lines 80-96. Re-run the validator
 * after every metadata edit; CI gates on a clean pass.
 *
 * Canonical taxonomy constants are exported so the matching Vitest suite
 * (`components/tests/metadata-schema.test.ts`) can share the same source
 * of truth — see "Extending purpose[]" in
 * `.claude/rules/domains/components.md`.
 */

import * as fs from "node:fs";
import * as path from "node:path";

/* ------------------------------------------------------------------ */
/*  Canonical taxonomy (source of truth — keep in sync with rules doc) */
/* ------------------------------------------------------------------ */

export const CANONICAL_STYLE: readonly string[] = [
  "modern",
  "classic",
  "editorial",
  "luxury",
  "playful",
  "minimal",
  "bold",
  "corporate",
];

export const CANONICAL_MOOD: readonly string[] = [
  "professional",
  "elegant",
  "fun",
  "serious",
  "friendly",
  "energetic",
  "calm",
  "trustworthy",
];

export const CANONICAL_PURPOSE: readonly string[] = [
  "hero",
  "navigation",
  "footer",
  "faq",
  "contact",
  "testimonials",
  "stats",
  "features",
  "services",
  "products",
  "about",
  "team",
  "process",
  "benefits",
  "portfolio",
  "showcase",
  "cta",
  "lead-capture",
  "brand-statement",
  "story",
  "location-display",
  "magazine-opener",
  "pricing",
  "gallery",
  "comparison",
];

export const CANONICAL_CATEGORY: readonly string[] = [
  "hero",
  "testimonial",
  "footer",
  "cta",
  "faq",
  "contact",
  "navigation",
  "stats",
  "content",
  "pricing",
  "team",
  "gallery",
  "products",
];

export const CANONICAL_VERTICAL: readonly string[] = [
  "bakery",
  "bakery-luxe",
  "restaurant",
  "restaurant-luxe",
  "fitness",
  "auto-services",
  "legal-consulting",
  "legal-luxe",
  "healthcare",
  "healthcare-luxe",
  "beauty-salon",
  "education",
  "real-estate",
  "real-estate-luxe",
  "hospitality",
  "hospitality-luxe",
  "pet-services",
  "ecommerce",
  "construction",
  "saas",
  "agency",
  "atelier-luxe",
  "gourmet-retail",
  "wellness",
];

export const MIN_TAG_FLOOR = 3;

const PURPOSE_TOKEN_RE = /^\S+$/;

/* ------------------------------------------------------------------ */
/*  Schema-of-record mirror (agents/scripts/seed-components.ts:80-96) */
/* ------------------------------------------------------------------ */

interface ComponentVariantEntry {
  id: string;
  name: string;
  density: string;
  colorMode: string;
  styleOverrides: string[];
}

interface MetadataJson {
  id: string;
  name: string;
  category: string;
  style: string[];
  mood: string[];
  purpose: string[];
  acceptsStyleKit: Record<string, boolean>;
  layout: string;
  density: string;
  imageWeight?: number;
  slots: unknown[];
  mobileBehavior: string;
  pairsWell: string[];
  pairsPoorly: string[];
  vertical?: string[];
  variants?: ComponentVariantEntry[];
  descriptions?: {
    descriptive: string;
    usage: string;
    audienceFit: string;
  };
}

/* ------------------------------------------------------------------ */
/*  Library walk                                                       */
/* ------------------------------------------------------------------ */

const SCRIPT_PATH = process.argv[1] ?? "";
const SCRIPT_DIR = SCRIPT_PATH
  ? path.dirname(path.resolve(SCRIPT_PATH))
  : path.resolve(process.cwd(), "scripts");
const COMPONENTS_ROOT = path.resolve(SCRIPT_DIR, "..");
const LIBRARY_DIR = path.join(COMPONENTS_ROOT, "library");

function findMetadataFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...findMetadataFiles(full));
    } else if (entry.isFile() && entry.name === "metadata.json") {
      out.push(full);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

interface FileFailure {
  relativePath: string;
  errors: string[];
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function notSubsetOf(
  values: readonly string[],
  canonical: readonly string[],
): string[] {
  const set = new Set(canonical);
  return values.filter((v) => !set.has(v));
}

function validateRequiredFields(
  parsed: Record<string, unknown>,
  errors: string[],
): parsed is Record<string, unknown> & MetadataJson {
  const REQUIRED_STRING: ReadonlyArray<keyof MetadataJson> = [
    "id",
    "name",
    "category",
    "layout",
    "density",
    "mobileBehavior",
  ];
  let ok = true;

  for (const field of REQUIRED_STRING) {
    const v = parsed[field as string];
    if (typeof v !== "string" || v.length === 0) {
      errors.push(`field "${field}" missing or not a non-empty string`);
      ok = false;
    }
  }

  if (!isStringArray(parsed.style) || (parsed.style as string[]).length === 0) {
    errors.push(`field "style" must be a non-empty string array`);
    ok = false;
  }
  if (!isStringArray(parsed.mood) || (parsed.mood as string[]).length === 0) {
    errors.push(`field "mood" must be a non-empty string array`);
    ok = false;
  }
  if (
    !isStringArray(parsed.purpose) ||
    (parsed.purpose as string[]).length === 0
  ) {
    errors.push(`field "purpose" must be a non-empty string array`);
    ok = false;
  }

  if (!Array.isArray(parsed.slots)) {
    errors.push(`field "slots" must be an array`);
    ok = false;
  }

  if (!isStringArray(parsed.pairsWell ?? [])) {
    errors.push(`field "pairsWell" must be a string array (or omitted)`);
    ok = false;
  }
  if (!isStringArray(parsed.pairsPoorly ?? [])) {
    errors.push(`field "pairsPoorly" must be a string array (or omitted)`);
    ok = false;
  }

  return ok;
}

function validateOne(
  metadata: MetadataJson,
  knownIds: Set<string>,
  errors: string[],
): void {
  // Rule 2: style[] subset of canonical
  const badStyle = notSubsetOf(metadata.style, CANONICAL_STYLE);
  if (badStyle.length > 0) {
    errors.push(
      `field "style" contains non-canonical values: [${badStyle
        .map((v) => `"${v}"`)
        .join(", ")}]`,
    );
  }

  // Rule 3: mood[] subset of canonical
  const badMood = notSubsetOf(metadata.mood, CANONICAL_MOOD);
  if (badMood.length > 0) {
    errors.push(
      `field "mood" contains non-canonical values: [${badMood
        .map((v) => `"${v}"`)
        .join(", ")}]`,
    );
  }

  // Rule 4: purpose[] subset of canonical
  const badPurpose = notSubsetOf(metadata.purpose, CANONICAL_PURPOSE);
  if (badPurpose.length > 0) {
    errors.push(
      `field "purpose" contains non-canonical values: [${badPurpose
        .map((v) => `"${v}"`)
        .join(", ")}]`,
    );
  }

  // Rule 5: each purpose token has no interior whitespace
  const whitespacePurpose = metadata.purpose.filter(
    (t) => !PURPOSE_TOKEN_RE.test(t),
  );
  if (whitespacePurpose.length > 0) {
    errors.push(
      `field "purpose" contains values with whitespace (must be single hyphenated tokens): [${whitespacePurpose
        .map((v) => `"${v}"`)
        .join(", ")}]`,
    );
  }

  // Rule 6: category is canonical
  if (!CANONICAL_CATEGORY.includes(metadata.category)) {
    errors.push(
      `field "category" value "${metadata.category}" is not in the canonical category list`,
    );
  }

  // Rule 7: tag floor
  if (metadata.style.length < MIN_TAG_FLOOR) {
    errors.push(
      `field "style" has ${metadata.style.length} entries, minimum is ${MIN_TAG_FLOOR}`,
    );
  }
  if (metadata.mood.length < MIN_TAG_FLOOR) {
    errors.push(
      `field "mood" has ${metadata.mood.length} entries, minimum is ${MIN_TAG_FLOOR}`,
    );
  }

  // Rule 8: pairsWell / pairsPoorly IDs all resolve
  const ghostsWell = (metadata.pairsWell ?? []).filter(
    (id) => !knownIds.has(id),
  );
  if (ghostsWell.length > 0) {
    errors.push(
      `field "pairsWell" references unknown component ids (ghosts): [${ghostsWell
        .map((v) => `"${v}"`)
        .join(", ")}]`,
    );
  }
  const ghostsPoorly = (metadata.pairsPoorly ?? []).filter(
    (id) => !knownIds.has(id),
  );
  if (ghostsPoorly.length > 0) {
    errors.push(
      `field "pairsPoorly" references unknown component ids (ghosts): [${ghostsPoorly
        .map((v) => `"${v}"`)
        .join(", ")}]`,
    );
  }

  // Rule 9b: vertical[] subset of CANONICAL_VERTICAL (when present)
  const badVertical = notSubsetOf(metadata.vertical ?? [], CANONICAL_VERTICAL);
  if (badVertical.length > 0) {
    errors.push(
      `field "vertical" contains non-canonical values: [${badVertical
        .map((v) => `"${v}"`)
        .join(", ")}]`,
    );
  }

  // Rule 9: when descriptions is present, all three axes must be non-empty strings.
  if (metadata.descriptions !== undefined) {
    const axes: ReadonlyArray<keyof NonNullable<MetadataJson["descriptions"]>> =
      ["descriptive", "usage", "audienceFit"];
    for (const axis of axes) {
      const v = metadata.descriptions[axis];
      if (typeof v !== "string" || v.trim().length === 0) {
        errors.push(
          `field "descriptions.${axis}" must be a non-empty string when "descriptions" is present`,
        );
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

function main(): void {
  if (!fs.existsSync(LIBRARY_DIR)) {
    console.error(`[validate-metadata] library not found: ${LIBRARY_DIR}`);
    process.exit(1);
  }

  const metadataFiles = findMetadataFiles(LIBRARY_DIR);

  // First pass: parse and collect known ids for ghost-detection.
  const parsedFiles: Array<{
    relativePath: string;
    parsed: Record<string, unknown> | null;
    parseError: string | null;
  }> = [];

  for (const filePath of metadataFiles) {
    const relativePath = path
      .relative(COMPONENTS_ROOT, filePath)
      .replace(/\\/g, "/");
    let raw: string;
    try {
      raw = fs.readFileSync(filePath, "utf-8");
    } catch (err) {
      parsedFiles.push({
        relativePath,
        parsed: null,
        parseError: `read failed: ${(err as Error).message}`,
      });
      continue;
    }
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      parsedFiles.push({ relativePath, parsed, parseError: null });
    } catch (err) {
      parsedFiles.push({
        relativePath,
        parsed: null,
        parseError: `parse failed: ${(err as Error).message}`,
      });
    }
  }

  const knownIds = new Set<string>();
  for (const { parsed } of parsedFiles) {
    if (parsed && typeof parsed.id === "string" && parsed.id.length > 0) {
      knownIds.add(parsed.id);
    }
  }

  // Second pass: validate each file.
  const failures: FileFailure[] = [];
  let okCount = 0;

  for (const { relativePath, parsed, parseError } of parsedFiles) {
    const errors: string[] = [];

    if (parseError !== null || parsed === null) {
      errors.push(parseError ?? "unknown parse error");
      failures.push({ relativePath, errors });
      continue;
    }

    const isShapeOk = validateRequiredFields(parsed, errors);

    if (isShapeOk) {
      validateOne(parsed as unknown as MetadataJson, knownIds, errors);
    }

    if (errors.length > 0) {
      failures.push({ relativePath, errors });
    } else {
      okCount++;
    }
  }

  // Report
  console.log(`[validate-metadata] scanned ${metadataFiles.length} files`);
  console.log(`[validate-metadata] passing: ${okCount}`);
  console.log(`[validate-metadata] failing: ${failures.length}`);

  if (failures.length > 0) {
    console.log();
    for (const failure of failures) {
      console.log(`FAIL ${failure.relativePath}`);
      for (const err of failure.errors) {
        console.log(`  - ${err}`);
      }
    }
    console.log();
    console.log(
      `[validate-metadata] ${failures.length} file(s) failed validation. See errors above.`,
    );
    process.exit(1);
  }

  console.log("[validate-metadata] all metadata.json files pass.");
}

/**
 * Only run main() when this file is invoked as the entry point. When the
 * Vitest suite imports the canonical constants from this module, we must
 * NOT execute the CLI side-effects (which would call process.exit(1) on
 * any failure and crash the test runner).
 *
 * The check compares the basename of process.argv[1] against this file's
 * basename — works under both CommonJS (`__filename` available) and ESM
 * (where `__filename` is undefined under ts-node).
 */
const INVOKED_AS_SCRIPT = (() => {
  const entry = process.argv[1];
  if (!entry) return false;
  return path.basename(entry).startsWith("validate-metadata");
})();

if (INVOKED_AS_SCRIPT) {
  main();
}
