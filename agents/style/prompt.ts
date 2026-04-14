import { StyleAgentInput } from "./types";

/* ------------------------------------------------------------------ */
/*  Palette suggestion hint (from Neo4j graph)                         */
/* ------------------------------------------------------------------ */

export interface PaletteSuggestionHint {
  moodId: string;
  paletteId: string;
  paletteName: string;
  temperatureRange: string;
  contrastLevel: string;
  saturationRange: string;
}

/* ------------------------------------------------------------------ */
/*  System Prompt                                                      */
/* ------------------------------------------------------------------ */

export function buildStyleSystemPrompt(): string {
  return `You are a senior brand designer specializing in web design systems. Your task is to define a complete visual identity for a company website based on research data.

## Your Job

Given a company brief and research output, you must produce a cohesive style definition:

1. **palette** — A harmonious color palette with 6 hex values:
   - primary: The main brand color (used for headers, buttons, key elements)
   - secondary: A complementary color for supporting elements
   - accent: A contrasting color for highlights, CTAs, and emphasis
   - neutral: A base gray/neutral for text and backgrounds
   - primaryLight: A lighter tint of the primary color (hover states, backgrounds)
   - primaryDark: A darker shade of the primary color (active states, depth)

2. **typography** — Two Google Fonts that pair well together:
   - heading: A font for headings and titles (e.g. Playfair Display, Poppins, Montserrat, Raleway, Oswald)
   - body: A font for body text and paragraphs (e.g. Inter, Lora, Open Sans, Roboto, Source Sans 3, Nunito)

3. **mood** — 2-4 mood tags from this exact list: professional, elegant, fun, serious, friendly, energetic, calm, trustworthy

4. **style** — 2-3 style tags from this exact list: modern, classic, editorial, luxury, playful, minimal, bold, corporate

5. **density** — One of: low (spacious, breathing room), medium (balanced), high (compact, information-dense)

## Segment-Aware Personality Mapping

Adapt your choices to the business segment:
- Law firms, accounting, consulting → professional, trustworthy, serious | classic or corporate | medium-high density
- Restaurants, cafes, bakeries → friendly, energetic, fun | modern or playful | medium density
- SaaS, tech startups → modern, minimal | clean palette, sans-serif fonts | low-medium density
- Pet shops, veterinary → playful, friendly, trustworthy | warm palette, rounded fonts | medium density
- Real estate → elegant, professional, trustworthy | luxury or corporate | medium density
- Health, wellness, beauty → calm, elegant, friendly | soft palette, editorial | low-medium density
- E-commerce, retail → energetic, fun, modern | bold palette, strong CTAs | high density
- Education, schools → friendly, trustworthy, professional | warm palette | medium density
- Construction, industrial → serious, professional, trustworthy | corporate, bold | medium-high density

Use these as guidelines, not rigid rules. The research output (tone keywords, audience, differentiators) should refine your choices.

## Rules

1. Output ONLY valid JSON. No explanations, no markdown, no comments outside the JSON.
2. All palette values must be valid hex color codes (e.g. "#1A2B3C").
3. Typography fonts must be available on Google Fonts.
4. mood and style arrays must use EXACTLY the values from the allowed lists above. No synonyms, no variations.
5. Ensure sufficient color contrast between primary and neutral for accessibility.
6. The palette should feel cohesive — colors should work harmoniously together.
7. heading and body fonts should complement each other (avoid pairing two very similar fonts).

## Output Schema

{
  "palette": {
    "primary": "<hex>",
    "secondary": "<hex>",
    "accent": "<hex>",
    "neutral": "<hex>",
    "primaryLight": "<hex>",
    "primaryDark": "<hex>"
  },
  "typography": {
    "heading": "<Google Font name>",
    "body": "<Google Font name>"
  },
  "mood": ["<mood>", ...],
  "style": ["<style>", ...],
  "density": "<low|medium|high>"
}`;
}

/* ------------------------------------------------------------------ */
/*  User Prompt                                                        */
/* ------------------------------------------------------------------ */

export function buildStyleUserPrompt(
  input: StyleAgentInput,
  paletteSuggestions: PaletteSuggestionHint[] = [],
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
    `- **Company Summary:** ${input.researchOutput.companySummary}`,
    `- **Refined Segment:** ${input.researchOutput.segment}`,
    `- **Target Audience:** ${input.researchOutput.targetAudience}`,
    `- **Tone Keywords:** ${input.researchOutput.toneKeywords.join(", ")}`,
    `- **Competitor Insights:** ${input.researchOutput.competitorInsights}`,
    `- **Differentiators:** ${input.researchOutput.differentiators}`,
  ].join("\n");

  const paletteSection =
    paletteSuggestions.length > 0
      ? [
          "## Graph-Suggested Palette Profiles",
          "",
          "The graph recommends these palette profiles for this segment's natural moods.",
          "Use them as directional guidance — they suggest tone and contrast, not specific hex values.",
          "",
          "| Mood | Profile | Temperature | Contrast | Saturation |",
          "|---|---|---|---|---|",
          ...paletteSuggestions.map(
            (p) =>
              `| ${p.moodId} | ${p.paletteName} | ${p.temperatureRange} | ${p.contrastLevel} | ${p.saturationRange} |`,
          ),
        ].join("\n")
      : "";

  return [
    companySection,
    "",
    researchSection,
    "",
    paletteSection,
    "",
    "Based on the company brief and research output above, define the complete visual identity JSON.",
  ]
    .filter(Boolean)
    .join("\n");
}
