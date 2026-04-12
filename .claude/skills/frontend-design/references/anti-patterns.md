# Frontend Anti-Patterns

These are explicit things to AVOID. LLMs tend toward these defaults — fight the bias.

## Styling Anti-Patterns

- **Raw Tailwind colors instead of semantic tokens.** `text-gray-500` breaks theme switching. Use `text-base-content/60`. `bg-blue-600` breaks palettes. Use `bg-primary`.
- **Hardcoded dark mode with `dark:` variant.** The OKLCH token system handles it via CSS variables. Use semantic token classes that work in both themes.
- **Cards inside cards.** One level of card only. If you need nested grouping, use `bg-base-200` with padding or a visual divider.
- **Gray text on colored backgrounds.** Always check contrast. Use `text-primary-content` on `bg-primary`, `text-base-content` on `bg-base-*`.
- **Overusing shadows.** Use shadows purposefully for elevation hierarchy. Don't add `shadow-lg` to everything.
- **`px-[17px]` arbitrary values.** Stick to Tailwind's spacing scale. If the design needs 17px, round to `px-4` (16px).
- **Centering everything.** Left-align text and content by default. Center only hero sections, empty states, and loading indicators.
- **Forgetting `cn()` for dynamic classes.** Always use `cn()` from `@lib/utils` when composing conditional classes. Never concatenate class strings manually.
- **Ignoring the `-content` token.** Every background color has a matching content color. `bg-primary` pairs with `text-primary-content`. Don't guess contrast — use the tokens.

## Component Anti-Patterns

- **Missing slot props.** Library components must accept slot props for AI-generated content. Don't hardcode headlines, descriptions, or CTAs.
- **Missing metadata.json.** Every library component needs metadata with style[], mood[], category, slots[], and pairing data.
- **Missing Storybook story.** Every library component needs a `.stories.tsx` file demonstrating all variants and states.
- **Inline styles.** Never use `style={{}}`. Use Tailwind classes with `cn()`.
- **Importing between library components.** Library components should be self-contained. Share patterns via `@ui/` primitives, not cross-imports.
- **Over-abstracting slot content.** Slots should map directly to visible content areas. Don't create abstract slot hierarchies.

## Animation Anti-Patterns

- **Bounce/elastic easing.** Feels dated. Use `easeOut` or custom cubic-bezier for enter, `easeIn` for exit.
- **Animating everything.** Reserve motion for state changes, reveals, and feedback. Static content doesn't need to fly in.
- **Duration > 300ms for UI feedback.** Keep interactions snappy. 150-200ms for toggles, 200-300ms for panels.
- **Layout shift from animations.** Always set explicit dimensions or use `layout` prop so surrounding content doesn't jump.
- **Missing `AnimatePresence`.** If a component conditionally renders and you want exit animation, wrap with `AnimatePresence`.

## UX Anti-Patterns

- **No loading state.** Every async operation needs a loading indicator. Use skeleton placeholders.
- **No empty state.** Components that render collections need a graceful zero-data state.
- **Disabled buttons with no explanation.** If a button is disabled, explain why via tooltip or adjacent text.
- **Fixed widths on content containers.** Use `max-w-*` with `w-full`, never `w-[800px]`.
- **Horizontal scroll on mobile.** Always test at 320px viewport. Use `overflow-x-hidden` as a safety net.
- **Hiding important content behind hover.** Mobile has no hover. Use visible controls or tap alternatives.
- **Ignoring `prefers-reduced-motion`.** Decorative animations must respect the user's motion preference.
