---
title: Build SiteGen Component Library v1 — 16 components with full theme system and Storybook
type: NewFeature
branch: feat/component-library-v1
created: 2026-04-10
---

## Context

The `components/` workspace does not exist yet. This plan creates it from scratch: workspace scaffolding, a full CSS variable token system (oklch, DaisyUI-style naming, light + dark mode), Storybook for local development, and 16 pre-designed React components across heroes, features, CTAs, contact, and footers. Components are for AI-generated client sites only — not the seller dashboard. Each component ships with `index.tsx` (slot props), `metadata.json` (full schema), and a `.stories.tsx` file.

## Docs to Read

- `.claude/rules/domains/components.md`
- `.claude/rules/general.md`
- `.claude/work/context.md`

## Reference Patterns

- Metadata schema: see `.claude/rules/domains/components.md` — `id`, `name`, `category`, `style[]`, `mood[]`, `layout`, `density`, `slots[]`, `mobileBehavior`, `pairsWell[]`, `pairsPoorly[]`
- Style tags allowed: `modern`, `classic`, `editorial`, `luxury`, `playful`, `minimal`, `bold`, `corporate`
- Mood tags allowed: `professional`, `elegant`, `fun`, `serious`, `friendly`, `energetic`, `calm`, `trustworthy`
- Path pattern: `components/library/<category>/<ComponentName>/`

---

## Work Items

### Wave 1 — Workspace Scaffolding

---

### 1. Initialize components workspace package

- **Status:** created
- **Scope:** components
- **Depends:** —
- **Files:**
  - `components/package.json` — workspace package, scripts, peer deps (react, react-dom, next), dev deps (typescript, tailwindcss, postcss, autoprefixer, storybook)
  - `components/tsconfig.json` — extends root tsconfig, paths alias `@components/*` → `./library/*`, JSX preserve
- **Action:** Create a self-contained npm workspace package named `@sitegen/components`. Include scripts: `storybook` (start storybook on port 6006), `build-storybook`, `type-check` (tsc --noEmit). Peer deps: `react ^18`, `react-dom ^18`, `next ^14`. Dev deps: `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `@storybook/react`, `@storybook/nextjs`, `@storybook/addon-essentials`, `@storybook/addon-a11y`. No `@shadcn/ui` package — components are copy-paste, so no registry dependency. The tsconfig paths alias is `@components/*` mapping to `./library/*` to match the `@components/*` convention in `general.md`.
- **Validate:** `cd components && npx tsc --noEmit --version` (confirms tsconfig parses)
- **Commit:** `chore(components): initialize components workspace with package.json and tsconfig`

### 2. Add root package.json with workspaces

- **Status:** created
- **Scope:** components (root)
- **Depends:** 1
- **Files:**
  - `package.json` — root package.json with npm workspaces config
- **Action:** The repo has no root `package.json` yet. Create one declaring `"workspaces": ["components", "dashboard", "agents", "infra"]`. Add root-level scripts: `"components:storybook": "npm run storybook --workspace=components"`, `"components:type-check": "npm run type-check --workspace=components"`. Set `"private": true`.
- **Validate:** `npm install` from repo root resolves without error
- **Commit:** `chore(components): add root package.json with npm workspaces`

---

### Wave 2 — Tailwind + Theme System

---

### 3. Add Tailwind and PostCSS config

- **Status:** created
- **Scope:** components
- **Depends:** 1, 2
- **Files:**
  - `components/tailwind.config.ts` — extend theme with CSS variable references for all tokens
  - `components/postcss.config.js` — tailwindcss + autoprefixer
- **Action:** The tailwind config must extend `theme.colors` with every token as a CSS variable reference. Pattern: `primary: 'oklch(var(--color-primary) / <alpha-value>)'` for each color token. Also extend `theme.borderRadius` using `--radius-box`, `--radius-field`, `--radius-selector`. Extend `theme.fontFamily` for font tokens. Set `content` to include `./library/**/*.{ts,tsx}` and `./src/**/*.{ts,tsx}`. Pin Tailwind to v3 (`^3.4`).
- **Validate:** `cd components && npx tsc --noEmit`
- **Commit:** `chore(components): add tailwind config with token bindings`

### 4. Create the CSS variable token system and default theme

- **Status:** created
- **Scope:** components
- **Depends:** 3
- **Files:**
  - `components/src/themes/tokens.css` — full token variable declarations (light + dark via `[data-theme]` attribute)
  - `components/src/themes/default.css` — one complete "Corporate Clean" theme
- **Action:** `tokens.css` documents the full token contract. `default.css` provides concrete oklch values for both light (`[data-theme="default"]`) and dark (`[data-theme="default-dark"]`) palettes:
  - **Colors (oklch):** `--color-base-100`, `--color-base-200`, `--color-base-300`, `--color-base-content`, `--color-primary`, `--color-primary-content`, `--color-secondary`, `--color-secondary-content`, `--color-accent`, `--color-accent-content`, `--color-neutral`, `--color-neutral-content`, `--color-info`, `--color-info-content`, `--color-success`, `--color-success-content`, `--color-warning`, `--color-warning-content`, `--color-error`, `--color-error-content`
  - **Radius:** `--radius-selector`, `--radius-field`, `--radius-box`
  - **Sizes:** `--size-selector`, `--size-field`
  - **Border:** `--border`
  - **Effects:** `--depth`, `--noise`
  - **Fonts:** `--font-sans`, `--font-serif`, `--font-mono` (system stacks as defaults until fonts are decided)
  Theme applied via `data-theme` attribute on `<html>`.
- **Validate:** CSS file is valid (import in story in item 5)
- **Commit:** `feat(components): add css variable token system and default theme`

---

### Wave 3 — Storybook Setup

---

### 5. Configure Storybook

- **Status:** created
- **Scope:** components
- **Depends:** 4, 2
- **Files:**
  - `components/.storybook/main.ts` — storybook config: framework `@storybook/nextjs`, stories glob, addons
  - `components/.storybook/preview.ts` — global decorators, viewport presets, theme toggle parameter
  - `components/.storybook/ThemeDecorator.tsx` — decorator that applies `data-theme` attribute and imports theme CSS
- **Action:**
  - `main.ts`: framework `@storybook/nextjs`. Stories: `['../library/**/*.stories.@(ts|tsx)']`. Addons: `@storybook/addon-essentials`, `@storybook/addon-a11y`.
  - `preview.ts`: import ThemeDecorator, register as global decorator. Theme toolbar: `default` and `default-dark`. Viewport presets: mobile (375px), tablet (768px), desktop (1280px).
  - `ThemeDecorator.tsx`: `'use client'`, reads `theme` parameter, sets `data-theme` on wrapper div, imports theme CSS.
- **Validate:** `cd components && npm run storybook` starts without errors
- **Commit:** `chore(components): configure storybook with theme and viewport presets`

---

### Wave 4 — Pattern Validation (First Component)

---

### 6. Build HeroFullWidth (pattern anchor)

- **Status:** created
- **Scope:** components
- **Depends:** 5
- **Files:**
  - `components/library/hero/HeroFullWidth/index.tsx`
  - `components/library/hero/HeroFullWidth/metadata.json`
  - `components/library/hero/HeroFullWidth/HeroFullWidth.stories.tsx`
- **Action:**
  - `index.tsx`: Server component. Props: `headline`, `subheadline?`, `ctaText?`, `ctaUrl?`, `imageSrc?`, `imageAlt?`. Full-width image bg with centered text overlay. Tailwind classes using theme tokens.
  - `metadata.json`: id `hero-full-width-01`, category `hero`, style `["bold", "modern"]`, mood `["energetic", "professional"]`, layout `full-width`, density `high`, mobileBehavior `scale`, slots with types and maxLengths, pairsWell `["features-grid-01", "cta-banner-01"]`, pairsPoorly `["hero-video-bg-01"]`.
  - Story: `Default` and `DarkTheme` stories with realistic placeholder content.
- **Validate:** Story renders in Storybook; `npx tsc --noEmit` passes
- **Commit:** `feat(components): add HeroFullWidth component with metadata and story`

---

### Wave 5 — Remaining Heroes (parallel)

---

### 7. Build HeroSplit

- **Status:** created
- **Scope:** components
- **Depends:** 6
- **Files:**
  - `components/library/hero/HeroSplit/index.tsx`
  - `components/library/hero/HeroSplit/metadata.json`
  - `components/library/hero/HeroSplit/HeroSplit.stories.tsx`
- **Action:** Two-column split: text left, image right. `flex-col-reverse` on mobile. Slots: `headline`, `subheadline`, `ctaText`, `ctaUrl`, `image` (4:3), `badgeText`. Id `hero-split-01`, style `["modern", "editorial"]`, mood `["professional", "elegant"]`, layout `split`, density `medium`, mobileBehavior `stack`. pairsWell `["features-icon-list-01", "cta-inline-01"]`.
- **Validate:** `npx tsc --noEmit` passes
- **Commit:** `feat(components): add HeroSplit component with metadata and story`

### 8. Build HeroVideoBg

- **Status:** created
- **Scope:** components
- **Depends:** 6
- **Files:**
  - `components/library/hero/HeroVideoBg/index.tsx`
  - `components/library/hero/HeroVideoBg/metadata.json`
  - `components/library/hero/HeroVideoBg/HeroVideoBg.stories.tsx`
- **Action:** Video background hero. `<video autoPlay muted loop playsInline>`. Semi-transparent overlay for text legibility. Slots: `headline`, `subheadline`, `ctaText`, `ctaUrl`, `videoSrc` (url), `posterImage` (image). Id `hero-video-bg-01`, style `["bold", "luxury"]`, mood `["energetic", "elegant"]`, layout `full-width`, density `high`, mobileBehavior `scale`. pairsWell `["cta-banner-01"]`, pairsPoorly `["hero-full-width-01"]`.
- **Validate:** `npx tsc --noEmit` passes
- **Commit:** `feat(components): add HeroVideoBg component with metadata and story`

### 9. Build HeroCentered

- **Status:** created
- **Scope:** components
- **Depends:** 6
- **Files:**
  - `components/library/hero/HeroCentered/index.tsx`
  - `components/library/hero/HeroCentered/metadata.json`
  - `components/library/hero/HeroCentered/HeroCentered.stories.tsx`
- **Action:** Centered text-only hero with optional gradient from `--color-primary` to `--color-base-100`. No image. Slots: `headline`, `subheadline`, `ctaText`, `ctaUrl`, `ctaSecondaryText`, `ctaSecondaryUrl`. Id `hero-centered-01`, style `["minimal", "modern"]`, mood `["professional", "calm"]`, layout `centered`, density `low`, mobileBehavior `scale`. pairsWell `["features-grid-01", "cta-inline-01"]`.
- **Validate:** `npx tsc --noEmit` passes
- **Commit:** `feat(components): add HeroCentered component with metadata and story`

### 10. Build HeroGradient

- **Status:** created
- **Scope:** components
- **Depends:** 6
- **Files:**
  - `components/library/hero/HeroGradient/index.tsx`
  - `components/library/hero/HeroGradient/metadata.json`
  - `components/library/hero/HeroGradient/HeroGradient.stories.tsx`
- **Action:** Animated CSS gradient background using `--color-primary`, `--color-secondary`, `--color-accent`. Pure CSS `@keyframes`. Slots: `headline`, `subheadline`, `ctaText`, `ctaUrl`, `tagline` (eyebrow). Id `hero-gradient-01`, style `["modern", "playful"]`, mood `["energetic", "friendly"]`, layout `centered`, density `medium`, mobileBehavior `scale`. pairsWell `["features-icon-list-01", "cta-floating-01"]`, pairsPoorly `["hero-video-bg-01"]`.
- **Validate:** `npx tsc --noEmit` passes
- **Commit:** `feat(components): add HeroGradient component with metadata and story`

---

### Wave 6 — Features Components (parallel)

---

### 11. Build FeaturesGrid

- **Status:** created
- **Scope:** components
- **Depends:** 6
- **Files:**
  - `components/library/features/FeaturesGrid/index.tsx`
  - `components/library/features/FeaturesGrid/metadata.json`
  - `components/library/features/FeaturesGrid/FeaturesGrid.stories.tsx`
- **Action:** 3-column card grid (2-col tablet, 1-col mobile). `features` list slot (maxItems 6, item: icon/title/description). Section slots: `sectionTitle`, `sectionSubtitle`. Cards use `--radius-box`, `--color-base-200`, `--border`. Id `features-grid-01`, style `["modern", "corporate"]`, mood `["professional", "trustworthy"]`, layout `grid`, density `medium`, mobileBehavior `stack`. pairsWell `["hero-split-01", "hero-full-width-01", "cta-banner-01"]`.
- **Validate:** `npx tsc --noEmit` passes
- **Commit:** `feat(components): add FeaturesGrid component with metadata and story`

### 12. Build FeaturesIconList

- **Status:** created
- **Scope:** components
- **Depends:** 6
- **Files:**
  - `components/library/features/FeaturesIconList/index.tsx`
  - `components/library/features/FeaturesIconList/metadata.json`
  - `components/library/features/FeaturesIconList/FeaturesIconList.stories.tsx`
- **Action:** Vertical icon + text list, 2-column desktop. No card boxes. Each item: icon, title, description. Section slots: `sectionTitle`, `sectionSubtitle`. List slot maxItems 8. Id `features-icon-list-01`, style `["minimal", "modern"]`, mood `["calm", "trustworthy"]`, layout `list`, density `low`, mobileBehavior `stack`. pairsWell `["hero-gradient-01", "hero-split-01"]`.
- **Validate:** `npx tsc --noEmit` passes
- **Commit:** `feat(components): add FeaturesIconList component with metadata and story`

### 13. Build FeaturesAlternating

- **Status:** created
- **Scope:** components
- **Depends:** 6
- **Files:**
  - `components/library/features/FeaturesAlternating/index.tsx`
  - `components/library/features/FeaturesAlternating/metadata.json`
  - `components/library/features/FeaturesAlternating/FeaturesAlternating.stories.tsx`
- **Action:** Alternating left-right sections: text + image, flip on even/odd. `sections` list slot (maxItems 4, item: title/description/image/imageAlt). Plus `sectionTitle`, `sectionSubtitle`. `flex-row-reverse` on even index. Stacks on mobile. Id `features-alternating-01`, style `["editorial", "modern"]`, mood `["professional", "elegant"]`, layout `alternating`, density `high`, mobileBehavior `stack`. pairsWell `["hero-centered-01", "cta-inline-01"]`.
- **Validate:** `npx tsc --noEmit` passes
- **Commit:** `feat(components): add FeaturesAlternating with metadata and story`

### 14. Build FeaturesSimpleList

- **Status:** created
- **Scope:** components
- **Depends:** 6
- **Files:**
  - `components/library/features/FeaturesSimpleList/index.tsx`
  - `components/library/features/FeaturesSimpleList/metadata.json`
  - `components/library/features/FeaturesSimpleList/FeaturesSimpleList.stories.tsx`
- **Action:** Simple checkmark/bullet list, two-column desktop. Text-only items (maxItems 12). Section slots: `sectionTitle`, `sectionSubtitle`. Id `features-simple-list-01`, style `["minimal", "classic"]`, mood `["calm", "trustworthy"]`, layout `list`, density `low`, mobileBehavior `stack`. pairsWell `["hero-centered-01", "cta-banner-01", "contact-form-01"]`.
- **Validate:** `npx tsc --noEmit` passes
- **Commit:** `feat(components): add FeaturesSimpleList component with metadata and story`

---

### Wave 7 — CTAs (parallel)

---

### 15. Build CTABanner

- **Status:** created
- **Scope:** components
- **Depends:** 6
- **Files:**
  - `components/library/cta/CTABanner/index.tsx`
  - `components/library/cta/CTABanner/metadata.json`
  - `components/library/cta/CTABanner/CTABanner.stories.tsx`
- **Action:** Full-width banner CTA. Background `--color-primary`. Slots: `headline`, `subheadline`, `ctaText`, `ctaUrl`, `ctaSecondaryText?`, `ctaSecondaryUrl?`. Two buttons side by side (stack mobile). Id `cta-banner-01`, style `["bold", "modern"]`, mood `["energetic", "professional"]`, layout `full-width`, density `medium`, mobileBehavior `stack`. pairsWell `["hero-full-width-01", "features-grid-01"]`, pairsPoorly `["cta-inline-01"]`.
- **Validate:** `npx tsc --noEmit` passes
- **Commit:** `feat(components): add CTABanner component with metadata and story`

### 16. Build CTAInline

- **Status:** created
- **Scope:** components
- **Depends:** 6
- **Files:**
  - `components/library/cta/CTAInline/index.tsx`
  - `components/library/cta/CTAInline/metadata.json`
  - `components/library/cta/CTAInline/CTAInline.stories.tsx`
- **Action:** Contained card CTA within page flow. `--color-base-200` bg, `--border`, `--radius-box`. Slots: `headline`, `supportText`, `ctaText`, `ctaUrl`. Single button. Id `cta-inline-01`, style `["minimal", "corporate"]`, mood `["professional", "calm"]`, layout `contained`, density `low`, mobileBehavior `stack`. pairsWell `["features-alternating-01", "hero-split-01"]`, pairsPoorly `["cta-banner-01"]`.
- **Validate:** `npx tsc --noEmit` passes
- **Commit:** `feat(components): add CTAInline component with metadata and story`

### 17. Build CTAFloating

- **Status:** created
- **Scope:** components
- **Depends:** 6
- **Files:**
  - `components/library/cta/CTAFloating/index.tsx`
  - `components/library/cta/CTAFloating/metadata.json`
  - `components/library/cta/CTAFloating/CTAFloating.stories.tsx`
- **Action:** Sticky bottom CTA bar. `'use client'` — scroll listener to show/hide. `position: fixed; bottom: 0`. Background `--color-primary`. Slots: `ctaText`, `ctaUrl`, `supportText?`. Slide-up CSS animation. Id `cta-floating-01`, style `["bold", "modern"]`, mood `["energetic", "friendly"]`, layout `fixed`, density `low`, mobileBehavior `show`. pairsWell `["hero-gradient-01"]`. Add `"requiresClient": true` in metadata.
- **Validate:** `npx tsc --noEmit` passes
- **Commit:** `feat(components): add CTAFloating component with metadata and story`

---

### Wave 8 — Contact + Footers (parallel)

---

### 18. Build ContactForm

- **Status:** created
- **Scope:** components
- **Depends:** 6
- **Files:**
  - `components/library/contact/ContactForm/index.tsx`
  - `components/library/contact/ContactForm/metadata.json`
  - `components/library/contact/ContactForm/ContactForm.stories.tsx`
- **Action:** `'use client'` contact form. Controlled inputs: name, email, message. `onSubmit?: (data: FormData) => Promise<void>` prop (Assembler wires handler). Inputs use `--radius-field`, `--size-field`, `--border`. Slots: `sectionTitle`, `sectionSubtitle`, `submitLabel` (default "Send Message"), `successMessage`. Id `contact-form-01`, style `["modern", "minimal"]`, mood `["professional", "friendly"]`, layout `split`, density `medium`, mobileBehavior `stack`. pairsWell `["features-simple-list-01", "footer-simple-01"]`, pairsPoorly `["contact-map-info-01"]`.
- **Validate:** `npx tsc --noEmit` passes
- **Commit:** `feat(components): add ContactForm component with metadata and story`

### 19. Build ContactMapInfo

- **Status:** created
- **Scope:** components
- **Depends:** 6
- **Files:**
  - `components/library/contact/ContactMapInfo/index.tsx`
  - `components/library/contact/ContactMapInfo/metadata.json`
  - `components/library/contact/ContactMapInfo/ContactMapInfo.stories.tsx`
- **Action:** Two-column: iframe map left, contact info right. Server component (iframe is SSR-safe). Slots: `mapEmbedUrl` (url), `sectionTitle`, `addressLine1`, `addressLine2?`, `phone`, `email`, `businessHours?`. Id `contact-map-info-01`, style `["corporate", "classic"]`, mood `["trustworthy", "professional"]`, layout `split`, density `medium`, mobileBehavior `stack`. pairsWell `["footer-multi-column-01", "cta-banner-01"]`, pairsPoorly `["contact-form-01"]`.
- **Validate:** `npx tsc --noEmit` passes
- **Commit:** `feat(components): add ContactMapInfo component with metadata and story`

### 20. Build FooterSimple

- **Status:** created
- **Scope:** components
- **Depends:** 6
- **Files:**
  - `components/library/footer/FooterSimple/index.tsx`
  - `components/library/footer/FooterSimple/metadata.json`
  - `components/library/footer/FooterSimple/FooterSimple.stories.tsx`
- **Action:** Single-row footer: logo left, nav links center, copyright right. Stacks on mobile. Slots: `logoText`, `logoImage?`, `links` (list, maxItems 6, item: label/href), `copyrightText`. Background `--color-neutral`, text `--color-neutral-content`. Id `footer-simple-01`, style `["minimal", "modern"]`, mood `["calm", "professional"]`, layout `single-row`, density `low`, mobileBehavior `stack`. pairsWell `["contact-form-01", "cta-inline-01"]`.
- **Validate:** `npx tsc --noEmit` passes
- **Commit:** `feat(components): add FooterSimple component with metadata and story`

### 21. Build FooterMultiColumn

- **Status:** created
- **Scope:** components
- **Depends:** 6
- **Files:**
  - `components/library/footer/FooterMultiColumn/index.tsx`
  - `components/library/footer/FooterMultiColumn/metadata.json`
  - `components/library/footer/FooterMultiColumn/FooterMultiColumn.stories.tsx`
- **Action:** Multi-column footer: logo + tagline, up to 3 link columns, bottom bar with copyright + social. Slots: `logoText`, `logoImage?`, `tagline`, `columns` (list, maxItems 3, item: title + links array), `copyrightText`, `socialLinks` (list, maxItems 5, item: platform/href). Background `--color-neutral`. Stacks on mobile. Id `footer-multi-column-01`, style `["corporate", "classic"]`, mood `["professional", "trustworthy"]`, layout `multi-column`, density `high`, mobileBehavior `stack`. pairsWell `["contact-map-info-01", "features-alternating-01"]`.
- **Validate:** `npx tsc --noEmit` passes
- **Commit:** `feat(components): add FooterMultiColumn with metadata and story`

---

### Wave 9 — Index and Export

---

### 22. Create component library index

- **Status:** created
- **Scope:** components
- **Depends:** 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
- **Files:**
  - `components/library/index.ts` — re-exports all 16 components + COMPONENT_REGISTRY
  - `components/src/index.ts` — workspace public API
- **Action:** `library/index.ts` exports each component by name and a `COMPONENT_REGISTRY` const mapping component id strings → component + metadata path. `src/index.ts` re-exports everything.
- **Validate:** `npx tsc --noEmit` from components/ passes
- **Commit:** `feat(components): add component registry index and workspace public api`

---

## Expected Outputs

| # | Output | Path | Wired To |
|---|--------|------|----------|
| 1 | Workspace package | `components/package.json` | Root workspaces |
| 2 | TypeScript config | `components/tsconfig.json` | All TS |
| 3 | Tailwind config | `components/tailwind.config.ts` | All components |
| 4 | PostCSS config | `components/postcss.config.js` | Tailwind |
| 5 | Token CSS | `components/src/themes/tokens.css` | All components |
| 6 | Default theme | `components/src/themes/default.css` | Storybook |
| 7 | Storybook config | `components/.storybook/main.ts` | All stories |
| 8 | Theme decorator | `components/.storybook/ThemeDecorator.tsx` | Every story |
| 9-24 | 16 components | `components/library/<cat>/<Name>/` | Composer Agent |
| 25 | Component registry | `components/library/index.ts` | Assembler |
| 26 | Root package.json | `package.json` | npm workspaces |

## Gotchas

- **Tailwind v3 pinned:** Use `^3.4` — v4 changes CSS variable syntax significantly. oklch variables use `'oklch(var(--color-primary) / <alpha-value>)'` pattern.
- **Storybook + Next.js RSC:** Use `@storybook/nextjs` framework. Keep components as synchronous functions (not async) for Storybook compatibility.
- **CTAFloating is `'use client'`:** Scroll listener needs browser APIs. Add `requiresClient: true` in metadata for Assembler.
- **ContactForm `onSubmit` prop:** Form component accepts `onSubmit` prop rather than hardcoded server action — Assembler injects the handler.
- **`list` slot type:** Uses `"itemSchema": { ... }` inline object in metadata. Content Agent must understand this structure.
- **`pairsWell` IDs must match real component IDs:** Cross-check all pairings against the 16 component ids.
- **Storybook story imports:** Use relative paths for CSS imports, not `@components/*` alias.
- **Icon set:** `icon` slot typed as `url` (image URL). No icon library dependency.

## Open Questions

1. **Tailwind version:** Plan pins v3. Confirm if you want v4 instead (different config approach).
2. **Font tokens:** Default theme uses system font stacks. Actual font choices TBD.
3. **`list` slot itemSchema:** Needs formal spec sign-off for Content Agent compatibility.
4. **Icon handling:** Using `url` type keeps components dependency-free. Confirm no icon library needed.

## Execution Summary

| # | Wave | Item | Status |
|---|------|------|--------|
| 1 | 1 | Initialize components workspace package | created |
| 2 | 1 | Add root package.json with workspaces | created |
| 3 | 2 | Add Tailwind and PostCSS config | created |
| 4 | 2 | Create CSS token system + default theme | created |
| 5 | 3 | Configure Storybook | created |
| 6 | 4 | Build HeroFullWidth (pattern anchor) | created |
| 7 | 5 | Build HeroSplit | created |
| 8 | 5 | Build HeroVideoBg | created |
| 9 | 5 | Build HeroCentered | created |
| 10 | 5 | Build HeroGradient | created |
| 11 | 6 | Build FeaturesGrid | created |
| 12 | 6 | Build FeaturesIconList | created |
| 13 | 6 | Build FeaturesAlternating | created |
| 14 | 6 | Build FeaturesSimpleList | created |
| 15 | 7 | Build CTABanner | created |
| 16 | 7 | Build CTAInline | created |
| 17 | 7 | Build CTAFloating | created |
| 18 | 8 | Build ContactForm | created |
| 19 | 8 | Build ContactMapInfo | created |
| 20 | 8 | Build FooterSimple | created |
| 21 | 8 | Build FooterMultiColumn | created |
| 22 | 9 | Create component library index | created |
