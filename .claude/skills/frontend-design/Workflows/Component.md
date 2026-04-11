# Workflow: Component

Scaffold a new library component following SiteGen conventions.

## Input
`$ARGUMENTS` after "component" — the component name (PascalCase) and its category:
- `component HeroMinimal hero` — hero section component
- `component FeaturesAlternating features` — features section component
- `component CtaFloating cta` — CTA component

If no category is given, infer it from the name prefix or ask.

## Steps

### 1. Determine placement
Target directory: `components/library/<category>/<ComponentName>/`

Verify the category exists. Valid categories from the domain rules:
- `hero` — full-width opening sections
- `features` — feature showcases (grids, lists, alternating)
- `cta` — call-to-action sections (banners, inline, floating)
- `testimonials` — social proof sections
- `contact` — forms, maps, info
- `pricing` — comparison tables, tiered cards
- `faq` — accordions, two-column layouts
- `footers` — site footers

### 2. Design the slot interface
Define what AI-generated content this component needs:
- **Text slots:** headline, subheadline, description, cta_text, etc. — include `maxLength` constraints
- **URL slots:** cta_url, link — for navigation
- **Image slots:** image, background — include `aspectRatio`
- **List slots:** features, items — for repeated content groups

Map these to a TypeScript props interface.

### 3. Create the three required files

**`index.tsx`** — the React component:
- Props interface matching the slots
- Optional `className` prop for composition
- `cn()` from `@lib/utils` for class merging
- Semantic color tokens (`bg-base-100`, `text-base-content`, `bg-primary`, etc.)
- `@ui/` primitives (`Button` for buttons, `buttonStyles()` for button-styled links) for interactive elements
- Semantic HTML (`section`, `h1`/`h2`, `nav`, etc.)
- Mobile-first responsive layout
- Add `"use client"` ONLY if using Framer Motion, hooks, or event handlers

**`metadata.json`** — component metadata:
- `id`: kebab-case with number suffix (e.g., `hero-minimal-01`)
- `name`: human-readable name
- `category`: matches directory
- `style[]`: from [modern, classic, editorial, luxury, playful, minimal, bold, corporate]
- `mood[]`: from [professional, elegant, fun, serious, friendly, energetic, calm, trustworthy]
- `layout`: describes the layout pattern (split, centered, grid, etc.)
- `density`: low, medium, or high
- `slots[]`: array of slot definitions with name, type, and constraints
- `mobileBehavior`: stack, scroll, or collapse
- `pairsWell[]`: component IDs that work well adjacent
- `pairsPoorly[]`: component IDs that clash

**`<ComponentName>.stories.tsx`** — Storybook story:
- Meta with `title: "<Category>/<ComponentName>"`
- `layout: "fullscreen"` for section-level components
- Default story with realistic content in all slots
- Additional variants if relevant (long text, minimal content)

### 4. Verify
- No raw Tailwind colors (only semantic tokens)
- No `dark:` variants
- No inline styles
- Accessible (semantic HTML, ARIA where needed)
- Mobile-responsive (stacks on small screens)
- Slots in `metadata.json` match props in `index.tsx`
- Story covers the default state with realistic content
- `cn()` used for any dynamic classes
