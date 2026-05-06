# Workflow: Polish

Final pass before shipping. Fix the small things that separate "works" from "feels great."

## Input
`$ARGUMENTS` after "polish" — a component or category to polish.

## Steps

### 0. Set the dials

Polish targets an existing component. Read its metadata (category, style, mood) and pick the dials that the polish should drive toward:

1. Use `references/taste-dials.md` per-category presets as the target.
2. If the component currently sits below preset (e.g., a hero with `motion: 3` when the preset is 6–8), polish in that direction — add scroll reveals, premium spring physics, perpetual micro-interactions.
3. State the target dials in one line so the user can override before you start.

### 1. Read the target and understand context
- Read the component, its metadata, and its story
- Understand how it sits in a generated page layout

### 2. Polish checklist — apply fixes directly

**Visual Refinement**
- Add subtle Framer Motion reveals where appropriate (`whileInView` for scroll-triggered)
- Ensure text truncation/clamping for long slot content (`truncate` or `line-clamp-*`)
- Check heading hierarchy (only `h1` in hero sections, `h2`/`h3` elsewhere)
- Ensure consistent spacing between internal elements
- Add `transition-colors duration-150` on hover effects

**Micro-interactions**
- Add hover states on interactive cards (`hover:bg-base-200` or `hover:shadow-md`)
- Add `whileTap={{ scale: 0.98 }}` on clickable elements for tactile feedback
- Add `whileHover={{ scale: 1.02 }}` on cards/features for subtle interactivity
- Ensure focus-visible rings on all interactive elements (`focus-visible:ring-2 ring-ring`)

**Responsive Polish**
- Check touch target sizes (minimum 44px on mobile)
- Verify nothing overflows horizontally at 320px
- Ensure images scale properly with `object-cover` and aspect ratios
- Test that stacking behavior on mobile matches `mobileBehavior` in metadata

**Edge Cases**
- Very long headline/description text
- Very short content (single word headline)
- Missing optional slots (should degrade gracefully)
- Component at different viewport widths

**Storybook**
- Add story variants for edge cases (long text, minimal content)
- Ensure default story has realistic, compelling content
- Verify component renders well in both light and dark themes

### 3. Anti-slop check

Run through `references/anti-slop.md` against the polished output. Common polish-pass slips:
- [ ] Didn't introduce neon glows or gradient text while "adding visual interest"
- [ ] Didn't introduce `h-screen` while resizing — use `min-h-[100dvh]`
- [ ] Didn't add perpetual loops outside an isolated, memoized leaf client
- [ ] If raising `MOTION_INTENSITY` to ≥ 6: switched to spring physics, `useMotionValue` for any new mouse-driven values
- [ ] Story content stays realistic — no "John Doe" / "Acme" / `99.99%` slipping in via "minimal content" edge-case stories

### 4. Summary
After applying fixes, list what changed and why. Keep it brief. Mention if the dials shifted (e.g., "raised motion from 4 to 6 — added scroll reveals + spring physics on CTA").
