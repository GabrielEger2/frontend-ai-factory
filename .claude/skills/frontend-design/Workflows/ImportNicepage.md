# Workflow: ImportNicepage

Generate a SiteGen library component from a NicePage preview URL. The capture step (Playwright screenshot, HTML structural signals, CSS palette) runs via a small CLI; the brief generation runs **in-context inside this Claude Code session** so it bills against the user's Claude Code subscription rather than a paid Anthropic API key. The one-shot UX is: capture, read screenshots + signals, generate a brief, write `brief.json`, delegate to the writer, report.

## Steps

1. **Parse the URL.** Extract `<url>` from `$ARGUMENTS`. Validate that it starts with `http`. If missing or invalid, abort with a one-line error explaining the expected form (`/frontend-design import-nicepage <url>`).

2. **Run capture.** Invoke the Bash tool with this exact command (note the double-quotes around the URL — NicePage preview URLs contain `?device=desktop` which the shell would otherwise split):

   ```bash
   npm run import:nicepage --workspace=agents -- --capture-only "<url>"
   ```

   If the exit code is non-zero, stop. Report the exit code and the last 20 lines of stdout/stderr verbatim. Do not attempt step 3.

3. **Locate the artifact directory.** Parse the line `[capture] artifactDir=<path>` from the capture stdout. Extract the absolute path. Store it as `<artifactDir>` for steps 4–8. If that line is absent, abort with: "expected `[capture] artifactDir=<path>` in capture stdout but not found".

4. **Read the screenshots.** Use the Read tool to read `<artifactDir>/screenshot-desktop.jpg` (primary visual reference) and `<artifactDir>/screenshot-mobile.jpg` (mobile layout reference). The Read tool natively decodes JPEGs as visual input.

5. **Read the signals.** Use the Read tool to read `<artifactDir>/signals.json`. Parse the JSON. Shape:

   ```ts
   {
     signals: { headings: string[]; ctaLabels: string[]; formFields: string[]; sectionCount: number },
     cssPalette: string[]
   }
   ```

   Use `headings`/`ctaLabels`/`formFields` as text-content hints, `sectionCount` as a structural hint, and `cssPalette` as color hints.

6. **Generate the brief in-context.** Combine the desktop screenshot (primary visual reference), the mobile screenshot (mobile layout reference), the signals (text + structure), and the CSS palette (color cues) to produce a single JSON object matching the `## Output Contract` below. Apply every rule from `## Design Rules`. Do **NOT** include `id` — the write step computes it.

7. **Write the brief to disk.** Use the Write tool to write the JSON object to `<artifactDir>/brief.json`, pretty-printed with 2-space indentation.

8. **Run the writer.** Compute `<slug>` as the last non-empty path segment of `<artifactDir>` (split on either `/` or `\`, drop trailing separators, take the final segment — do not reconstruct from the URL). Then invoke the Bash tool with:

   ```bash
   npm run import:nicepage --workspace=agents -- --write-from <slug>
   ```

   If the exit code is non-zero, stop and report the exit code and stderr.

9. **Report.** Summarize per the `## Report` section.

## Output Contract

The brief written in step 7 must be a single JSON object matching `ClaudeResponseSchema` from `agents/scripts/lib/types.ts`. Fields:

- `componentName` — string, PascalCase, regex `^[A-Z][A-Za-z0-9]+$`.
- `category` — enum, one of: `hero`, `contact`, `cta`, `faq`, `footers`, `navigation`, `carousel`, `stats`, `layout/grid`, `layout/scroll`, `layout/split`.
- `name` — human-readable string (e.g. `"Contact Form with Shapes"`).
- `purpose` — `string[]`, min 1 item, each a short phrase.
- `acceptsStyleKit` — object `{ card: boolean, background: boolean, textDecoration: boolean, button: boolean }`.
- `style` — non-empty array of: `modern` | `classic` | `editorial` | `luxury` | `playful` | `minimal` | `bold` | `corporate`.
- `mood` — non-empty array of: `professional` | `elegant` | `fun` | `serious` | `friendly` | `energetic` | `calm` | `trustworthy`.
- `layout` — one of: `split` | `centered` | `grid` | `stacked` | `asymmetric` | `multi-column` | `horizontal` | `floating`.
- `density` — one of: `low` | `medium` | `high`.
- `slots` — array of slot objects. Each slot has `name` (string) and `type` (one of `text`, `image`, `url`, `list`, `number`, `boolean`, `object`). Per-type optional fields:
  - `text` slots: `maxLength` (number, recommended), `enum` (string[], when the slot is a fixed set of options).
  - `image` slots: `aspectRatio` (string like `"16:9"`).
  - `list` slots: `maxItems` (number) and `itemSchema` describing each item's shape (a nested array of slot definitions).
  - `object` slots: `fields` (a nested array of slot definitions for grouped values).
  - Any slot may set `optional: true` to mark a non-required content prop.
  - The `slots[]` array MUST mirror the props interface declared in `indexTsx` field-for-field.
- `mobileBehavior` — one of: `stack` | `scroll` | `collapse` | `preserve`.
- `pairsWell` — `string[]` (component IDs this pairs well with).
- `pairsPoorly` — `string[]` (component IDs to avoid pairing with).
- `variants` — optional, hero-only.
- `indexTsx` — string, min 100 chars. Full source of `index.tsx`.
- `storiesTsx` — string, min 100 chars. Full source of `<ComponentName>.stories.tsx`.

**Explicitly omit `id`.** The write step generates `<prefix>-<kebab-name>-<seq>` from `category` and `componentName` and writes it into the final `metadata.json`.

## Design Rules

### Slot vocabulary
Every visible content area is a slot in the props interface AND in `slots[]` — the two must mirror each other exactly. Rules:

- **Text slots** take `maxLength` (e.g. headline 80, subheadline 160, button 30, body 320).
- **Image slots** take `aspectRatio` (e.g. `"16:9"`, `"1:1"`, `"4:3"`). Always pair an image with an `imageAlt` text slot for accessibility.
- **List slots** take `itemSchema` describing each item's shape and `maxItems` to bound the list (e.g. `maxItems: 6` for a feature grid, `3` for a testimonial row).
- **Object slots** take `fields` (sub-schema) for grouped values that aren't a list.
- **URL slots** use `type: "url"` (CTAs, navigation hrefs).
- Always include `className?: string` on the props interface for composition by parent layouts.
- Optional features ride on optional props: a `headlineRotatingWords?: string[]` flips on a typewriter; an `emailPlaceholder?: string` swaps a plain CTA for an email-capture form. Present = feature on, absent = feature off.
- Provide sensible defaults ONLY for non-content props (animation thresholds, viewport margins). Never default content (headlines, copy, images).

### OKLCH tokens
Never use raw Tailwind colors. Never use inline hex. Never use `dark:` variants. The semantic token system handles theme switching and per-site palette swaps automatically:

- **Backgrounds:** `bg-base-100` (page surface), `bg-base-200` (cards / elevated surfaces), `bg-base-300` (deepest surface / borders backdrop).
- **Text:** `text-base-content` (primary), `text-base-content/60` (muted), `text-base-content/70` (secondary body), `text-base-content/40` (placeholder).
- **Brand:** `bg-primary` / `bg-secondary` / `bg-accent` / `bg-neutral`, each paired with the matching `-content` token (`text-primary-content` on `bg-primary`, etc.). Never put `text-base-content` on a brand background.
- **Status:** `bg-info` / `bg-success` / `bg-warning` / `bg-error` (with matching `-content` tokens, plus translucent variants like `bg-success/10 text-success` for badges).
- **Borders:** `border-base-300`. For focus rings use `ring-primary`.
- **Radii:** `rounded-lg` (cards/sections), `rounded-field` (form controls), `rounded-selector` (chips/pills).
- **Fonts:** `font-sans` (body), `font-serif` (editorial accent), `font-mono` (code/data).
- **Section padding:** `px-4 md:px-8 lg:px-12`. **Section vertical:** `py-12 md:py-16 lg:py-24`. **Container:** `max-w-7xl mx-auto`.

Color mapping cheat-sheet for adapting NicePage palettes to tokens:

| NicePage / raw Tailwind cue | SiteGen token |
|---|---|
| `bg-slate-900`, `bg-zinc-900`, dark hero backdrops | `bg-neutral` |
| `bg-slate-800`, card backgrounds | `bg-base-200` |
| `text-white`, `text-slate-50` on dark | `text-neutral-content` |
| `text-slate-400`, muted gray copy | `text-base-content/60` |
| `bg-indigo-600`, `bg-blue-600`, accent buttons | `bg-primary` |
| `text-indigo-400`, link / accent text | `text-primary` |
| `border-slate-700`, dividers | `border-base-300` |

### Required imports for `indexTsx`
Line 1 must be the `"use client";` directive whenever the component uses Framer Motion, hooks, or event handlers (which is essentially every imported NicePage section). The canonical import block:

```tsx
"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@lib/utils";
import { Button, buttonStyles } from "@ui/button";
```

Notes on the import path: the canonical SiteGen import is `"motion/react"` — **never** `"framer-motion"`. Both `references/animation.md` and `references/component-patterns.md` show `framer-motion` in their snippets; ignore those snippets and use `motion/react` here. Allowed path aliases: `@ui/`, `@lib/`, `@components/`, `@hooks/`. No relative imports across directories. Use `<Button>` for actual `<button>` elements; use `buttonStyles({ variant, size })` to style `<a>` tags or other non-button elements that need a button look.

### Framer Motion conventions
The default reveal pattern for a website section is scroll-triggered:

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

For grids and lists, use a parent with `staggerChildren` and child variants:

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Card item={item} />
    </motion.div>
  ))}
</motion.div>
```

Timing budget:

- Scroll-triggered reveal: 250–300 ms, `ease: "easeOut"`. `y` offset 8–16 px (subtle, never dramatic).
- Stagger between siblings: 50–80 ms (use `0.08` as the default `staggerChildren`).
- Button / toggle feedback: 100–150 ms, `easeOut`. Use `whileHover={{ scale: 1.02 }}` and `whileTap={{ scale: 0.98 }}` on interactive cards and CTAs.
- Exit animations: 150 ms, `easeIn`. Wrap exit-animated conditionals in `<AnimatePresence>`; add `mode="wait"` when swapping between two siblings (tabs, routes).

Honor user motion preferences: call `const prefersReducedMotion = useReducedMotion();` near the top of the component and either skip non-essential motion or set `initial={false}` when it returns `true`.

### Story conventions
File name: `<ComponentName>.stories.tsx` (sibling of `index.tsx`). Skeleton:

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import ComponentName from "./index";

const meta: Meta<typeof ComponentName> = {
  title: "<Category>/<ComponentName>",
  component: ComponentName,
  parameters: { layout: "fullscreen" },
  argTypes: {
    ctaStyle: { control: "select", options: ["primary", "secondary", "ghost"] },
  },
};
export default meta;
type Story = StoryObj<typeof ComponentName>;
```

Export **3–5 stories**, each with a **scenario name** (`Default`, `RealEstate`, `SaasOnboarding`, `FreelancerPortfolio`, `LocalRestaurant`) — never prop-named (no `WithEmailButton`, no `DarkVariant`). Every story has unique, realistic English content with a different business context — never duplicate slot data across stories just to swap a single prop. Mix variant props (e.g. `ctaStyle`, optional flags) naturally across stories instead of creating dedicated demo stories. No Lorem ipsum, no "Your headline here", no placeholder copy. For images use `https://placehold.co/WxH` with appropriate dimensions.

### Forbidden patterns
- **Raw Tailwind colors** — `text-gray-500`, `bg-blue-600`, `border-slate-700`. They break theme switching and per-site palettes.
- **`dark:` variants** — the OKLCH token system handles theme switching at the CSS-variable level. Components must work in both themes via tokens alone.
- **Inline `style={{}}`** — the only exception is genuinely dynamic Framer Motion values (`zIndex`, animated `rotate`, drag positions). Static styling always goes through Tailwind classes composed with `cn()`.
- **CSS `@keyframes` or CSS transitions** — keep all motion in Framer Motion for consistency.
- **`position: absolute` for layout** — only for decorative overlays. Use grid/flex for structural layout.
- **Letter-by-letter reveals**, bounce/elastic easing, durations > 300 ms for UI feedback. Reserve 400 ms+ only for decorative page transitions, never for component-level interactions.
- **Missing `<AnimatePresence>`** around exit-animated conditionals — without it, exit animations don't play.
- **`import { motion } from "framer-motion"`** — must be `from "motion/react"`. This is the single most common LLM bias to fight.
- **Cards inside cards** — one level of card only. For nested grouping use `bg-base-200` with padding.
- **Centering everything** — left-align text and content by default. Center only hero sections, empty states, and loading indicators.
- **Hardcoded copy** that should be a slot — every visible string in the screenshot becomes a typed prop.
- **Concatenated class strings** — always use `cn()` from `@lib/utils` for conditional classes.
- **Cross-library imports** — library components do not import from sibling library components. Share patterns via `@ui/` primitives only.

## ToS Guardrail

The NicePage HTML and CSS are read for **structural signals only** — heading text, CTA label text, form field count, section count, and a sampled CSS color palette. The component code is regenerated from scratch using the SiteGen design system (semantic OKLCH tokens, `@ui/` primitives, `motion/react`, the conventions inlined above). Treat the screenshots as visual inspiration, not source material. **No NicePage HTML or CSS may appear in the generated output.**

## Report

After step 8 succeeds, summarize the run for the user:

- **Component path** — `components/library/<category-dir>/<ComponentName>/`. The writer logs this on success; mirror it. Note that `<category-dir>` follows the writer's category-to-directory map (e.g. `layout/grid` resolves to `layouts/grid`, `footers` stays as `footers`).
- **Storybook stories** — count of named exports in `<ComponentName>.stories.tsx`. Also list each story name briefly so the user can navigate them.
- **Computed `id`** — read it from the written `metadata.json`. It follows `<prefix>-<kebab-name>-<seq>` (e.g. `contact-shapes-form-01`, `hero-modern-split-02`).
- **Slot summary** — count of slots defined plus the names of any optional/feature-toggle slots (typewriter, email capture, etc.).
- **Warnings** — any non-fatal lines emitted during capture or write: large screenshot buffer notice (still under the 5 MB image cap), manifest rebuild advisories, etc.
- **Next step** — direct the user to `npm run components:storybook` from the repo root. Storybook dev mode auto-discovers new stories via the `**/*.stories.@(ts|tsx)` glob, so no `build-storybook` step is required for the smoke test.

If the writer exits non-zero, do **not** produce this report — instead surface the exit code (1 = generic / parse / read failure, 2 = schema or category lookup failure, 3 = manifest rebuild failure, 4 = capture / Chromium failure) along with the stderr tail so the user can act on the specific failure mode.
