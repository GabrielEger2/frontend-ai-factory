---
title: Reorganize component library into style kit + parameterized layout architecture
type: Refactoring
branch: feat/component-library-v1
created: 2026-04-12
---

## Context

The component library currently contains self-contained, opinionated components where visual style choices (which card, which background, which button variant) are baked into each component. The goal is to separate the style kit (Style Agent outputs: card, background, textDecoration, buttonVariant, buttonColorScheme) from the layout structure, so the Assembler can thread one site-wide style kit through every section. This is a full migration of the `components/` workspace only — no changes to `dashboard/`, `agents/`, or `infra/`.

## Docs to Read

- `/components/.claude/rules/domains/components.md`
- `/components/.claude/rules/general.md`

## Rules to Read

- `.claude/rules/git.md`

## Reference Patterns

- Card dispatcher pattern: `components/library/layouts/FeaturesCards/index.tsx` — switch/case card selection to preserve as style kit selection
- CTA threading pattern: `components/library/layouts/FeaturesStickyCards/index.tsx` — how `(ctaStyle, ctaColorScheme)` flows through sub-components
- Scroll sub-components: `components/library/layouts/FeaturesParallaxContent/index.tsx` — private sub-components with MotionValues, preserve exactly
- Duplicated animation variants: `components/library/layouts/ContentImageText/index.tsx` — `containerVariants`, `fadeUp`, `imageReveal` — these get extracted
- Multi-layout card: `components/ui/cards/TestimonialCard.tsx` — `layout` prop pattern to follow for content modes
- Wrapper card pattern: `renderMagicCards` inside FeaturesCards — layout builds JSX, passes as children to wrapper card

---

## Planner Decisions on Open Questions

1. **FeaturesIconList → `layouts/split/`** — The component is spatially a split layout (icon list left, circular image right). The icon-per-item pattern is internal structure, not a directory concern. New name: `IconListSplit`.

2. **ContentAuthorSplit → keep separate in `layouts/split/`** — Its data shape (banner image + author avatar + bio) is distinct from ImageText. It is not a testimonial. New name: `AuthorSplit`. It stays as its own split layout with its own story scenarios (about pages, founder stories).

3. **TestimonialShowcase → separate split layout in `layouts/split/`** — It has a unique state machine (paginated navigation), a full-height author photo, and `bg-primary` treatment. It cannot collapse into AuthorSplit without losing its identity. New name: `ShowcaseSplit`. Purpose tag: `testimonials`.

4. **CTA token fixes — YES, fix in this migration** — The three CTA components (`CtaBanner`, `CtaInline`, `CtaFloating`) have `text-primary-foreground` (wrong token) instead of `text-primary-content`. They are touched during the metadata overhaul pass anyway. Fix inline, keep within metadata work items where the files are already open. Each CTA fix is bundled into its metadata item (max 2 files per item: `index.tsx` + `metadata.json`).

5. **TestimonialCard stays as primitive** — It already has content-aware modes via `layout: "horizontal" | "vertical" | "compact"`. No changes. It remains in `components/ui/cards/TestimonialCard.tsx`.

6. **CardOutline stays as-is** — `CardOutlineGrid` fuses layout + card. It is referenced from the `CardGrid` dispatcher as `cardStyle: "outline"`. No restructuring.

7. **Motion library** — New files (`motion-variants.ts`, `StyleKit` types) use `motion/react`. All moved/rewritten layout files (non-trivial refactor) use `motion/react`. Files that are only moved with minor additions (heroes, CTAs, FAQ, contact, etc.) keep `framer-motion` to minimize diff surface.

8. **Shared animation variants extracted** — `components/lib/motion-variants.ts` exports `containerVariants`, `fadeUp`, `imageReveal`. Used by all refactored layouts. The three variants are identical across 6+ components.

---

## Directory Map (Before → After)

```
BEFORE                                      AFTER
──────────────────────────────────────────  ──────────────────────────────────
layouts/FeaturesCards/                   →  layouts/grid/CardGrid/
layouts/ContentFeaturesList/             →  layouts/grid/SimpleGrid/
layouts/FeaturesIconList/                →  layouts/split/IconListSplit/
layouts/ContentStatementSplit/           →  layouts/split/StatementSplit/
layouts/ContentAuthorSplit/              →  layouts/split/AuthorSplit/
layouts/ContentImageText/                →  layouts/split/ImageText/
layouts/FeaturesParallaxContent/         →  layouts/scroll/ParallaxContent/
layouts/FeaturesStickyCards/             →  layouts/scroll/StickyCards/
testimonials/TestimonialsScrolling/      →  layouts/scroll/InfiniteScroll/
testimonials/TestimonialsStacked/        →  layouts/split/StackedSplit/
testimonials/TestimonialsStagger/        →  layouts/grid/StaggerFan/
testimonials/TestimonialShowcase/        →  layouts/split/ShowcaseSplit/
heroes/HeroGeometric/                    →  heroes/HeroGeometric/  (unchanged)
heroes/HeroSplitImage/                   →  heroes/HeroSplitImage/ (unchanged)
heroes/HeroParallaxImages/               →  heroes/HeroParallaxImages/ (unchanged)
heroes/HeroShuffleCards/                 →  heroes/HeroShuffleCards/ (unchanged)
```

---

## Work Items

Items are grouped into dependency waves. Wave N must be fully committed before Wave N+1 begins.

---

### WAVE 1 — Foundation (no dependencies)

---

### 1. Create StyleKit TypeScript types

- **Status:** created
- **Scope:** components
- **Depends:** —
- **Files:**
  - `components/lib/style-kit.ts` — NEW: `StyleKit` interface + `CardStyle`, `BackgroundVariant`, `TextDecorationVariant` type aliases; exports default empty style kit constant
- **Action:** Create `components/lib/style-kit.ts`. Define and export:
  - `CardStyle` union: `"base" | "flip" | "reveal" | "magic-gradient" | "magic-orb" | "product" | "outline"`
  - `BackgroundVariant` union: `"animated-svg" | "retro-grid" | "dot-pattern" | "striped" | "gradient-bars" | "interactive-grid" | "none"`
  - `TextDecorationVariant` union: `"typewriter" | "highlighter" | "line-shadow" | "reveal" | "text-reveal" | "none"`
  - `StyleKit` interface with optional fields: `card?: CardStyle`, `ctaVariant?: CtaVariant`, `ctaColorScheme?: ColorScheme`, `background?: BackgroundVariant`, `textDecoration?: TextDecorationVariant`
  - Import types only: `import type { CtaVariant, ColorScheme } from "@ui/button"` (type-only import to avoid pulling React client code)
  - Export `DEFAULT_STYLE_KIT: StyleKit` constant (all fields at their current defaults: `card: "base"`, `ctaVariant: "default"`, `ctaColorScheme: "primary"`, `background: "none"`, `textDecoration: "none"`)
  - No React imports — this is a pure types file
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `feat(components): add StyleKit TypeScript interface and type aliases`

---

### 2. Extract shared animation variants to lib

- **Status:** created
- **Scope:** components
- **Depends:** —
- **Files:**
  - `components/lib/motion-variants.ts` — NEW: shared Framer Motion variant objects
- **Action:** Create `components/lib/motion-variants.ts`. Export three variant objects that are currently copy-pasted across 6+ layout files. Copy exact definitions from `components/library/layouts/ContentImageText/index.tsx` lines 40-63 as the canonical source:
  - `containerVariants` — stagger children 0.08s
  - `fadeUp` — opacity 0→1, y 16→0, duration 0.3 easeOut
  - `imageReveal` — opacity 0→1, scale 0.97→1, duration 0.35 easeOut
  - Also export `accentReveal` (from ContentStatementSplit — opacity+y+scale with 0.3s delay)
  - Import from `motion/react` for the type annotations only: `import type { Variants } from "motion/react"`
  - Annotate each export as `Variants`
  - Do NOT import framer-motion — this file only defines plain objects with type annotation
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `refactor(components): extract shared motion variants to lib/motion-variants`

---

### WAVE 2 — Card updates (depends on Wave 1)

---

### 3. Add content mode types to CardBase

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/ui/cards/CardBase.tsx` — add `mode?: "feature" | "team"` prop; add `role?: string` field for team mode
- **Action:** Read `components/ui/cards/CardBase.tsx` first. Add an optional `mode` prop defaulting to `"feature"`. When `mode === "team"`, render `role` below the title (using `text-base-content/60 text-sm`). The existing prop interface maps exactly: `feature` mode uses current fields; `team` mode adds `role?: string`. Do NOT change the visual output for `mode === "feature"` — it must be pixel-identical to current. Keep `framer-motion` import as-is (file is only extended, not rewritten).
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `feat(components): add feature/team content modes to CardBase`

---

### 4. Add content mode types to CardRevealSlide

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/ui/cards/CardRevealSlide.tsx` — add `mode?: "feature"` prop; no visual change (feature is only mode)
- **Action:** Read `components/ui/cards/CardRevealSlide.tsx` first. Add `mode?: "feature"` to the props interface as a no-op prop (single mode, declared for API consistency with CardBase). This allows `CardGrid` to pass `mode` to all card types uniformly. No other changes.
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `feat(components): add mode prop to CardRevealSlide for style kit API consistency`

---

### WAVE 3 — Grid layouts (depends on Waves 1 and 2)

---

### 5. Create CardGrid layout (replaces FeaturesCards)

- **Status:** created
- **Scope:** components
- **Depends:** 1, 2, 3, 4
- **Files:**
  - `components/library/layouts/grid/CardGrid/index.tsx` — NEW: full rewrite of FeaturesCards with style kit
  - `components/library/layouts/grid/CardGrid/CardGrid.stories.tsx` — NEW: updated stories
- **Action:** Create `components/library/layouts/grid/CardGrid/` directory. Write `index.tsx`:
  - Import from `motion/react` (not framer-motion — this is a new file)
  - Import `containerVariants`, `fadeUp` from `@lib/motion-variants`
  - Import `StyleKit` from `@lib/style-kit`
  - Import all 6 card primitives from `@ui/cards/*` (same as FeaturesCards)
  - Keep all existing item type interfaces: `FeatureCardItem`, `ProductCardItem`, `FlipCardItem`, `OutlineCardItem` — copy verbatim from FeaturesCards
  - Keep `CardStyle` type — but now it is imported from `@lib/style-kit` instead of defined locally
  - Replace `cardStyle` prop with `styleKit?: StyleKit` — the card is `styleKit?.card ?? "base"`
  - The switch/case dispatcher stays structurally identical; card choice comes from `styleKit.card` instead of a direct `cardStyle` prop
  - Add `purpose?: string` prop (informational, not affecting rendering — passed to the section `data-purpose` attribute)
  - Keep `headline`, `subheadline`, `cards` (union type), `columns`, `flipDirection`, `className`
  - CTA inside card renderers: use `styleKit?.ctaVariant` and `styleKit?.ctaColorScheme` where applicable (base cards, magic cards use `buttonStyles` — pass variant through)
  - For `renderMagicCards`, pass `styleKit?.cardGradientFrom` and `styleKit?.cardGradientTo` to `CardMagic` if present — otherwise CardMagic uses its own defaults (no breaking change)
  - `SectionHeader` sub-component: keep identical, just import `fadeUp` from shared variants
  - Write `CardGrid.stories.tsx` with 4 scenarios using `styleKit` prop: `SaasFeatures` (base cards), `EcommerceProducts` (product cards), `AgencyPortfolio` (outline cards), `ConsultingFlip` (flip cards). Each story must have unique content. Add `argTypes` for `styleKit.card` with `control: "select"`.
- **Validate:** `cd components && npx tsc --noEmit` then `cd components && npx storybook build --quiet`
- **Commit:** `feat(components): add CardGrid layout with style kit prop threading`

---

### 6. Create SimpleGrid layout (replaces ContentFeaturesList)

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/library/layouts/grid/SimpleGrid/index.tsx` — NEW: ContentFeaturesList migrated + style kit
  - `components/library/layouts/grid/SimpleGrid/SimpleGrid.stories.tsx` — NEW: updated stories
- **Action:** Create `components/library/layouts/grid/SimpleGrid/` directory. Write `index.tsx`:
  - Import from `motion/react`
  - Import `containerVariants`, `fadeUp` from `@lib/motion-variants`
  - Import `StyleKit` from `@lib/style-kit`
  - Import `CtaButton` from `@ui/button`
  - Port all props from `ContentFeaturesListProps` verbatim. Replace `ctaStyle?: CtaVariant` and `ctaColorScheme?: ColorScheme` with `styleKit?: StyleKit`. Use `styleKit?.ctaVariant ?? "default"` and `styleKit?.ctaColorScheme ?? "primary"` internally.
  - Add `purpose?: string` prop (rendered as `data-purpose` attribute on the `<section>`)
  - All layout logic, grid column map, ArrowRight icon — copy intact from ContentFeaturesList
  - Remove the locally-defined `containerVariants` and `fadeUp` — import from shared variants
  - Write `SimpleGrid.stories.tsx` with 4 scenarios: `SaasCapabilities`, `AgencyServices`, `StartupBenefits`, `ClinicOfferings`. Each story assigns a different `styleKit.ctaVariant`. Add `argTypes` for `styleKit`.
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `feat(components): add SimpleGrid layout with style kit prop threading`

---

### WAVE 4 — Split layouts (depends on Wave 1)

---

### 7. Create ImageText split layout (replaces ContentImageText)

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/library/layouts/split/ImageText/index.tsx` — NEW: ContentImageText migrated + style kit
  - `components/library/layouts/split/ImageText/ImageText.stories.tsx` — NEW: updated stories
- **Action:** Create `components/library/layouts/split/ImageText/` directory. Write `index.tsx`:
  - Import from `motion/react`
  - Import `containerVariants`, `fadeUp`, `imageReveal` from `@lib/motion-variants`
  - Import `StyleKit` from `@lib/style-kit`
  - Import `CtaButton` from `@ui/button`
  - Port all props from `ContentImageTextProps`. Replace `ctaStyle` + `ctaColorScheme` with `styleKit?: StyleKit`. Keep `colorScheme`, `imagePosition`, `label`, `headline`, `description`, `ctaText`, `ctaUrl`, `image`, `imageAlt`, `className`.
  - Add `purpose?: string` prop.
  - Remove locally-defined animation variants — import from shared.
  - Use `styleKit?.ctaVariant ?? "default"` and `styleKit?.ctaColorScheme ?? "primary"` for the CtaButton.
  - ContentImageText did NOT have a metadata.json — this is the first time one is created (handled in metadata wave, item 18).
  - Write `ImageText.stories.tsx` with 4 scenarios: `RealEstateListing`, `SaasOnboarding`, `HealthcareServices`, `FoodBrandStory`. Each has unique copy and a different `styleKit.ctaVariant`.
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `feat(components): add ImageText split layout with style kit prop threading`

---

### 8. Create StatementSplit layout (replaces ContentStatementSplit)

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/library/layouts/split/StatementSplit/index.tsx` — NEW: ContentStatementSplit migrated + style kit
  - `components/library/layouts/split/StatementSplit/StatementSplit.stories.tsx` — NEW: updated stories
- **Action:** Create `components/library/layouts/split/StatementSplit/` directory. Write `index.tsx`:
  - Import from `motion/react`
  - Import `containerVariants`, `fadeUp`, `imageReveal`, `accentReveal` from `@lib/motion-variants`
  - Import `StyleKit` from `@lib/style-kit`
  - Port all props from `ContentStatementSplitProps`. Keep `colorScheme`, `headlinePosition`. Add `purpose?: string`. No CTA button in this component — no ctaVariant needed from styleKit.
  - Remove locally-defined animation variants — import from shared.
  - `accentReveal` in ContentStatementSplit has a `delay: 0.3` — confirm `accentReveal` in `motion-variants.ts` includes this.
  - Write `StatementSplit.stories.tsx` with 4 scenarios: `LuxuryBrand`, `ArchitectureFirm`, `EditorialMagazine`, `FinancialAdvisory`.
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `feat(components): add StatementSplit layout migrated from ContentStatementSplit`

---

### 9. Create AuthorSplit layout (replaces ContentAuthorSplit)

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/library/layouts/split/AuthorSplit/index.tsx` — NEW: ContentAuthorSplit migrated + style kit
  - `components/library/layouts/split/AuthorSplit/AuthorSplit.stories.tsx` — NEW: updated stories
- **Action:** Create `components/library/layouts/split/AuthorSplit/` directory. Write `index.tsx`:
  - Import from `motion/react`
  - Import `containerVariants`, `fadeUp`, `imageReveal` from `@lib/motion-variants`
  - Import `StyleKit` from `@lib/style-kit`
  - Port all props from `ContentAuthorSplitProps`. Add `purpose?: string`. CTA is a plain `<a>` tag (not CtaButton) in the original — keep it as is; no style kit threading needed here since it's an inline link, not a button.
  - Remove locally-defined animation variants — import from shared.
  - Keep ArrowRight private sub-component.
  - Write `AuthorSplit.stories.tsx` with 4 scenarios: `FounderStory`, `TeamMemberSpotlight`, `BookAuthor`, `GalleryArtist`.
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `feat(components): add AuthorSplit layout migrated from ContentAuthorSplit`

---

### 10. Create IconListSplit layout (replaces FeaturesIconList)

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/library/layouts/split/IconListSplit/index.tsx` — NEW: FeaturesIconList migrated + style kit
  - `components/library/layouts/split/IconListSplit/IconListSplit.stories.tsx` — NEW: updated stories
- **Action:** Create `components/library/layouts/split/IconListSplit/` directory. Write `index.tsx`:
  - Import from `motion/react`
  - Import `containerVariants`, `fadeUp`, `imageReveal` from `@lib/motion-variants`
  - Import `StyleKit` from `@lib/style-kit`
  - Port all props from `FeaturesIconListProps`. Add `purpose?: string`. No CTA button — no styleKit.ctaVariant needed. The `AccentUnderline` sub-component uses `bg-primary` hardcoded — leave as is (theme token, not style kit concern).
  - Remove locally-defined animation variants — import from shared.
  - Write `IconListSplit.stories.tsx` with 4 scenarios: `SaasProductFeatures`, `LawFirmServices`, `MedicalClinicSpecialties`, `AgencyProcess`.
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `feat(components): add IconListSplit layout migrated from FeaturesIconList`

---

### WAVE 5 — Scroll layouts (depends on Wave 1)

---

### 11. Create StickyCards scroll layout (replaces FeaturesStickyCards)

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/library/layouts/scroll/StickyCards/index.tsx` — NEW: FeaturesStickyCards migrated + style kit
  - `components/library/layouts/scroll/StickyCards/StickyCards.stories.tsx` — NEW: updated stories
- **Action:** Create `components/library/layouts/scroll/StickyCards/` directory. Write `index.tsx`:
  - Import from `motion/react` (rewrite, not move)
  - Import `StyleKit` from `@lib/style-kit`
  - Port all props from `FeaturesStickyCardsProps`. Replace `ctaStyle` + `ctaColorScheme` with `styleKit?: StyleKit`. Keep `headline`, `subheadline`, `cards`, `cardHeight`, `className`.
  - Add `purpose?: string` prop.
  - The scroll mechanism (useScroll, useTransform, sticky positioning, StickyCard/SectionHeader sub-components) must be preserved exactly — this is the complex part. Only change: derive `ctaStyle` and `ctaColorScheme` from `styleKit?.ctaVariant` and `styleKit?.ctaColorScheme` with their defaults before passing to StickyCard sub-component.
  - The `StickyCard` sub-component receives the resolved (non-nullable) variants, not the styleKit directly.
  - Write `StickyCards.stories.tsx` with 3 scenarios: `SaasPlatformFeatures`, `ConsultingProcess`, `ProductShowcase`. Each assigns a different `styleKit`. Use `decorators` for scroll testing as in original stories.
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `feat(components): add StickyCards scroll layout with style kit prop threading`

---

### 12. Create ParallaxContent scroll layout (replaces FeaturesParallaxContent)

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/library/layouts/scroll/ParallaxContent/index.tsx` — NEW: FeaturesParallaxContent migrated + style kit
  - `components/library/layouts/scroll/ParallaxContent/ParallaxContent.stories.tsx` — NEW: updated stories
- **Action:** Create `components/library/layouts/scroll/ParallaxContent/` directory. Write `index.tsx`:
  - Import from `motion/react`
  - Import `StyleKit` from `@lib/style-kit`
  - Port all props from `FeaturesParallaxContentProps`. Replace `ctaStyle` + `ctaColorScheme` with `styleKit?: StyleKit`.
  - Preserve all three private sub-components (`StickyImage`, `OverlayCopy`, `ContentBlock`) with their scroll MotionValues intact — only change is that `ContentBlock` now receives resolved ctaVariant/ctaColorScheme derived from styleKit.
  - Add `purpose?: string` prop.
  - Write `ParallaxContent.stories.tsx` with 3 scenarios: `LuxuryHotelRooms`, `SaasProductDeepDive`, `DigitalAgencyWork`. Use `decorators` for scroll testing.
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `feat(components): add ParallaxContent scroll layout with style kit prop threading`

---

### WAVE 6 — Testimonial layouts (depends on Wave 1)

---

### 13. Create InfiniteScroll layout (replaces TestimonialsScrolling)

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/library/layouts/scroll/InfiniteScroll/index.tsx` — NEW: TestimonialsScrolling migrated
  - `components/library/layouts/scroll/InfiniteScroll/InfiniteScroll.stories.tsx` — NEW: updated stories
- **Action:** Create `components/library/layouts/scroll/InfiniteScroll/` directory. Write `index.tsx`:
  - Import from `motion/react`
  - Import `StyleKit` from `@lib/style-kit`
  - Import `TestimonialCard` from `@ui/cards/TestimonialCard` (same import path)
  - Port all props from `TestimonialsScrollingProps`. The `rows: [T[], T[], T[]]` tuple stays — it is a deliberate 3-row design. Add `styleKit?: StyleKit` and `purpose?: string`.
  - StyleKit has no effect on rendering in this component (TestimonialCard is the only card, it has its own design) — it is accepted as a prop for API consistency and attached as `data-style-kit` attribute for the Assembler.
  - MarqueeRow sub-component: keep exactly as-is. Only change the import path.
  - Write `InfiniteScroll.stories.tsx` with 3 scenarios: `SaasTestimonials`, `AgencyClientReviews`, `EcommerceReviews`. Each must supply unique 3-row data.
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `feat(components): add InfiniteScroll layout migrated from TestimonialsScrolling`

---

### 14. Create StackedSplit layout (replaces TestimonialsStacked)

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/library/layouts/split/StackedSplit/index.tsx` — NEW: TestimonialsStacked migrated
  - `components/library/layouts/split/StackedSplit/StackedSplit.stories.tsx` — NEW: updated stories
- **Action:** Create `components/library/layouts/split/StackedSplit/` directory. Write `index.tsx`:
  - Import from `motion/react`
  - Import `StyleKit` from `@lib/style-kit`
  - Import `TestimonialCard` from `@ui/cards/TestimonialCard`
  - Port all props from `TestimonialsStackedProps`. Add `styleKit?: StyleKit` and `purpose?: string`. Style kit accepted for API consistency, not used in rendering.
  - Preserve ProgressBar and StackedCards sub-components exactly. They use `TestimonialCard` with `layout="compact"` — do not alter the card or the animation.
  - Write `StackedSplit.stories.tsx` with 3 scenarios: `SoftwareCompanyReviews`, `CoachingServiceTestimonials`, `RestaurantGuests`.
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `feat(components): add StackedSplit layout migrated from TestimonialsStacked`

---

### 15. Create StaggerFan grid layout (replaces TestimonialsStagger)

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/library/layouts/grid/StaggerFan/index.tsx` — NEW: TestimonialsStagger migrated + token fix
  - `components/library/layouts/grid/StaggerFan/StaggerFan.stories.tsx` — NEW: updated stories
- **Action:** Create `components/library/layouts/grid/StaggerFan/` directory. Write `index.tsx`:
  - Import from `motion/react` (this is a rewrite — complex animation, cleaner with new import)
  - Import `StyleKit` from `@lib/style-kit`
  - Import `TestimonialCard` from `@ui/cards/TestimonialCard`
  - Port all props from `TestimonialsStaggerProps`. Add `styleKit?: StyleKit` and `purpose?: string`.
  - FIX the token anomaly: `hsl(var(--bc))` in `boxShadow` and `bg-base-content` span → replace with `hsl(var(--base-content))` — check the actual correct token first (read `components/ui/` theme config). The correct DaisyUI token for base-content is `hsl(var(--bc))` — BUT the project uses oklch. Read the actual CSS custom properties. If `--bc` is defined in the theme, keep it; if not, use `oklch(var(--base-content))`. **Executor must read the theme CSS file before writing this.**
  - Preserve all spring animation constants (ROTATE_DEG, STAGGER, CENTER_STAGGER, CORNER_CLIP, etc.) exactly — these are the visual identity of this component.
  - Write `StaggerFan.stories.tsx` with 3 scenarios: `StartupPressReviews`, `FreelancerClientQuotes`, `ElearningStudentStories`.
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `feat(components): add StaggerFan layout migrated from TestimonialsStagger with token fix`

---

### 16. Create ShowcaseSplit layout (replaces TestimonialShowcase)

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/library/layouts/split/ShowcaseSplit/index.tsx` — NEW: TestimonialShowcase migrated
  - `components/library/layouts/split/ShowcaseSplit/ShowcaseSplit.stories.tsx` — NEW: updated stories
- **Action:** Create `components/library/layouts/split/ShowcaseSplit/` directory. Write `index.tsx`:
  - Import from `motion/react`
  - Import `StyleKit` from `@lib/style-kit`
  - Port all props from `TestimonialShowcaseProps`. Add `styleKit?: StyleKit` and `purpose?: string`.
  - Preserve the paginated navigation state machine (`[[activeIndex, direction], setActive]`, `paginate` callback) exactly — this is complex and correct.
  - Preserve `slideVariants`, `AnimatePresence`, `NavArrow` sub-component.
  - Style kit accepted for API consistency. No rendering change — the `bg-primary` showcase card is opinionated by design (matches the Planner decision that heroes stay opinionated; this follows same principle for this unique layout).
  - Write `ShowcaseSplit.stories.tsx` with 3 scenarios: `B2BSaasClients`, `LawFirmClientsSpotlight`, `CreativeAgencyPortfolio`.
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `feat(components): add ShowcaseSplit layout migrated from TestimonialShowcase`

---

### WAVE 7 — Metadata overhaul (depends on layout creation waves)

Items 17-25 depend on their corresponding layout items because the metadata files live inside directories created by those items. They cannot run until their layout directories exist.

---

### 17. Write metadata.json for all new grid layouts

- **Status:** created
- **Scope:** components
- **Depends:** 1 (for schema knowledge), 5, 6 (for correct ids)
- **Files:**
  - `components/library/layouts/grid/CardGrid/metadata.json` — NEW
  - `components/library/layouts/grid/SimpleGrid/metadata.json` — NEW
- **Action:** Write metadata.json for CardGrid and SimpleGrid using the updated schema:
  
  **CardGrid** (`layout-cardgrid-01`):
  ```json
  {
    "id": "layout-cardgrid-01",
    "name": "Card Grid",
    "category": "layout/grid",
    "style": ["modern", "bold", "corporate", "playful"],
    "mood": ["professional", "energetic", "friendly", "trustworthy"],
    "layout": "grid",
    "density": "high",
    "purpose": ["features", "products", "team", "services"],
    "acceptsStyleKit": { "card": true, "background": false, "textDecoration": false, "button": true },
    "slots": [
      { "name": "headline", "type": "text", "maxLength": 80, "optional": true },
      { "name": "subheadline", "type": "text", "maxLength": 160, "optional": true },
      { "name": "columns", "type": "number", "enum": [2, 3, 4], "optional": true },
      { "name": "cards", "type": "list", "itemSchema": { "type": "object", "fields": [
        { "name": "image", "type": "image", "aspectRatio": "16:9" },
        { "name": "imageAlt", "type": "text", "maxLength": 120 },
        { "name": "title", "type": "text", "maxLength": 80 },
        { "name": "description", "type": "text", "maxLength": 200 },
        { "name": "ctaText", "type": "text", "maxLength": 30, "optional": true },
        { "name": "ctaUrl", "type": "url", "optional": true }
      ]}}
    ],
    "mobileBehavior": "stack",
    "pairsWell": ["layout-simplegrid-01", "layout-stickycards-01", "hero-geometric-01"],
    "pairsPoorly": ["layout-staggerfan-01"]
  }
  ```
  
  **SimpleGrid** (`layout-simplegrid-01`):
  - `"category": "layout/grid"`, `"purpose": ["features", "services", "benefits", "process"]`
  - `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": true }`
  - Slots: `label` (text, 60, optional), `headline` (text, 80), `description` (text, 200, optional), `features` (list of title+description+ctaText+ctaUrl), `ctaText` (text, 30, optional), `ctaUrl` (url, optional), `columns` (number enum 2/3/4, optional)
  - pairsWell: CardGrid, ImageText hero layouts
- **Validate:** `cd components && npx tsc --noEmit` (schema validation via type checker on import)
- **Commit:** `feat(components): add metadata.json for CardGrid and SimpleGrid layouts`

---

### 18. Write metadata.json for all new split layouts (group A)

- **Status:** created
- **Scope:** components
- **Depends:** 1, 7, 8, 9
- **Files:**
  - `components/library/layouts/split/ImageText/metadata.json` — NEW (first ever for this component)
  - `components/library/layouts/split/StatementSplit/metadata.json` — NEW (migrated+updated)
  - `components/library/layouts/split/AuthorSplit/metadata.json` — NEW (migrated+updated)
- **Action:** Write three metadata.json files using the updated schema with `purpose[]` and `acceptsStyleKit`. All use `"category": "layout/split"`.

  **ImageText** (`layout-imagetext-01`):
  - `"purpose": ["features", "services", "about", "products"]`
  - `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": true }`
  - Slots: `headline`, `description`, `ctaText`, `ctaUrl`, `image`, `imageAlt`, `label` (optional), `imagePosition` (enum left/right, optional), `colorScheme` (enum light/dark, optional)

  **StatementSplit** (`layout-statementsplit-01`):
  - `"purpose": ["about", "features", "services"]`
  - `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": false }`
  - Slots: `headline`, `description`, `descriptionEmphasis` (optional), `image`, `imageAlt`, `accentImage` (optional), `accentImageAlt` (optional), `colorScheme` (optional), `headlinePosition` (optional)
  - style: `["editorial", "luxury", "minimal"]`, mood: `["elegant", "professional", "calm"]`

  **AuthorSplit** (`layout-authorsplit-01`):
  - `"purpose": ["about", "team"]`
  - `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": false }`
  - Slots: `bannerImage`, `bannerImageAlt`, `authorImage`, `authorImageAlt`, `authorName`, `authorTagline`, `description`, `ctaText` (optional), `ctaUrl` (optional)
  - style: `["editorial", "modern", "minimal"]`, mood: `["professional", "friendly", "elegant"]`
- **Validate:** JSON syntax check (executor: parse each file mentally, verify no trailing commas)
- **Commit:** `feat(components): add metadata.json for ImageText, StatementSplit, AuthorSplit layouts`

---

### 19. Write metadata.json for all new split layouts (group B — testimonials)

- **Status:** created
- **Scope:** components
- **Depends:** 1, 10, 14, 16
- **Files:**
  - `components/library/layouts/split/IconListSplit/metadata.json` — NEW
  - `components/library/layouts/split/StackedSplit/metadata.json` — NEW
  - `components/library/layouts/split/ShowcaseSplit/metadata.json` — NEW
- **Action:** Write three metadata.json files.

  **IconListSplit** (`layout-iconlistsplit-01`):
  - `"category": "layout/split"`, `"purpose": ["features", "services", "process"]`
  - `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": false }`
  - Slots: `headline`, `features` (list: icon[string/emoji], title, description), `image` (optional), `imageAlt` (optional), `logos` (optional list: image, imageAlt)
  - style: `["modern", "corporate", "minimal"]`, mood: `["professional", "trustworthy", "calm"]`

  **StackedSplit** (`layout-stackedsplit-01`):
  - `"category": "layout/split"`, `"purpose": ["testimonials"]`
  - `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": false }`
  - Slots: `headline`, `subheadline` (optional), `testimonials` (list: image, imageAlt, name, title, quote), `autoAdvanceDuration` (number, optional)

  **ShowcaseSplit** (`layout-showcasesplit-01`):
  - `"category": "layout/split"`, `"purpose": ["testimonials"]`
  - `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": false }`
  - Slots: `label` (optional), `headline`, `testimonials` (list: image, imageAlt, name, title, quote)
  - style: `["bold", "modern", "corporate"]`, mood: `["professional", "trustworthy", "energetic"]`
- **Validate:** JSON syntax check
- **Commit:** `feat(components): add metadata.json for IconListSplit, StackedSplit, ShowcaseSplit layouts`

---

### 20. Write metadata.json for all new scroll layouts

- **Status:** created
- **Scope:** components
- **Depends:** 1, 11, 12, 13, 15
- **Files:**
  - `components/library/layouts/scroll/StickyCards/metadata.json` — NEW
  - `components/library/layouts/scroll/ParallaxContent/metadata.json` — NEW
  - `components/library/layouts/scroll/InfiniteScroll/metadata.json` — NEW
  - `components/library/layouts/grid/StaggerFan/metadata.json` — NEW
- **Action:** Write four metadata.json files. Note: StaggerFan is in `layouts/grid/` not `layouts/scroll/` — it is spatially a fan arrangement, not a scroll mechanism.

  **StickyCards** (`layout-stickycards-01`):
  - `"category": "layout/scroll"`, `"purpose": ["features", "services", "process"]`
  - `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": true }`
  - Slots: `headline` (optional), `subheadline` (optional), `cards` (list: icon, image, imageAlt, title, description, ctaText, ctaUrl), `cardHeight` (number, optional)

  **ParallaxContent** (`layout-parallaxcontent-01`):
  - `"category": "layout/scroll"`, `"purpose": ["features", "about", "services"]`
  - `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": true }`
  - Slots: `sections` (list of: image, imageAlt, label, heading, content: {contentHeadline, contentDescription, ctaText, ctaUrl}), `imagePadding` (number, optional)

  **InfiniteScroll** (`layout-infinitescroll-01`):
  - `"category": "layout/scroll"`, `"purpose": ["testimonials"]`
  - `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": false }`
  - Slots: `headline`, `subheadline` (optional), `rows` (3-tuple of lists: image, imageAlt, name, title, quote)

  **StaggerFan** (`layout-staggerfan-01`):
  - `"category": "layout/grid"`, `"purpose": ["testimonials"]`
  - `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": false }`
  - Slots: `testimonials` (list: image, imageAlt, name, title, quote), `sectionHeight` (number, optional)
- **Validate:** JSON syntax check
- **Commit:** `feat(components): add metadata.json for StickyCards, ParallaxContent, InfiniteScroll, StaggerFan`

---

### 21. Update heroes metadata — add acceptsStyleKit and purpose

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/library/heroes/HeroGeometric/metadata.json` — update
  - `components/library/heroes/HeroSplitImage/metadata.json` — update
  - `components/library/heroes/HeroParallaxImages/metadata.json` — update
  - `components/library/heroes/HeroShuffleCards/metadata.json` — update
- **Action:** For each hero metadata.json, add two new top-level fields:
  - `"purpose": ["hero"]` — all heroes have this single purpose
  - `"acceptsStyleKit"` — declare which style kit slots each hero exposes:
    - **HeroGeometric**: `{ "card": false, "background": true, "textDecoration": true, "button": true }` (uses AnimatedSvgBackground, TypeWriter, CtaButton)
    - **HeroSplitImage**: `{ "card": false, "background": false, "textDecoration": true, "button": true }` (uses TypeWriter, CtaButton; image IS the background)
    - **HeroParallaxImages**: `{ "card": false, "background": false, "textDecoration": true, "button": true }` (uses TypeWriter, CtaButton; parallax images ARE the background)
    - **HeroShuffleCards**: `{ "card": false, "background": false, "textDecoration": true, "button": true }` (uses TypeWriter, CtaButton; animated cards are its own pattern)
  - Also update `category` from `"heroes"` to `"hero"` for all four — the current value is plural which is inconsistent with domain rules.
  - Fix `pairsWell` IDs where they reference non-existent IDs (e.g., `"features-grid-01"` → `"layout-cardgrid-01"`, `"cta-banner-01"` → `"cta-banner-01"` [keep for now], `"testimonials-carousel-01"` → remove or update to `"layout-infinitescroll-01"`). Update to real IDs from this migration where mappable; leave others as-is for Phase 3 graph work.
  - Do NOT touch `index.tsx` or `.stories.tsx` for any hero.
- **Validate:** JSON syntax check on all four files
- **Commit:** `feat(components): update heroes metadata with purpose, acceptsStyleKit, corrected category`

---

### 22. Update CTA metadata and fix token anomalies

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/library/cta/CtaBanner/index.tsx` — fix `text-primary-foreground` → `text-primary-content`
  - `components/library/cta/CtaBanner/metadata.json` — add purpose, acceptsStyleKit
  - `components/library/cta/CtaInline/index.tsx` — fix `text-primary-foreground` → `text-primary-content`
  - `components/library/cta/CtaInline/metadata.json` — add purpose, acceptsStyleKit
- **Action:** Read both `index.tsx` files first. Find all occurrences of `text-primary-foreground` and replace with `text-primary-content`. Then update both metadata.json files:
  - Add `"purpose": ["cta"]`
  - Add `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": true }`
  - Update `"category"` to `"cta"` (verify current value is correct)
  - Fix slot naming inconsistency: if `cta_text` (snake_case) exists in slots, rename to `ctaText` (camelCase) to match the component prop name
  - Do NOT change any animation or layout logic
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `fix(components): fix primary-foreground token in CTAs, add purpose and acceptsStyleKit metadata`

---

### 23. Update CtaFloating metadata and remaining component metadata

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/library/cta/CtaFloating/index.tsx` — fix `text-primary-foreground` → `text-primary-content`
  - `components/library/cta/CtaFloating/metadata.json` — add purpose, acceptsStyleKit
  - `components/library/faq/FaqAccordion/metadata.json` — add purpose, acceptsStyleKit
  - `components/library/faq/FaqMinimal/metadata.json` — add purpose, acceptsStyleKit
  - `components/library/faq/FaqSolutions/metadata.json` — add purpose, acceptsStyleKit
  - `components/library/contact/ContactForm/metadata.json` — add purpose, acceptsStyleKit
- **Action:** For each file, add `purpose` and `acceptsStyleKit`. CtaFloating also has the `text-primary-foreground` token bug — fix it. Changes:
  - `CtaFloating`: `"purpose": ["cta"]`, `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": true }`. Also fix `text-primary-foreground` → `text-primary-content` in `CtaFloating/index.tsx` (same token bug as CtaBanner/CtaInline).
  - `FaqAccordion`: `"purpose": ["faq"]`, `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": false }`
  - `FaqMinimal`: same as FaqAccordion
  - `FaqSolutions`: `"purpose": ["faq"]`, `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": true }` (FaqSolutions uses buttonStyles)
  - `ContactForm`: `"purpose": ["contact"]`, `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": true }`
- **Validate:** JSON syntax check
- **Commit:** `feat(components): add purpose and acceptsStyleKit to cta, faq, contact metadata`

---

### 24. Update remaining component metadata — contact, stats, carousel, footer, nav

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/library/contact/ContactMapInfo/metadata.json` — add purpose, acceptsStyleKit
  - `components/library/stats/StatsCountUp/metadata.json` — add purpose, acceptsStyleKit
  - `components/library/carousel/CarouselSwipe/metadata.json` — add purpose, acceptsStyleKit
  - `components/library/carousel/CarouselCards/metadata.json` — add purpose, acceptsStyleKit
  - `components/library/footers/FooterReveal/metadata.json` — add purpose, acceptsStyleKit
- **Action:** Metadata-only additions:
  - `ContactMapInfo`: `"purpose": ["contact"]`, `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": false }`
  - `StatsCountUp`: `"purpose": ["stats"]`, `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": false }`
  - `CarouselSwipe`: `"purpose": ["features", "products", "testimonials"]`, `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": false }`
  - `CarouselCards`: same as CarouselSwipe
  - `FooterReveal`: `"purpose": ["footer"]`, `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": true }`
- **Validate:** JSON syntax check
- **Commit:** `feat(components): add purpose and acceptsStyleKit to contact, stats, carousel, footer metadata`

---

### 25. Update NavbarSticky metadata

- **Status:** created
- **Scope:** components
- **Depends:** 1
- **Files:**
  - `components/library/navigation/NavbarSticky/metadata.json` — add purpose, acceptsStyleKit
- **Action:** Add `"purpose": ["navigation"]` and `"acceptsStyleKit": { "card": false, "background": false, "textDecoration": false, "button": true }`. NavbarSticky uses CtaButton. One file, minimal change.
- **Validate:** JSON syntax check
- **Commit:** `feat(components): add purpose and acceptsStyleKit to NavbarSticky metadata`

---

### WAVE 8 — Cleanup (depends on all prior waves)

---

### 26. Delete old flat layout files

- **Status:** created
- **Scope:** components
- **Depends:** 5, 6, 7, 8, 9, 10, 11, 12 (all new layouts committed)
- **Files:**
  - `components/library/layouts/FeaturesCards/` — delete entire directory (index.tsx, metadata.json, stories.tsx)
  - `components/library/layouts/ContentFeaturesList/` — delete entire directory
  - `components/library/layouts/FeaturesIconList/` — delete entire directory
  - `components/library/layouts/ContentStatementSplit/` — delete entire directory
  - `components/library/layouts/ContentAuthorSplit/` — delete entire directory
  - `components/library/layouts/ContentImageText/` — delete entire directory
  - `components/library/layouts/FeaturesStickyCards/` — delete entire directory
  - `components/library/layouts/FeaturesParallaxContent/` — delete entire directory
- **Action:** Delete all 8 old flat layout directories. These are fully superseded by the new `layouts/grid/`, `layouts/split/`, `layouts/scroll/` components. Use git rm to stage deletions. Verify that TypeScript compiles cleanly before committing — no remaining imports from these paths.
- **Validate:** `cd components && npx tsc --noEmit` (must pass with no errors after deletions)
- **Commit:** `refactor(components): remove old flat layout directories superseded by grid/split/scroll`

---

### 27. Delete testimonials directory

- **Status:** created
- **Scope:** components
- **Depends:** 13, 14, 15, 16 (all testimonial layouts committed to new paths)
- **Files:**
  - `components/library/testimonials/TestimonialsScrolling/` — delete entire directory
  - `components/library/testimonials/TestimonialsStacked/` — delete entire directory
  - `components/library/testimonials/TestimonialsStagger/` — delete entire directory
  - `components/library/testimonials/TestimonialShowcase/` — delete entire directory
  - `components/library/testimonials/` — delete directory itself (will be empty)
- **Action:** Delete all 4 testimonial component directories and the parent `testimonials/` directory. These are fully superseded by ShowcaseSplit, StackedSplit, StaggerFan, InfiniteScroll in the new layout structure. Verify TypeScript compiles cleanly.
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `refactor(components): remove testimonials directory merged into layout system`

---

### 28. Verify Storybook builds clean after full migration

- **Status:** created
- **Scope:** components
- **Depends:** 26, 27 (all deletions done)
- **Files:** No file changes — validation only
- **Action:** Run Storybook build to verify all story imports resolve, no missing components. Specifically check: all stories in `layouts/grid/`, `layouts/split/`, `layouts/scroll/`, `heroes/` and `cta/`, `faq/`, `contact/`, `footers/`, `navigation/`, `stats/`, `carousel/` build without error. If any story still imports from a deleted path, fix the import.
- **Validate:** `cd components && npx storybook build --quiet`
- **Commit:** (no commit if no changes needed; if import fixes required: `fix(components): fix stale story imports after directory migration`)

---

## Expected Outputs

| # | Output | Path | Wired To |
|---|--------|------|----------|
| 1 | StyleKit interface | `components/lib/style-kit.ts` | All layout components via import |
| 2 | Shared motion variants | `components/lib/motion-variants.ts` | All refactored layouts |
| 3 | CardGrid layout | `components/library/layouts/grid/CardGrid/` | Assembler card dispatch |
| 4 | SimpleGrid layout | `components/library/layouts/grid/SimpleGrid/` | Assembler features/benefits sections |
| 5 | StaggerFan layout | `components/library/layouts/grid/StaggerFan/` | Assembler testimonial sections |
| 6 | ImageText layout | `components/library/layouts/split/ImageText/` | Assembler image+text sections |
| 7 | StatementSplit layout | `components/library/layouts/split/StatementSplit/` | Assembler editorial sections |
| 8 | AuthorSplit layout | `components/library/layouts/split/AuthorSplit/` | Assembler about/team sections |
| 9 | IconListSplit layout | `components/library/layouts/split/IconListSplit/` | Assembler icon-feature sections |
| 10 | StackedSplit layout | `components/library/layouts/split/StackedSplit/` | Assembler testimonial sections |
| 11 | ShowcaseSplit layout | `components/library/layouts/split/ShowcaseSplit/` | Assembler testimonial sections |
| 12 | StickyCards layout | `components/library/layouts/scroll/StickyCards/` | Assembler scroll-feature sections |
| 13 | ParallaxContent layout | `components/library/layouts/scroll/ParallaxContent/` | Assembler parallax sections |
| 14 | InfiniteScroll layout | `components/library/layouts/scroll/InfiniteScroll/` | Assembler testimonial marquee |
| 15 | All metadata.json updated | All layout + hero + utility dirs | Composer Agent metadata queries |
| 16 | CardBase with modes | `components/ui/cards/CardBase.tsx` | CardGrid feature/team dispatch |
| 17 | CTA token fixes | `components/library/cta/CtaBanner/index.tsx`, `CtaInline/index.tsx` | Correct visual rendering |

---

## Gotchas

- **FeaturesCards switch/case:** The existing `cardStyle` prop is used in Storybook `argTypes`. When replacing with `styleKit.card`, update `argTypes` to control `styleKit` as a nested object or use a flat `cardStyle` wrapper for Storybook convenience — but the component prop must be `styleKit`. Do not leave both props on the component.

- **ContentImageText missing metadata.json:** This is the only component with no existing metadata. Item 18 creates it for the first time. Executor must create the file, not update.

- **itemSchema inconsistency:** Current metadata uses both `"fields": [...]` array format (HeroGeometric socialProofAvatars) and flat object format. The new metadata must use the `"fields": [...]` array format consistently for all list slot itemSchemas. This is what HeroGeometric uses and is more explicit.

- **StaggerFan token anomaly:** `hsl(var(--bc))` in the boxShadow animate value. The executor MUST read `components/ui/` theme CSS (likely `components/src/themes/default.css` or similar) to confirm the correct CSS custom property name before writing the fixed version. Do not assume — the project uses oklch, not hsl, for custom properties.

- **Motion library split:** New files use `motion/react`. Files that are moves with minimal changes keep `framer-motion`. The executor must not accidentally convert an untouched file (like a hero) to `motion/react` when only adding metadata.

- **No barrel files:** There are no `index.ts` re-exports anywhere. All imports are direct paths. The Assembler references components by direct path. After renaming, the Assembler must update its path registry — but that is out of scope for this migration (Assembler is in a different workspace, and there are currently zero cross-workspace imports).

- **Stories: icons as JSX:** FeaturesIconList stories pass `icon: <FiCalendar />` which is not JSON-serializable. The new IconListSplit stories should use emoji strings (`icon: "📅"`) or the existing convention from FeaturesIconList stories — check what the current FeaturesIconList stories use and match it.

- **Storybook glob coverage:** Storybook config uses `"../library/**/*.stories.@(ts|tsx)"`. New stories under `layouts/grid/`, `layouts/split/`, `layouts/scroll/` are automatically discovered. No config change needed.

- **Wave 7 can parallelize with Waves 3-6:** Metadata items 17-25 only touch `.json` and occasionally `.tsx` (token fixes). They don't import new types from Wave 1 in the JSON files themselves. However, they DO depend on the new component IDs for `pairsWell` arrays, so they should be written after the component directories are named (which happens when Wave 3-6 items are started, even before they're committed).

- **Git add specificity:** Per git rules, never `git add .`. Each commit must `git add` only the specific files listed in that item's Files section.

- **Parallel testimonial migration risk:** TestimonialsStagger has a token bug (`hsl(var(--bc))`). This file is being fully rewritten for StaggerFan. The executor must not copy the bug — fix it in the rewrite.

- **Stagger timing divergence:** ContentImageText uses `staggerChildren: 0.08` in `containerVariants` while ContentStatementSplit uses `staggerChildren: 0.1`. The shared `containerVariants` will standardize on `0.08`. StatementSplit will silently change from 0.1 to 0.08 — this is an intentional alignment to a consistent library value.

- **ContentStatementSplit accentReveal:** The `accentReveal` variant has a `delay: 0.3` which is not present in the other shared variants. The `motion-variants.ts` file (item 2) must include this with the delay baked in. If it causes issues for other components, make `delay` an optional parameter or keep it as a separate named export `accentRevealDelayed`.

---

## Execution Summary

| # | Item | Commit | Status | Notes |
|---|------|--------|--------|-------|
| 1 | Create StyleKit types | — | created | — |
| 2 | Extract motion variants | — | created | — |
| 3 | CardBase content modes | — | created | — |
| 4 | CardRevealSlide mode prop | — | created | — |
| 5 | CardGrid layout | — | created | — |
| 6 | SimpleGrid layout | — | created | — |
| 7 | ImageText layout | — | created | — |
| 8 | StatementSplit layout | — | created | — |
| 9 | AuthorSplit layout | — | created | — |
| 10 | IconListSplit layout | — | created | — |
| 11 | StickyCards layout | — | created | — |
| 12 | ParallaxContent layout | — | created | — |
| 13 | InfiniteScroll layout | — | created | — |
| 14 | StackedSplit layout | — | created | — |
| 15 | StaggerFan layout | — | created | — |
| 16 | ShowcaseSplit layout | — | created | — |
| 17 | Metadata: grid layouts | — | created | — |
| 18 | Metadata: split layouts A | — | created | — |
| 19 | Metadata: split layouts B | — | created | — |
| 20 | Metadata: scroll layouts | — | created | — |
| 21 | Heroes metadata update | — | created | — |
| 22 | CTA token fix + metadata | — | created | — |
| 23 | FAQ/contact metadata | — | created | — |
| 24 | Stats/carousel/footer metadata | — | created | — |
| 25 | NavbarSticky metadata | — | created | — |
| 26 | Delete old flat layouts | — | created | — |
| 27 | Delete testimonials dir | — | created | — |
| 28 | Storybook validation | — | created | — |
```

---

## Summary for executor

**28 work items across 8 dependency waves.** The execution order is strict within waves but items within Wave 7 (metadata) can run in parallel with Waves 3-6 (layout creation). All validation uses `cd components && npx tsc --noEmit`; Storybook build is used at items 5 and 28.

**Critical files the executor must read before writing:**
- `/components/library/layouts/FeaturesCards/index.tsx` — before item 5 (CardGrid)
- `/components/lib/` theme CSS — before item 15 (StaggerFan token fix)
- `/components/library/layouts/FeaturesIconList/FeaturesIconList.stories.tsx` — before item 10 (icon JSX vs string convention)
- `/components/ui/cards/CardBase.tsx` — before item 3
- `/components/library/layouts/ContentStatementSplit/index.tsx` — before item 2 (accentReveal exact definition)

**New directories to create (do not exist yet):**
- `components/library/layouts/grid/CardGrid/`
- `components/library/layouts/grid/SimpleGrid/`
- `components/library/layouts/grid/StaggerFan/`
- `components/library/layouts/split/ImageText/`
- `components/library/layouts/split/StatementSplit/`
- `components/library/layouts/split/AuthorSplit/`
- `components/library/layouts/split/IconListSplit/`
- `components/library/layouts/split/StackedSplit/`
- `components/library/layouts/split/ShowcaseSplit/`
- `components/library/layouts/scroll/StickyCards/`
- `components/library/layouts/scroll/ParallaxContent/`
- `components/library/layouts/scroll/InfiniteScroll/`
- `components/lib/style-kit.ts` (file in existing `components/lib/` dir)
- `components/lib/motion-variants.ts` (file in existing `components/lib/` dir)