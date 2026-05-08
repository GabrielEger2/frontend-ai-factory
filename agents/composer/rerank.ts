import type { CandidateComponent } from "./prompt";
import type { StyleOutput } from "../shared/types";
import { COMPONENT_METADATA } from "../assembler/component-sources.generated";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

// Tuned 2026-05-08 from grid sweep over 53 labeled fixtures with the new
// audienceFit signal added (agents/eval/reports/2026-05-08T19-32-32-183Z.md).
// Best global combo lifted agreement from 0.768 to 0.800 vs the prior best.
// audienceFit (Qdrant per-axis cosine) carries the signal; pairsWith and
// styleOverlap fall to 0/0.25 respectively because audienceFit subsumes
// most of the segment/vertical-fit work the style filter was doing.
// verticalFit added 2026-05-08 (Phase 3, feat/composer-vertical-affinity). Initial weight 0.5 per context.md decision B3.
const WEIGHT_PAIRS_WITH = 0;
const WEIGHT_STYLE_OVERLAP = 0.15;
const WEIGHT_DIVERSITY = 0;
const WEIGHT_DENSITY = 0;
const WEIGHT_AUDIENCE_FIT = 0.5;
const WEIGHT_VERTICAL_FIT = 0.5;
const PAIRS_WITH_BOOST = 0.3;
const PAIRS_WITH_DEMOTE = 0.3;
const IMAGE_WEIGHT_HEAVY_THRESHOLD = 0.3;
const DIVERSITY_REPEAT_THRESHOLD = 3;

/* ------------------------------------------------------------------ */
/*  Internal scorers (NOT exported)                                    */
/* ------------------------------------------------------------------ */

/**
 * PAIRS_WITH adjustment for `candidate` against the IDs already picked.
 * For each picked ID, look up its `pairsWell` / `pairsPoorly` arrays in
 * COMPONENT_METADATA: a hit on `pairsWell` adds +PAIRS_WITH_BOOST, a hit
 * on `pairsPoorly` subtracts PAIRS_WITH_DEMOTE. Returns the raw additive
 * adjustment — clamping happens in the combiner once it is folded into
 * `avgPairScore`.
 */
function scorePairsWith(
  candidate: CandidateComponent,
  pickedIds: string[],
): number {
  let adjustment = 0;
  for (const pickedId of pickedIds) {
    const pickedMeta = COMPONENT_METADATA[pickedId];
    const pairsWell = pickedMeta?.pairsWell ?? [];
    const pairsPoorly = pickedMeta?.pairsPoorly ?? [];
    if (pairsWell.includes(candidate.id)) adjustment += PAIRS_WITH_BOOST;
    if (pairsPoorly.includes(candidate.id)) adjustment -= PAIRS_WITH_DEMOTE;
  }
  return adjustment;
}

/**
 * Style + mood overlap between candidate metadata and the approved
 * StyleOutput. Each axis (style, mood) is scored as
 * intersection / max(a.length, b.length, 1), then the two ratios are
 * averaged. Range 0..1. Empty arrays on either side make that sub-score 0.
 */
function scoreStyleOverlap(
  candidate: CandidateComponent,
  styleOutput: StyleOutput,
): number {
  const candidateStyle = candidate.style ?? [];
  const candidateMood = candidate.mood ?? [];
  const targetStyle = styleOutput.style ?? [];
  const targetMood = styleOutput.mood ?? [];

  const styleIntersect = candidateStyle.filter((s) =>
    targetStyle.includes(s as (typeof targetStyle)[number]),
  ).length;
  const moodIntersect = candidateMood.filter((m) =>
    targetMood.includes(m as (typeof targetMood)[number]),
  ).length;

  const styleRatio =
    styleIntersect / Math.max(candidateStyle.length, targetStyle.length, 1);
  const moodRatio =
    moodIntersect / Math.max(candidateMood.length, targetMood.length, 1);

  return (styleRatio + moodRatio) / 2;
}

/**
 * Diversity penalty. Merge candidate.style[] + candidate.mood[] tags;
 * count how many of those tags already appear at >= DIVERSITY_REPEAT_THRESHOLD
 * in the picked frequency map. Penalty = repeatCount / max(allTags.length, 1),
 * clamped to [0, 1]. High penalty = candidate would worsen diversity.
 */
function scoreDiversityPenalty(
  candidate: CandidateComponent,
  pickedTagFrequencies: Map<string, number>,
): number {
  const allTags = [...(candidate.style ?? []), ...(candidate.mood ?? [])];
  let repeatCount = 0;
  for (const tag of allTags) {
    if ((pickedTagFrequencies.get(tag) ?? 0) >= DIVERSITY_REPEAT_THRESHOLD) {
      repeatCount += 1;
    }
  }
  return Math.min(1, repeatCount / Math.max(allTags.length, 1));
}

/**
 * Density-balance PENALTY. Returns 0..1 where 0 = no penalty (good balance)
 * and 1 = max penalty (same density AND both image-heavy). The combiner
 * SUBTRACTS this from the total — high output = bad balance = down-rank.
 *
 * +0.5 if candidate.density === prevPick.density (stacking the same density
 * hurts visual rhythm).
 * +0.5 if both candidate and prevPick have imageWeight >= 0.3 (two
 * image-heavy sections in a row).
 *
 * Naming reads as "balance" (the desired outcome); the scalar returned is
 * the penalty against UNbalance. If there is no previous pick, returns 0.
 */
function scoreDensityBalance(
  candidate: CandidateComponent,
  pickedCandidates: CandidateComponent[],
): number {
  const prevPick = pickedCandidates[pickedCandidates.length - 1];
  if (!prevPick) return 0;

  let penalty = 0;
  if (candidate.density === prevPick.density) {
    penalty += 0.5;
  }
  const candidateImageHeavy =
    (candidate.imageWeight ?? 0) >= IMAGE_WEIGHT_HEAVY_THRESHOLD;
  const prevImageHeavy =
    (prevPick.imageWeight ?? 0) >= IMAGE_WEIGHT_HEAVY_THRESHOLD;
  if (candidateImageHeavy && prevImageHeavy) {
    penalty += 0.5;
  }
  return Math.max(0, Math.min(1, penalty));
}

/**
 * Audience-fit cosine score from Qdrant retrieval. Reads the
 * `audienceFit` axis off `vectorScoresByAxis`, which is populated upstream
 * by the composer handler's vector retrieval (and by query-vectors.ts when
 * exercising the script). Range 0..1 in practice.
 *
 * Returns 0 when the field is absent — this happens for fallback
 * candidates produced by `getDynamoFallbackCandidates`, which never went
 * through Qdrant. Treating "no signal" as 0 is the correct neutral default
 * for a positive additive contribution; do not warn or special-case.
 */
function scoreAudienceFit(candidate: CandidateComponent): number {
  return candidate.vectorScoresByAxis?.audienceFit ?? 0;
}

function scoreVerticalAffinity(
  candidate: { vertical?: string[] },
  briefVerticals: string[],
): number {
  const compVertical = candidate.vertical;
  if (!compVertical || compVertical.length === 0) return 0.0;
  if (!briefVerticals || briefVerticals.length === 0) return 0.0;
  if (compVertical.some((v) => briefVerticals.includes(v))) return 1.0;
  return -1.0;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export interface RerankWeights {
  pairsWith: number;
  styleOverlap: number;
  diversity: number;
  density: number;
  audienceFit: number;
  verticalFit: number;
}

export const DEFAULT_RERANK_WEIGHTS: RerankWeights = {
  pairsWith: WEIGHT_PAIRS_WITH,
  styleOverlap: WEIGHT_STYLE_OVERLAP,
  diversity: WEIGHT_DIVERSITY,
  density: WEIGHT_DENSITY,
  audienceFit: WEIGHT_AUDIENCE_FIT,
  verticalFit: WEIGHT_VERTICAL_FIT,
};

/**
 * Five-signal greedy re-ranker. For each candidate in `slotCandidates`,
 * computes:
 *   - pairsWithScore    = clamp(avgPairScore + PAIRS_WITH adjustment, 0, 1)
 *   - styleScore        = scoreStyleOverlap(candidate, styleOutput)        [0..1]
 *   - diversityPenalty  = scoreDiversityPenalty(candidate, pickedTagFreq)  [0..1]
 *   - densityPenalty    = scoreDensityBalance(candidate, pickedCandidates) [0..1]
 *   - audienceFitScore  = scoreAudienceFit(candidate)                      [0..1]
 *
 * Combined as:
 *   rerankScore = w.pairsWith    * pairsWithScore
 *               + w.styleOverlap * styleScore
 *               - w.diversity    * diversityPenalty
 *               - w.density      * densityPenalty
 *               + w.audienceFit  * audienceFitScore
 *
 * Returns a freshly sorted array (descending by rerankScore). Pure
 * function — input arrays are not mutated; operates on shallow copies.
 * `avgPairScore` is preserved as the raw cosine score; the combined
 * score and per-signal contributions are attached as `_rerankDebug` via
 * a type cast so they do not leak into the LLM-facing CandidateComponent
 * interface.
 */
export function rerankCandidates(
  slotCandidates: CandidateComponent[],
  pickedCandidates: CandidateComponent[],
  styleOutput: StyleOutput,
  weights: RerankWeights,
): CandidateComponent[] {
  // Build merged tag-frequency map from picked candidates' style[] + mood[].
  const pickedTagFrequencies = new Map<string, number>();
  for (const picked of pickedCandidates) {
    const tags = [...(picked.style ?? []), ...(picked.mood ?? [])];
    for (const tag of tags) {
      pickedTagFrequencies.set(tag, (pickedTagFrequencies.get(tag) ?? 0) + 1);
    }
  }

  const pickedIds = pickedCandidates.map((c) => c.id);
  const briefVerticals = styleOutput.vertical ?? [];

  const scored = slotCandidates.map((candidate) => {
    const copy: CandidateComponent = { ...candidate };

    const rawPairsAdjustment = scorePairsWith(copy, pickedIds);
    const pairsWithScore = Math.max(
      0,
      Math.min(1, copy.avgPairScore + rawPairsAdjustment),
    );
    const styleScore = scoreStyleOverlap(copy, styleOutput);
    const diversityPenalty = scoreDiversityPenalty(copy, pickedTagFrequencies);
    const densityPenalty = scoreDensityBalance(copy, pickedCandidates);
    const audienceFitScore = scoreAudienceFit(copy);
    const verticalAffinityScore = scoreVerticalAffinity(copy, briefVerticals);

    const rerankScore =
      weights.pairsWith * pairsWithScore +
      weights.styleOverlap * styleScore -
      weights.diversity * diversityPenalty -
      weights.density * densityPenalty +
      weights.audienceFit * audienceFitScore +
      weights.verticalFit * verticalAffinityScore;

    // Attach debug payload via type cast so CandidateComponent stays clean
    // (no debug fields surface in the LLM prompt candidate table).
    (copy as any)._rerankDebug = {
      pairsWithScore,
      styleScore,
      diversityPenalty,
      densityPenalty,
      audienceFitScore,
      verticalAffinityScore,
      rerankScore,
    };

    return { copy, rerankScore };
  });

  scored.sort((a, b) => b.rerankScore - a.rerankScore);
  return scored.map((s) => s.copy);
}
