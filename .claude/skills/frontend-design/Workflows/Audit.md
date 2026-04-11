# Workflow: Audit

Run a technical quality audit on the specified target. Report findings without making edits.

## Input
`$ARGUMENTS` after "audit" — a component name, category, or area (e.g., "HeroSplit", "hero", "all features").

## Steps

### 1. Find the target
- Search `components/library/` for the target component or category
- Read all relevant files (`index.tsx`, `metadata.json`, `.stories.tsx`)

### 2. Check each category

**Accessibility**
- [ ] Semantic HTML (`section`, `nav`, `main`, `article`, `button` — not `div` with `onClick`)
- [ ] ARIA labels on interactive elements without visible text
- [ ] `alt` text on all images (slot or hardcoded)
- [ ] Keyboard navigable (no `onClick` without `onKeyDown` or using `button`/`a`)
- [ ] Color contrast (no `text-base-content/40` or lighter on `bg-base-100`)
- [ ] Heading hierarchy (`h1` only in heroes, `h2`/`h3` in sections)

**Responsive**
- [ ] Works at 320px viewport (no horizontal overflow)
- [ ] Touch targets at least 44x44px on mobile
- [ ] Text readable without zooming on mobile
- [ ] Responsive images (not fixed width)
- [ ] Layout doesn't break between breakpoints
- [ ] `mobileBehavior` from metadata matches actual CSS behavior

**Token Consistency**
- [ ] Using semantic color tokens (no raw Tailwind colors like `text-gray-500`, `bg-blue-600`)
- [ ] Using `cn()` for dynamic/conditional classes
- [ ] No `dark:` variants — theme switching relies on CSS variables
- [ ] No arbitrary values (`px-[17px]`) where Tailwind scale works
- [ ] Using `@ui/` primitives for interactive elements (Button, Input, etc.)

**Metadata**
- [ ] `metadata.json` exists with all required fields
- [ ] Slots in metadata match props interface in `index.tsx`
- [ ] `style[]` and `mood[]` arrays are populated
- [ ] `pairsWell` and `pairsPoorly` reference valid component IDs
- [ ] `category` matches the directory structure

**Storybook**
- [ ] `.stories.tsx` file exists
- [ ] Default story has realistic slot content
- [ ] Story uses `layout: "fullscreen"` for section-level components
- [ ] All slot props are represented in story args

**Performance**
- [ ] `"use client"` only where necessary (Framer Motion, event handlers)
- [ ] Images use appropriate sizing/aspect ratios
- [ ] No unnecessary re-renders from unstable references

### 3. Report findings

Output a checklist-style report grouped by category. For each issue found:
- Describe the problem
- Reference the exact file and line
- Suggest the fix (but don't apply it)

Rate overall quality: Pass / Needs Work / Failing
