# Animation Patterns Reference — motion.dev

All imports use `"motion/react"`. Copy and adapt these patterns when animating components.

## Core Imports

```tsx
// Basic animations
import { motion, useReducedMotion } from "motion/react";

// With conditional rendering
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// With scroll-linked animations
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

// With in-view detection (alternative to whileInView for complex cases)
import { motion, useReducedMotion, useInView } from "motion/react";
```

## Timing Table

| Category | Duration | Example |
|----------|----------|---------|
| Micro-interactions | 100–150ms | Button press, toggle switch, checkbox |
| Panel/dropdown | 150–200ms | Dropdown open, tooltip appear, accordion |
| Section reveal | 200–300ms | Content fade-in on scroll, card entrance |
| Page transitions | 200–400ms | Route change animation, modal open |
| **Hard limit** | **500ms max** | No UI animation should ever exceed this |

## Easing

**Default easing**: `"easeOut"` for entrances, `"easeIn"` for exits, `"easeInOut"` for transitions.

**Spring (preferred for natural motion)**:
```ts
{ type: "spring", stiffness: 300, damping: 30 }
```

**Never use**: `"bounce"` — it feels cheap and draws attention to the animation rather than the content.

**For subtle motion**:
```ts
{ type: "spring", stiffness: 400, damping: 40 }  // snappy, barely noticeable
```

**For gentle motion**:
```ts
{ type: "spring", stiffness: 200, damping: 25 }  // soft, relaxed
```

## Variant Presets

Define these at the top of the component file, outside the component function.

### Fade Up (most common)
```tsx
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
```

### Fade In (no movement)
```tsx
const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
```

### Scale In
```tsx
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};
```

### Slide In from Left
```tsx
const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
```

### Slide In from Right
```tsx
const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
```

### Stagger Container
```tsx
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};
```

### Stagger Container (fast)
```tsx
const staggerContainerFast = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};
```

## Full Patterns

### Fade In Section on Scroll

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export function ContentSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      variants={fadeUp}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* content */}
    </motion.section>
  );
}
```

### Stagger Children Grid

```tsx
"use client";

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

export function CardGrid({ items }: { items: Item[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={staggerContainer}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={fadeUp}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* card content */}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### Hero Section (Sequential Entrance)

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";

const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      variants={heroContainer}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      className="..."
    >
      <motion.h1 variants={fadeUp}>Heading</motion.h1>
      <motion.p variants={fadeUp}>Subtitle</motion.p>
      <motion.div variants={fadeUp}>
        <button>Get Started</button>
      </motion.div>
    </motion.section>
  );
}
```

### Animated List (Add/Remove)

```tsx
"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function AnimatedList({ items }: { items: Item[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="popLayout">
      {items.map((item) => (
        <motion.div
          key={item.id}
          layout
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* item content */}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
```

### Modal with Backdrop

```tsx
"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function AnimatedModal({ isOpen, onClose, children }: ModalProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
            className="fixed inset-0 bg-neutral/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 300, damping: 30 }
            }
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="rounded-box bg-base-100 shadow-2xl max-w-lg w-full">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### Scroll-Linked Parallax

```tsx
"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";

export function ParallaxSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div style={shouldReduceMotion ? {} : { y }}>
        {children}
      </motion.div>
    </div>
  );
}
```

### Number Counter on Scroll

```tsx
"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface CounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function Counter({ target, duration = 1.5, suffix = "", prefix = "" }: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}
```

### Hover Card with Subtle Scale

```tsx
<motion.div
  whileHover={{ y: -4, scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
  className="cursor-pointer"
>
  {/* card content */}
</motion.div>
```

## Rules

1. **Always import from `"motion/react"`** — never from `"framer-motion"`.
2. **Always support `prefers-reduced-motion`** via `useReducedMotion()`.
3. **Always use `viewport={{ once: true }}`** for scroll-triggered animations — don't re-trigger.
4. **Always wrap removable elements with `<AnimatePresence>`**.
5. **Never animate `layout` on elements with expensive children** (large images, deep trees).
6. **Never animate `color` or `background-color` directly** — animate opacity of overlapping layers instead.
7. **Keep variants at the top of the file** — not inline, not in separate config files.
8. **Every animation must have a purpose**: guide attention, provide feedback, show spatial relationships, or create visual rhythm.
9. **Max duration 500ms** — no animation should ever exceed this.
10. **Prefer spring transitions** for natural motion. Use timed easing (`duration` + `ease`) for scroll reveals.
