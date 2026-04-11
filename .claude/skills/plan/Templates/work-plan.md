# Work Plan Template

```markdown
---
title: <one-sentence description>
type: NewFeature | BugFix | Refactoring | Infrastructure
branch: <branch name>
created: <YYYY-MM-DD>
---

## Context

<!-- 2-3 sentences: what and why -->

## Docs to Read

- `.claude/rules/domains/pipeline.md`
- `.claude/rules/domains/components.md`

## Rules to Read

- `.claude/rules/backend/api.md`
- `.claude/rules/deployment.md`

## Reference Patterns

- Agent pattern: `agents/<existing-agent>/handler.ts`
- Dashboard pattern: `dashboard/src/app/<existing-page>/page.tsx`

## Work Items

### 1. <imperative title>

- **Status:** created
- **Scope:** agents | infra | dashboard | components
- **Depends:** — (or item number)
- **Files:**
  - `<path>` — <what changes>
- **Action:** <specific instructions>
- **Validate:** <command>
- **Commit:** `<type>(<scope>): <description>`

## Expected Outputs

| # | Output | Path | Wired To |
|---|--------|------|----------|

## Gotchas

- **<Area>:** <risk and mitigation>

## Execution Summary

<!-- Filled by executor after execution -->

| # | Item | Commit | Status | Notes |
|---|------|--------|--------|-------|
```

## Guidelines

### Item Sizing
- 1-3 files per item (max 5)
- One workspace per item
- One commit per item

### Status Values
| Status | Meaning |
|---|---|
| `created` | Not yet started |
| `started` | Executor working |
| `completed` | Done and committed |
| `blocked` | Cannot complete |
| `skipped` | Dependency was blocked |
