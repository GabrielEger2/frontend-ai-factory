/* ------------------------------------------------------------------ */
/*  Composer Post-Check                                                */
/* ------------------------------------------------------------------ */

/**
 * Deterministic post-LLM passes on the selected layout. Five passes:
 *
 *   1. Sequence — navigation must be at index 0; footers at last index.
 *   2. Same-category adjacency — adjacent components with the same category
 *      (excluding navigation/footers) get a same-category swap or, failing
 *      that, the second is dropped.
 *   3. pairsPoorly — adjacent (a, b) where metaLookup[a].pairsPoorly includes
 *      b: try to swap b with a same-category candidate from pairsWell. If no
 *      replacement found, allow the pair and emit a warning.
 *   4. Motion budget — at most one motion-heavy component per page. Any
 *      additional heavy occurrences are swapped for a non-heavy same-category
 *      candidate, or dropped when no candidate is available.
 *   5. Required categories — when `desiredSections` includes "contact", make
 *      sure the lineup contains at least one CTA-category and one
 *      Contact-category component. Missing categories are filled by
 *      injecting the best-fit candidate; the inserts respect the
 *      navigation/footer book-ends from `enforceSequence` (CTA before
 *      Contact, both before footer).
 *
 * Applied only to `output.layouts[output.selectedLayout].components`. Pure
 * functions — no throws, no mutation of inputs.
 */

import type { ComposerOutput } from "../shared/types";
import type { CandidateComponent } from "./prompt";
import { COMPONENT_METADATA } from "../assembler/component-sources.generated";

export type PostCheckResult = {
  result: ComposerOutput;
  warnings: string[];
};

/**
 * Components whose runtime cost (parallax, scroll-driven) is high enough
 * that placing more than one in a page makes the result feel heavy and
 * erodes the storytelling rhythm. Composer is allowed to keep ONE heavy
 * component per page; the post-check trims any extras.
 *
 * IDs match metaLookup keys (component metadata `id`), not PascalCase names.
 */
const HEAVY_COMPONENTS = ["hero-parallax-images-01"];

export function runPairPostCheck(
  output: ComposerOutput,
  candidates: CandidateComponent[],
  metaLookup: typeof COMPONENT_METADATA = COMPONENT_METADATA,
  desiredSections: string[] = [],
): PostCheckResult {
  const warnings: string[] = [];
  const layouts = output.layouts.map((layout, idx) => {
    if (idx !== output.selectedLayout) return layout;
    let components = [...layout.components];

    // Step 1: sequence
    components = enforceSequence(components, metaLookup, warnings);

    // Step 2: same-category adjacency
    components = fixSameCategoryAdjacency(
      components,
      candidates,
      metaLookup,
      warnings,
    );

    // Step 3: pairsPoorly
    components = fixPairsPoorly(components, candidates, metaLookup, warnings);

    // Step 4: motion budget — keep at most one motion-heavy component.
    components = enforceMotionBudget(
      components,
      candidates,
      metaLookup,
      warnings,
    );

    // Step 5: required categories — backfill CTA + Contact when the buyer
    // asked for a contact section. Runs after motion-budget so any drops
    // in step 4 can still be filled here.
    components = enforceRequiredCategories(
      components,
      candidates,
      metaLookup,
      desiredSections,
      warnings,
    );

    return { ...layout, components };
  });

  return {
    result: { ...output, layouts },
    warnings,
  };
}

function enforceSequence(
  components: string[],
  metaLookup: typeof COMPONENT_METADATA,
  warnings: string[],
): string[] {
  const result = [...components];
  // Move navigation to index 0
  const navIdx = result.findIndex(
    (id) => metaLookup[id]?.category === "navigation",
  );
  if (navIdx > 0) {
    const [nav] = result.splice(navIdx, 1);
    result.unshift(nav);
    warnings.push(`Moved navigation component "${nav}" to index 0`);
  }
  // Move footers to last
  const footerIdx = result.findIndex(
    (id) => metaLookup[id]?.category === "footers",
  );
  if (footerIdx >= 0 && footerIdx !== result.length - 1) {
    const [footer] = result.splice(footerIdx, 1);
    result.push(footer);
    warnings.push(`Moved footers component "${footer}" to last index`);
  }
  return result;
}

function fixSameCategoryAdjacency(
  components: string[],
  candidates: CandidateComponent[],
  metaLookup: typeof COMPONENT_METADATA,
  warnings: string[],
): string[] {
  const result = [...components];
  for (let i = 0; i < result.length - 1; i++) {
    const a = result[i];
    const b = result[i + 1];
    const catA = metaLookup[a]?.category;
    const catB = metaLookup[b]?.category;
    if (!catA || !catB) continue;
    if (catA === "navigation" || catA === "footers") continue;
    if (catB === "navigation" || catB === "footers") continue;
    if (catA !== catB) continue;
    // Same-category adjacency. Find a swap candidate.
    const replacement = candidates.find(
      (c) =>
        c.id !== b &&
        c.id !== a &&
        !result.includes(c.id) &&
        metaLookup[c.id]?.category === catB &&
        // doesn't create new adjacency
        (i + 2 >= result.length ||
          metaLookup[result[i + 2]]?.category !== catB),
    );
    if (replacement) {
      result[i + 1] = replacement.id;
      warnings.push(
        `Swapped same-category adjacent "${b}" with "${replacement.id}" at index ${i + 1}`,
      );
    } else {
      result.splice(i + 1, 1);
      warnings.push(
        `Dropped same-category adjacent "${b}" at index ${i + 1} (no swap candidate)`,
      );
      i--; // re-check at the same position
    }
  }
  return result;
}

function fixPairsPoorly(
  components: string[],
  candidates: CandidateComponent[],
  metaLookup: typeof COMPONENT_METADATA,
  warnings: string[],
): string[] {
  const result = [...components];
  for (let i = 0; i < result.length - 1; i++) {
    const a = result[i];
    const b = result[i + 1];
    const metaA = metaLookup[a];
    if (!metaA?.pairsPoorly?.includes(b)) continue;
    // Try to find a replacement in pairsWell, same category as b
    const catB = metaLookup[b]?.category;
    const replacement = candidates.find(
      (c) =>
        c.id !== b &&
        c.id !== a &&
        !result.includes(c.id) &&
        metaA.pairsWell?.includes(c.id) &&
        metaLookup[c.id]?.category === catB,
    );
    if (replacement) {
      result[i + 1] = replacement.id;
      warnings.push(
        `Swapped pairsPoorly adjacent "${b}" with "${replacement.id}" (paired well with "${a}")`,
      );
    } else {
      warnings.push(
        `Bad pair "${a}" -> "${b}" (in pairsPoorly), no swap candidate`,
      );
    }
  }
  return result;
}

function enforceMotionBudget(
  components: string[],
  candidates: CandidateComponent[],
  metaLookup: typeof COMPONENT_METADATA,
  warnings: string[],
): string[] {
  // Budget: 1 motion-heavy component per page. Keep the FIRST heavy
  // occurrence; for each subsequent heavy, swap with a same-category
  // non-heavy candidate or drop it.
  const result = [...components];
  let seenHeavy = false;
  for (let i = 0; i < result.length; i++) {
    const id = result[i];
    if (!HEAVY_COMPONENTS.includes(id)) continue;
    if (!seenHeavy) {
      seenHeavy = true;
      continue;
    }
    // This is the 2nd+ heavy component. Try to swap with a same-category
    // non-heavy candidate not already in the layout.
    const catId = metaLookup[id]?.category;
    const replacement = candidates.find(
      (c) =>
        c.id !== id &&
        !result.includes(c.id) &&
        !HEAVY_COMPONENTS.includes(c.id) &&
        metaLookup[c.id]?.category === catId,
    );
    if (replacement) {
      result[i] = replacement.id;
      warnings.push(
        `Swapped motion-heavy "${id}" with "${replacement.id}" at index ${i} (motion budget = 1 per page)`,
      );
    } else {
      result.splice(i, 1);
      warnings.push(
        `Dropped motion-heavy "${id}" at index ${i} (motion budget = 1 per page, no swap candidate)`,
      );
      i--; // re-check at the same position
    }
  }
  return result;
}

function enforceRequiredCategories(
  components: string[],
  candidates: CandidateComponent[],
  metaLookup: typeof COMPONENT_METADATA,
  desiredSections: string[],
  warnings: string[],
): string[] {
  // Only intervene when the buyer asked for a contact section. The
  // `enforceDesiredSections` validator in handler.ts already throws if any
  // desired category is entirely missing; this pass is the gentler twin —
  // it specifically guarantees the CTA + Contact pairing that the user-side
  // brief calls out, by injecting fallbacks rather than rejecting.
  const wantsContact = desiredSections.some(
    (s) => s.toLowerCase() === "contact",
  );
  if (!wantsContact) return components;

  const result = [...components];
  const requiredCategories: Array<"cta" | "contact"> = ["cta", "contact"];

  for (const category of requiredCategories) {
    const hasCategory = result.some(
      (id) => metaLookup[id]?.category === category,
    );
    if (hasCategory) continue;

    const replacement = pickBestCandidate(category, result, candidates);
    if (!replacement) {
      warnings.push(
        `composer fallback: no candidate available to inject category "${category}" (desiredSections requires it)`,
      );
      continue;
    }

    const insertIdx = chooseInsertIndex(category, result, metaLookup);
    result.splice(insertIdx, 0, replacement.id);
    warnings.push(
      `composer fallback: injected ${replacement.id} (category=${category}) because desiredSections requires it`,
    );
  }

  return result;
}

/**
 * Pick the candidate from `pool` whose mood/style overlap with the rest of
 * the lineup is highest. We approximate "fit" with the candidate's own
 * moodHits + styleHits scores (already segment-relative because they were
 * produced by the graph or fallback ranker against this run's segment).
 */
function pickBestCandidate(
  category: string,
  current: string[],
  candidates: CandidateComponent[],
): CandidateComponent | undefined {
  const eligible = candidates.filter(
    (c) => c.category === category && !current.includes(c.id),
  );
  if (eligible.length === 0) return undefined;
  // Highest moodHits + styleHits wins; ties broken by avgPairScore.
  return [...eligible].sort((a, b) => {
    const fitA = a.moodHits + a.styleHits;
    const fitB = b.moodHits + b.styleHits;
    if (fitA !== fitB) return fitB - fitA;
    return b.avgPairScore - a.avgPairScore;
  })[0];
}

/**
 * Insert position respects the navbar/footer book-ends already enforced by
 * `enforceSequence`:
 *   - CTA goes near the end but before any contact + footer.
 *   - Contact goes after CTA but before the footer.
 *
 * If no footer is present, insert at end.
 */
function chooseInsertIndex(
  category: "cta" | "contact",
  components: string[],
  metaLookup: typeof COMPONENT_METADATA,
): number {
  const footerIdx = components.findIndex(
    (id) => metaLookup[id]?.category === "footers",
  );
  const lastSafeIdx = footerIdx >= 0 ? footerIdx : components.length;

  if (category === "cta") {
    // Place CTA right before any existing contact, else right before the
    // footer (or at end).
    const contactIdx = components.findIndex(
      (id) => metaLookup[id]?.category === "contact",
    );
    if (contactIdx >= 0) return contactIdx;
    return lastSafeIdx;
  }

  // category === "contact" — sit after the CTA when one exists, else just
  // before the footer.
  const ctaIdx = components.findIndex(
    (id) => metaLookup[id]?.category === "cta",
  );
  if (ctaIdx >= 0) {
    return Math.min(ctaIdx + 1, lastSafeIdx);
  }
  return lastSafeIdx;
}
