# Workflow: Page

Scaffold a template page by composing library components into a full website page layout.

## Input
`$ARGUMENTS` after "page" — the template name and optionally a description:
- `page landing` — generic landing page template
- `page services professional` — professional services page

## Steps

### 0. Set the dials

Read `references/taste-dials.md`. For a **template** (page composition), the dials reflect the overall vibe of the page, not any single component:

1. Pick page-level values, e.g. `VARIANCE 7 / MOTION 6 / DENSITY 4` for a "premium SaaS landing".
2. State your choice in one line.
3. Use the dials to filter component candidates in step 2 — don't pull a low-motion footer into a high-motion editorial template (or do, intentionally, for grounding).

### 1. Determine placement
Target: `components/templates/<TemplateName>/`

Templates compose library components into full page layouts that the Assembler can use.

### 2. Choose components
Based on the page type, select appropriate library components:

**Typical landing page flow:**
1. Hero section (one of the hero components)
2. Features section (grid, icon list, or alternating)
3. Testimonials (if available)
4. CTA section (banner or inline)
5. Contact or footer

Check `metadata.json` `pairsWell` arrays to ensure components work together.
Match `style[]` and `mood[]` tags across components for visual consistency.

### 3. Create the template

**`index.tsx`** — the page composition:
```tsx
import HeroSplit from "@components/hero/HeroSplit";
import FeaturesGrid from "@components/features/FeaturesGrid";
import CtaBanner from "@components/cta/CtaBanner";

export interface LandingPageProps {
  hero: React.ComponentProps<typeof HeroSplit>;
  features: React.ComponentProps<typeof FeaturesGrid>;
  cta: React.ComponentProps<typeof CtaBanner>;
}

export default function LandingPage({ hero, features, cta }: LandingPageProps) {
  return (
    <main>
      <HeroSplit {...hero} />
      <FeaturesGrid {...features} />
      <CtaBanner {...cta} />
    </main>
  );
}
```

**`metadata.json`** — template metadata:
```json
{
  "id": "landing-01",
  "name": "Landing Page",
  "components": ["hero-split-01", "features-grid-01", "cta-banner-01"],
  "style": ["modern"],
  "mood": ["professional"],
  "segments": ["general", "services", "saas"]
}
```

**`<TemplateName>.stories.tsx`** — Storybook story with full page preview

### 4. Anti-slop check

Run through `references/anti-slop.md`. For a template, the most common slips are:
- [ ] No "Acme" / "Nexus" / "SmartFlow" as the demo brand name in stories
- [ ] No "John Doe" or `99.99%` in the demo content
- [ ] No 3-equal-card features section (swap for zig-zag or asymmetric grid)
- [ ] No raw Unsplash links — use `placehold.co` or `picsum.photos/seed/...`
- [ ] Dial coherence: high-motion template doesn't suddenly drop into a static `motion: 2` carousel — components should sit within ±2 of the page-level motion value

### 5. Verify
- Components pair well (check `pairsWell`/`pairsPoorly`)
- Style and mood tags are consistent across components
- Page flows naturally (hero → value prop → social proof → CTA)
- Works at all viewport sizes
- No visual jarring between component sections (spacing, color transitions)
