# Workflow: Animate

Add purposeful Framer Motion animations to a target component.

## Input
`$ARGUMENTS` after "animate" — the component to animate.

## Steps

### 0. Set the motion dial

Read `references/taste-dials.md` and pick `MOTION_INTENSITY` based on the component's category and the brief:

1. Use the per-category preset (`hero` → 6–8, `footer` → 2–3, `faq` → 3, `motion` → 8–10).
2. If the brief explicitly asks for "subtle" or "static", drop to 1–3 and use only CSS hover/active states.
3. State your choice in one line. Examples:

   > Motion dial: 7 (cta category, brief says "make it premium").
   > Motion dial: 3 (faq, calm/readable preset).

4. **If the dial lands at 6+**, you're in premium-motion territory — read `references/animation.md` § Premium Motion before writing any code. Spring physics, `useMotionValue`, perpetual interactions, isolation/memoization rules apply.

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

### 4. Anti-slop check

Run through `references/anti-slop.md` (animation-relevant items) and the animation hard bans from `anti-patterns.md`:
- [ ] Animating only `transform` and `opacity` — never `top`/`left`/`width`/`height`/`margin`
- [ ] No `h-screen` introduced for full-height (use `min-h-[100dvh]`)
- [ ] No grain/noise filter on a scrolling container (only on `fixed pointer-events-none` pseudo-elements)
- [ ] If motion ≥ 6: spring physics (no linear easing for press/hover), `useMotionValue` for mouse-driven values, perpetual loops in `React.memo`'d leaf clients
- [ ] No `window.addEventListener('scroll')` — use Framer's `useScroll`
- [ ] Not mixing GSAP/ThreeJS with Framer Motion in the same component tree

### 5. Verify
- Animation doesn't block interaction (duration <= 300ms for UI; spring physics may exceed but should still feel snappy)
- Exit animations work (wrapped in `AnimatePresence`)
- No layout shift (surrounding content doesn't jump)
- Works on mobile (no hover-dependent animations without fallback)
- `prefers-reduced-motion` respected for decorative motion
- Component still works correctly without JavaScript (content visible, just not animated)
- Storybook story still renders properly
