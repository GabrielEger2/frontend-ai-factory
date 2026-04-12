# Workflow: Animate

Add purposeful Framer Motion animations to a target component.

## Input
`$ARGUMENTS` after "animate" — the component to animate.

## Steps

### 1. Read the target
- Read the component and understand its structure
- Identify what elements benefit from animation (content reveals, list items, CTAs)

### 2. Choose animation type

Read `references/animation.md` for conventions and timing values.

| Scenario | Technique |
|---|---|
| Section scrolls into view | `whileInView` fade + subtle `y` offset |
| List/grid of items appears | Staggered reveal (50-80ms between items) |
| Panel/sidebar opens/closes | Slide with `AnimatePresence` |
| Element conditionally renders | `AnimatePresence` wrapping the conditional |
| Items reorder (sort, filter) | `layout` prop on each item |
| Button click feedback | `whileTap={{ scale: 0.98 }}` |
| Card hover interaction | `whileHover={{ scale: 1.02 }}` |

### 3. Apply animations

Rules:
- **Add `"use client"` directive** — required for Framer Motion. If the component was a server component, add it at the top
- **Import from `framer-motion`**: `motion`, `AnimatePresence`, and `type Variants` if using variants
- **Use project timing** — see `references/animation.md` for exact durations and easing
- **Prefer `whileInView`** — library components are scrolled into view on generated sites
- **`viewport={{ once: true, margin: "-100px" }}`** — trigger early, don't re-animate
- **Respect reduced motion** — check `prefers-reduced-motion` for decorative animations
- **Don't cause layout shift** — set explicit dimensions or use `layout` prop
- **Keep it subtle** — small y offsets (8-16px), short durations (200-300ms)

### 4. Verify
- Animation doesn't block interaction (duration <= 300ms for UI)
- Exit animations work (wrapped in `AnimatePresence`)
- No layout shift (surrounding content doesn't jump)
- Works on mobile (no hover-dependent animations without fallback)
- `prefers-reduced-motion` respected for decorative motion
- Component still works correctly without JavaScript (content visible, just not animated)
- Storybook story still renders properly
