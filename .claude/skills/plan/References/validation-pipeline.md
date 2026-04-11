# Validation Pipeline

## Pipeline Steps

| Step | Command | Where | What It Validates |
|---|---|---|---|
| 1 | `npm run lint` | root | ESLint on infra + agents |
| 2 | `npm run build` | `dashboard/` | Next.js production build |
| 3 | `npm run synth` | root | CDK synthesizes CloudFormation |

## What Each Step Catches

### Step 1: Root Lint
- Import path violations
- Unused variables
- TypeScript strict mode violations

### Step 2: Dashboard Build
- SSR rendering failures
- Server action compilation
- Component import resolution

### Step 3: CDK Synth
- Stack instantiation issues
- Missing props between stacks
- Lambda bundling failures
- Step Function definition errors

## What the Pipeline Does NOT Catch

| Gap | How to Catch |
|---|---|
| Agent prompt quality | Manual testing with real inputs |
| LLM structured output failures | Runtime validation + retry logic |
| Component rendering issues | Visual testing |
| Vercel deployment failures | Integration test |
| DynamoDB key mismatches | Review against rules |
| Step Function state size limits | Load testing |
