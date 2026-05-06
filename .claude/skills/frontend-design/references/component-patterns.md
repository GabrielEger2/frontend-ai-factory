# Component Patterns — SiteGen Library

## Library Component (website section)

Library components live in `components/library/<category>/<ComponentName>/` and have three files:

### index.tsx — the component

```tsx
import { cn } from "@lib/utils";
import { buttonStyles } from "@ui/button";

export interface HeroSplitProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaUrl: string;
  image: string;
  imageAlt: string;
  className?: string;
}

export default function HeroSplit({
  headline,
  subheadline,
  ctaText,
  ctaUrl,
  image,
  imageAlt,
  className,
}: HeroSplitProps) {
  return (
    <section
      className={cn(
        "w-full bg-base-100 py-16 md:py-24",
        className,
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 md:px-8 lg:grid-cols-2">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-base-content md:text-5xl">
            {headline}
          </h1>
          <p className="text-lg text-base-content/70">
            {subheadline}
          </p>
          <a href={ctaUrl} className={buttonStyles({ size: "lg" })}>
            {ctaText}
          </a>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
```

Key points:
- Props interface mirrors the slots defined in `metadata.json`
- Uses semantic color tokens (`bg-base-100`, `text-base-content`)
- Uses `cn()` for class composition with optional `className` prop
- Uses `@ui/` primitives (`buttonStyles()` for links, `Button` for actual buttons) for interactive elements
- Mobile-first responsive layout
- Semantic HTML (`section`, `h1`)

### metadata.json — component metadata

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
    { "name": "ctaText", "type": "text", "maxLength": 30 },
    { "name": "ctaUrl", "type": "url" },
    { "name": "image", "type": "image", "aspectRatio": "16:9" },
    { "name": "imageAlt", "type": "text", "maxLength": 120 }
  ],
  "mobileBehavior": "stack",
  "pairsWell": ["features-grid-01", "cta-banner-01"],
  "pairsPoorly": ["hero-video-01"]
}
```

### ComponentName.stories.tsx — Storybook story

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import HeroSplit from "./index";

const meta: Meta<typeof HeroSplit> = {
  title: "Hero/HeroSplit",
  component: HeroSplit,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof HeroSplit>;

export const Default: Story = {
  args: {
    headline: "Build your business with confidence",
    subheadline:
      "Our platform helps you grow faster with tools designed for modern teams.",
    ctaText: "Get Started",
    ctaUrl: "#",
    image: "https://placehold.co/800x450",
    imageAlt: "Team collaborating",
  },
};
```

## Animated Library Component

When a component uses Framer Motion, mark it as a client component:

```tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@lib/utils";

export interface FeaturesGridProps {
  headline: string;
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  className?: string;
}

export default function FeaturesGrid({
  headline,
  features,
  className,
}: FeaturesGridProps) {
  return (
    <section className={cn("w-full bg-base-200 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-base-content">
          {headline}
        </h2>
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="rounded-lg bg-base-100 p-6 shadow-sm"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="mb-3 text-3xl">{feature.icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-base-content">
                {feature.title}
              </h3>
              <p className="text-sm text-base-content/60">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

Key points:
- `"use client"` at the top — required for Framer Motion
- `whileInView` with `viewport={{ once: true }}` for scroll-triggered reveals
- Staggered children for lists/grids
- Subtle motion — small `y` offset (8-16px), short duration (200-300ms)
- Still uses semantic tokens and `cn()` like all other components

## Adapted Component (from reference code)

When adapting external/reference code into a SiteGen library component, follow this transformation pattern:

### Color token mapping

| Raw Tailwind | Semantic Token | When to use |
|---|---|---|
| `bg-slate-900`, `bg-gray-900`, `bg-zinc-900` | `bg-neutral` | Dark section backgrounds |
| `bg-slate-800`, `bg-gray-800` | `bg-base-200` or `bg-base-300` | Cards, elevated surfaces |
| `bg-slate-800/20` | `bg-base-200/20` | Translucent surfaces (backdrop-blur) |
| `text-slate-50`, `text-white` | `text-neutral-content` | Text on dark backgrounds |
| `text-slate-400`, `text-gray-400` | `text-base-content/60` | Muted/secondary text |
| `bg-indigo-600`, `bg-blue-600` | `bg-primary` | Primary actions, accents |
| `text-indigo-400`, `text-blue-400` | `text-primary` | Accent text, links |
| `border-slate-700`, `border-gray-700` | `border-base-300` | Borders on dark surfaces |
| `bg-slate-200`, `bg-gray-200` | `bg-base-200` | Light surface fallback (images, avatars) |
| `focus:bg-slate-700` | `focus:bg-base-300` | Focus states |

### Extracting slots from hardcoded content

```tsx
// BEFORE — hardcoded content in reference code
<h3 className="text-5xl font-black">You don't know marketing</h3>
<p className="text-slate-400">...but we're going to help.</p>
<button>Join newsletter</button>

// AFTER — slot-driven props
interface Props {
  headline: string;
  subheadline: string;
  ctaText: string;
}
<h2 className="text-5xl font-black text-base-content">{headline}</h2>
<p className="text-base-content/60">{subheadline}</p>
<Button>{ctaText}</Button>
```

### Handling repeated sub-components (cards, items)

```tsx
// BEFORE — multiple hardcoded instances
<Card imgUrl="/imgs/7.jpg" testimonial="I feel like..." author="Jenn F." />
<Card imgUrl="/imgs/8.jpg" testimonial="My boss thinks..." author="Adrian Y." />

// AFTER — array slot prop
interface Props {
  cards: Array<{
    image: string;
    imageAlt: string;
    quote: string;
    author: string;
  }>;
}
{cards.map((card, i) => (
  <Card key={i} {...card} />
))}
```

### Optional feature props (variations)

Use optional props to toggle component features. This drives Storybook variations:

```tsx
interface Props {
  headline: string;
  /** When provided, last line animates through these words */
  headlineRotatingWords?: string[];
  ctaText: string;
  ctaUrl: string;
  /** When provided, shows email form instead of plain CTA */
  emailPlaceholder?: string;
  onEmailSubmit?: (email: string) => void;
}

// In the component:
{emailPlaceholder ? (
  <form onSubmit={handleSubmit}>
    <input placeholder={emailPlaceholder} />
    <Button type="submit">{ctaText}</Button>
  </form>
) : (
  <a href={ctaUrl} className={buttonStyles()}>{ctaText}</a>
)}
```

### Keeping animation-dynamic inline styles

Framer Motion `animate`, `style`, and drag constraints may need dynamic values.
These are the ONE exception to the "no inline styles" rule:

```tsx
// OK — dynamic values from animation state
<motion.div
  style={{ zIndex }}
  animate={{ rotate: rotateZ, x }}
  className="absolute left-0 top-0 rounded-2xl border border-base-300 bg-base-200/20 p-6 shadow-xl backdrop-blur-md"
>
```

## The Primitive-Receiving Rule

Library components **compose** UI primitives (`@ui/Button`, `@ui/Card`, etc.) **internally**. They do NOT receive primitives as props.

### Why this is a hard rule

The AI pipeline serializes slot content as JSON before the assembler stitches a generated site. JSON can carry strings, urls, image paths, and arrays — it cannot carry `ReactNode`. Every slot prop must round-trip through JSON.

If a component accepts `cta?: ReactNode`, the Content Agent has nothing reasonable to put there, and the assembler can't construct it deterministically. The pipeline breaks.

### The rule

```tsx
// CORRECT — slots are plain data, primitive composed inside
import { Button } from "@ui/button";

export interface CtaBannerProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaUrl: string;
  ctaVariant?: "primary" | "secondary" | "arrow";  // flexes the internal primitive
  className?: string;
}

export default function CtaBanner({
  headline, subheadline, ctaText, ctaUrl, ctaVariant = "primary", className,
}: CtaBannerProps) {
  return (
    <section className={cn("...", className)}>
      <h2>{headline}</h2>
      <p>{subheadline}</p>
      <Button variant={ctaVariant} asChild>
        <a href={ctaUrl}>{ctaText}</a>
      </Button>
    </section>
  );
}
```

```tsx
// WRONG — ReactNode slot, breaks the AI pipeline
export interface CtaBannerProps {
  headline: string;
  subheadline: string;
  cta: ReactNode;          // assembler can't fill this
  renderCta?: () => ReactNode;  // also wrong
}
```

### What components MAY accept

- **Plain data slots** — `string`, `string[]`, image-path strings, urls, structured arrays (`Array<{ image, quote, author }>`)
- **`className?: string`** — for outer composition only
- **Variant props** — `ctaVariant?: "primary" | "arrow"`, `tone?: "light" | "dark"`, `density?: "compact" | "default"` — flex the internally-composed primitive without exposing it
- **Optional toggle props** — `headlineRotatingWords?: string[]`, `emailPlaceholder?: string` — drive feature variations the Content Agent can opt into

### What components MUST NOT accept

- `ReactNode` / `React.ReactElement` content slots
- `renderX?: () => ReactNode` render-prop callbacks
- Children for content slots — `children` is reserved for true wrapper components, which library components are not

### Animation-state inline styles are still the exception

The "no inline styles" rule has one carve-out for Framer Motion `style={{ x, y, rotate }}` driven by motion values — see the example at the end of "Adapted Component" above. That's not a primitive being received as a prop; it's a dynamic value from the component's own animation state.

## Utility Pattern — cn() usage

```tsx
import { cn } from "@lib/utils";

// Conditional classes
<div className={cn("bg-base-100 p-6", isHighlighted && "ring-2 ring-primary")} />

// Variant-based classes
<span className={cn(
  "inline-flex rounded-full px-3 py-1 text-sm font-medium",
  variant === "success" && "bg-success/10 text-success",
  variant === "error" && "bg-error/10 text-error",
  variant === "info" && "bg-info/10 text-info",
)} />
```
