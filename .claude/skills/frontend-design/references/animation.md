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
