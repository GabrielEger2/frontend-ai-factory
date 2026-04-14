import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

const LIBRARY_DIR = path.resolve(__dirname, "../library");

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

interface ComponentPair {
  metaPath: string;
  tsxPath: string;
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
            tsxPath,
            componentName: path.basename(path.dirname(fullPath)),
          });
        }
      }
    }
  }

  walk(LIBRARY_DIR);
  return pairs;
}

/**
 * Extract prop names from the exported Props interface.
 *
 * Uses brace-depth tracking to handle nested types like:
 *   fields?: Array<{ name: string; label: string }>;
 *
 * Only extracts top-level prop names (depth === 1).
 */
function extractPropNames(tsxSource: string): Set<string> {
  const lines = tsxSource.split("\n");
  const propNames = new Set<string>();

  let insideInterface = false;
  let depth = 0;

  for (const line of lines) {
    // Detect the start of the Props interface
    if (!insideInterface && /export interface \w+Props\s*\{/.test(line)) {
      insideInterface = true;
      depth = 1;
      continue;
    }

    if (!insideInterface) continue;

    // Extract prop at current depth BEFORE counting braces on this line.
    // This handles lines like `fields?: Array<{` where the prop name
    // is at depth 1 but the opening brace would push depth to 2.
    if (depth === 1) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("*") && !trimmed.startsWith("/")) {
        const match = trimmed.match(/^(\w+)\??:/);
        if (match) {
          propNames.add(match[1]);
        }
      }
    }

    // Track brace depth
    for (const ch of line) {
      if (ch === "{") depth++;
      if (ch === "}") depth--;
    }

    // We've closed the interface
    if (depth <= 0) break;
  }

  return propNames;
}

/** Extract slot names from a parsed metadata.json. */
function extractSlotNames(metadata: {
  slots?: Array<{ name: string }>;
}): string[] {
  return (metadata.slots ?? []).map((s) => s.name);
}

/* ------------------------------------------------------------------ */
/*  Tests                                                               */
/* ------------------------------------------------------------------ */

const pairs = findComponentPairs();

describe("Component slot-prop contract", () => {
  it("should discover at least one component", () => {
    expect(pairs.length).toBeGreaterThan(0);
  });

  for (const { metaPath, tsxPath, componentName } of pairs) {
    describe(componentName, () => {
      it("every metadata slot name must exist as a TypeScript prop", () => {
        const metadata = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
        const tsxSource = fs.readFileSync(tsxPath, "utf-8");

        const slotNames = extractSlotNames(metadata);
        const propNames = extractPropNames(tsxSource);

        if (propNames.size === 0) {
          console.warn(
            `[WARN] No Props interface found in ${componentName}/index.tsx — skipped`,
          );
          return;
        }

        const mismatches = slotNames.filter((slot) => !propNames.has(slot));

        expect(
          mismatches,
          [
            `Component "${componentName}" has metadata slots that don't match any TypeScript prop:`,
            ...mismatches.map((m) => `  - slot "${m}" has no matching prop`),
            `  Available props: ${[...propNames].join(", ")}`,
          ].join("\n"),
        ).toHaveLength(0);
      });
    });
  }
});
