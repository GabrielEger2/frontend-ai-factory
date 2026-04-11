# Component Patterns — SiteGen Library

## Library Component (website section)

Library components live in `components/library/<category>/<ComponentName>/` and have three files:

### index.tsx — the component

```tsx
import { cn } from "@lib/utils";
import { Button } from "@ui/button";

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
          <Button asChild size="lg">
            <a href={ctaUrl}>{ctaText}</a>
          </Button>
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
- Uses `@ui/` primitives (Button) for interactive elements
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
