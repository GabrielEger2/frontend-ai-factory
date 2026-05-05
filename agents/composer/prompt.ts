import { ComposerAgentInput } from "./types";

/* ------------------------------------------------------------------ */
/*  Candidate Component (graph query or fallback result)               */
/* ------------------------------------------------------------------ */

export interface CandidateComponent {
  id: string;
  name: string;
  category: string;
  density: string;
  layout: string;
  moodHits: number;
  styleHits: number;
  avgPairScore: number;
  imageWeight?: number;
  source?: "graph" | "vector" | "graph+vector";
  vectorScore?: number;
  variants?: Array<{
    id: string;
    name: string;
    density: string;
    colorMode: string;
  }>;
}

export interface PairMatrixEntry {
  a: string;
  b: string;
  score: number;
}

/* ------------------------------------------------------------------ */
/*  System Prompt                                                      */
/* ------------------------------------------------------------------ */

export function buildSystemPrompt(): string {
  return `You are a senior website layout composer. Given a list of candidate components with compatibility scores, compose 3 page layouts ranked by overall quality.

## Your Job

Select and order components into cohesive page layouts. Each layout must have 5-8 components (sections) in a logical page flow.

## Page Flow Rules

Follow this section order strictly:
1. Navbar first (if a navbar component is available)
2. Hero section
3. Features / content sections (grid, cards, icon lists, image+text, stats, etc.)
4. CTA (call-to-action)
5. Testimonials (if available)
6. Contact section
7. Footer last (if a footer component is available)

Components should flow naturally from top to bottom. A visitor should understand the brand, see value propositions, then be guided to act.

## Visual Variety Rules

- NEVER place 3 or more consecutive components with the same density (low/medium/high).
- NEVER place 3 or more consecutive components with the same layout type.
- Alternate between different visual rhythms to maintain engagement.

## Segment Appropriateness

Conservative segments (law-firm, accounting, dental-clinic, consulting, health-clinic) should:
- Avoid playful/bold components even if they score well on other metrics.
- Prefer professional, calm, and trustworthy tones.
- Use medium or high density layouts.

Creative/casual segments (pet-shop, restaurant, bakery, gym, clothing-store) can:
- Use playful, bold, and energetic components.
- Vary density more freely.

## Segment-fit guidance

Segments {B2B local distributor, commodity supplier, food/grocery} should PREFER:
  - Split heroes (HeroSplitImage)
  - Grid feature lists
  - Simple banner CTAs
  - Contact forms / location info
And should AVOID:
  - Editorial scroll-driven layouts
  - Heavy parallax / sticky-card narratives

## PAIRS_WITH Adjacency

A pair compatibility matrix is provided in the user prompt when available. Use the explicit pair scores to evaluate adjacency when placing components next to each other. A score near 1.0 means excellent adjacency; near 0.0 means poor adjacency. When no pair score is listed for a pair, treat it as neutral (0.5). Prefer placing consecutive components with pair scores >= 0.6.

## Scoring

Rate each layout on a 0-1 scale based on:
- Page flow correctness (40%)
- Visual variety and rhythm (20%)
- Segment appropriateness (20%)
- Component compatibility / PAIRS_WITH adjacency (20%)

## Retrieval Sources

Candidates come from multiple retrieval sources:
- **graph** — matched via Neo4j mood/style/segment graph (MoodHits, StyleHits, AvgPairScore reflect signal strength)
- **vector** — matched via semantic similarity to the project brief (VectorScore reflects cosine similarity; MoodHits/StyleHits are 0)
- **graph+vector** — appeared in both sources (highest confidence; carries both graph scores and VectorScore)

When ranking candidates, weigh both graph signal and semantic similarity. graph+vector candidates represent the strongest alignment.

Notes:
- For "vector" rows, Density and Layout show sentinel defaults ("medium" / "full") — they do not reflect measured component values. Weigh component fit primarily by category and VectorScore.
- The "graph" per-candidate label covers both Neo4j graph traversal and the DynamoDB tag-score fallback path. The top-level "source" field separately reports whether the graph itself was healthy ("graph" or "fallback").

## Output Format

Return EXACTLY 3 layouts ranked by overall score (highest first). Output ONLY valid JSON matching this schema:

{
  "layouts": [
    {
      "components": ["component-id-1", "component-id-2", ...],
      "score": 0.92,
      "rationale": "Brief explanation of why this layout works for the segment"
    },
    ...
  ],
  "selectedLayout": 0,
  "source": "graph"
}

## Rules

1. Output ONLY valid JSON. No explanations, no markdown, no comments outside the JSON.
2. Each layout must have between 5 and 8 components.
3. "selectedLayout" is always 0 (the highest-scored layout).
4. "source" will be provided to you — use exactly the value given ("graph", "fallback", or "hybrid").
5. Component IDs in the output must exactly match the IDs from the candidate list.
6. Never invent component IDs that are not in the candidate list.
7. Return exactly 3 layouts.
8. If desiredSections includes 'contact', include at least one CTA component and one Contact component in the lineup.

## Variant Selection

Some components have variants listed in the candidate table.
When a component has variants, optionally select the most appropriate one.
Output variant selections in "variantSelections" as componentId -> variantId map.
If no variant is better than default, omit from variantSelections.`;
}

/* ------------------------------------------------------------------ */
/*  User Prompt                                                        */
/* ------------------------------------------------------------------ */

export function buildUserPrompt(
  input: ComposerAgentInput,
  candidates: CandidateComponent[],
  source: "graph" | "fallback" | "hybrid",
  pairMatrix: PairMatrixEntry[],
): string {
  const companySection = [
    "## Company",
    "",
    `- **Name:** ${input.companyName}`,
    `- **Segment:** ${input.segment}`,
    `- **Description:** ${input.description}`,
  ].join("\n");

  const styleSection = [
    "## Approved Style",
    "",
    `- **Mood tags:** ${input.styleOutput.mood.join(", ")}`,
    `- **Style tags:** ${input.styleOutput.style.join(", ")}`,
    `- **Density:** ${input.styleOutput.density}`,
  ].join("\n");

  // Buyer-supplied tone tags refine the AI inference. When present, treat
  // them as authoritative signal alongside the approved Style mood/style.
  const brandToneSection =
    input.brandToneKeywords && input.brandToneKeywords.length > 0
      ? [
          "## Buyer Brand Tone Keywords",
          "",
          `The seller (on the buyer's behalf) supplied these tone tags: **${input.brandToneKeywords.join(", ")}**.`,
          "Treat them as an explicit signal about how the brand should feel — favor components whose mood/style metadata aligns with these keywords.",
        ].join("\n")
      : "";

  // Buyer objectives shape ordering / CTA placement. Hints, not hard rules.
  const objectivesSection =
    input.objectives && input.objectives.length > 0
      ? [
          "## Buyer Objectives",
          "",
          `The buyer wants the site to accomplish: **${input.objectives.join(", ")}**.`,
          "- `more_leads`, `drive_whatsapp`, `drive_purchases` → place a CTA earlier in the flow.",
          "- `showcase_portfolio`, `brand_awareness` → favor visual/editorial sections higher up.",
          "- `support_inquiries`, `increase_signups` → ensure a contact/form section is present and accessible.",
          "Use these as soft hints when ordering components.",
        ].join("\n")
      : "";

  // HARD RULES from the section selector. These come from the buyer intake
  // form and MUST be honored — the Composer handler enforces them with a
  // deterministic post-process (see enforceDesiredSections).
  const desiredSectionsSection =
    input.desiredSections && input.desiredSections.length > 0
      ? [
          "## REQUIRED Sections (hard rule)",
          "",
          `The selected layout MUST include at least one component from each of these categories: **${input.desiredSections.join(", ")}**.`,
          "Failure to include all required categories will cause the layout to be rejected.",
        ].join("\n")
      : "";

  const candidateRows = candidates
    .map((c) => {
      const variantCol =
        c.variants && c.variants.length > 0
          ? c.variants
              .map((v) => `${v.id}(${v.colorMode}/${v.density})`)
              .join(", ")
          : "\u2014";
      const vectorScoreCol =
        c.vectorScore !== undefined ? c.vectorScore.toFixed(3) : "\u2014";
      const sourceCol = c.source ?? "graph";
      return `| ${c.id} | ${c.name} | ${c.category} | ${c.density} | ${c.layout} | ${c.moodHits} | ${c.styleHits} | ${c.avgPairScore.toFixed(2)} | ${vectorScoreCol} | ${sourceCol} | ${variantCol} |`;
    })
    .join("\n");

  const candidateSection = [
    "## Candidate Components",
    "",
    "| ID | Name | Category | Density | Layout | MoodHits | StyleHits | AvgPairScore | VectorScore | Source | Variants |",
    "|---|---|---|---|---|---|---|---|---|---|---|",
    candidateRows,
  ].join("\n");

  const pairMatrixSection =
    pairMatrix.length > 0
      ? [
          "## Pair Compatibility Matrix",
          "",
          "Use these PAIRS_WITH scores when deciding which components to place adjacent.",
          "Higher score = better adjacency.",
          "",
          "| Component A | Component B | Score |",
          "|---|---|---|",
          ...pairMatrix.map(
            (p) => `| ${p.a} | ${p.b} | ${p.score.toFixed(2)} |`,
          ),
        ].join("\n")
      : "";

  const sourceNote = `\n## Source\n\nSet "source" to "${source}" in your output. Use "hybrid" when candidates from multiple retrieval sources are present.\n`;

  return [
    companySection,
    "",
    styleSection,
    "",
    brandToneSection,
    "",
    objectivesSection,
    "",
    desiredSectionsSection,
    "",
    candidateSection,
    "",
    pairMatrixSection,
    "",
    sourceNote,
    "Compose 3 ranked page layouts from these candidates. Output valid JSON only.",
  ]
    .filter(Boolean)
    .join("\n");
}
