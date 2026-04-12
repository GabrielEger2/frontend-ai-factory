# SiteGen Component Library Style Guide

## Design System

### Typography
- **Font family:** Controlled by CSS variables — `font-sans` (body), `font-serif` (editorial), `font-mono` (code/data)
- **Scale:** Use Tailwind's default scale — `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-4xl`, `text-5xl`
- **Headings:** Bold weight, tight leading (`leading-tight`). Use semantic elements (`h1`-`h4`)
- **Body text:** `text-base-content` (semantic token). Never hardcode gray values

### Color
- **Always use semantic color tokens** — `primary`, `secondary`, `accent`, `neutral`, `base-100/200/300`, `info`, `success`, `warning`, `error`
- **Text colors:** `text-base-content`, `text-base-content/60` (muted), `text-primary`, `text-error`
- **Background:** `bg-base-100` (page), `bg-base-200` (cards/surfaces), `bg-base-300` (elevated/borders)
- **On colored backgrounds:** Use `-content` tokens — `text-primary-content` on `bg-primary`, `text-secondary-content` on `bg-secondary`
- **Never use raw Tailwind colors** (no `text-gray-500`, no `bg-blue-600`) — they break theme switching and per-site palettes

### Spacing
- Use Tailwind spacing scale consistently: `gap-2`, `gap-4`, `gap-6` for component internals
- Section padding: `px-4 md:px-8 lg:px-12`
- Section vertical spacing: `py-12 md:py-16 lg:py-24`
- Card padding: `p-4 md:p-6`

### Components (@ui/ primitives)
Prefer `@ui/` primitives over custom implementations for interactive elements:
- **Buttons:** `<Button>` from `@ui/button` with variants: `primary`, `secondary`, `accent`, `outline`, `ghost`, `link` and sizes: `sm`, `md`, `lg`, `icon`
- **Button-styled links:** `buttonStyles({ variant, size })` from `@ui/button` — returns class string for `<a>` or other non-button elements
- **Cards:** Build with semantic tokens (`bg-base-200`, `text-base-content`, `rounded-lg`, `border border-base-300`)
- **Badges:** Use semantic tokens (`bg-primary/10 text-primary rounded-full px-3 py-1`)

### Layout Patterns
- **Section wrapper:** `max-w-7xl mx-auto px-4 md:px-8` for content areas
- **Grid:** CSS grid or flexbox with Tailwind — `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Full-width sections:** Use `w-full` on the outer container, constrain inner content with `max-w-*`
- **Split layouts:** `grid grid-cols-1 lg:grid-cols-2 gap-8 items-center`

### Dark Mode
- Handled via CSS custom properties that change between light/dark themes
- Components should work in both themes by using semantic tokens
- Never hardcode colors — always use token classes
- Test all components in both light and dark themes in Storybook

## File Organization

### Library components (website sections)
`components/library/<category>/<ComponentName>/index.tsx` + `metadata.json` + `<ComponentName>.stories.tsx`

### UI primitives
`components/ui/<component>.tsx` — low-level interactive components (Button, TypeWriter, ClientSideLink, etc.)

### Utilities
`components/lib/utils.ts` — `cn()` class merge utility

### Hooks
`components/hooks/use[Name].ts`

## Class Merging

Always use `cn()` from `@lib/utils` when composing classes dynamically:
```tsx
import { cn } from "@lib/utils";

<div className={cn("bg-base-100 p-6", isActive && "bg-primary text-primary-content")} />
```
