# Integration Research — Component Library Architecture

## 1. Cross-Workspace Imports

**Zero cross-workspace imports.** No files in `dashboard/`, `agents/`, or `infra/` import from `components/library/`. The component library is entirely self-contained — only used within `components/` workspace. Migration cannot break other workspaces.

## 2. UI Primitive Dependency Graph

| Library Component | UI Imports |
|---|---|
| FeaturesCards | `@ui/button` (buttonStyles), ALL 6 card primitives |
| FeaturesStickyCards | `@ui/button` (CtaButton, CtaVariant, ColorScheme) |
| FeaturesParallaxContent | `@ui/button` (CtaButton, CtaVariant, ColorScheme) |
| FeaturesIconList | none (only @lib/utils) |
| ContentImageText | `@ui/button` (CtaButton, CtaVariant, ColorScheme) |
| ContentFeaturesList | `@ui/button` (CtaButton, CtaVariant, ColorScheme) |
| ContentAuthorSplit | none |
| ContentStatementSplit | none |
| HeroGeometric | `@ui/button`, `@ui/text-decorations/TypeWriter`, `@ui/backgrounds/AnimatedSvgBackground` |
| HeroSplitImage | `@ui/button`, `@ui/text-decorations/TypeWriter` |
| HeroParallaxImages | `@ui/button`, `@ui/text-decorations/TypeWriter` |
| HeroShuffleCards | `@ui/button` (Button + CtaButton), `@ui/text-decorations/TypeWriter` |
| TestimonialsScrolling | `@ui/cards/TestimonialCard` |
| TestimonialsStacked | `@ui/cards/TestimonialCard` |
| TestimonialsStagger | `@ui/cards/TestimonialCard` |
| TestimonialShowcase | none |
| FooterReveal | `@ui/button` (CtaButton) |
| NavbarSticky | `@ui/button` (CtaButton), `@ui/ClientSideLink` |
| FaqSolutions | `@ui/button` (buttonStyles) |

Internal `@ui` → `@ui` deps: CardBase imports buttonStyles, CardProduct imports Button. No circular dependencies.

## 3. Git Status — Current State

Branch `feat/component-library-v1` has a partially completed migration:

**Already moved (staged):**
- `hero/` → `heroes/` (all 4 heroes)
- `features/FeaturesCards|ParallaxContent|StickyCards/` → `layouts/`
- `ui/` flat card/background files → `ui/cards/`, `ui/backgrounds/` subdirs

**Current filesystem truth:**
```
components/library/
  heroes/          ← migrated from hero/
  layouts/         ← partially migrated from features/ + new content components
  testimonials/    ← unchanged, needs restructuring
  cta/             ← untouched
  contact/         ← untouched
  faq/             ← untouched
  footers/         ← untouched
  navigation/      ← untouched
  stats/           ← untouched
  carousel/        ← untouched
```

**Still to move:**
- All `layouts/` components → `layouts/grid/`, `layouts/split/`, `layouts/scroll/`
- All `testimonials/` → merge into layouts/
- All metadata updates

## 4. Build System

- Package: `@sitegen/components`, private, no build output — consumed via TypeScript source
- `type-check`: `tsc --noEmit`
- **Storybook globs**: `"../library/**/*.stories.@(ts|tsx)"`, `"../ui/**/*.stories.@(ts|tsx)"` — recursive, directory changes auto-discovered
- **Tailwind content**: `"./library/**/*.{ts,tsx}"`, `"./ui/**/*.{ts,tsx}"` — recursive, transparent to restructuring
- No barrel/index.ts files anywhere — all imports are direct paths

## 5. Path Aliases

```json
"@components/*": ["./library/*"]
"@ui/*":         ["./ui/*"]
"@lib/*":        ["./lib/*"]
"@hooks/*":      ["./hooks/*"]
```

Storybook webpack mirrors these. No changes needed for subdirectory restructuring.

## 6. Risk Assessment

### Highest complexity: FeaturesCards
- 6 card imports, 7-way switch, 4 distinct TS item interfaces
- Full rewrite — card choice moves out, content modes replace union type
- This is the only component where the refactor changes core shape

### Second: FeaturesStickyCards
- Complex scroll-linked animation with sticky positioning
- But: scroll mechanism stays intact. Only directory rename + style kit props.

### Third: TestimonialsStagger
- Custom fan/carousel with spring animation, geometry-based positioning
- Becomes layout with purpose "testimonials" + style kit card selection

### Low risk (most components):
- ContentStatementSplit, ContentAuthorSplit, ContentImageText, FeaturesIconList — straightforward framer-motion + props. Mainly directory move + style kit props + metadata update.

## 7. Migration Dependency Order

1. **UI Primitives** — already at new paths. Verify all imports work. No changes needed.
2. **Define StyleKit type** — shared TypeScript interface
3. **Extract shared motion variants** — `@lib/motion-variants.ts` (used by 6+ components)
4. **Create layout subdirectories** — `layouts/grid/`, `layouts/split/`, `layouts/scroll/`
5. **Migrate simple layouts first** — ContentStatementSplit, ContentAuthorSplit, ContentImageText, FeaturesIconList, ContentFeaturesList → split/grid dirs
6. **Migrate testimonials** — all 4 → appropriate layout subdirs
7. **Migrate scroll layouts** — FeaturesStickyCards, FeaturesParallaxContent → scroll/
8. **Migrate FeaturesCards** (most complex) → layouts/grid/CardGrid with style kit
9. **Update all metadata.json** — purpose[], acceptsStyleKit, new category values
10. **Update heroes metadata** — add acceptsStyleKit declarations
11. **Update remaining components metadata** — cta, faq, contact, carousel, stats, footer, nav

## 8. Files — Delete vs Rename vs New

**Already deleted (staged):** hero/ (4×3 files), features/ (3×3 files)

**Will delete:** All files in current `layouts/` flat dir and `testimonials/` dir (after creating new versions in subdirs)

**Net new directories:**
- `layouts/grid/` — CardGrid, SimpleGrid, IconGrid
- `layouts/split/` — ImageText, StatementSplit, AuthorSplit, ShowcaseSplit, StackedSplit
- `layouts/scroll/` — StickyCards, ParallaxContent, InfiniteScroll, StaggerFan

**Untouched (metadata-only changes):** cta/ (3), contact/ (2), faq/ (3), footers/ (1), navigation/ (1), stats/ (1), carousel/ (2), heroes/ (4)

## 9. Gotchas

- **Dual motion library:** `motion/react` vs `framer-motion`. New files should use `motion/react`.
- **ContentImageText missing metadata.json** — must be created during migration
- **itemSchema format inconsistency** — `"fields": [...]` vs flat object. Pick one.
- **TestimonialsScrolling 3-row tuple** — `rows: [T[], T[], T[]]` hardcoded. Needs generalization.
- **Token anomalies:** TestimonialsStagger `hsl(var(--bc))`, CTAs `text-primary-foreground`
- **Storybook ThemeDecorator** imports from `../src/themes/` — unaffected by library restructuring
- **No barrel files** — no index.ts to update, but Assembler needs direct paths

## 10. Open Questions for Planner

1. FeaturesIconList — grid or split layout? Has icon list (grid-like) but also circular image (split-like).
2. ContentAuthorSplit — unique data shape (banner + avatar + bio). Merge into split layout or keep separate?
3. TestimonialShowcase vs ContentAuthorSplit — both are split with image+text. Collapse into one?
4. CTA components (CtaBanner/Inline/Floating) are draft quality — fix token issues in this migration or defer?
5. `TestimonialCard` — stays as separate primitive or becomes a content mode on other cards?
