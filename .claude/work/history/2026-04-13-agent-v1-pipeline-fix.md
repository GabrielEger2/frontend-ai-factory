---
title: Fix 5 runtime gaps in Agent v1 pipeline for end-to-end execution
type: NewFeature
branch: fix/agent-v1-pipeline
created: 2026-04-13
---

## Context

The Phase 1 pipeline (Content Agent → Assembler → Deploy) is fully implemented but has 5 runtime gaps that prevent end-to-end execution. This plan fixes all gaps so the pipeline can actually work when deployed.

## Docs to Read

- `.claude/rules/domains/pipeline.md`
- `.claude/rules/domains/components.md`
- `.claude/rules/general.md`
- `.claude/rules/git.md`

## Rules to Read

- `.claude/rules/backend/api.md`
- `.claude/rules/deployment.md`

## Reference Patterns

- Default theme CSS variables: `components/src/themes/default.css` — exact oklch values for `:root` block
- Correct itemSchema format: `components/library/carousel/CarouselCards/metadata.json` — `{ "type": "object", "fields": [...] }`
- Agent handler pattern: `agents/content/handler.ts` — SSM cache, Zod validation, DDB read/write

## Work Items

### 1. Strip markdown fences from Claude response before JSON.parse

- **Status:** created
- **Scope:** agents
- **Depends:** —
- **Files:**
  - `agents/content/handler.ts` — add fence-stripping between rawJson assignment and JSON.parse
- **Action:** In the `generateContent` function (line 147), after `const rawJson = textBlock.text.trim();`, add a line that strips markdown code fences:
  ```ts
  const jsonString = rawJson
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "");
  ```
  Then change `JSON.parse(rawJson)` to `JSON.parse(jsonString)` on line 151. Also update the error message on line 153 to reference `jsonString` instead of `rawJson`.
- **Validate:** `npm run lint --workspace=agents` (or root lint if available)
- **Commit:** `fix(agents): strip markdown fences from Claude response before JSON.parse`

### 2. Add CSS variable definitions to generateGlobalsCss

- **Status:** created
- **Scope:** agents
- **Depends:** —
- **Files:**
  - `agents/assembler/handler.ts` — replace `generateGlobalsCss()` body (lines 310-315)
- **Action:** Replace the `generateGlobalsCss` function body to emit Tailwind directives followed by a `:root { }` block defining all CSS custom properties. Use the light palette values from `components/src/themes/default.css`.

  CRITICAL: Values must be raw oklch channel triplets (e.g. `0.97 0.001 106.42`), NOT wrapped in `oklch()`. The Tailwind config wraps them.

  Use `:root` selector (NOT `[data-theme="default"]`) because the generated site layout.tsx renders `<html lang="pt-BR">` without a data-theme attribute.

  Exact values to use (from `components/src/themes/default.css` light palette):
  ```
  --color-base-100: 0.97 0.001 106.42;
  --color-base-200: 0.93 0.002 106.42;
  --color-base-300: 0.87 0.003 106.42;
  --color-base-content: 0.27 0.02 261.3;
  --color-primary: 0.49 0.16 264.38;
  --color-primary-content: 0.98 0.005 264.38;
  --color-secondary: 0.62 0.08 230.5;
  --color-secondary-content: 0.98 0.005 230.5;
  --color-accent: 0.55 0.18 280.12;
  --color-accent-content: 0.98 0.005 280.12;
  --color-neutral: 0.32 0.02 261.3;
  --color-neutral-content: 0.94 0.005 106.42;
  --color-info: 0.62 0.14 243.65;
  --color-info-content: 0.98 0.005 243.65;
  --color-success: 0.62 0.17 152.55;
  --color-success-content: 0.98 0.005 152.55;
  --color-warning: 0.75 0.16 75.84;
  --color-warning-content: 0.27 0.04 75.84;
  --color-error: 0.58 0.22 27.33;
  --color-error-content: 0.98 0.005 27.33;
  --radius-selector: 1rem;
  --radius-field: 0.25rem;
  --radius-box: 0.5rem;
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  ```
- **Validate:** `npm run synth` from root (ensures assembler Lambda bundles)
- **Commit:** `fix(assembler): add CSS variable definitions to generateGlobalsCss`

### 3. Widen Step Functions retry policy to States.ALL

- **Status:** created
- **Scope:** infra
- **Depends:** —
- **Files:**
  - `infra/stacks/PipelineStack.ts` — change `retryConfig.errors` on line 185
- **Action:** In the `retryConfig` object at line 181-186, change:
  ```ts
  errors: ["States.TaskFailed"],
  ```
  to:
  ```ts
  errors: ["States.ALL"],
  ```
  This one constant is shared across all 3 pipeline steps (content, assembler, deploy), so the change applies everywhere.
- **Validate:** `npm run synth` from root
- **Commit:** `fix(infra): widen Step Functions retry policy to States.ALL`

### 4. Add predeploy hook to regenerate component sources before deploy

- **Status:** created
- **Scope:** root
- **Depends:** —
- **Files:**
  - `package.json` (root) — add `predeploy` script
- **Action:** Add a `predeploy` npm lifecycle script to the root package.json `scripts` block:
  ```json
  "predeploy": "npm run generate-sources --workspace=agents"
  ```
  npm automatically runs `predeploy` before `deploy`. This ensures `agents/assembler/component-sources.generated.ts` is regenerated from current `components/library/` state before every CDK deploy.
- **Validate:** `npm run predeploy` (runs generate-sources successfully)
- **Commit:** `chore: add predeploy hook to regenerate component sources before deploy`

### 5. Normalize itemSchema to object format in 4 metadata files

- **Status:** created
- **Scope:** components
- **Depends:** —
- **Files:**
  - `components/library/faq/FaqAccordion/metadata.json` — wrap `items.itemSchema` array in `{ "type": "object", "fields": [...] }`
  - `components/library/faq/FaqSolutions/metadata.json` — wrap `items.itemSchema` array in `{ "type": "object", "fields": [...] }`
  - `components/library/faq/FaqMinimal/metadata.json` — wrap `items.itemSchema` array in `{ "type": "object", "fields": [...] }`
  - `components/library/contact/ContactForm/metadata.json` — wrap `fields.itemSchema` array in `{ "type": "object", "fields": [...] }`
- **Action:** In each file, the `itemSchema` is currently a bare JSON array like:
  ```json
  "itemSchema": [
    { "name": "question", "type": "text", "maxLength": 120 },
    { "name": "answer", "type": "text", "maxLength": 500 }
  ]
  ```
  Wrap it in the standard envelope used by other components (see `CarouselCards/metadata.json`):
  ```json
  "itemSchema": {
    "type": "object",
    "fields": [
      { "name": "question", "type": "text", "maxLength": 120 },
      { "name": "answer", "type": "text", "maxLength": 500 }
    ]
  }
  ```
  Do this for all 4 files. The array contents stay exactly the same — only the wrapping changes.
  
  Note: After deploying, the operator must re-run `npm run db:seed` to push corrected metadata to DynamoDB.
- **Validate:** Verify each file is valid JSON (parse with node -e or similar)
- **Commit:** `fix(components): normalize itemSchema to object format in 4 metadata files`

## Expected Outputs

| # | Output | Path | Wired To |
|---|--------|------|----------|
| 1 | Fence-stripped JSON parsing | `agents/content/handler.ts` | Claude API response → JSON.parse |
| 2 | CSS variable `:root` block | `agents/assembler/handler.ts` | generateGlobalsCss → generated site globals.css |
| 3 | States.ALL retry | `infra/stacks/PipelineStack.ts` | Step Functions retry policy |
| 4 | predeploy script | root `package.json` | npm deploy lifecycle → generate-sources |
| 5 | Normalized itemSchema | 4 metadata.json files | Content Agent prompt → Claude |

## Gotchas

- **Task 1 — Regex anchoring:** The fence regex must use `^` and `$` anchors on the already-trimmed string. Don't anchor to the original untrimmed text.
- **Task 2 — oklch values are raw triplets:** `--color-primary: 0.49 0.16 264.38;` NOT `--color-primary: oklch(0.49 0.16 264.38);`. The Tailwind config adds the `oklch()` wrapper.
- **Task 2 — Use `:root` not `[data-theme]`:** Generated sites don't have a data-theme attribute on <html>.
- **Task 3 — States.ALL is intentional:** Catches all error types including Lambda service errors. The maxAttempts: 2 cap limits total retries.
- **Task 5 — Array contents unchanged:** Only the wrapper changes. Don't modify the field objects themselves.

## Execution Summary

<!-- Filled by executor after execution -->

| # | Item | Commit | Status | Notes |
|---|------|--------|--------|-------|
