# Starter Components — Index

Reusable UI components and utilities available in `components/ui/` and `components/lib/`. Library components in `components/library/` can import these.

## Quick Reference

| Need | Component | Path |
|------|-----------|------|
| Class merging (`cn`) | `cn()` | `components/lib/utils.ts` |
| Scroll to element | `scrollToElement()` | `components/lib/scroll.ts` |
| Hash link click handler | `handleLinkClick()` | `components/lib/scroll.ts` |
| Hash/anchor link navigation | `ClientSideLink` | `components/ui/ClientSideLink.tsx` |
| Overlay content (lightbox, form) | `Modal` | `components/ui/Modal.tsx` |
| Smooth/inertia page scrolling | `SmoothScroll` | `components/ui/SmoothScroll.tsx` |
| Floating WhatsApp button | `WhatsAppFloat` | `components/ui/WhatsAppFloat.tsx` |
| Scroll-triggered text reveal | `Reveal` | `components/ui/Reveal.tsx` |
| Typing animation | `TypeWriter` | `components/ui/TypeWriter.tsx` |

## Dependency Graph

```
lib/utils.ts (cn — exists)
lib/scroll.ts (scrollToElement, handleLinkClick)
  └─ ui/ClientSideLink.tsx (depends on handleLinkClick)

ui/Modal.tsx (depends on cn)
ui/SmoothScroll.tsx (standalone — wraps layout, needs lenis)
ui/WhatsAppFloat.tsx (standalone — motion/react)
ui/Reveal.tsx (standalone — motion/react)
ui/TypeWriter.tsx (standalone — pure React, no deps)
```

## Rules

- **Always use theme tokens** — `bg-base-100`, `text-base-content`, `bg-primary`, etc.
- **Always import motion from `"motion/react"`** — never `"framer-motion"`.
- **Always support `prefers-reduced-motion`** via `useReducedMotion()` or `useMediaQuery`.
- UI components in `components/ui/` are utilities — library components in `components/library/` are the actual website sections.
