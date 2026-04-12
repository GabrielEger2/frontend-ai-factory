# Domain Research — Component Library Architecture

## Card Primitives (`components/ui/cards/`)

### CardBase
- Props: `image`, `imageAlt`, `title`, `description`, `ctaText?`, `ctaUrl?`, `badge?`, `className?`
- Visual: `bg-base-200`, `border-base-300`, `rounded-box`, `shadow-sm`, framer-motion fade-up
- Content mode fit: **feature** (current), **team** (needs role field)
- Imports: `buttonStyles` from `@ui/button`

### CardFlip
- Props: `front: ReactNode`, `back: ReactNode`, `duration?`, `flipDirection?`, `flipRotation?`
- Pure container — accepts ReactNode on front/back. Already mode-agnostic.
- Fixed default: `h-72 w-56` — caller must override
- Lowest coupling — only framer-motion + cn

### CardMagic
- Props: `children?: ReactNode`, `className?`, `gradientSize?`, `gradientFrom?`, `gradientTo?`, mode (`gradient`|`orb`)
- Pure wrapper — children flow through. No content fields.
- Hardcoded fallback colors (`#9E7AFF`, `#FE8BBB`, `#ee4f27`, `#6b21ef`) — style kit should override
- Uses framer-motion for spring orb physics

### CardOutline
- Exports: `CardOutlineGrid` (container + custom cursor) and `CardOutlineItem`
- `CardOutlineItem`: `image`, `imageAlt`, `title`, `url`
- Both layout AND card fused — grid structure is built-in
- Minimal navigation card — image background + gradient overlay + title + arrow

### CardProduct
- Props: `image`, `imageAlt`, `title`, `price`, `originalPrice?`, `currency?`, `rating?`, `badge?`, `onAddToCart?`, `onWishlist?`
- Most specialized — entirely **product** mode. Cannot reuse for other modes.
- Imports `Button` from `@ui/button`

### CardRevealSlide
- Props: `image`, `imageAlt`, `title`, `description`, `ctaText?`, `ctaUrl?`
- Image slides to top-left on hover, revealing text. Fixed `h-[300px]`.
- Feature-like content shape

### TestimonialCard
- Props: extends `TestimonialItem` (image, imageAlt, name, title, quote) + `layout?`, `inverted?`
- Three layout variants: **horizontal** (marquee), **vertical** (stagger fan), **compact** (stacked slider)
- Already content-aware with modes via `layout` prop. No motion library.

## Background Primitives (`components/ui/backgrounds/`)

| Primitive | Animation | Self-positioning | Used by |
|---|---|---|---|
| AnimatedSvgBackground | SVG pathLength on scroll | `absolute inset-0 -z-10` | HeroGeometric only |
| RetroGrid | WebGL canvas + rAF loop | `absolute size-full` | Nothing in library |
| DotPattern | None (static SVG) | `absolute inset-0` | Nothing |
| StripedPattern | None (static SVG) | `absolute inset-0` | Nothing |
| GradientBars | Breathing motion via motion/react | `absolute inset-0 z-0` | Nothing |
| InteractiveGridPattern | Cursor-reactive SVG | `pointer-events-auto` | Nothing (stories only) |

Only AnimatedSvgBackground is used by any library component. Other 5 exist only as Storybook demos.

## Text Decorations (`components/ui/text-decorations/`)

| Primitive | Props summary | Used by |
|---|---|---|
| TypeWriter | `text: string\|string[]`, speed, cursor options, `startOnView` | All 4 heroes |
| Highlighter | `children: ReactNode`, action (highlight/underline/box/circle/strike-through/crossed-off/bracket) | Nothing |
| LineShadowText | `children: string`, `shadowColor?`, polymorphic `as` | Nothing |
| Reveal | `children: ReactNode`, `color?` — scroll-triggered overlay slide | Nothing |
| TextReveal | `children: string`, blur/split/delay options | Nothing |

TypeWriter used by all heroes. Other 4 decorations unused by any library component.

## Button System (`components/ui/button.tsx`)

`CtaButton` is the unified dispatcher: `variant: CtaVariant` + `colorScheme: ColorScheme`
- Variants: default, slide, dotExpand, drawOutline, glow
- ColorSchemes: primary, secondary, accent, neutral
- Imported by: all 4 heroes, FeaturesParallaxContent, FeaturesStickyCards, ContentFeaturesList, ContentImageText, TestimonialShowcase, FooterReveal, NavbarSticky

Style kit `buttonVariant` + `buttonColorScheme` maps exactly to existing `CtaVariant` + `ColorScheme`.

## Library Components — Coupling Analysis

| Component | Card imports | Background | TextDecoration | CtaButton | Coupling |
|---|---|---|---|---|---|
| HeroGeometric | 0 | AnimatedSvgBackground | TypeWriter | yes | medium |
| HeroSplitImage | 0 | inline CSS grid | TypeWriter | yes | low |
| HeroParallaxImages | 0 | none | TypeWriter | yes | low |
| HeroShuffleCards | 0 | none | TypeWriter | yes | low |
| FeaturesCards | **ALL 6** | none | none | buttonStyles | **VERY HIGH** |
| FeaturesParallaxContent | 0 | none | none | yes | low |
| FeaturesStickyCards | 0 | none | none | yes | low |
| FeaturesIconList | 0 | none | none | none | very low |
| ContentStatementSplit | 0 | none | none | none | very low |
| ContentFeaturesList | 0 | none | none | yes | low |
| ContentAuthorSplit | 0 | none | none | none | very low |
| ContentImageText | 0 | none | none | yes | low |
| TestimonialShowcase | 0 | none | none | none | very low |
| TestimonialsScrolling | TestimonialCard | none | none | none | low |
| TestimonialsStacked | TestimonialCard | none | none | none | low |
| TestimonialsStagger | TestimonialCard | none | none | none | low |

## Metadata — Current Patterns

All metadata have: `id`, `name`, `category`, `style[]`, `mood[]`, `layout`, `density`, `slots[]`, `mobileBehavior`, `pairsWell[]`, `pairsPoorly[]`

### Issues found:
- **itemSchema format split**: some use `"fields": [...]` array, some use flat object `{ "image": {...} }`
- **Slot naming**: CtaBanner uses `cta_text` (snake_case) but component prop is `ctaText` (camelCase)
- **pairsWell IDs**: reference non-existent component IDs (e.g., `features-grid-01`)
- **Missing metadata**: ContentImageText has no metadata.json
- **Token anomalies**: TestimonialsStagger uses `hsl(var(--bc))` (wrong), CTAs use `text-primary-foreground` (should be `text-primary-content`)

### New fields needed:
- `purpose: string[]` — features, testimonials, team, products, services, about, process
- `acceptsStyleKit: { card: boolean, background: boolean, textDecoration: boolean, button: boolean }`
- `category` restructured: `"layout/grid"`, `"layout/split"`, `"layout/scroll"`, `"hero"`, etc.

## Theme System

- CSS custom properties with `[data-theme]` attribute switching
- Token categories: colors (oklch), radius (3 levels), sizes, border, effects (depth/noise — unused), fonts
- Only 1 theme: `default` (light + dark)
- Tailwind config wraps tokens via `oklch()` helper
- `--depth` and `--noise` tokens defined but unused
- Style kit sits ON TOP of theme — theme gives colors/fonts, style kit picks which primitives to use

## Content Modes for Cards (Migration Design)

Based on current card prop interfaces, the content modes would be:

| Mode | Fields | Cards that support it |
|---|---|---|
| feature | icon?, image?, title, description, ctaText?, ctaUrl? | CardBase, CardRevealSlide, CardMagic(wrapper), CardFlip(wrapper) |
| testimonial | image, name, title/role, quote | TestimonialCard (already has modes) |
| product | image, title, price, originalPrice?, rating?, badge? | CardProduct |
| team | image, name, role, bio?, ctaUrl? | CardBase(adapted), CardMagic(wrapper) |
| outline | image, title, url | CardOutline |

CardFlip and CardMagic are wrappers — they accept any content mode's JSX as children. The layout builds the content, the wrapper provides the visual treatment.
