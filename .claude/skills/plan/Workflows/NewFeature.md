# Workflow: New Feature

How to plan a new feature end-to-end for SiteGen.

## When to Use

- Adding a new pipeline agent
- Adding a new dashboard page or feature
- Adding new components to the library
- Any change that touches multiple workspaces

## Before You Start

1. Read `style-guide.md` for plan formatting.
2. Read relevant domain rules.
3. Use `Templates/feature-plan.md`.

## Step-by-Step

### 1. Define Feature Scope

- New agent functions? → `agents/`
- New CDK stacks/constructs? → `infra/`
- New dashboard pages? → `dashboard/`
- New component templates? → `components/`

### 2. Plan Agent Changes

For each new pipeline agent:
1. **Handler** (`agents/<name>/handler.ts`) — Lambda entry point
2. **Prompt** (`agents/<name>/prompt.ts`) — System prompt and formatting
3. **Types** (`agents/<name>/types.ts`) — Input/output interfaces
4. **Examples** (`agents/<name>/examples.ts`) — Few-shot examples if needed

### 3. Plan CDK Changes

1. **Stack** — Add `AgentLambda` construct in `PipelineStack`
2. **Step Function** — Add step to `AgentPipeline`
3. **Permissions** — Grant table access, Secrets Manager access
4. **MainStage** — Wire props if cross-stack

### 4. Plan Dashboard Changes

1. **API wrapper** (`dashboard/src/lib/api/`) — Fetch functions
2. **Server action** (`dashboard/src/lib/actions/`) — Zod validation + API call
3. **Page/Component** — Server Component by default

### 5. Plan Component Changes

1. **Template** (`components/library/<category>/<Name>/index.tsx`)
2. **Metadata** (`metadata.json` with style[], mood[], slots[])
3. **Assembler integration** — Verify slot mapping

### 6. Implementation Order

1. Shared types (if cross-workspace)
2. Agent handlers + prompts
3. CDK stacks + constructs
4. Dashboard pages + actions
5. Component templates + metadata

### 7. Surface Gotchas

- Agent prompt reliability (structured output parsing)
- Step Function state size limits
- Component slot schema consistency
- Vercel deployment configuration

## Quality Checks

- [ ] Each agent has input/output validation
- [ ] CDK constructs use `AgentLambda` pattern
- [ ] Dashboard pages are Server Components by default
- [ ] Component metadata matches schema
- [ ] Implementation order respects dependencies
