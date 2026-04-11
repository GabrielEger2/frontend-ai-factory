# General Conventions

## Workspace-First Workflow
- Shared types live in each workspace. Cross-workspace types are duplicated minimally or shared via a `shared/` directory.
- Agent functions are self-contained: each has its own handler, prompt, and types.
- Component metadata (style[], mood[], slots[], PAIRS_WITH) is the source of truth for composition.

## Path Aliases
- `@shared/*` — shared utilities across agents
- `@agents/*` — agent-specific code
- `@components/*` — component library
- `@/*` — dashboard `src/` (Next.js)

## Naming
- Agent handlers: `handler.ts` inside each agent directory
- Agent prompts: `prompt.ts` or `prompts/*.ts` inside each agent directory
- CDK stacks: `<Name>Stack.ts` (PascalCase)
- CDK constructs: `<Name>.ts` (PascalCase)
- Dashboard pages: Next.js App Router conventions
- Components: `<ComponentName>/index.tsx` + `metadata.json`
- Database table env vars: `SCREAMING_SNAKE_CASE` with resource suffix
- Constants: `SCREAMING_SNAKE_CASE`

## Pipeline Mental Model
- **AI agents handle subjective decisions** — mood, copy, style choices
- **Graph handles structured knowledge** — component compatibility, style/segment mapping
- **Assembler is deterministic** — slots content into pre-designed templates, no LLM
- Never put LLM calls in the assembler. Never put deterministic logic in AI agents.

## Component Metadata
Every component has: `style[]`, `mood[]`, `category`, `layout`, `density`, `slots[]`, `mobileBehavior`, and `PAIRS_WITH` scores.
