# Context: Component Library v1

## Task Boundary
Build 16 pre-designed website components across 5 categories (5 heroes, 4 features, 3 CTAs, 2 contact, 2 footers) with a full theming system. These components are for **AI-generated websites** (client-facing output), NOT the seller dashboard. Each component tagged with style[], mood[], category, slots[] metadata. Local development via Storybook.

## Implementation Decisions (locked)

### UI Framework
- **shadcn/UI + Tailwind CSS** — copy-paste components the team owns
- Use DaisyUI's token structure as **inspiration** for CSS variable naming, but NOT DaisyUI as a dependency
- Components are React/Next.js components with slot props

### Theming System
- **DaisyUI-style CSS variable naming**: `--color-base-100`, `--color-primary`, `--radius-box`, etc.
- **oklch color space** for all color tokens
- **Full token set from day 1**:
  - Colors: base-100/200/300/content, primary/content, secondary/content, accent/content, neutral/content, info/content, success/content, warning/content, error/content
  - Border radius: --radius-selector, --radius-field, --radius-box
  - Base sizes: --size-selector, --size-field
  - Border: --border
  - Effects: --depth, --noise
  - Fonts: TBD but included in token system
- **Both light + dark mode from the start** — each theme defines both palettes
- Theme tokens are for **generated sites only** — dashboard has separate styling

### Component Architecture
- **CSS-first, minimal JS** — server components by default, `'use client'` only for forms and essential interactions
- CSS for hover states, transitions, responsive behavior
- Components consume theme tokens via CSS variables + Tailwind classes

### Local Development
- **Storybook** for component development and testing
- Each component gets stories with different themes, slot content, and viewport sizes

### Component Structure (from CLAUDE.md)
- Path: `components/library/<category>/<ComponentName>/`
- Files: `index.tsx` (component), `metadata.json` (tags), optional `variants/`
- Metadata: style[], mood[], category, layout, density, slots[], mobileBehavior, pairsWell[], pairsPoorly[]

## Claude's Discretion
- Exact shadcn/UI components to use as base (if any) vs fully custom
- Storybook configuration details
- Tailwind config structure for custom theme tokens
- Component internal implementation patterns
- File organization within components/ workspace

## Existing Code Insights
- Repo is greenfield — only phases.txt and .claude/ config exist
- No existing components, no package.json, no workspace setup yet
- Monorepo structure defined in CLAUDE.md: infra/, agents/, dashboard/, components/

## Specific Ideas
- User provided a complete DaisyUI theme config as reference for token structure (oklch values, radius, sizes, border, depth, noise)
- Phase 1 scope: 16 components across heroes (5), features (4), CTAs (3), contact (2), footers (2)

## Deferred Ideas
- Neo4j PAIRS_WITH scoring (Phase 3)
- Component variants (Phase 3)
- 50-component full library (Phase 3)
- Dashboard styling (separate concern)
