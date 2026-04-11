# Git Strategy

## Branching

| Task type | Branch prefix | Example |
|---|---|---|
| New feature | `feat/` | `feat/research-agent` |
| Bug fix | `fix/` | `fix/broken-style-output` |
| Refactoring | `refactor/` | `refactor/agent-shared-utils` |
| Infrastructure | `infra/` | `infra/add-pipeline-stack` |

## Commits

- One commit per work item (atomic).
- Format: `<type>(<scope>): <short description>` (see `.claude/rules/git.md`).
- `.claude/work/` contents are NOT committed.

## PR Creation

1. Push branch with `-u`.
2. Create PR via `gh pr create`:
   - Title under 70 chars.
   - Body with summary bullets, test plan, footer.
3. Report PR URL.

## What NOT to commit

- `.claude/work/` contents
- Unrelated changes
- Files with secrets (`.env`, API keys)
