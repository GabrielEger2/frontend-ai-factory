# Workflow: Polish

Final pass before shipping. Fix the small things that separate "works" from "feels great."

## Input
`$ARGUMENTS` after "polish" — a component or category to polish.

## Steps

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

### 3. Summary
After applying fixes, list what changed and why. Keep it brief.
