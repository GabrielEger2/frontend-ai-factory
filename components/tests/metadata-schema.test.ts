/**
 * Vitest mirror of `components/scripts/validate-metadata.ts`.
 *
 * Provides the same canonical-taxonomy enforcement as the CLI validator,
 * but as a per-component `describe(...)` block so failures land in the
 * normal test reporter and editors/CI surfaces them inline.
 *
 * Canonical constants (`CANONICAL_STYLE`, `CANONICAL_MOOD`,
 * `CANONICAL_PURPOSE`, `CANONICAL_CATEGORY`, `MIN_TAG_FLOOR`) are
 * imported from the validator script so both share a single source of
 * truth — see "Extending purpose[]" in
 * `.claude/rules/domains/components.md`.
 */

import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

import {
  CANONICAL_STYLE,
  CANONICAL_MOOD,
  CANONICAL_PURPOSE,
  CANONICAL_CATEGORY,
  MIN_TAG_FLOOR,
} from "../scripts/validate-metadata";

const LIBRARY_DIR = path.resolve(__dirname, "../library");
const PURPOSE_TOKEN_RE = /^\S+$/;

/* ------------------------------------------------------------------ */
/*  Helpers — same walk pattern as slot-prop-match.test.ts             */
/* ------------------------------------------------------------------ */

interface ComponentPair {
  metaPath: string;
  componentName: string;
}

/** Walk library/ to find all { metadata.json, index.tsx } pairs. */
function findComponentPairs(): ComponentPair[] {
  const pairs: ComponentPair[] = [];

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === "metadata.json") {
        const tsxPath = path.join(path.dirname(fullPath), "index.tsx");
        if (fs.existsSync(tsxPath)) {
          pairs.push({
            metaPath: fullPath,
            componentName: path.basename(path.dirname(fullPath)),
          });
        }
      }
    }
  }

  walk(LIBRARY_DIR);
  return pairs;
}

interface MetadataShape {
  id?: unknown;
  name?: unknown;
  category?: unknown;
  style?: unknown;
  mood?: unknown;
  purpose?: unknown;
  layout?: unknown;
  density?: unknown;
  mobileBehavior?: unknown;
  slots?: unknown;
  pairsWell?: unknown;
  pairsPoorly?: unknown;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

/* ------------------------------------------------------------------ */
/*  Tests                                                               */
/* ------------------------------------------------------------------ */

const pairs = findComponentPairs();

// Build the set of all known component ids in one pass so per-component
// tests can detect ghost references without re-walking the library.
const KNOWN_IDS = (() => {
  const ids = new Set<string>();
  for (const { metaPath } of pairs) {
    try {
      const parsed = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as {
        id?: unknown;
      };
      if (typeof parsed.id === "string" && parsed.id.length > 0) {
        ids.add(parsed.id);
      }
    } catch {
      // ignore — per-file parse error is reported by its own test below
    }
  }
  return ids;
})();

describe("Component metadata schema", () => {
  it("should discover at least one component", () => {
    expect(pairs.length).toBeGreaterThan(0);
  });

  for (const { metaPath, componentName } of pairs) {
    describe(componentName, () => {
      const metadata: MetadataShape = (() => {
        try {
          return JSON.parse(
            fs.readFileSync(metaPath, "utf-8"),
          ) as MetadataShape;
        } catch (err) {
          return { __parseError: (err as Error).message } as MetadataShape;
        }
      })();

      it("metadata.json parses as JSON", () => {
        expect(
          (metadata as Record<string, unknown>).__parseError,
          `Failed to parse ${componentName}/metadata.json`,
        ).toBeUndefined();
      });

      it("has all required fields", () => {
        expect(typeof metadata.id, "id must be a string").toBe("string");
        expect(typeof metadata.name, "name must be a string").toBe("string");
        expect(typeof metadata.category, "category must be a string").toBe(
          "string",
        );
        expect(typeof metadata.layout, "layout must be a string").toBe(
          "string",
        );
        expect(typeof metadata.density, "density must be a string").toBe(
          "string",
        );
        expect(
          typeof metadata.mobileBehavior,
          "mobileBehavior must be a string",
        ).toBe("string");
        expect(
          isStringArray(metadata.style) &&
            (metadata.style as string[]).length > 0,
          "style must be a non-empty string array",
        ).toBe(true);
        expect(
          isStringArray(metadata.mood) &&
            (metadata.mood as string[]).length > 0,
          "mood must be a non-empty string array",
        ).toBe(true);
        expect(
          isStringArray(metadata.purpose) &&
            (metadata.purpose as string[]).length > 0,
          "purpose must be a non-empty string array",
        ).toBe(true);
        expect(Array.isArray(metadata.slots), "slots must be an array").toBe(
          true,
        );
      });

      it("category is in the canonical list", () => {
        const cat = metadata.category as string;
        expect(
          CANONICAL_CATEGORY.includes(cat),
          `category "${cat}" is not in canonical list: ${CANONICAL_CATEGORY.join(
            ", ",
          )}`,
        ).toBe(true);
      });

      it("style[] values are all canonical", () => {
        const styles = (metadata.style as string[]) ?? [];
        const bad = styles.filter((v) => !CANONICAL_STYLE.includes(v));
        expect(
          bad,
          `non-canonical style values: ${JSON.stringify(bad)}`,
        ).toHaveLength(0);
      });

      it("mood[] values are all canonical", () => {
        const moods = (metadata.mood as string[]) ?? [];
        const bad = moods.filter((v) => !CANONICAL_MOOD.includes(v));
        expect(
          bad,
          `non-canonical mood values: ${JSON.stringify(bad)}`,
        ).toHaveLength(0);
      });

      it("purpose[] values are all canonical", () => {
        const purposes = (metadata.purpose as string[]) ?? [];
        const bad = purposes.filter((v) => !CANONICAL_PURPOSE.includes(v));
        expect(
          bad,
          `non-canonical purpose values: ${JSON.stringify(bad)}`,
        ).toHaveLength(0);
      });

      it("purpose[] tokens have no interior whitespace", () => {
        const purposes = (metadata.purpose as string[]) ?? [];
        const bad = purposes.filter((t) => !PURPOSE_TOKEN_RE.test(t));
        expect(
          bad,
          `purpose values with whitespace: ${JSON.stringify(bad)}`,
        ).toHaveLength(0);
      });

      it(`style[] meets the ${MIN_TAG_FLOOR}-tag floor`, () => {
        const styles = (metadata.style as string[]) ?? [];
        expect(
          styles.length,
          `style[] has ${styles.length} entries, minimum is ${MIN_TAG_FLOOR}`,
        ).toBeGreaterThanOrEqual(MIN_TAG_FLOOR);
      });

      it(`mood[] meets the ${MIN_TAG_FLOOR}-tag floor`, () => {
        const moods = (metadata.mood as string[]) ?? [];
        expect(
          moods.length,
          `mood[] has ${moods.length} entries, minimum is ${MIN_TAG_FLOOR}`,
        ).toBeGreaterThanOrEqual(MIN_TAG_FLOOR);
      });

      it("pairsWell IDs all resolve to a real component", () => {
        const ids = isStringArray(metadata.pairsWell)
          ? (metadata.pairsWell as string[])
          : [];
        const ghosts = ids.filter((id) => !KNOWN_IDS.has(id));
        expect(
          ghosts,
          `pairsWell ghost ids: ${JSON.stringify(ghosts)}`,
        ).toHaveLength(0);
      });

      it("pairsPoorly IDs all resolve to a real component", () => {
        const ids = isStringArray(metadata.pairsPoorly)
          ? (metadata.pairsPoorly as string[])
          : [];
        const ghosts = ids.filter((id) => !KNOWN_IDS.has(id));
        expect(
          ghosts,
          `pairsPoorly ghost ids: ${JSON.stringify(ghosts)}`,
        ).toHaveLength(0);
      });
    });
  }
});
