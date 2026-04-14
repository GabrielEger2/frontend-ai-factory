/**
 * Generate PAIRS_WITH compatibility scores for all component pairs.
 *
 * This is a pure-computation script — no Neo4j or external services needed.
 * It reads every metadata.json from the component library, computes a
 * weighted compatibility score for each unique pair, and writes the
 * result to seed-data/pairs-scores.json.
 *
 * WARNING: pairs-scores.json is generated — do not hand-edit it.
 *          Re-run this script after any metadata changes.
 *
 * Usage:
 *   npx ts-node scripts/generate-pair-scores.ts
 *
 * Algorithm (4-factor weighted formula):
 *   1. Page-flow position score   (40% weight)
 *   2. Style/mood overlap score   (30% weight)
 *   3. Density/layout compat      (20% weight)
 *   4. Manual override delta      (10% weight)
 *
 * All scores clamped to [0.05, 0.95].
 */

import * as fs from "fs";
import * as path from "path";

/* ------------------------------------------------------------------ */
/*  Resolve library root                                               */
/* ------------------------------------------------------------------ */

const LIBRARY_ROOT = path.resolve(
  __dirname,
  "..",
  "..",
  "components",
  "library",
);

const OUTPUT_PATH = path.resolve(__dirname, "seed-data", "pairs-scores.json");

/* ------------------------------------------------------------------ */
/*  Walk directory tree and collect metadata.json paths                */
/* ------------------------------------------------------------------ */

function findMetadataFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMetadataFiles(fullPath));
    } else if (entry.name === "metadata.json") {
      results.push(fullPath);
    }
  }

  return results;
}

/* ------------------------------------------------------------------ */
/*  Metadata interface                                                 */
/* ------------------------------------------------------------------ */

interface MetadataJson {
  id: string;
  name: string;
  category: string;
  style: string[];
  mood: string[];
  layout: string;
  density: string;
  pairsWell: string[];
  pairsPoorly: string[];
}

/* ------------------------------------------------------------------ */
/*  Page-flow order and position mapping                               */
/* ------------------------------------------------------------------ */

/**
 * Natural page-flow order for website sections.
 * Categories that share a base (e.g. layout/grid, layout/scroll, layout/split)
 * all map to the same flow position.
 */
const FLOW_ORDER: string[] = [
  "navigation",
  "hero",
  "layout",
  "stats",
  "carousel",
  "cta",
  "faq",
  "contact",
  "footers",
];

/**
 * Map a component category to its flow-order index.
 * Sub-categories like "layout/grid" map to the "layout" position.
 */
function flowIndex(category: string): number {
  // Try exact match first
  const exact = FLOW_ORDER.indexOf(category);
  if (exact !== -1) return exact;

  // Try base category (before the slash)
  const base = category.split("/")[0];
  const baseIdx = FLOW_ORDER.indexOf(base);
  if (baseIdx !== -1) return baseIdx;

  // Unknown category — place in middle
  return Math.floor(FLOW_ORDER.length / 2);
}

/* ------------------------------------------------------------------ */
/*  Factor 1: Page-flow position score (40% weight)                    */
/* ------------------------------------------------------------------ */

/**
 * Scores how natural it is for two components to appear adjacent
 * in a page layout based on their category positions.
 *
 * - Adjacent categories in flow order:  0.8
 * - Same category (redundant):          0.3
 * - One category apart:                 0.6
 * - Two+ categories apart:              0.4
 * - Wildly reversed (footer before hero): 0.2
 */
function pageFlowScore(a: MetadataJson, b: MetadataJson): number {
  const idxA = flowIndex(a.category);
  const idxB = flowIndex(b.category);
  const distance = idxB - idxA; // signed: positive = B comes after A
  const absDistance = Math.abs(distance);

  // Same category — redundant adjacency
  if (absDistance === 0) return 0.3;

  // Wildly reversed: B is 3+ positions before A in the natural flow
  // (e.g., footers before hero)
  if (distance <= -3) return 0.2;

  // Adjacent in flow order (distance of 1)
  if (absDistance === 1) return 0.8;

  // One category apart (distance of 2)
  if (absDistance === 2) return 0.6;

  // Two+ categories apart (distance >= 3)
  return 0.4;
}

/* ------------------------------------------------------------------ */
/*  Factor 2: Style/mood overlap score (30% weight)                    */
/* ------------------------------------------------------------------ */

function arrayOverlap(a: string[], b: string[]): number {
  const setB = new Set(b);
  let overlap = 0;
  for (const item of a) {
    if (setB.has(item)) overlap++;
  }
  return overlap;
}

/**
 * Jaccard-like overlap for style and mood arrays.
 * styleOverlap / max(len(A.style), len(B.style)) * 0.5 +
 * moodOverlap / max(len(A.mood), len(B.mood)) * 0.5
 */
function styleMoodScore(a: MetadataJson, b: MetadataJson): number {
  const maxStyle = Math.max(a.style.length, b.style.length);
  const maxMood = Math.max(a.mood.length, b.mood.length);

  const styleRatio =
    maxStyle > 0 ? arrayOverlap(a.style, b.style) / maxStyle : 0;
  const moodRatio = maxMood > 0 ? arrayOverlap(a.mood, b.mood) / maxMood : 0;

  return styleRatio * 0.5 + moodRatio * 0.5;
}

/* ------------------------------------------------------------------ */
/*  Factor 3: Density/layout compatibility score (20% weight)          */
/* ------------------------------------------------------------------ */

/**
 * Visual variety is desirable — different density/layout score higher.
 * - Same density:   0.4   | Different density:   0.8
 * - Same layout:    0.3   | Different layout:    0.9
 * Average both sub-scores.
 */
function densityLayoutScore(a: MetadataJson, b: MetadataJson): number {
  const densitySub = a.density === b.density ? 0.4 : 0.8;
  const layoutSub = a.layout === b.layout ? 0.3 : 0.9;
  return (densitySub + layoutSub) / 2;
}

/* ------------------------------------------------------------------ */
/*  Factor 4: Manual override delta (10% weight)                       */
/* ------------------------------------------------------------------ */

/**
 * Check pairsWell/pairsPoorly for manual hints.
 * If A is in B's pairsWell OR B is in A's pairsWell: +0.15 boost
 * If A is in B's pairsPoorly OR B is in A's pairsPoorly: -0.15 penalty
 * Both can apply (net zero if in both directions differently).
 */
function manualOverrideDelta(a: MetadataJson, b: MetadataJson): number {
  let delta = 0;

  // Check pairsWell (bidirectional)
  if (a.pairsWell.includes(b.id) || b.pairsWell.includes(a.id)) {
    delta += 0.15;
  }

  // Check pairsPoorly (bidirectional)
  if (a.pairsPoorly.includes(b.id) || b.pairsPoorly.includes(a.id)) {
    delta -= 0.15;
  }

  return delta;
}

/* ------------------------------------------------------------------ */
/*  Combined scoring                                                   */
/* ------------------------------------------------------------------ */

const WEIGHT_PAGE_FLOW = 0.4;
const WEIGHT_STYLE_MOOD = 0.3;
const WEIGHT_DENSITY_LAYOUT = 0.2;
const WEIGHT_MANUAL = 0.1;

interface PairScore {
  a: string;
  b: string;
  score: number;
}

function computePairScore(a: MetadataJson, b: MetadataJson): number {
  const flow = pageFlowScore(a, b);
  const styleMood = styleMoodScore(a, b);
  const densityLayout = densityLayoutScore(a, b);
  const manual = manualOverrideDelta(a, b);

  const raw =
    WEIGHT_PAGE_FLOW * flow +
    WEIGHT_STYLE_MOOD * styleMood +
    WEIGHT_DENSITY_LAYOUT * densityLayout +
    WEIGHT_MANUAL * manual;

  // Clamp to [0.05, 0.95]
  return Math.round(Math.min(0.95, Math.max(0.05, raw)) * 100) / 100;
}

/* ------------------------------------------------------------------ */
/*  Output format                                                      */
/* ------------------------------------------------------------------ */

interface PairScoresOutput {
  generatedAt: string;
  componentCount: number;
  pairCount: number;
  pairs: PairScore[];
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

function main(): void {
  console.log(`Library root: ${LIBRARY_ROOT}`);
  console.log(`Output path:  ${OUTPUT_PATH}`);
  console.log();

  // Discover metadata files
  const metadataFiles = findMetadataFiles(LIBRARY_ROOT);

  if (metadataFiles.length === 0) {
    console.error("No metadata.json files found in", LIBRARY_ROOT);
    process.exit(1);
  }

  // Load all component metadata
  const components: MetadataJson[] = [];

  for (const filePath of metadataFiles) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const json: MetadataJson = JSON.parse(raw);
    components.push(json);
  }

  // Sort by id for deterministic pair ordering
  components.sort((a, b) => a.id.localeCompare(b.id));

  console.log(`Found ${components.length} components`);
  console.log();

  // Generate all unique pairs where a.id < b.id
  const pairs: PairScore[] = [];

  for (let i = 0; i < components.length; i++) {
    for (let j = i + 1; j < components.length; j++) {
      const a = components[i];
      const b = components[j];
      const score = computePairScore(a, b);
      pairs.push({ a: a.id, b: b.id, score });
    }
  }

  const expectedPairs = (components.length * (components.length - 1)) / 2;
  console.log(
    `Generated ${pairs.length} pair scores (expected ${expectedPairs})`,
  );

  // Validate all scores are in range
  let outOfRange = 0;
  for (const pair of pairs) {
    if (pair.score < 0.05 || pair.score > 0.95) {
      console.error(`  OUT OF RANGE: ${pair.a} <-> ${pair.b} = ${pair.score}`);
      outOfRange++;
    }
  }

  if (outOfRange > 0) {
    console.error(`\n${outOfRange} scores out of [0.05, 0.95] range!`);
    process.exit(1);
  }

  // Score distribution summary
  const buckets: Record<string, number> = {
    "0.05-0.20": 0,
    "0.21-0.40": 0,
    "0.41-0.60": 0,
    "0.61-0.80": 0,
    "0.81-0.95": 0,
  };

  for (const pair of pairs) {
    if (pair.score <= 0.2) buckets["0.05-0.20"]++;
    else if (pair.score <= 0.4) buckets["0.21-0.40"]++;
    else if (pair.score <= 0.6) buckets["0.41-0.60"]++;
    else if (pair.score <= 0.8) buckets["0.61-0.80"]++;
    else buckets["0.81-0.95"]++;
  }

  console.log("\nScore distribution:");
  for (const [range, count] of Object.entries(buckets)) {
    const bar = "#".repeat(Math.ceil(count / 5));
    console.log(`  ${range}: ${count.toString().padStart(3)} ${bar}`);
  }

  // Build output
  const output: PairScoresOutput = {
    generatedAt: new Date().toISOString(),
    componentCount: components.length,
    pairCount: pairs.length,
    pairs,
  };

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    OUTPUT_PATH,
    JSON.stringify(output, null, 2) + "\n",
    "utf-8",
  );

  console.log(`\nWritten to ${OUTPUT_PATH}`);
  console.log("Done.");
}

main();
