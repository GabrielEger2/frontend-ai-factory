// NicePage Importer — DOM signal extractor (cheerio-based)
//
// Reads the captured HTML and produces a small bundle of structural
// signals — heading text, CTA labels, form-field hints, and a section
// count — that the prompt builder hands to Claude alongside the
// screenshots. The intent is structural ONLY: we never carry through
// NicePage HTML/CSS into the generated component (see ToS guardrail in
// the system prompt). These signals just help Claude name slots and
// pick reasonable copy lengths.
//
// CJS-compat note: cheerio 1.1+ is ESM-only. `agents/package.json`
// pins `^1.0.0-rc.12` and `agents/tsconfig.json` is `module: commonjs`.
// `import * as cheerio from 'cheerio'` resolves to the CJS bundle in
// rc.12 and works under ts-node CJS — type-check is the canary.

import * as cheerio from "cheerio";

export interface PageSignals {
  headings: string[];
  ctaLabels: string[];
  formFields: string[];
  sectionCount: number;
}

export function extractSignals(html: string): PageSignals {
  const $ = cheerio.load(html);

  // Headings — h1/h2/h3 text, trimmed, deduped, max 10.
  const headings = Array.from(
    new Set(
      $("h1, h2, h3")
        .map((_, el) => $(el).text().trim())
        .get()
        .filter((t) => t.length > 0),
    ),
  ).slice(0, 10);

  // CTA labels — anchors with href + native buttons. Filter to plausible
  // button copy (1–59 chars), dedupe, max 10. The length filter drops
  // long body copy that happens to live inside an <a>.
  const ctaLabels = Array.from(
    new Set(
      $("a[href], button")
        .map((_, el) => $(el).text().trim())
        .get()
        .filter((t) => t.length > 0 && t.length < 60),
    ),
  ).slice(0, 10);

  // Form fields — placeholder text, falling back to `name`. Useful as
  // signals for which form slots a Contact-style component needs.
  const formFields = $("input, textarea, select")
    .map((_, el) => $(el).attr("placeholder") || $(el).attr("name") || "")
    .get()
    .filter((s) => s.length > 0)
    .slice(0, 20);

  // Section count — real <section> + NicePage's u-section/u-clearfix
  // wrapper classes (their layout containers).
  const sectionCount = $(
    'section, [class*="u-section"], [class*="u-clearfix"]',
  ).length;

  return { headings, ctaLabels, formFields, sectionCount };
}
