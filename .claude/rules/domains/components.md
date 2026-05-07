# Component Library Domain Rules

## Component Structure

Each component lives in `components/library/<category>/<ComponentName>/`:
- `index.tsx` — React component with slot props
- `metadata.json` — id, name, category, style[], mood[], purpose[], layout, density, slots[], mobileBehavior, pairsWell, pairsPoorly
- `variants/` — optional style variants (same component, different density/color mode)

## Categories

The library spans 12 active categories. Counts below reflect what is on disk in `components/library/` today.

| Category | Count | Components |
|---|---|---|
| hero | 10 | Asymmetric stack, bakery editorial, carousel full-bleed slider, device chrome, grid gallery, newsroom ticker, polaroid collage, split form, split image, video backdrop |
| testimonial | 5 | Infinite scroll, masonry quotes, metric card, spotlight quote, video card |
| footer | 4 | Columns social, mega, pulse, reveal |
| cta | 7 | Dual offer split, hover reveal list, image backdrop, inline calculator, sticky image list, testimonial paired, video backdrop |
| faq | 3 | Categorized, solutions, tabbed |
| contact | 7 | Booking embed, chat embed, locations map, multi-step, shapes form, split form, support tabs |
| navigation | 4 | Dock, mega-panel, pill, sticky |
| stats | 3 | Chart, count-up, KPI grid |
| content | 7 | Carousel before/after, carousel cards, comparison split, editorial framed split, gallery case study, gallery image-text editorial, zigzag alternating split |
| pricing | 4 | Freemium ladder, monthly/annual toggle, single price, tier cards |
| team | 3 | Founder split, leadership grid, member spotlight |
| gallery | 4 | Carousel thumbnail nav, lightbox grid, masonry, portfolio strip |

Total on disk: 61 components across 12 active categories.

The previous `motion`, `layout/grid`, `layout/split`, and `carousel` categories have been retired. `layout/split`'s surviving components were migrated to `content`; `motion` and `layout/grid` had all their components removed; `carousel`'s 4 components were redistributed to `content` (CarouselBeforeAfter, CarouselCards), `hero` (CarouselFullBleedSlider), and `gallery` (CarouselThumbnailNav).

`components/wrappers/` (separate from `components/library/`) holds hand-authored page-template wrappers that accept `React.ReactNode` for nested content slots — currently `ParallaxContent` and `StickyCards`. These are NOT Composer-pickable and have no `metadata.json`. Use them only when hand-composing a Next.js page.

## Category Field Convention

The `"category"` field in `metadata.json` MUST be one of these singular values (no plural forms):

```
hero | testimonial | footer | cta | faq | contact |
navigation | stats | content |
pricing | team | gallery
```

Plural variants like `"footers"`, `"testimonials"`, `"heroes"` are NOT permitted in the `category` field. The category field is what drives downstream consumers (FLOW_ORDER in `agents/scripts/generate-pair-scores.ts`, composer agent's flow ordering, dashboard category facets), so a mismatch silently breaks pair scoring.

Directory names (`components/library/footers/...`, `components/library/heroes/...`, `components/library/testimonials/...`) may differ from the canonical category value — only the `category` value inside `metadata.json` is constrained.

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
location-display, magazine-opener, pricing, gallery, comparison
```

`magazine-opener` is used by HeroAsymmetricStack and HeroNewsroomTicker. `pricing`, `gallery`, and `comparison` were added when those categories landed — `pricing` for tier cards / comparison tables / freemium ladders, `gallery` for masonry / lightbox / case-study showcases, `comparison` for side-by-side feature/option layouts (used by ComparisonSplit). Sentence-format values (e.g. `"brand storytelling"`, `"editorial conversion"`) fail the validator's whitespace check and the canonical-list subset check.

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
