# Component Patterns Reference

Code templates for common component types. Follow these patterns when creating new components.

## Library Component (Slot-Based, Server Default)

Library components live in `components/library/<category>/<ComponentName>/`. They consume slot props filled by AI-generated content.

```tsx
import React from "react";

export interface HeroSplitProps {
  /** Primary headline text */
  headline: string;
  /** Supporting subheadline text */
  subheadline?: string;
  /** Call-to-action button label */
  ctaText?: string;
  /** Call-to-action destination URL */
  ctaUrl?: string;
  /** Hero image source URL */
  imageSrc?: string;
  /** Alt text for the hero image */
  imageAlt?: string;
}

export default function HeroSplit({
  headline,
  subheadline,
  ctaText,
  ctaUrl,
  imageSrc,
  imageAlt,
}: HeroSplitProps) {
  return (
    <section className="w-full bg-base-100 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="font-sans text-4xl font-bold leading-tight tracking-tight text-base-content sm:text-5xl md:text-6xl">
          {headline}
        </h1>
        {subheadline && (
          <p className="mt-4 font-sans text-lg leading-relaxed text-base-content/70">
            {subheadline}
          </p>
        )}
      </div>
    </section>
  );
}
```

**Key patterns**:
- Props interface exported alongside default export
- Props map to metadata.json `slots[]`
- Use theme tokens (`bg-base-100`, `text-base-content`, `text-primary`) — never raw hex
- `font-sans` / `font-serif` / `font-mono` for typography
- `rounded-box` / `rounded-field` / `rounded-selector` for border radius
- No `"use client"` unless the component needs hooks/event handlers/motion

## Library Component (Client, With Animation)

```tsx
"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export interface FeatureGridProps {
  sectionTitle: string;
  sectionSubtitle?: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export default function FeatureGrid({
  sectionTitle,
  sectionSubtitle,
  features,
}: FeatureGridProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="w-full bg-base-100 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-sans text-3xl font-bold text-base-content sm:text-4xl">
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="mt-4 font-sans text-lg text-base-content/70">
              {sectionSubtitle}
            </p>
          )}
        </div>

        <motion.div
          variants={staggerContainer}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              className="rounded-box bg-base-200 p-6"
            >
              <img src={feature.icon} alt="" className="h-10 w-10" />
              <h3 className="mt-4 font-sans text-lg font-semibold text-base-content">
                {feature.title}
              </h3>
              <p className="mt-2 font-sans text-base text-base-content/70">
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

## Shared UI Component with Variants

Shared UI components live in `components/ui/` and are imported by library components.

```tsx
import { type ComponentProps } from "react";
import { cn } from "@lib/utils";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-selector font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        {
          "bg-primary text-primary-content hover:opacity-90": variant === "primary",
          "bg-secondary text-secondary-content hover:opacity-90": variant === "secondary",
          "border-2 border-primary text-primary hover:bg-primary/10": variant === "outline",
        },
        {
          "px-4 py-2 text-sm": size === "sm",
          "px-8 py-3 text-base": size === "md",
          "px-10 py-4 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

**Pattern notes**:
- Extend native element props with `ComponentProps<"element">`
- Use `cn()` from `@lib/utils` for conditional classes
- Provide sensible defaults for variant props
- Include focus-visible, active, and disabled states
- Spread remaining props to the native element
- Use theme tokens for all colors

## Hybrid: Server Parent + Client Child

```tsx
// ServerSection.tsx (server component — no directive)
import { InteractiveWidget } from "./InteractiveWidget";

export function ServerSection({ data }: { data: DataType }) {
  return (
    <section className="w-full bg-base-100 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-sans text-3xl font-bold text-base-content">{data.title}</h2>
        <p className="mt-4 text-base-content/70">{data.description}</p>

        {/* Only this child is a client component */}
        <InteractiveWidget items={data.items} />
      </div>
    </section>
  );
}
```

```tsx
// InteractiveWidget.tsx
"use client";

import { useState } from "react";

export function InteractiveWidget({ items }: { items: Item[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  // ... interactive logic
}
```

**Use this pattern when**: A section is mostly static content but has a small interactive part. Keep the client boundary as small as possible.

## cn() Utility

Already exists at `components/lib/utils.ts`:
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Required dependencies: `clsx`, `tailwind-merge` (already installed).
