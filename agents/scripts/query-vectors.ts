/**
 * Demo: query the Qdrant `components` collection per skeleton slot.
 *
 * Usage:
 *   ts-node scripts/query-vectors.ts "<brief>" [flags]
 *
 * Flags (all optional — defaults preserve original SaaS-shaped mock):
 *   --mood    <comma-list>   e.g. "elegant,warm,friendly"  (default: professional)
 *   --style   <comma-list>   e.g. "editorial,luxury"       (default: modern)
 *   --density <low|medium|high>                            (default: medium)
 *
 * Required env vars (point to SSM parameter names, not raw secrets):
 *   QDRANT_ENDPOINT_SSM_PATH   — e.g. /sitegen/dev/qdrant-endpoint
 *   QDRANT_API_KEY_SSM_PATH    — e.g. /sitegen/dev/qdrant-api-key
 *   OPENAI_API_KEY_SSM_PATH    — e.g. /sitegen/dev/openai-api-key
 *
 * For each slot in DEFAULT_SKELETON, embeds a per-slot query string via
 * OpenAI text-embedding-3-small (1536-d), runs three category-filtered
 * cosine similarity searches against the `components` collection — one per
 * named-vector axis (`descriptive`, `usage`, `audienceFit`) — merges results
 * by componentId taking the max axis score, and prints the top-3 hits per
 * slot as a markdown table. The slotQuery phrasing mirrors the Composer
 * handler exactly: `${category} for ${brief}; mood: ${mood}; needs:
 * ${purpose}`, so the mood override flows into the embedding too — not just
 * rerank.
 *
 * After printing the top-3 table, the script also runs the deterministic
 * Phase D `rerankCandidates` four-signal combiner (PAIRS_WITH + style
 * overlap + diversity + density) and prints a per-signal score breakdown
 * for the winning candidate per slot. This enables empirical weight
 * tuning for Stage 4 of the composer eval loop.
 */

import * as fs from "fs";
import * as path from "path";
import { getEmbedding } from "../shared/embeddings";
import { getQdrantClient } from "../shared/qdrant-client";
import { DEFAULT_SKELETON } from "../composer/defaultSkeleton";
import { rerankCandidates, DEFAULT_RERANK_WEIGHTS } from "../composer/rerank";
import { COMPONENT_METADATA } from "../assembler/component-sources.generated";
import type { CandidateComponent } from "../composer/prompt";
import type { StyleOutput } from "../shared/types";

/* ------------------------------------------------------------------ */
/*  Resolve query brief + style overrides                              */
/* ------------------------------------------------------------------ */

const argv = process.argv.slice(2);

let brief: string | undefined;
let moodOverride: string[] | undefined;
let styleOverride: string[] | undefined;
let densityOverride: string | undefined;
let captureSlug: string | undefined;

const splitCsv = (raw: string): string[] =>
  raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (arg === "--mood" && i + 1 < argv.length) {
    moodOverride = splitCsv(argv[++i]);
  } else if (arg === "--style" && i + 1 < argv.length) {
    styleOverride = splitCsv(argv[++i]);
  } else if (arg === "--density" && i + 1 < argv.length) {
    densityOverride = argv[++i].trim();
  } else if (arg === "--capture" && i + 1 < argv.length) {
    captureSlug = argv[++i];
  } else if (!arg.startsWith("--") && brief === undefined) {
    brief = arg;
  }
}

if (!brief) {
  console.error(
    'Usage: ts-node scripts/query-vectors.ts "<brief>" [--mood a,b,c] [--style a,b,c] [--density low|medium|high] [--capture <slug>]',
  );
  process.exit(1);
}

const captureMode = captureSlug !== undefined;
const fixturePath = captureMode
  ? path.resolve(__dirname, "../eval/fixtures", `${captureSlug}.jsonl`)
  : undefined;
if (fixturePath) {
  fs.mkdirSync(path.dirname(fixturePath), { recursive: true });
}

/* ------------------------------------------------------------------ */
/*  Verify required env vars                                           */
/* ------------------------------------------------------------------ */

const REQUIRED_ENV_VARS = [
  "QDRANT_ENDPOINT_SSM_PATH",
  "QDRANT_API_KEY_SSM_PATH",
  "OPENAI_API_KEY_SSM_PATH",
] as const;

for (const name of REQUIRED_ENV_VARS) {
  if (!process.env[name]) {
    console.error(`Error: ${name} environment variable is not set`);
    process.exit(1);
  }
}

/* ------------------------------------------------------------------ */
/*  Payload shape (mirrors what seed-vectors.ts writes)                */
/* ------------------------------------------------------------------ */

interface ComponentPayload {
  componentId?: string;
  name?: string;
  category?: string;
  style?: string[];
  mood?: string[];
  purpose?: string[];
}

/* ------------------------------------------------------------------ */
/*  StyleOutput for the re-ranker (CLI-overridable)                    */
/* ------------------------------------------------------------------ */

/**
 * Debug approximation only. The real composer pipeline feeds the Style
 * Agent's StyleOutput into rerankCandidates; this script lacks an upstream
 * style run, so we hand-roll a minimal object with just the fields the
 * style-overlap scorer actually reads (`style`, `mood`) plus `density` for
 * the density penalty. Other StyleOutput fields (palette, typography, etc.)
 * are unused by rerank.ts, so we cast through `unknown` rather than
 * fabricate plausible values. Stage 4 will thread real StyleOutput from a
 * captured pipeline run.
 *
 * The defaults below preserve the original SaaS-shaped mock so existing
 * runs reproduce; the CLI flags let callers override per brief.
 */
const STYLE_OUTPUT = {
  mood: moodOverride ?? ["professional"],
  style: styleOverride ?? ["modern"],
  density: densityOverride ?? "medium",
} as unknown as StyleOutput;

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  // brief is non-undefined here (we exit above when it is missing) but TS
  // narrowing across module-level checks is unreliable, so re-assert.
  const queryText: string = brief as string;

  const client = await getQdrantClient();

  const escapedBrief = queryText.replace(/"/g, '\\"');
  console.log();
  console.log(`> Query: "${escapedBrief}"`);
  console.log(
    `> Style: mood=[${(STYLE_OUTPUT.mood ?? []).join(", ")}] style=[${(STYLE_OUTPUT.style ?? []).join(", ")}] density=${STYLE_OUTPUT.density}`,
  );

  const moodTags = (STYLE_OUTPUT.mood ?? []).join(", ");

  const newFixtureLines: object[] = [];

  const axes = ["descriptive", "usage", "audienceFit"] as const;
  type Axis = (typeof axes)[number];

  // Track picked candidates across slots so the diversity / density signals
  // see real prior picks (mirrors the handler's greedy loop).
  const pickedCandidates: CandidateComponent[] = [];

  for (
    let skeletonIdx = 0;
    skeletonIdx < DEFAULT_SKELETON.length;
    skeletonIdx++
  ) {
    const slot = DEFAULT_SKELETON[skeletonIdx];
    if (captureMode && slot.category === "navigation") continue;
    // Mirrors agents/composer/handler.ts:564 phrasing exactly so debug runs
    // produce the same embeddings the production composer would.
    const slotQuery = `${slot.category} for ${queryText}; mood: ${moodTags}; needs: ${slot.purpose}`;
    const slotVector = await getEmbedding(slotQuery);

    const filter = {
      must: [{ key: "category", match: { value: slot.category } }],
    };

    // The Qdrant SDK exposes options in snake_case (`with_payload`),
    // matching the underlying REST schema — verified against
    // @qdrant/js-client-rest qdrant-client.d.ts. Named-vector search uses
    // `vector: { name, vector }` (NamedVectorStruct).
    const [descriptiveHits, usageHits, audienceFitHits] = await Promise.all(
      axes.map((axis) =>
        client.search("components", {
          vector: { name: axis, vector: slotVector },
          limit: captureMode ? 5 : 3,
          with_payload: true,
          filter,
        }),
      ),
    );

    type Merged = {
      payload: ComponentPayload;
      scoresByAxis: Record<Axis, number>;
    };
    const merged = new Map<string, Merged>();

    const ingest = (
      hits: Awaited<ReturnType<typeof client.search>>,
      axis: Axis,
    ): void => {
      for (const hit of hits) {
        const payload = (hit.payload ?? {}) as ComponentPayload;
        const id = payload.componentId ?? String(hit.id);
        const existing = merged.get(id);
        if (existing) {
          existing.scoresByAxis[axis] = Math.max(
            existing.scoresByAxis[axis],
            hit.score,
          );
        } else {
          merged.set(id, {
            payload,
            scoresByAxis: {
              descriptive: 0,
              usage: 0,
              audienceFit: 0,
              [axis]: hit.score,
            },
          });
        }
      }
    };

    ingest(descriptiveHits, "descriptive");
    ingest(usageHits, "usage");
    ingest(audienceFitHits, "audienceFit");

    type Ranked = {
      id: string;
      name: string;
      score: number;
      axis: Axis;
    };
    const ranked: Ranked[] = [];
    for (const [id, entry] of merged) {
      let bestAxis: Axis = "descriptive";
      let bestScore = entry.scoresByAxis.descriptive;
      for (const axis of axes) {
        if (entry.scoresByAxis[axis] > bestScore) {
          bestScore = entry.scoresByAxis[axis];
          bestAxis = axis;
        }
      }
      ranked.push({
        id,
        name: entry.payload.name ?? "—",
        score: bestScore,
        axis: bestAxis,
      });
    }
    ranked.sort((a, b) => b.score - a.score);
    const topRanked = ranked.slice(0, 3);

    console.log();
    console.log(`## Slot: ${slot.category} (needs: ${slot.purpose})`);
    console.log();
    console.log("| Rank | ID | Name | Score | Axis |");
    console.log("|---|---|---|---|---|");

    topRanked.forEach((row, idx) => {
      const score = row.score.toFixed(4);
      console.log(
        `| ${idx + 1} | ${row.id} | ${row.name} | ${score} | ${row.axis} |`,
      );
    });

    /* -------------------------------------------------------------- */
    /*  Phase D: build CandidateComponent[] and re-rank                */
    /* -------------------------------------------------------------- */

    // Backfill density / imageWeight / style / mood from COMPONENT_METADATA
    // so the re-ranker signals operate on real values rather than sentinels.
    // Mirrors handler.ts::getVectorCandidatesForSlot.
    const slotCandidates: CandidateComponent[] = [];
    for (const [id, entry] of merged) {
      const maxScore = Math.max(
        entry.scoresByAxis.descriptive,
        entry.scoresByAxis.usage,
        entry.scoresByAxis.audienceFit,
      );
      const meta = COMPONENT_METADATA[id];
      slotCandidates.push({
        id,
        name: entry.payload.name ?? "",
        category: entry.payload.category ?? slot.category,
        density: meta?.density ?? "medium",
        layout: "full",
        moodHits: 0,
        styleHits: 0,
        avgPairScore: maxScore,
        vectorScore: maxScore,
        vectorScoresByAxis: entry.scoresByAxis,
        imageWeight: meta?.imageWeight,
        style: meta?.style,
        mood: meta?.mood,
        source: "vector" as const,
      });
    }

    if (slotCandidates.length === 0) continue;

    const reranked = rerankCandidates(
      slotCandidates,
      pickedCandidates,
      STYLE_OUTPUT,
      DEFAULT_RERANK_WEIGHTS,
    );
    const top = reranked[0];
    if (!top) continue;

    if (captureMode && fixturePath) {
      const captureSource: "vector" | "fallback" = slotCandidates.every(
        (c) => c.source === "vector",
      )
        ? "vector"
        : "fallback";

      const fixtureLine = {
        fixtureId: `${captureSlug}__${slot.category}`,
        brief: queryText,
        mood: STYLE_OUTPUT.mood ?? [],
        style: STYLE_OUTPUT.style ?? [],
        density: STYLE_OUTPUT.density ?? "medium",
        slotCategory: slot.category,
        skeletonIndex: skeletonIdx,
        captureSource,
        candidates: slotCandidates,
        previouslyPicked: pickedCandidates.map((c) => c.id),
        pickId: null,
      };

      newFixtureLines.push(fixtureLine);
      console.log(
        `[capture] wrote fixture line for slot=${slot.category} → ${fixturePath}`,
      );
    }

    // _rerankDebug is attached via a type cast inside rerank.ts so it does
    // not leak into the LLM-facing CandidateComponent interface.
    const debug = (
      top as unknown as {
        _rerankDebug?: {
          pairsWithScore: number;
          styleScore: number;
          diversityPenalty: number;
          densityPenalty: number;
          rerankScore: number;
        };
      }
    )._rerankDebug;

    const fmt = (n: number | undefined): string =>
      typeof n === "number" ? n.toFixed(3) : "—";

    console.log();
    console.log(
      `### Re-rank winner: ${top.id}${top.name ? ` — ${top.name}` : ""}`,
    );
    console.log();
    console.log("| Signal           | Score |");
    console.log("|---|---|");
    console.log(`| vectorScore      | ${fmt(top.vectorScore)} |`);
    console.log(`| pairsWithScore   | ${fmt(debug?.pairsWithScore)} |`);
    console.log(`| styleScore       | ${fmt(debug?.styleScore)} |`);
    console.log(`| diversityPenalty | ${fmt(debug?.diversityPenalty)} |`);
    console.log(`| densityPenalty   | ${fmt(debug?.densityPenalty)} |`);
    console.log(`| rerankScore      | ${fmt(debug?.rerankScore)} |`);

    pickedCandidates.push(top);
  }

  if (captureMode && fixturePath) {
    fs.writeFileSync(
      fixturePath,
      newFixtureLines.map((l) => JSON.stringify(l)).join("\n") + "\n",
      "utf-8",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
