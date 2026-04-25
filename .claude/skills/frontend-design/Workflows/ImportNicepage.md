# Workflow: ImportNicepage

Import a NicePage preview URL into the SiteGen component library by delegating to the local CLI script (`agents/scripts/nicepage-import.ts`).

## Input

`$ARGUMENTS` is `<url> [--category <cat>] [--name <PascalName>] [--dry-run]`.

- `<url>` — required. A NicePage preview URL (must start with `http`).
- `--category <cat>` — optional. Override the category Claude infers from the screenshots. Valid values: `hero`, `contact`, `cta`, `faq`, `footers`, `navigation`, `carousel`, `stats`, `layout/grid`, `layout/scroll`, `layout/split`.
  - **Slash quoting:** when passing a `layout/...` value, wrap it in double quotes — e.g. `--category "layout/grid"`. Without the quotes most shells split on the slash.
  - **Dash aliases:** to dodge Windows shell quoting issues, the CLI also accepts the dash forms `layout-grid`, `layout-scroll`, and `layout-split`. They normalize to the slash form before lookup.
- `--name <PascalName>` — optional. Force the generated component's PascalCase name (e.g. `ContactShapesForm`). Useful when Claude's inferred name collides with an existing directory or you want a more descriptive label.
- `--dry-run` — optional. Run capture + generation, write artifacts to `.claude/work/imports/<slug>/`, but do NOT write into `components/library/`. Logs the target directory and computed `id` so you can verify before committing the run.

## What this workflow does

This workflow **delegates to the CLI script** at `agents/scripts/nicepage-import.ts`. Claude Code does NOT generate the component inline — the CLI handles the full pipeline end-to-end, including its own Claude vision call:

1. Launch headless Chromium via Playwright at desktop (1280×800) and mobile (375×812) viewports.
2. Capture full-page JPEG screenshots at quality 80, the rendered HTML, and a computed CSS palette via `page.evaluate()` (top 8 non-black/non-white colors used by `body`, headings, sections, links, buttons).
3. Extract structural signals from the HTML with cheerio (headings, CTA labels, form field placeholders, section count) — **no HTML/CSS is carried into the output**.
4. Build a system prompt at runtime by inlining the skill's own `Workflows/Create.md`, `references/animation.md`, `references/anti-patterns.md`, `references/component-patterns.md`, and `style-guide.md`.
5. Call Claude (`claude-opus-4-7`) with both screenshots, the signals, and the CSS palette, requesting one structured JSON response containing `componentName`, full metadata, `indexTsx`, and `storiesTsx`.
6. Validate the response against a Zod schema, write the three component files into `components/library/<category-dir>/<Name>/`, and rebuild `components/library/manifest.json`.

Your job in this workflow is to invoke the CLI, watch the logs, and review the generated component. You do not author the component yourself.

## Pre-conditions

- `ANTHROPIC_API_KEY=sk-ant-...` set in the shell environment. The CLI also accepts `CLAUDE_API_KEY` as a fallback. If neither is set, the script logs `"Set ANTHROPIC_API_KEY in your environment"` and exits with code 1.
- Chromium installed for Playwright: `npx playwright install chromium` (one-time, ~300 MB). The CLI auto-detects a missing binary, prints `"Chromium not found. Run: npx playwright install chromium"`, and exits with code 4.

## CLI invocation

```bash
npm run nicepage:import -- "<url>" [--category "layout/grid"] [--name CustomName] [--dry-run]
```

Run from the repo root. The double-dash (`--`) is required so npm forwards the rest of the arguments to the script.

## ToS guardrail

The importer reads NicePage HTML for **structural signals only** — heading text, CTA label text, form field count, section count. Component code is regenerated from scratch using the SiteGen design system (semantic OKLCH tokens, `@ui/` primitives, `motion/react`, and the conventions inlined from this skill). **No NicePage HTML or CSS is carried into the generated output.** The system prompt explicitly forbids copying source markup. Treat the screenshots as visual inspiration only.

## Expected output

On a successful (non-dry-run) execution, the CLI writes three files:

```
components/library/<category-dir>/<Name>/
  index.tsx
  metadata.json
  <Name>.stories.tsx
```

Notes:
- `<category-dir>` follows the `CATEGORY_TO_DIR` map (e.g. `layout/grid` → `layouts/grid`, `footers` → `footers`).
- `metadata.json` `id` follows `<prefix>-<kebab-name>-<seq>` (e.g. `contact-shapes-form-01`, `hero-modern-split-02`, `layout-card-grid-01`).
- `manifest.json` at `components/library/manifest.json` is regenerated automatically via `npx ts-node scripts/build-manifest.ts`.
- Per-run artifacts land at `.claude/work/imports/<YYYY-MM-DD>-<slug>/` and contain `screenshot-desktop.jpg`, `screenshot-mobile.jpg`, `page.html`, and `brief.json`. This directory is gitignored.

## Post-import steps

1. Run `npm run components:storybook` from the repo root. **Storybook dev mode auto-discovers new stories** via the `**/*.stories.@(ts|tsx)` glob — no `build-storybook` step is required for the smoke test.
2. Open the new story under `<Category>/<ComponentName>` in the Storybook browser tab. Verify all stories render, the scroll-triggered animations play, and there are no console errors.
3. Type-check both workspaces if you plan to commit: `npm run type-check --workspace=agents` and `npm run components:type-check`.
4. If satisfied, stage and commit the three component files plus the regenerated `manifest.json`. The artifact directory under `.claude/work/imports/` is gitignored, so it does not need to be committed or cleaned up.

## Smoke test

Reference URL — a contact section with decorative shapes:

```
https://nicepage.com/css-templates/preview/contact-us-block-with-shapes-6119341?device=desktop
```

Suggested sequence:

1. **Dry run:** `npm run nicepage:import -- "<url>" --dry-run`. Confirm the artifact directory contains all four files and that `brief.json` shows a `category` of `contact`, a PascalCase `componentName`, slots covering at least `headline`, `description`, and form-related fields, an `indexTsx` that begins with `"use client"` and contains `from "motion/react"`, and a `storiesTsx` that includes `layout: "fullscreen"` plus three or more named exports.
2. **Live run:** rerun without `--dry-run`. Expect a log line of the form `Component written to: components/library/contact/<Name>` and a follow-up `Next: npm run components:storybook`.
3. **Verify on disk:** the three files exist at `components/library/contact/<Name>/`, `metadata.json` `id` matches `contact-<kebab>-01`, and `manifest.json` includes the new entry.

### Report

After the CLI exits, summarize:

- The component path that was written (`components/library/<category-dir>/<Name>/`).
- The number of Storybook stories created (count of named exports in `<Name>.stories.tsx`).
- Any warnings the CLI emitted — most commonly the `screenshot buffer >4.5MB` warning (still under Claude's 5 MB image cap, just tight) or the manifest rebuild error (component files written but `manifest.json` is stale; rerun the manifest builder manually).
- The exit code if non-zero (1 = generic / API key / parse failure, 2 = validation or category lookup failure, 3 = manifest rebuild failure, 4 = capture failure / Chromium missing).
