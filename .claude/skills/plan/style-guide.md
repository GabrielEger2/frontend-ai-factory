# Plan Style Guide

How to write plans for SiteGen. Apply these conventions when producing plans and task breakdowns.

## Scope

- **One plan per feature.** Don't bundle unrelated changes.
- **Dependency ordering.** Shared types → agents → CDK → dashboard → components.
- **Explicit file paths.** Reference exact files, not vague descriptions.
- **Dependencies are ordered.** If step B depends on A, list them in that order.

## Format

- **Use the template.** Start from `Templates/feature-plan.md`.
- **Tables for file lists.** Markdown tables for files, changes, and purpose.
- **Checklists for verification.** `- [ ]` checkboxes for gotchas and validation.

## Task Breakdown

- **One task = one commit.** Each task produces a single scoped commit.
- **Task titles are imperative.** "Add research agent handler" not "Adding research agent".
- **Include the scope.** Precise names, not vague descriptions.
- **Identify blockers.** Explicit dependencies between tasks.

## Commit Strategy

Follow `.claude/rules/git.md`:
- Format: `<type>(<scope>): <short description>`
- Typical sequence:
```
feat(agents): add research agent handler and prompt
feat(agents): add style agent handler and prompt
feat(infra): add pipeline stack with agent lambdas
feat(dashboard): add project creation form and API wrapper
```

## Language

- **Precise.** Exact type names, file names, paths.
- **Direct.** "Add `ResearchOutput` type to `agents/research/types.ts`"
- **No hedging.** "This requires X" not "This might need X".

## Gotcha Surfacing

- Call out gotchas as explicit warnings with risk and mitigation.
- Don't bury gotchas inside implementation steps.
