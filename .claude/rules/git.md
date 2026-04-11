# Git Conventions

## Commit Messages
Format: `<type>(<scope>): <short description>`

### Types
- `feat` — new feature or capability
- `fix` — bug fix
- `refactor` — code restructuring without behavior change
- `docs` — documentation only
- `test` — adding or updating tests
- `chore` — build, deps, config changes

### Scopes (match workspace or domain)
- `infra` — CDK/CloudFormation
- `agents` — any pipeline agent code
- `dashboard` — seller dashboard frontend
- `components` — component library
- `pipeline` — Step Functions orchestration
- `research`, `style`, `composer`, `content`, `seo`, `humanizer`, `assembler`, `qa` — specific agent

### Rules
- Title: max 72 chars, lowercase, no period
- Body: blank line after title, then explain WHAT changed and WHY
- One commit per logical unit of work
- Always `git add` specific files, never `git add .`

### Example
```
feat(agents): add research agent handler and prompt

Implement the Research Agent that searches for company info,
competitors, and market segment data. Uses Claude API with
structured JSON output for downstream Style Agent consumption.
```
