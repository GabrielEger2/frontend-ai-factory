# Animation Conventions — SiteGen Components

## Stack
- **Framer Motion** via `motion` and `AnimatePresence` from `framer-motion`
- No CSS animations or `@keyframes` — keep all motion in Framer Motion for consistency
- Components using Framer Motion must have `"use client"` directive

## Timing

| Context | Duration | Easing |
|---|---|---|
| Button/toggle feedback | 100-150ms | `easeOut` |
| Panel slide (sidebar, drawer) | 150-200ms | `easeOut` |
| Content reveal (fade in) | 200-300ms | `easeOut` |
| Exit animation | 150ms | `easeIn` |
| Staggered list items | 50-80ms between items | `easeOut` |
| Scroll-triggered reveal | 250-350ms | `easeOut` |

Never exceed 300ms for UI interactions. Reserve 400ms+ only for decorative page transitions.

## Patterns Used in This Project

### Scroll-Triggered Reveal (most common for website sections)
```tsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  {children}
</motion.div>
```

### Staggered Grid/List
```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={{
    visible: { transition: { staggerChildren: 0.08 } },
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <ItemCard item={item} />
    </motion.div>
  ))}
</motion.div>
```

### Fade-in Reveal
```tsx
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
>
  {children}
</motion.div>
```

### Slide-in Panel
```tsx
<AnimatePresence>
  {isOpen && (
    <motion.nav
      initial={{ x: "100vw" }}
      animate={{ x: 0 }}
      exit={{ x: "100vw" }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {/* content */}
    </motion.nav>
  )}
</AnimatePresence>
```

### Hover Interaction
```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15 }}
>
  <Card />
</motion.div>
```

## Rules

1. **Always wrap conditional renders in `AnimatePresence`** if you want exit animations
2. **Use `layout` prop** when items reorder (lists, grids) to animate position changes
3. **Respect `prefers-reduced-motion`** — wrap animation values:
   ```tsx
   const prefersReduced = typeof window !== "undefined"
     && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

   <motion.div
     initial={prefersReduced ? false : { opacity: 0 }}
     animate={{ opacity: 1 }}
   />
   ```
4. **Prefer `whileInView` for website sections** — library components are scrolled into view, so scroll-triggered animations are the default pattern
5. **`viewport={{ once: true }}`** — don't re-trigger animations on scroll back. Use `margin: "-100px"` to trigger slightly before the element is visible
6. **Keep it subtle** — the best animations are barely noticed consciously. Small `y` offsets (8-16px), short durations (200-300ms)
7. **`mode="wait"` on `AnimatePresence`** when swapping between two elements (tabs, routes). Default mode overlaps enter/exit

## Premium Motion (when `MOTION_INTENSITY` ≥ 6)

The conventions above are the everyday defaults. When the dial in `taste-dials.md` is set to 6+, layer on these premium-motion rules. Adapted from [taste-skill](https://github.com/Leonxlnx/taste-skill).

### Spring physics over linear easing

Premium motion uses spring physics — not the project default `easeOut` cubic-bezier:

```tsx
<motion.div
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: "spring", stiffness: 100, damping: 20 }}
/>
```

`stiffness: 100, damping: 20` is the SiteGen premium-motion default. Tune within these ranges:
- `stiffness 60–120` (lower = softer, slower)
- `damping 15–25` (lower = bouncier, higher = snappier)

Avoid raw `easeOut` for spring-feel interactions (button magnetism, card lift, drawer slides). Keep `easeOut` for pure fade/slide reveals where physics would feel weird.

### `useMotionValue` and `useTransform` — never `useState` for hover

For magnetic buttons, parallax tilt cards, mouse-following effects, and any continuous animation, **never** drive the value through `useState` — it triggers React re-renders on every mouse event and collapses on mobile.

```tsx
"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";

export function MagneticButton({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

  return (
    <motion.button
      style={{ x, y, rotateX, rotateY }}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.button>
  );
}
```

Motion values live outside React's render cycle. Only the DOM updates — no re-render storm.

### Perpetual micro-interactions

When `MOTION_INTENSITY ≥ 7`, components should feel alive — embed continuous, infinite micro-animations (Pulse, Float, Shimmer, Carousel) in standard elements (avatars, status dots, backgrounds).

```tsx
"use client";
import { memo } from "react";
import { motion } from "framer-motion";

export const PulseDot = memo(function PulseDot() {
  return (
    <motion.span
      className="inline-block h-2 w-2 rounded-full bg-success"
      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
});
```

**Performance critical:** every perpetual animation MUST be:
1. Wrapped in `React.memo` so prop-unrelated parent renders don't restart it
2. Isolated to its own microscopic Client Component (no siblings, no state from above)
3. Animating only `transform` / `opacity` — never `width`, `height`, `top`, `left`

Spammed perpetual motion in a parent component triggers full subtree re-renders 60×/sec and tanks Lighthouse.

### `layout` and `layoutId` — shared element transitions

For lists that re-order, items that resize, or elements that morph between states, use Framer Motion's layout animation:

```tsx
{items.map((item) => (
  <motion.div key={item.id} layout transition={{ type: "spring", stiffness: 100, damping: 20 }}>
    {item.content}
  </motion.div>
))}
```

`layoutId` morphs the same element across mount boundaries (e.g., a thumbnail that expands into a modal). Use it for "click card → card grows into detail view" patterns.

### `staggerChildren` — parent + children must be in same client tree

`staggerChildren` only works when the parent `variants` and the children `variants` live in the same `"use client"` component tree. If you fetch data on the server and pass it as props, the wrapping `<motion.div>` parent must still be a client component:

```tsx
// Wrong: server-rendered list, client-only items — stagger silently breaks
// Right: one client wrapper that owns both parent variants and children
"use client";
export function StaggeredList({ items }: { items: Item[] }) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >
      {items.map((item) => (
        <motion.li
          key={item.id}
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
        >
          {item.label}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Hard bans

These apply at every motion intensity, not just premium:

- **Never use `h-screen` for full-height sections.** Use `min-h-[100dvh]`. iOS Safari's address bar causes catastrophic layout jumps with `100vh`/`h-screen`.
- **Never animate dimensional properties.** No `top`, `left`, `width`, `height`, `margin`. Use `transform` (`x`, `y`, `scale`, `rotate`) and `opacity` only — these are GPU-accelerated; the others trigger reflow.
- **Never animate via `window.addEventListener('scroll')`.** Use Framer Motion's `useScroll` hook — it batches via `requestAnimationFrame`.
- **Grain / noise filters only on fixed pseudo-elements.** Apply grain SVG/PNG overlays as `fixed inset-0 z-[1] pointer-events-none` overlays — never on a scrolling container, which forces continuous GPU repaints and kills mobile performance.
- **Never mix GSAP/ThreeJS with Framer Motion in the same component tree.** Default to Framer Motion. Reach for GSAP/ThreeJS only for full-page scrolltelling or canvas backgrounds, isolated in their own `useEffect` with strict cleanup.

### Pre-flight check for premium motion

Before shipping any component with `MOTION_INTENSITY ≥ 6`:

- [ ] Spring physics on interactive elements (no linear easing for hover/press)
- [ ] No `useState` for continuous mouse-driven values — `useMotionValue` only
- [ ] All perpetual animations are `React.memo`'d and isolated
- [ ] Animating only `transform` / `opacity`
- [ ] `min-h-[100dvh]` for full-height sections
- [ ] `prefers-reduced-motion` short-circuits decorative motion (still applies)
