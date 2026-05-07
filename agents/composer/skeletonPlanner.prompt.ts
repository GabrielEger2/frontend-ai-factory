import { ComposerAgentInput } from "./types";

/* ------------------------------------------------------------------ */
/*  System Prompt                                                      */
/* ------------------------------------------------------------------ */

export function buildSkeletonSystemPrompt(): string {
  return `You are a senior web information architect. Your task is to plan a page skeleton for a small-business website given a company brief, research output, and a chosen visual style.

## Your Job

Produce an ordered list of page sections (a "skeleton") that another agent will use to retrieve concrete components, one per slot. Each slot represents one vertical band of the page reading top-to-bottom.

## Rules

1. **Categories are CLOSED.** Each slot's \`category\` MUST be exactly one of these 13 canonical values — no synonyms, no plural forms, no novel categories:

   \`hero | testimonial | footer | cta | faq | contact | navigation | stats | carousel | content | pricing | team | gallery\`

2. **Page reads top-to-bottom.** Order the slots in the order they will appear on the rendered page. A typical order is:
   \`navigation\` → \`hero\` → body sections (\`stats\`, \`content\`, \`gallery\`, \`team\`, \`pricing\`, \`testimonial\`, \`carousel\`, \`faq\`) → \`cta\` → \`footer\`.

3. **Slot count: 5 to 9.** Fewer than 5 produces a thin page; more than 9 makes the page noisy. Pick a count that fits the brief.

4. **Per-slot fields.** Every slot is a JSON object with:
   - \`category\` (required) — one of the 12 canonical values above.
   - \`purpose\` (required) — a short phrase describing what the section accomplishes for this specific company (e.g. "showcase signature dishes", "social proof from happy clients", "lead-capture for free consultation"). This phrase becomes the search query for component retrieval, so make it concrete and segment-aware.
   - \`notes\` (optional) — a short hint about content emphasis, mood, or imagery direction.

5. **No duplicate \`navigation\` or \`footer\`.** Use each at most once.

6. **Adapt the count and mix to the brief.** Service businesses lean toward FAQ + CTA; portfolios lean toward carousel + gallery; stores lean toward pricing + stats; about/institutional pages lean toward content + testimonial + team.

## Output Schema

Return a RAW JSON ARRAY (no markdown fences, no surrounding prose, no \`\`\`json wrapper). The array MUST validate against this shape:

[
  {
    "category": "<one of: hero | testimonial | footer | cta | faq | contact | navigation | stats | carousel | content | pricing | team | gallery>",
    "purpose": "<short phrase describing what this section accomplishes for this brand>",
    "notes": "<optional short hint>"
  }
]

Output ONLY the JSON array. No explanations, no markdown, no comments, no code fences.`;
}

/* ------------------------------------------------------------------ */
/*  User Prompt                                                        */
/* ------------------------------------------------------------------ */

export function buildSkeletonUserPrompt(
  input: ComposerAgentInput,
  sellerHint?: string,
): string {
  const companySection = [
    "## Company Brief",
    "",
    `- **Company Name:** ${input.companyName}`,
    `- **Segment:** ${input.segment}`,
    `- **Description:** ${input.description}`,
  ].join("\n");

  const researchSection = [
    "## Research Output",
    "",
    `- **Refined Segment:** ${input.researchOutput.segment}`,
    `- **Target Audience:** ${input.researchOutput.targetAudience}`,
    `- **Tone Keywords:** ${input.researchOutput.toneKeywords.join(", ")}`,
  ].join("\n");

  const styleParts: string[] = [
    "## Style Output",
    "",
    `- **Mood:** ${input.styleOutput.mood.join(", ")}`,
    `- **Style:** ${input.styleOutput.style.join(", ")}`,
    `- **Density:** ${input.styleOutput.density}`,
  ];
  if (input.styleOutput.imageryDensity) {
    styleParts.push(
      `- **Imagery Density:** ${input.styleOutput.imageryDensity}`,
    );
  }
  const styleSection = styleParts.join("\n");

  const pageTypeSection = sellerHint
    ? [
        "## Page Type Hint",
        "",
        `The seller has indicated this should be a **${sellerHint}** page. Adapt the skeleton mix accordingly (e.g. \`store\` favors pricing + stats; \`portfolio\` favors carousel + gallery; \`services\` favors content + faq + cta; \`about\` favors content + testimonial + team; \`landing\` favors hero + cta-driven flow).`,
      ].join("\n")
    : "";

  return [
    companySection,
    "",
    researchSection,
    "",
    styleSection,
    "",
    pageTypeSection,
    "",
    "Based on the company brief, research, and style above, return the page skeleton as a raw JSON array of 5-9 slots, ordered top-to-bottom.",
  ]
    .filter(Boolean)
    .join("\n");
}
