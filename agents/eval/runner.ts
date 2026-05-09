/**
 * Rerank weight grid-search evaluator.
 *
 * Loads all `*.jsonl` fixture files from `agents/eval/fixtures/`, replays
 * `rerankCandidates` across a coarse 5^5 = 3125 grid of `RerankWeights`
 * combinations, and writes a markdown report + JSON sidecar to
 * `agents/eval/reports/`.
 *
 * Replay strategy: frozen human-labeled picks (Strategy A). For each
 * fixture line, `previouslyPicked` is the IDs from that line, hydrated to
 * full `CandidateComponent` objects via `hydrateFromMetadata`. Same
 * context for every weight combo on a given slot — keeps per-slot
 * gradients clean.
 *
 * Lines with `pickId === null` or `captureSource === "fallback"` are
 * skipped (not scoreable). Score per line: 1/r if pickId is in top-K,
 * 0 otherwise (K = 5).
 */

import * as fs from "fs";
import * as path from "path";
import {
  rerankCandidates,
  DEFAULT_RERANK_WEIGHTS,
  RerankWeights,
} from "../composer/rerank";
import { COMPONENT_METADATA } from "../assembler/component-sources.generated";
import type { CandidateComponent } from "../composer/prompt";
import type { StyleOutput } from "../shared/types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FixtureLine {
  fixtureId: string;
  brief: string;
  mood: string[];
  style: string[];
  density: string;
  slotCategory: string;
  skeletonIndex: number;
  captureSource: "vector" | "fallback";
  candidates: CandidateComponent[];
  previouslyPicked: string[];
  pickId: string | null;
}

interface SlotResult {
  fixtureId: string;
  slotCategory: string;
  weights: RerankWeights;
  rankOfPick: number;
  score: number;
}

interface GridPoint {
  weights: RerankWeights;
  globalScore: number;
  perSlotScores: Record<string, number>;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const K = 5;
const WEIGHT_VALUES = [0, 0.25, 0.5, 0.75, 1.0] as const;
const FIXTURES_DIR = path.resolve(__dirname, "fixtures");
const REPORTS_DIR = path.resolve(__dirname, "reports");

const SLOT_CATEGORIES_REPORT_ORDER = [
  "hero",
  "products",
  "content",
  "testimonial",
  "cta",
  "contact",
  "footer",
] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Build a CandidateComponent from a stored picked-ID by reading
 * COMPONENT_METADATA. Only fields that rerank actually reads on prior
 * picks are populated with real values: `id`, `style`, `mood`, `density`,
 * `imageWeight`. Other required fields use dummy values — they are not
 * read by rerank on prior picks (verified at rerank.ts:175-183, 112-126).
 *
 * Hydrated objects are NEVER user-facing — they only flow into rerank's
 * tag-frequency map and density-penalty check.
 */
function hydrateFromMetadata(id: string): CandidateComponent {
  const meta = COMPONENT_METADATA[id];
  return {
    id,
    name: id,
    category: meta?.category ?? "",
    density: meta?.density ?? "medium",
    layout: "split",
    moodHits: 0,
    styleHits: 0,
    avgPairScore: 0.5,
    imageWeight: meta?.imageWeight,
    style: meta?.style,
    mood: meta?.mood,
  };
}

/**
 * Load every `*.jsonl` file from `dir` and return the concatenated
 * FixtureLine array. Throws if dir is missing, contains no `.jsonl`
 * files, or any file is empty.
 */
function loadFixtures(dir: string): FixtureLine[] {
  if (!fs.existsSync(dir)) {
    throw new Error(`Fixtures directory not found: ${dir}`);
  }
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".jsonl"))
    .sort();
  if (files.length === 0) {
    throw new Error(`No .jsonl fixture files found in ${dir}`);
  }
  const lines: FixtureLine[] = [];
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      throw new Error(`Fixture file is empty: ${fullPath}`);
    }
    for (const rawLine of trimmed.split(/\r?\n/)) {
      const lineText = rawLine.trim();
      if (lineText.length === 0) continue;
      const parsed = JSON.parse(lineText) as FixtureLine;
      lines.push(parsed);
    }
  }
  return lines;
}

/**
 * Generate the 5^5 = 3125 weight combinations.
 */
function generateGrid(): RerankWeights[] {
  const combos: RerankWeights[] = [];
  for (const pairsWith of WEIGHT_VALUES) {
    for (const styleOverlap of WEIGHT_VALUES) {
      for (const diversity of WEIGHT_VALUES) {
        for (const density of WEIGHT_VALUES) {
          for (const audienceFit of WEIGHT_VALUES) {
            combos.push({
              pairsWith,
              styleOverlap,
              diversity,
              density,
              audienceFit,
              // Pinned to default; verticalFit grid sweep deferred to Phase 5
              // per plan C1. Required field added 2026-05-08 (Phase 3).
              verticalFit: DEFAULT_RERANK_WEIGHTS.verticalFit,
            });
          }
        }
      }
    }
  }
  return combos;
}

/**
 * For each scoreable fixture line, replay `rerankCandidates` with the
 * given weights and return one SlotResult per line. Score is 1/r where r
 * is the 1-based rank of the human pickId in the reranked array; 0 if
 * pickId is outside the top-K window.
 */
function scoreCombo(
  lines: FixtureLine[],
  weights: RerankWeights,
): SlotResult[] {
  const results: SlotResult[] = [];
  for (const line of lines) {
    if (line.pickId === null) continue;
    if (line.captureSource === "fallback") continue;

    const hydratedPriorPicks = line.previouslyPicked.map(hydrateFromMetadata);
    const styleOutput = {
      style: line.style,
      mood: line.mood,
    } as unknown as StyleOutput;

    const reranked = rerankCandidates(
      line.candidates,
      hydratedPriorPicks,
      styleOutput,
      weights,
    );

    const rankIdx = reranked.findIndex((c) => c.id === line.pickId);
    const rank = rankIdx === -1 ? K + 1 : rankIdx + 1;
    const score = rank <= K ? 1 / rank : 0;

    results.push({
      fixtureId: line.fixtureId,
      slotCategory: line.slotCategory,
      weights,
      rankOfPick: rank,
      score,
    });
  }
  return results;
}

/**
 * Sweep the grid and produce a GridPoint per weight combo. Each
 * GridPoint reports global mean score and per-slot mean score (keyed by
 * slot category). Slots with no scoreable lines map to NaN — callers
 * render them as `—`.
 */
function aggregateGrid(
  lines: FixtureLine[],
  grid: RerankWeights[],
): GridPoint[] {
  const points: GridPoint[] = [];
  for (let i = 0; i < grid.length; i++) {
    const weights = grid[i];
    const slotResults = scoreCombo(lines, weights);

    const globalScore =
      slotResults.length > 0
        ? slotResults.reduce((sum, r) => sum + r.score, 0) / slotResults.length
        : 0;

    // Per-slot mean.
    const perSlotBuckets = new Map<string, number[]>();
    for (const r of slotResults) {
      const bucket = perSlotBuckets.get(r.slotCategory) ?? [];
      bucket.push(r.score);
      perSlotBuckets.set(r.slotCategory, bucket);
    }
    const perSlotScores: Record<string, number> = {};
    for (const [cat, scores] of perSlotBuckets) {
      perSlotScores[cat] =
        scores.reduce((a, b) => a + b, 0) / Math.max(scores.length, 1);
    }

    points.push({ weights, globalScore, perSlotScores });

    if ((i + 1) % 100 === 0 || i === grid.length - 1) {
      process.stdout.write(`\r[runner] grid progress: ${i + 1}/${grid.length}`);
    }
  }
  process.stdout.write("\n");
  return points;
}

/* ------------------------------------------------------------------ */
/*  Reporting                                                          */
/* ------------------------------------------------------------------ */

const fmtWeight = (n: number): string => n.toFixed(2);
const fmtScore = (n: number): string =>
  Number.isFinite(n) ? n.toFixed(3) : "—";
const fmtSlot = (n: number | undefined): string =>
  typeof n === "number" && Number.isFinite(n) ? n.toFixed(3) : "—";
const fmtSigned = (n: number): string =>
  Number.isFinite(n) ? (n >= 0 ? `+${n.toFixed(3)}` : n.toFixed(3)) : "—";

function findGridPoint(
  points: GridPoint[],
  predicate: (p: GridPoint) => boolean,
): GridPoint | undefined {
  return points.find(predicate);
}

function findBaseline(points: GridPoint[]): GridPoint | undefined {
  return findGridPoint(
    points,
    (p) =>
      p.weights.pairsWith === DEFAULT_RERANK_WEIGHTS.pairsWith &&
      p.weights.styleOverlap === DEFAULT_RERANK_WEIGHTS.styleOverlap &&
      p.weights.diversity === DEFAULT_RERANK_WEIGHTS.diversity &&
      p.weights.density === DEFAULT_RERANK_WEIGHTS.density &&
      p.weights.audienceFit === DEFAULT_RERANK_WEIGHTS.audienceFit,
  );
}

function findBestGlobal(points: GridPoint[]): GridPoint {
  let best = points[0];
  for (const p of points) {
    if (p.globalScore > best.globalScore) best = p;
  }
  return best;
}

function findBestForSlot(
  points: GridPoint[],
  category: string,
): GridPoint | undefined {
  let best: GridPoint | undefined;
  let bestScore = -Infinity;
  for (const p of points) {
    const s = p.perSlotScores[category];
    if (typeof s === "number" && Number.isFinite(s) && s > bestScore) {
      best = p;
      bestScore = s;
    }
  }
  return best;
}

function buildReport(lines: FixtureLine[], gridPoints: GridPoint[]): string {
  const total = lines.length;
  const fallbackSkips = lines.filter(
    (l) => l.captureSource === "fallback",
  ).length;
  const nullPickSkips = lines.filter(
    (l) => l.pickId === null && l.captureSource !== "fallback",
  ).length;
  const scoreable = lines.filter(
    (l) => l.pickId !== null && l.captureSource !== "fallback",
  );
  const scoreableCount = scoreable.length;

  const baseline = findBaseline(gridPoints);
  const bestGlobal = findBestGlobal(gridPoints);

  const sections: string[] = [];

  /* ---- Section 1: Header ---- */
  sections.push(`# Rerank Weight Grid Search Report`);
  sections.push("");
  sections.push(`- Generated: ${new Date().toISOString()}`);
  sections.push(`- Total fixture lines: ${total}`);
  sections.push(`- Scoreable lines: ${scoreableCount}`);
  sections.push(`- Skipped (fallback captureSource): ${fallbackSkips}`);
  sections.push(`- Skipped (pickId null): ${nullPickSkips}`);
  sections.push(`- Grid combinations evaluated: ${gridPoints.length}`);
  sections.push("");

  /* ---- Section 2: Baseline ---- */
  sections.push(`## Baseline (DEFAULT_RERANK_WEIGHTS)`);
  sections.push("");
  if (!baseline) {
    sections.push(
      `_Baseline weights ${JSON.stringify(DEFAULT_RERANK_WEIGHTS)} not found in grid._`,
    );
  } else {
    sections.push(
      `Weights: pairsWith=${fmtWeight(baseline.weights.pairsWith)}, ` +
        `styleOverlap=${fmtWeight(baseline.weights.styleOverlap)}, ` +
        `diversity=${fmtWeight(baseline.weights.diversity)}, ` +
        `density=${fmtWeight(baseline.weights.density)}, ` +
        `audienceFit=${fmtWeight(baseline.weights.audienceFit)}`,
    );
    sections.push("");
    sections.push(`**Global score:** ${fmtScore(baseline.globalScore)}`);
    sections.push("");
    sections.push("| Slot | Score |");
    sections.push("|---|---|");
    for (const cat of SLOT_CATEGORIES_REPORT_ORDER) {
      sections.push(`| ${cat} | ${fmtSlot(baseline.perSlotScores[cat])} |`);
    }
  }
  sections.push("");

  /* ---- Section 3: Best global combo ---- */
  sections.push(`## Best Global Combo`);
  sections.push("");
  const bestGlobalGain = baseline
    ? bestGlobal.globalScore - baseline.globalScore
    : NaN;
  sections.push(
    "| pairsWith | styleOverlap | diversity | density | audienceFit | Global Score | vs Baseline |",
  );
  sections.push("|---|---|---|---|---|---|---|");
  sections.push(
    `| ${fmtWeight(bestGlobal.weights.pairsWith)} | ${fmtWeight(bestGlobal.weights.styleOverlap)} | ${fmtWeight(bestGlobal.weights.diversity)} | ${fmtWeight(bestGlobal.weights.density)} | ${fmtWeight(bestGlobal.weights.audienceFit)} | ${fmtScore(bestGlobal.globalScore)} | ${fmtSigned(bestGlobalGain)} |`,
  );
  sections.push("");
  sections.push("**Per-slot scores under best-global weights:**");
  sections.push("");
  sections.push("| Slot | Score |");
  sections.push("|---|---|");
  for (const cat of SLOT_CATEGORIES_REPORT_ORDER) {
    sections.push(`| ${cat} | ${fmtSlot(bestGlobal.perSlotScores[cat])} |`);
  }
  sections.push("");

  /* ---- Section 4: Best per-slot ---- */
  sections.push(`## Best Per-Slot Weights`);
  sections.push("");
  sections.push(
    "| Slot | pairsWith | styleOverlap | diversity | density | audienceFit | Score | vs Baseline |",
  );
  sections.push("|---|---|---|---|---|---|---|---|");
  for (const cat of SLOT_CATEGORIES_REPORT_ORDER) {
    const best = findBestForSlot(gridPoints, cat);
    if (!best) {
      sections.push(`| ${cat} | — | — | — | — | — | — | — |`);
      continue;
    }
    const baselineSlotScore = baseline?.perSlotScores[cat];
    const bestSlotScore = best.perSlotScores[cat];
    const delta =
      typeof baselineSlotScore === "number" &&
      Number.isFinite(baselineSlotScore) &&
      typeof bestSlotScore === "number" &&
      Number.isFinite(bestSlotScore)
        ? bestSlotScore - baselineSlotScore
        : NaN;
    sections.push(
      `| ${cat} | ${fmtWeight(best.weights.pairsWith)} | ${fmtWeight(best.weights.styleOverlap)} | ${fmtWeight(best.weights.diversity)} | ${fmtWeight(best.weights.density)} | ${fmtWeight(best.weights.audienceFit)} | ${fmtSlot(bestSlotScore)} | ${fmtSigned(delta)} |`,
    );
  }
  sections.push("");

  /* ---- Section 5: Top-5 disagreements ---- */
  sections.push(`## Top-5 Disagreements (baseline weights)`);
  sections.push("");
  if (scoreableCount === 0) {
    sections.push(`_No scoreable lines._`);
  } else {
    type Disagreement = {
      line: FixtureLine;
      reranked: CandidateComponent[];
      pickRank: number;
      pickScore: number;
    };
    const disagreements: Disagreement[] = [];
    for (const line of scoreable) {
      const hydratedPriorPicks = line.previouslyPicked.map(hydrateFromMetadata);
      const styleOutput = {
        style: line.style,
        mood: line.mood,
      } as unknown as StyleOutput;
      const reranked = rerankCandidates(
        line.candidates,
        hydratedPriorPicks,
        styleOutput,
        DEFAULT_RERANK_WEIGHTS,
      );
      const rankIdx = reranked.findIndex((c) => c.id === line.pickId);
      const rank = rankIdx === -1 ? K + 1 : rankIdx + 1;
      const score = rank <= K ? 1 / rank : 0;
      disagreements.push({ line, reranked, pickRank: rank, pickScore: score });
    }
    disagreements.sort((a, b) => a.pickScore - b.pickScore);
    const top5 = disagreements.slice(0, 5);

    type DebugPayload = {
      pairsWithScore: number;
      styleScore: number;
      diversityPenalty: number;
      densityPenalty: number;
      audienceFitScore: number;
      rerankScore: number;
    };
    const readDebug = (c: CandidateComponent): DebugPayload | undefined =>
      (c as unknown as { _rerankDebug?: DebugPayload })._rerankDebug;

    for (let i = 0; i < top5.length; i++) {
      const d = top5[i];
      const algoTop = d.reranked[0];
      const yourPick = d.reranked.find((c) => c.id === d.line.pickId);
      sections.push(
        `### ${i + 1}. ${d.line.fixtureId} (${d.line.slotCategory})`,
      );
      sections.push("");
      sections.push(`- Your pick: \`${d.line.pickId}\``);
      sections.push(`- Algorithm rank-1: \`${algoTop?.id ?? "—"}\``);
      sections.push(
        `- Your pick's rank: ${d.pickRank > K ? `>${K} (out of top-K)` : d.pickRank}`,
      );
      sections.push(`- Score: ${fmtScore(d.pickScore)}`);
      sections.push("");
      sections.push(
        "| Candidate | pairsWith | styleOverlap | diversityPenalty | densityPenalty | audienceFitScore | rerankScore |",
      );
      sections.push("|---|---|---|---|---|---|---|");
      const yourDebug = yourPick ? readDebug(yourPick) : undefined;
      const algoDebug = algoTop ? readDebug(algoTop) : undefined;
      sections.push(
        `| your pick (${d.line.pickId}) | ${fmtSlot(yourDebug?.pairsWithScore)} | ${fmtSlot(yourDebug?.styleScore)} | ${fmtSlot(yourDebug?.diversityPenalty)} | ${fmtSlot(yourDebug?.densityPenalty)} | ${fmtSlot(yourDebug?.audienceFitScore)} | ${fmtSlot(yourDebug?.rerankScore)} |`,
      );
      sections.push(
        `| algo rank-1 (${algoTop?.id ?? "—"}) | ${fmtSlot(algoDebug?.pairsWithScore)} | ${fmtSlot(algoDebug?.styleScore)} | ${fmtSlot(algoDebug?.diversityPenalty)} | ${fmtSlot(algoDebug?.densityPenalty)} | ${fmtSlot(algoDebug?.audienceFitScore)} | ${fmtSlot(algoDebug?.rerankScore)} |`,
      );
      sections.push("");
    }
  }

  /* ---- Section 6: Footer ---- */
  sections.push(`## Applying the Best Combo`);
  sections.push("");
  sections.push(
    "To apply the best global combo, update `DEFAULT_RERANK_WEIGHTS` in `agents/composer/rerank.ts:160-166`.",
  );
  sections.push("");

  return sections.join("\n");
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  console.log("[runner] loading fixtures...");
  const lines = loadFixtures(FIXTURES_DIR);
  console.log(`[runner] loaded ${lines.length} fixture lines`);

  const scoreable = lines.filter(
    (l) => l.pickId !== null && l.captureSource !== "fallback",
  );
  console.log(
    `[runner] ${scoreable.length} lines have pickId set and are scoreable`,
  );
  if (scoreable.length === 0) {
    console.error(
      "[runner] No scoreable fixtures. Fill pickId in JSONL files before running the sweep.",
    );
    process.exit(1);
  }

  console.log("[runner] generating grid (5^5 = 3125 combos)...");
  const grid = generateGrid();

  console.log("[runner] sweeping grid...");
  const gridPoints = aggregateGrid(lines, grid);

  console.log("[runner] building report...");
  const report = buildReport(lines, gridPoints);

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  fs.writeFileSync(path.join(REPORTS_DIR, `${ts}.md`), report, "utf-8");
  fs.writeFileSync(
    path.join(REPORTS_DIR, `${ts}.json`),
    JSON.stringify(gridPoints, null, 2) + "\n",
    "utf-8",
  );
  fs.writeFileSync(path.join(REPORTS_DIR, "latest.md"), report, "utf-8");
  fs.writeFileSync(
    path.join(REPORTS_DIR, "latest.json"),
    JSON.stringify(gridPoints, null, 2) + "\n",
    "utf-8",
  );

  console.log(`[runner] report written: ${path.join(REPORTS_DIR, `${ts}.md`)}`);
  console.log(`[runner] latest.md and latest.json updated`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
