# Component Library Domain Rules

## Component Structure

Each component lives in `components/library/<category>/<ComponentName>/`:
- `index.tsx` — React component with slot props
- `metadata.json` — style[], mood[], category, layout, density, slots[], mobileBehavior
- `variants/` — optional style variants (same component, different density/color mode)

## Categories

| Category | Phase 1 | Full Library | Examples |
|---|---|---|---|
| Heroes | 5 | 15 | Full-width image, split layout, video background |
| Features | 4 | 10 | Grid cards, icon list, alternating sections |
| CTAs | 3 | 8 | Banner, inline, floating |
| Testimonials | — | 6 | Carousel, grid, single quote |
| Contact | 2 | 5 | Form, map + info |
| Pricing | — | 4 | Comparison table, tiered cards |
| FAQ | — | 4 | Accordion, two-column |
| Footers | 2 | 3 | Simple links, multi-column |

Phase 1 total: 16 components across 5 categories.
Full library target: ~55 components across 8 categories.

## Metadata Schema

```json
{
  "id": "hero-split-01",
  "name": "Split Hero",
  "category": "hero",
  "style": ["modern", "editorial"],
  "mood": ["professional", "elegant"],
  "layout": "split",
  "density": "medium",
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

## PAIRS_WITH Scoring (Phase 3 — Neo4j)
- Each component pair has a compatibility score (0-1).
- The Composer Agent uses these scores to chain components into page layouts.
- Scores are manually seeded initially, then refined by the learning loop (Phase 5).
- Until Neo4j is ready, PAIRS_WITH data lives in metadata.json as `pairsWell`/`pairsPoorly` arrays.

## Slot System
- Slots define where AI-generated content goes in a component.
- Each slot has: name, type (text, image, url, list), constraints (maxLength, aspectRatio).
- The Content Agent generates content for each slot.
- The Assembler maps slot content to component props.

## Style Tags
- Components tagged with style[] and mood[] arrays.
- Styles: modern, classic, editorial, luxury, playful, minimal, bold, corporate
- Moods: professional, elegant, fun, serious, friendly, energetic, calm, trustworthy

## Adding a New Component
1. Create directory: `components/library/<category>/<ComponentName>/`
2. Create `index.tsx` with slot props interface.
3. Create `metadata.json` with all required fields.
4. Add PAIRS_WITH data (which components it goes well/poorly with).
5. Test with assembler to verify slot mapping works.
6. Update component count in relevant docs.
