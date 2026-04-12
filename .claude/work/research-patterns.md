# Pattern Research — Component Library Architecture

## 1. How Components Compose Primitives

### Three representative traces:

**FeaturesCards** (deepest import fan):
`framer-motion` → `@lib/utils` (cn) → `@ui/button` (buttonStyles) → 6 card primitives from `@ui/cards/`
Contains a `switch/case` card dispatcher — the only component with this pattern.

**FeaturesParallaxContent** (scroll-driven):
`framer-motion` (useScroll, useTransform, useReducedMotion) → `@lib/utils` → `@ui/button` (CtaButton)
Private sub-components: `StickyImage`, `OverlayCopy`, `ContentBlock` — each receives scroll MotionValues as props.

**TestimonialsStagger** (card consumer):
`framer-motion` → `@lib/utils` → `@ui/cards/TestimonialCard` (single card primitive with multi-layout support)

### Reusable patterns across all:
- `useReducedMotion()` at section root, passed down as boolean
- `cn()` for conditional Tailwind
- `whileInView` + `viewport: { once: true, margin: "-100px" }` — repeated verbatim everywhere
- Private sub-components in same file (no separate files)
- Section wrapped in `<section>` with hardcoded `bg-base-100` or `bg-neutral`
- Animation variants (`containerVariants`, `fadeUp`, `imageReveal`) duplicated across 6+ components — should be extracted

## 2. Card Rendering Pattern (FeaturesCards)

Current dispatcher:
```
cardStyle prop → switch/case:
  "flip"           → renderFlipCards(cards as FlipCardItem[], flipDirection)
  "reveal"         → renderRevealCards(cards as FeatureCardItem[])
  "magic-gradient"→ renderMagicCards(cards as FeatureCardItem[], "gradient")
  "magic-orb"     → renderMagicCards(cards as FeatureCardItem[], "orb")
  "product"       → renderProductCards(cards as ProductCardItem[])
  "outline"       → CardOutlineGrid (early return, own grid)
  default "base"  → renderBaseCards(cards as FeatureCardItem[])
```

Key observations:
- `cards` prop uses a union type — callers must match item shape to cardStyle
- `CardMagic` accepts `children` while all others accept typed props
- `renderMagicCards` builds JSX and passes as children to `<CardMagic>` — this pattern can be preserved
- `CardFlip` receives `front`/`back` as ReactNode — most coupled renderer
- After migration: card choice moves to style kit, content shape becomes the "mode"

## 3. Motion Library Usage

Both `framer-motion` and `motion/react` coexist. At v12 they're the same library, different import path.

**`motion/react` (newer):** HeroGeometric, AnimatedSvgBackground, GradientBars, LineShadowText, Reveal, TextReveal, Highlighter, WhatsAppFloat, CursorFollow

**`framer-motion` (older, ~90% of codebase):** All cards, all layouts, all testimonials, 3 of 4 heroes, FAQ, carousel, navigation, Modal

Target: `motion/react` is forward path. New files should use `motion/react`.

## 4. Prop Patterns

**Pattern A — Variant enum with switch dispatch:** `cardStyle`, `CtaButton.variant`. String union → switch/case selects sub-component.

**Pattern B — Boolean flags + optional prop pairs:** `gridBackground`, `whatsappUrl+whatsappLabel`. Undefined = feature doesn't render.

**Pattern C — Sub-layout selection:** `imagePosition: "left"|"right"`, `layout: "horizontal"|"vertical"|"compact"`. 2-3 value string controls flex direction.

**Default values:** All at function signature level. No defaultProps, no config objects.

## 5. Style Kit Prop Recommendation

Based on existing patterns, the `(ctaStyle, ctaColorScheme)` pair is the direct precedent — already threaded through every CTA-bearing component.

**Recommended pattern — single `styleKit` object prop:**
```tsx
interface StyleKit {
  card?: CardStyle;           // "base"|"flip"|"reveal"|"magic-gradient"|...
  ctaVariant?: CtaVariant;    // "default"|"slide"|"drawOutline"|...
  ctaColorScheme?: ColorScheme;
  background?: BackgroundVariant;
  textDecoration?: TextDecorationVariant;
}
```

- Mirrors existing ctaStyle/ctaColorScheme threading
- Single prop the Assembler passes
- Optional with defaults (backward compatible)
- Plain object — no React context (matches existing patterns, layouts don't nest deeply)

**React context would be wrong** — no existing component uses context. All configuration is pure prop threading.

**CardMagic tension:** It accepts `children` while other cards accept typed props. Content mode rendering happens in the layout's renderer, which builds JSX and passes it. The current `renderMagicCards` in FeaturesCards already does this.

## 6. Storybook Patterns

Consistent across all stories:
```tsx
const meta: Meta<typeof Component> = {
  title: "Category/ComponentName",
  component: Component,
  parameters: { layout: "fullscreen" },
  argTypes: { enumProp: { control: "select", options: [...] } },
};
```
- Story names are scenario-based (SaasProductivity, DigitalAgency)
- Each story fills full args — no inheritance/spread
- `argTypes` with `control: "select"` for enum props
- Icons passed as JSX in args (not JSON-serializable — known issue)
- Scroll-dependent components use `decorators`

After migration: `cardStyle` arg replaced by `styleKit` prop with nested controls.

## 7. Import Alias Resolution

```json
"@components/*": ["./library/*"]
"@ui/*":         ["./ui/*"]
"@lib/*":        ["./lib/*"]
"@hooks/*":      ["./hooks/*"]
```

Storybook webpack mirrors tsconfig. No changes needed for directory restructuring — all globs are recursive.

## Reference Patterns for Executor

| Pattern | File | What to follow |
|---|---|---|
| Card dispatcher (switch/case) | `layouts/FeaturesCards/index.tsx` | Pattern for style kit card selection |
| CTA threading | `layouts/FeaturesStickyCards/index.tsx` | How (ctaStyle, ctaColorScheme) flows |
| Scroll sub-components | `layouts/FeaturesParallaxContent/index.tsx` | Private sub-components with MotionValues |
| Duplicated animation variants | `layouts/ContentImageText/index.tsx` | `containerVariants`, `fadeUp` — extract to shared |
| TestimonialCard multi-layout | `ui/cards/TestimonialCard.tsx` | Single card with modes via `layout` prop |
| CardMagic children pattern | `layouts/FeaturesCards/index.tsx` (`renderMagicCards`) | Wrapper cards with pre-built JSX |

## Gotchas

- **Hardcoded bg on sections:** Every section has `bg-base-100` or `bg-neutral` in className. Background from style kit needs to override or complement this.
- **Animation variants duplicated:** `containerVariants`, `fadeUp`, `imageReveal` are copy-pasted across 6+ components. Migration should extract to `@lib/motion-variants.ts`.
- **Icons as JSX in stories:** `icon: <FiCalendar />` is not serializable. Need icon name string mapping or emoji convention.
- **CardOutline fuses layout+card:** Grid structure is built into the card primitive — needs special handling.
