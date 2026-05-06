# Component Library Domain Rules

## Component Structure

Each component lives in `components/library/<category>/<ComponentName>/`:
- `index.tsx` — React component with slot props
- `metadata.json` — id, name, category, style[], mood[], purpose[], layout, density, slots[], mobileBehavior, pairsWell, pairsPoorly
- `variants/` — optional style variants (same component, different density/color mode)

## Categories

The library now spans 15 canonical categories. `Current` reflects what is on disk in `components/library/` today; `Target` is the next milestone the composer should be able to draw from.

| Category | Current | Target | Examples (current + planned) |
|---|---|---|---|
| hero | 15 | 18 | Bold editorial, geometric, parallax images, polaroid collage, shuffle cards, split image, terminal console, video backdrop |
| testimonial | 6 | 8 | Infinite scroll, stacked split, stagger fan, logo-quote ribbon, spotlight quote, video card |
| footer | 3 | 5 | Mega, pulse, reveal — planned: minimal-strip, multi-column-social |
| cta | 8 | 12 | Collage duo, countdown, dual-offer split, editorial split, image backdrop, minimal strip, sticky banner, newsletter capture |
| faq | 4 | 6 | Accordion, minimal, solutions, tabbed — planned: search-driven, categorized |
| contact | 5 | 7 | Booking embed, locations map, shapes form, split form, support tabs |
| navigation | 4 | 6 | Dock, mega-panel, pill, sticky — planned: transparent-overlay, side-rail |
| stats | 4 | 5 | Chart, count-up, KPI grid, milestone bar |
| carousel | 5 | 7 | Before/after, cards, horizontal scroll, swipe, testimonial avatar peek |
| motion | 4 | 6 | Marquee, parallax content, scroll narrative, sticky cards — planned: reveal-on-scroll, pinned-section |
| layout/grid | 6 | 8 | Card grid, icon feature grid, logo cloud, pricing tiers*, process timeline, simple grid |
| layout/split | 8 | 10 | Author, comparison†, editorial framed, icon list, image text, statement, vertical timeline, zigzag alternating |
| **pricing** ⭐ new | 0 | 5 | Planned: tier cards, comparison table, freemium ladder, single-price card, monthly/annual toggle |
| **team** ⭐ new | 0 | 4 | Planned: leadership grid, founder split, team carousel, member spotlight |
| **gallery** ⭐ new | 0 | 5 | Planned: masonry, lightbox grid, case-study layout, portfolio strip, image-text editorial |

\* `PricingTiers` and `LogoCloud` currently live under `layout/grid`. When the dedicated `pricing` category is implemented, plan to migrate `PricingTiers` over (and optionally promote logo/trust components to their own category if they grow past 3).

† `layouts/split/ComparisonSplit/` exists as an empty folder. It must either be implemented (preferred — feeds the new `comparison` purpose) or removed. The validator should fail on empty component dirs going forward.

Total on disk: ~76 components across 12 active categories.
Target: ~112 components across 15 active categories.

## Category Field Convention

The `"category"` field in `metadata.json` MUST be one of these singular values (no plural forms):

```
hero | testimonial | footer | cta | faq | contact |
navigation | stats | motion | carousel | layout/grid | layout/split |
pricing | team | gallery
```

Plural variants like `"footers"`, `"testimonials"`, `"heroes"` are NOT permitted in the `category` field. The category field is what drives downstream consumers (FLOW_ORDER in `agents/scripts/generate-pair-scores.ts`, composer agent's flow ordering, dashboard category facets), so a mismatch silently breaks pair scoring.

`pricing`, `team`, and `gallery` are newly added and currently have **zero on-disk components**. Before any component declares one of these as `category`, the value must also be added to the validator's category enum, FLOW_ORDER in `agents/scripts/generate-pair-scores.ts`, and the dashboard's category facet list, in the same commit.

Directory names (`components/library/footers/...`) may remain plural — only the `category` value inside `metadata.json` is constrained.

## Metadata Schema

```json
{
  "id": "hero-split-01",
  "name": "Split Hero",
  "category": "hero",
  "style": ["modern", "editorial", "corporate"],
  "mood": ["professional", "elegant", "trustworthy"],
  "purpose": ["hero", "brand-statement"],
  "acceptsStyleKit": {
    "card": false,
    "background": true,
    "textDecoration": true,
    "button": true
  },
  "layout": "split",
  "density": "medium",
  "imageWeight": 0.15,
  "slots": [
    { "name": "headline", "type": "text", "maxLength": 80 },
    { "name": "subheadline", "type": "text", "maxLength": 160 },
    { "name": "cta_text", "type": "text", "maxLength": 30 },
    { "name": "cta_url", "type": "url" },
    { "name": "image", "type": "image", "aspectRatio": "16:9" }
  ],
  "mobileBehavior": "stack",
  "pairsWell": ["features-grid-01", "cta-banner-01"],
  "pairsPoorly": ["hero-video-01"]
}
```

## PAIRS_WITH Scoring
- PAIRS_WITH data lives in `metadata.json` as `pairsWell` / `pairsPoorly` arrays. These are the source of truth.
- The Composer Agent reads them as a re-ranking signal post-retrieval (greedy left-to-right boost/demote): once a slot is filled, candidates for subsequent slots whose IDs appear in any prior pick's `pairsWell` get boosted, and those in `pairsPoorly` get demoted.
- Scores are manually seeded initially, then refined by the learning loop (Phase 5).
- All values inside `pairsWell` and `pairsPoorly` MUST resolve to a real component `id` somewhere in the library. Ghost references (IDs that don't match any real component) are caught by the metadata validator.

## Slot System
- Slots define where AI-generated content goes in a component.
- Each slot has: name, type (text, image, url, list), constraints (maxLength, aspectRatio).
- The Content Agent generates content for each slot.
- The Assembler maps slot content to component props.

## Style Tags
- Components tagged with style[] and mood[] arrays.
- Styles: modern, classic, editorial, luxury, playful, minimal, bold, corporate
- Moods: professional, elegant, fun, serious, friendly, energetic, calm, trustworthy

## Purpose Tags

Every component declares a non-empty `purpose[]` array. Values MUST come from this canonical list (single hyphenated tokens — interior whitespace is NOT permitted):

```
hero, navigation, footer, faq, contact, testimonials, stats,
features, services, products, about, team, process, benefits,
portfolio, showcase, cta, lead-capture, brand-statement, story,
location-display, magazine-opener
```

`magazine-opener` is included to cover HeroBoldEditorial's existing usage. Sentence-format values (e.g. `"brand storytelling"`, `"editorial conversion"`) fail the validator's whitespace check and the canonical-list subset check.

### Pending purpose tokens (not yet in validator)

The new `pricing`, `team`, and `gallery` categories will need three additional tokens to describe their slot intent. They are listed here for planning only — do **not** use them in any `metadata.json` until they are added to the validator and tests in the same commit (see "Extending purpose[]" below).

```
pricing       — pricing tier, comparison table, freemium ladder slots
gallery       — masonry, lightbox, image-grid, case-study showcase slots
comparison    — side-by-side feature/option comparisons (also unblocks the empty ComparisonSplit)
```

Until those are merged through the canonical list, components built for the new categories should reuse the closest existing token (`benefits`, `showcase`, `portfolio`) and be flagged for a follow-up purpose-tag pass.

### Extending purpose[]

Adding a new canonical purpose token requires updating the rules doc AND the validator constant in the same commit:

1. Append the new token to the list in this file.
2. Append the same token to `CANONICAL_PURPOSE` in `components/scripts/validate-metadata.ts`.
3. Append the same token to the matching constant in `components/tests/metadata-schema.test.ts` (or the shared module).

Anything less drifts the rules doc out of sync with the validator.

## Tag Enrichment Floor

Components MUST have at least 3 entries in `style[]` and at least 3 entries in `mood[]`. Cap at 4 unless the component clearly fits 5 use cases. Enrichment is **additive-only** — never remove an existing tag without flagging, because `agents/composer/handler.ts::getDynamoFallbackCandidates` filters live on these arrays and components with zero overlap get dropped.

## Storybook Stories

- **Max 5 stories per component.**
- Every story must have **unique content** — different business context, copy, and data. Never duplicate content across stories just to swap a prop.
- **Mix button/CTA variants naturally** across stories instead of creating dedicated "WithXButton" stories. Each story already represents a different use case — assign a different `ctaStyle` to each.
- Name stories after the scenario they represent (e.g. `RealEstate`, `SaasOnboarding`, `FreelancerPortfolio`), not after the prop being demoed.
- Use `argTypes` with `control: "select"` so any variant can still be tested interactively via the Storybook controls panel.

## Adding a New Component
1. Create directory: `components/library/<category>/<ComponentName>/`
2. Create `index.tsx` with slot props interface.
3. Create `metadata.json` with all required fields (`category` singular; `style[]`/`mood[]` ≥ 3; `purpose[]` from canonical list).
4. Create `<ComponentName>.stories.tsx` following the story rules above.
5. Add PAIRS_WITH data (which components it goes well/poorly with). All IDs MUST resolve.
6. Test with assembler to verify slot mapping works.
7. Run `cd components && npm run validate:metadata` — must exit 0.
8. Update component count in relevant docs.
