// NicePage Importer — Runtime skill-doc system prompt builder
//
// Reads the SiteGen frontend-design skill at runtime and composes the
// full system prompt for Claude vision. By reading from disk on every
// invocation we get the latest skill conventions without rebuilding the
// agents bundle — the importer is a local CLI, so the skills are always
// resolvable relative to the repo root.
//
// All five files are required (no `existsSync` guard): the executor
// confirmed `style-guide.md` is present alongside `Workflows/Create.md`,
// `references/animation.md`, `references/anti-patterns.md`, and
// `references/component-patterns.md`. A missing file is a setup bug and
// should fail loudly via `fs.readFileSync`.

import * as fs from "fs";
import * as path from "path";

/**
 * Build the full Claude system prompt for the NicePage importer.
 *
 * @param skillsRoot Absolute path to `.claude/skills/frontend-design/`.
 * @returns A single multi-section string ready to pass as `system` to
 *          `client.messages.create()`.
 */
export function buildSystemPrompt(skillsRoot: string): string {
  // -- Read embedded skill docs at runtime ----------------------------
  const createMd = fs.readFileSync(
    path.join(skillsRoot, "Workflows/Create.md"),
    "utf-8",
  );
  const animationMd = fs.readFileSync(
    path.join(skillsRoot, "references/animation.md"),
    "utf-8",
  );
  const antiPatternsMd = fs.readFileSync(
    path.join(skillsRoot, "references/anti-patterns.md"),
    "utf-8",
  );
  const componentPatternsMd = fs.readFileSync(
    path.join(skillsRoot, "references/component-patterns.md"),
    "utf-8",
  );
  const styleGuideMd = fs.readFileSync(
    path.join(skillsRoot, "style-guide.md"),
    "utf-8",
  );

  // -- Section 1: Role -----------------------------------------------
  const role = [
    "# Role",
    "You are generating a SiteGen component from a NicePage visual reference.",
  ].join("\n");

  // -- Section 2: Output contract ------------------------------------
  // The JSON schema sketch mirrors `ClaudeResponseSchema` in
  // `agents/scripts/lib/types.ts`. `id` is intentionally absent — the
  // script computes it after Zod-validating this response.
  const contract = [
    "# Output contract",
    "Return ONE JSON object matching this schema. NO markdown fences, NO surrounding text.",
    "",
    "Required fields:",
    "- componentName (PascalCase, e.g. `ContactShapesForm`)",
    "- category (one of: hero|contact|cta|faq|footers|navigation|carousel|stats|layout/grid|layout/scroll|layout/split)",
    "- name (human-readable string)",
    "- purpose[] (string[], at least 1 entry)",
    "- acceptsStyleKit { card: bool, background: bool, textDecoration: bool, button: bool }",
    "- style[] (subset of: modern|classic|editorial|luxury|playful|minimal|bold|corporate)",
    "- mood[] (subset of: professional|elegant|fun|serious|friendly|energetic|calm|trustworthy)",
    "- layout (one of: split|centered|grid|stacked|asymmetric|multi-column|horizontal|floating)",
    "- density (low|medium|high)",
    "- slots[] (per-slot: name, type, optional? maxLength? aspectRatio? maxItems? enum? itemSchema? fields?)",
    "- mobileBehavior (stack|scroll|collapse|preserve)",
    "- pairsWell[] (string[])",
    "- pairsPoorly[] (string[])",
    "- variants?[] (heroes only — { id, name, density, colorMode, styleOverrides })",
    "- indexTsx (full source string for index.tsx)",
    "- storiesTsx (full source string for <ComponentName>.stories.tsx)",
    "",
    "The script will set `id` after validation — DO NOT include `id` in your response.",
  ].join("\n");

  // -- Section 3: Required imports ------------------------------------
  const imports = [
    "# Required imports in indexTsx",
    '- Line 1 must be `"use client";` — no blank line before imports.',
    '- Motion: `import { motion, useReducedMotion } from "motion/react";` — NEVER `framer-motion`.',
    '- Class merge: `import { cn } from "@lib/utils";`',
    '- Buttons: `import { Button, CtaButton, type CtaVariant, type ColorScheme } from "@ui/button";`',
    "- Use ONLY these aliases — `@ui/`, `@lib/`, `@components/`, `@hooks/`. NO relative imports across directories.",
    "- Always include `className?: string` on the props interface.",
    "- `useReducedMotion()` must be honored.",
  ].join("\n");

  // -- Section 4: OKLCH tokens ---------------------------------------
  // Sourced verbatim from `research-patterns.md` section 9.
  const tokens = [
    "# Tokens (OKLCH) you may use",
    "Backgrounds & surfaces:",
    "- `bg-base-100`, `bg-base-200`, `bg-base-300`",
    "- `text-base-content`",
    "",
    "Brand:",
    "- `bg-primary`, `text-primary`, `text-primary-content`",
    "- `bg-secondary`, `text-secondary`, `text-secondary-content`",
    "- `bg-accent`, `text-accent`, `text-accent-content`",
    "- `bg-neutral`, `text-neutral`, `text-neutral-content`",
    "",
    "Status:",
    "- `bg-info`, `text-info`",
    "- `bg-success`, `text-success`",
    "- `bg-warning`, `text-warning`",
    "- `bg-error`, `text-error`",
    "",
    "Borders & radii:",
    "- `border-base-300`",
    "- `rounded-lg`, `rounded-field`, `rounded-selector`",
    "",
    "Fonts:",
    "- `font-sans`, `font-serif`, `font-mono`",
  ].join("\n");

  // -- Section 5: Forbidden -------------------------------------------
  const forbidden = [
    "# Forbidden",
    "- Raw Tailwind color utilities (`bg-blue-500`, `text-red-600`, etc.) — use only the tokens above.",
    "- Inline hex values in className or style props.",
    "- CSS `@keyframes` or CSS animation rules — use `motion/react` only.",
    "- `dark:` Tailwind variants — color modes are theme-driven.",
    "- `position: absolute` for layout structure (decorative SVG/glow overlays only).",
    "- Letter-by-letter text reveals or bounce/elastic easing.",
    "- Animation duration > 300ms for UI feedback (button hover, click, focus).",
  ].join("\n");

  // -- Section 6: ToS guardrail ---------------------------------------
  const tos = [
    "# ToS guardrail",
    "DO NOT copy NicePage HTML or CSS. Treat the screenshots as visual inspiration only.",
    "Regenerate the component from the SiteGen design system. The HTML signals provided",
    "(heading text, CTA labels, form-field hints, section count) are STRUCTURAL hints",
    "only — use them to size slots and infer composition, never to carry markup forward.",
  ].join("\n");

  // -- Section 7: Embedded skill conventions -------------------------
  // Each file under its own `## <FileName>` header so Claude can refer
  // back to a specific doc when reasoning about a decision.
  const embeddedHeader = "# Embedded skill conventions";
  const embedded = [
    embeddedHeader,
    "## Workflows/Create.md",
    createMd,
    "## references/animation.md",
    animationMd,
    "## references/anti-patterns.md",
    antiPatternsMd,
    "## references/component-patterns.md",
    componentPatternsMd,
    "## style-guide.md",
    styleGuideMd,
  ].join("\n\n");

  return [role, contract, imports, tokens, forbidden, tos, embedded].join(
    "\n\n",
  );
}
