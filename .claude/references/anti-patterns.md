# Anti-Patterns — Things to Avoid

Canonical list of things to check for and fix when building or reviewing components.

## Styling

- **No raw hex colors in `className`** — always use Tailwind config tokens. `bg-[#5B7566]` is wrong; `bg-primary` is right.
- **No `!important`** — if you need to override, fix the specificity issue or use a more specific utility.
- **No inline `style={}`** — unless the value is truly dynamic and computed at runtime (e.g., a calculated position). Static styles belong in `className`.
- **No nested cards** — a card inside a card creates visual confusion. Flatten the hierarchy.
- **No fixed widths** — use `max-w-*` and let content flow. `w-[400px]` breaks on mobile. Use `w-full max-w-md` instead.
- **No `@apply` in CSS** — use Tailwind utilities directly in components. `@apply` defeats the purpose of utility-first CSS and makes styles harder to trace.
- **No mixed spacing scales** — don't use `p-3` next to `p-8` in the same visual group. Maintain a consistent rhythm.

## Components

- **No unnecessary `"use client"`** — if a component doesn't use hooks, event handlers, motion, or browser APIs, it should be a server component.
- **No prop drilling more than 2 levels** — if props pass through 3+ components, use composition (children pattern) or React context.
- **No `any` types** — always define proper TypeScript interfaces. Use `unknown` if truly necessary, then narrow.
- **No index as `key` in dynamic lists** — use a stable unique identifier. Index keys cause bugs when items are reordered, added, or removed.
- **No duplicate component patterns** — if a shared component exists, import and use it. Don't write inline markup.
- **No business logic in UI components** — components render UI. Data transformation, filtering, and complex logic belong in utilities or hooks.

## Images

- **No raw `<img>` tags** — always use `next/image` `<Image>`.
- **No missing `alt` text** — every image needs descriptive alt text. Decorative-only images get `alt=""` with `aria-hidden="true"`.
- **No unoptimized images** — always specify `width` and `height`, or use `fill` with a sized parent container.
- **No massive images without `sizes`** — if an image is responsive, provide a `sizes` prop to avoid loading oversized images on small screens.

## Accessibility

- **No click handlers on `<div>`** — use `<button>` for actions and `<a>`/`<Link>` for navigation. If you must use a div, add `role="button"`, `tabIndex={0}`, and keyboard event handlers.
- **No missing focus states** — every interactive element must have a visible focus indicator. Use `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`.
- **No color as the only indicator** — always pair color with an icon, text label, or pattern.
- **No text smaller than 12px** — `text-xs` (12px) is the minimum.
- **No missing `aria-label` on icon-only buttons** — if a button contains only an icon, add `aria-label="descriptive action"`.
- **No auto-playing animations without user control** — respect `prefers-reduced-motion`.
- **No missing form labels** — every input needs a `<label>` with `htmlFor` matching the input's `id`, or use `aria-label`.

## Animation

- **No animations longer than 300ms** for UI feedback (button, toggle, hover). Section reveals can go up to 500ms max.
- **No layout-thrashing animations** — don't animate `width`, `height`, or `top`/`left` on large elements. Use `transform` (via motion's `x`, `y`, `scale`) and `opacity`.
- **No animation without `prefers-reduced-motion` support** — always check and respect the user's system preference.
- **No `bounce` easing** — it feels unprofessional and draws attention to the animation instead of the content.
- **No animations on page load that block content visibility** — content should be visible immediately, then animate in.

## Performance

- **No unnecessary re-renders** — memoize expensive computations. Don't create new objects/arrays in render.
- **No large client component trees** — keep `"use client"` boundaries as small as possible. A full page should never be a client component.
- **No unoptimized fonts** — use `next/font` for self-hosting. Don't load fonts from CDN in `<head>`.
- **No blocking scripts** — never add `<script>` tags to components. Use Next.js `<Script>` component if external scripts are truly needed.
