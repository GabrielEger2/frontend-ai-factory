# Workflow: Create

Adapt reference code into a SiteGen library component with metadata and rich Storybook stories.

## Input

`$ARGUMENTS` after "create" — a natural language brief that includes:
- **What to build** — component description, category hints, interactive behavior
- **Variations requested** — typewriter headline, with/without email, alternative card content, etc.
- **Content context** — what the slots represent in a real use case (testimonials, products, team members, etc.)
- **Reference code** — pasted source code to adapt (React/JSX, any styling approach)

### Example invocations

```
/frontend-design create a component for this hero with cards, add a variation
with typewriter for the last hero line, one with an email or not, add for
context that these cards can serve as testimonials or products

<pasted DragShuffleHero code>
```

```
/frontend-design create a pricing section from this code, add a toggle for
monthly/annual billing, add a highlighted "popular" variant

<pasted PricingTable code>
```

```
/frontend-design create an FAQ accordion from this reference, add a variant
with search filtering, one compact and one expanded style

<pasted FAQ code>
```

## Steps

### 1. Infer component name and category

The user won't pass structured names like `component HeroMinimal hero`. Infer from the brief + code:

1. **Category** — match to a valid category from the description keywords and code structure:
   - `hero` — "hero", full-width opening sections, prominent headline + CTA
   - `features` — "features", "benefits", grid/list showcases
   - `cta` — "call to action", "newsletter", "signup", conversion-focused
   - `testimonials` — "testimonials", "reviews", "social proof", quotes
   - `contact` — "contact", "form", "map"
   - `pricing` — "pricing", "plans", "tiers"
   - `faq` — "faq", "accordion", "questions"
   - `footers` — "footer"
   - `navigation` — "navbar", "nav", "header", "menu"

2. **Component name** — derive a PascalCase name that describes the layout + distinctive feature:
   - Reference exports `DragShuffleHero` + brief says "hero with cards" → `HeroShuffleCards`
   - Reference has a pricing table with toggles → `PricingToggle`
   - Keep it short (2-3 words max), descriptive, category-prefixed

3. **Target directory** — `components/library/<category>/<ComponentName>/`

4. **Confirm with the user** if the category or name is ambiguous (e.g., "this could be a hero or a CTA — which fits your library better?")

### 2. Analyze the reference code

Read the pasted code and extract (don't output this table — it's your internal analysis):

| What | How |
|---|---|
| **Layout structure** | Split, centered, grid, stacked — what's the visual arrangement? |
| **Interactive features** | Drag, shuffle, carousel, accordion, hover effects, scroll triggers |
| **Sub-components** | Internal components (Card, Item, etc.) — keep them in the same file or split if complex |
| **Hardcoded content** | Headlines, descriptions, testimonials, CTAs, images — these become slots |
| **State management** | useState, useRef, event handlers — determines if `"use client"` is needed |
| **Animation** | CSS transitions, Framer Motion, or other — adapt to project Framer Motion conventions |
| **Styling approach** | Raw Tailwind, CSS modules, styled-components — adapt to semantic tokens |
| **Dependencies** | External libraries used — check if they exist in `components/package.json` |

### 3. Parse the brief for variations

Extract every variation the user described. Common patterns:

| Brief pattern | Storybook treatment |
|---|---|
| "with typewriter" | Story variant using `<TypeWriter>` from `@ui/TypeWriter` in the headline |
| "with/without email" | Two stories: `WithEmailCapture` and `WithoutEmail` (CTA button only) |
| "cards as testimonials or products" | Two stories with different slot content: `TestimonialCards` and `ProductCards` |
| "dark/light version" | Storybook theme decorator handles this — no extra story needed |
| "with video background" | Story variant with video slot filled |
| "minimal vs full" | `Minimal` story (fewer slots filled) and `Full` story (all slots) |

Each variation becomes a named Storybook export with realistic content.

### 4. Design the slot interface

Map hardcoded content from the reference code to typed slot props:

1. **Identify every piece of content** — headlines, body text, button labels, images, list items, testimonials, etc.
2. **Group repeated content** — if there are 3 cards with the same shape, that's a `list` slot with an item schema
3. **Add constraints** — `maxLength` for text, `aspectRatio` for images, `maxItems` for lists
4. **Include optional slots** — email input, secondary CTA, badge text — these enable the variations
5. **Always include `className?: string`** — for composition

Props interface example for a hero with draggable cards:

```tsx
export interface HeroCardsProps {
  headline: string;
  /** If provided, the last line cycles through these strings with a typewriter effect */
  headlineRotatingWords?: string[];
  subheadline: string;
  ctaText: string;
  ctaUrl: string;
  /** When provided, shows an email capture form instead of a plain CTA */
  emailPlaceholder?: string;
  cards: Array<{
    image: string;
    imageAlt: string;
    quote: string;
    author: string;
  }>;
  className?: string;
}
```

Optional props (`headlineRotatingWords?`, `emailPlaceholder?`) are what drive the story variations — present = variant active, absent = variant off.

### 5. Adapt the component

Create `index.tsx` following these adaptation rules:

#### Styling
- Replace ALL raw Tailwind colors with semantic tokens:
  - `bg-slate-900` → `bg-neutral` or `bg-base-300`
  - `text-slate-50` → `text-neutral-content` or `text-base-content`
  - `text-slate-400` → `text-base-content/60`
  - `bg-slate-800` → `bg-base-200`
  - `bg-indigo-600` → `bg-primary`
  - `text-indigo-400` → `text-primary`
  - `border-slate-700` → `border-base-300`
- Use `cn()` from `@lib/utils` for all dynamic/conditional classes
- No inline `style={{}}` except for truly dynamic values (positions from animation)
- No `dark:` variants — the token system handles theme switching

#### Interactive elements
- Buttons → `<Button>` from `@ui/button` for actual `<button>` elements
- Button-styled links → `buttonStyles()` from `@ui/button` returns a class string for `<a>` or other non-button elements
- Inputs → style with semantic tokens, keep the same structure
- Links → `<ClientSideLink>` from `@ui/ClientSideLink` for internal navigation

#### Animation
- Keep Framer Motion `motion.*` elements — they're already the right library
- Adapt timing to project conventions (see `references/animation.md`):
  - Drag interactions: keep original feel, respect 150-200ms transitions
  - Scroll reveals: `whileInView` with `viewport={{ once: true, margin: "-100px" }}`
  - Stagger: 50-80ms between items
- Add `"use client"` directive at top of file

#### TypeWriter integration
When the brief requests typewriter:
- Import `{ TypeWriter }` from `@ui/TypeWriter`
- Split the headline: static prefix + rotating part
- Use the `headlineRotatingWords` prop to feed the `<TypeWriter text={...} />` component
- The story controls which words rotate

#### Email capture integration
When the brief requests email/newsletter:
- Make the email form conditional on `emailPlaceholder` prop presence
- When `emailPlaceholder` is absent, render a standard CTA button
- Use `onSubmit` prop (`(email: string) => void`) for form handling
- Style the input with semantic tokens

#### Sub-components
- Keep Card, Item, etc. in the same file as private components (not exported)
- If a sub-component exceeds ~80 lines, extract to a separate file in the same directory
- Sub-components receive typed props, not `any`

#### Content slots
- Replace ALL hardcoded text with props
- Replace ALL hardcoded images with `image` + `imageAlt` props
- Replace ALL hardcoded URLs with `url` props
- Provide sensible defaults ONLY for non-content props (animation config, thresholds)

### 6. Create metadata.json

```json
{
  "id": "<category>-<variant>-<number>",
  "name": "Human Readable Name",
  "category": "<category>",
  "style": [],
  "mood": [],
  "layout": "<split|centered|grid|stacked|asymmetric>",
  "density": "<low|medium|high>",
  "slots": [],
  "mobileBehavior": "<stack|scroll|collapse>",
  "pairsWell": [],
  "pairsPoorly": []
}
```

Rules:
- `style[]` from: modern, classic, editorial, luxury, playful, minimal, bold, corporate
- `mood[]` from: professional, elegant, fun, serious, friendly, energetic, calm, trustworthy
- `slots[]` must exactly match the props interface (every content prop = one slot entry)
- List-type slots use `itemSchema` to describe the shape of each item
- Optional props still appear in slots — the Content Agent decides whether to fill them
- `pairsWell`/`pairsPoorly` — suggest based on the component's visual weight and category

### 7. Create the Storybook story

File: `<ComponentName>.stories.tsx`

#### Structure
```tsx
import type { Meta, StoryObj } from "@storybook/react";
import ComponentName from "./index";

const meta: Meta<typeof ComponentName> = {
  title: "<Category>/<ComponentName>",
  component: ComponentName,
  parameters: {
    layout: "fullscreen",  // always fullscreen for section-level components
  },
};
export default meta;
type Story = StoryObj<typeof ComponentName>;
```

#### Story naming convention
- `Default` — all required slots filled with realistic content, no optional features
- Each variation from the brief gets its own named export:
  - `WithTypewriter` — headline uses rotating words
  - `WithEmailCapture` — email form visible
  - `TestimonialCards` / `ProductCards` — different card content context
  - `Minimal` — fewest slots filled
  - `Full` — every slot filled including all optionals

#### Content quality
- **Realistic content only** — no "Lorem ipsum", no "Your headline here"
- **Match the context** the user described — if they said "testimonials or products", write real-sounding testimonials and real-sounding product descriptions
- **Vary content length** across stories — test short headlines and long ones
- **Use placehold.co for images** — `https://placehold.co/WxH` with appropriate dimensions
- **pt-BR content is fine** if the user's context suggests it — the project targets Brazilian Portuguese

#### Decorator pattern
If the component benefits from scroll context (sticky, reveal, parallax), add a decorator:
```tsx
decorators: [
  (Story) => (
    <div>
      <Story />
      <div className="min-h-[150vh] bg-base-200" />
    </div>
  ),
],
```

### 8. Check dependencies

Before finishing:
- If the reference code uses a library not in `components/package.json`, flag it to the user
- If using `<TypeWriter>`, verify it exists at `@ui/TypeWriter`
- If using `<Button>`, verify it exists at `@ui/button`
- If using `framer-motion`, verify it's in dependencies

### 9. Verify

Run through this checklist:

- [ ] No raw Tailwind colors — only semantic tokens
- [ ] No `dark:` variants
- [ ] No inline styles (except animation-dynamic values)
- [ ] `cn()` used for all conditional/dynamic classes
- [ ] `"use client"` present if using hooks, Framer Motion, or event handlers
- [ ] Props interface matches slots in `metadata.json`
- [ ] Every hardcoded string from reference code is now a prop
- [ ] Every requested variation has its own Storybook export
- [ ] Story content is realistic and contextual, not placeholder
- [ ] Accessible — semantic HTML, ARIA where needed, alt text on images
- [ ] Mobile-responsive — stacks on small screens
- [ ] Optional props drive feature toggling (typewriter, email, etc.)
- [ ] Sub-components have typed props

### 10. Report

After creating all files, summarize:
- Component path and category
- Slots defined (count and names)
- Story variants created (list each export name and what it tests)
- Any dependencies that need to be installed
- Any design decisions made during adaptation (e.g., "replaced CSS shuffle animation with Framer Motion `layout` prop")
