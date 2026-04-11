# SiteGen — AI-Powered Website Generator

A product layer on top of a CRM. Sellers input company info, AI generates a complete SEO-optimized website in minutes, seller demos it to the client, deploys with one click. Built as an AWS serverless monorepo with a Step Functions AI agent pipeline.

## Tech Stack

- **Dashboard:** Next.js (App Router), React, TypeScript — styling TBD
- **Auth:** CRM JWT validation + API key auth (no standalone auth — sellers auth through CRM)
- **Backend:** AWS Lambda (Node.js 20, ARM64), API Gateway (REST), Step Functions, SQS
- **Database:** MongoDB or DynamoDB (TBD — projects, components, deployments)
- **Graph (Phase 3):** Neo4j Aura (component compatibility, mood/style/segment intelligence)
- **AI:** Claude/GPT API (specialized prompts per agent, not monolithic)
- **Generated Sites:** Vercel API deploy (programmatic, edge network)
- **IaC:** AWS CDK (TypeScript), single-stage deployment

## Monorepo Structure

| Workspace | Path | Contains |
|---|---|---|
| `infra/` | `infra/stacks/`, `infra/constructs/` | CDK stacks, constructs, Lambda defaults |
| `agents/` | `agents/research/`, `agents/style/`, etc. | AI agent Lambda functions (one per pipeline step) |
| `dashboard/` | `dashboard/src/` | Seller dashboard Next.js app (OpenNext on AWS) |
| `components/` | `components/library/`, `components/templates/` | Pre-designed website component library with metadata |

## Key Commands

| Command | Where | What |
|---|---|---|
| `npm run synth` | root | Synthesize CloudFormation templates |
| `npm run deploy` | root | Deploy all CDK stacks |
| `npx cdk diff` | root | Compare deployed vs current |
| `npm run lint` | root | Lint infra + agent code |
| `npm run dev` | `dashboard/` | Dev server |
| `npm run build` | `dashboard/` | Production build |

## Agent Pipeline (Step Functions)

SQS → Step Function:
1. **Research Agent** → searches company, competitors, segment
2. **Style Agent** → selects palette, typography, mood tags
3. **Composer Agent** → picks + chains components by compatibility
4. **Content Agent** + **SEO Agent** (parallel) → copy per slot + meta/JSON-LD
5. **Humanizer Agent** → adapts pt-BR tone to brand personality
6. **Assembler** → deterministic: blueprint + tokens + content → Next.js files
7. **QA Agent** → responsive, TS, accessibility, Lighthouse
8. Deploy to Vercel or flag issues → notify seller

## Development Workflow

1. Types changed? → Rebuild shared types, then update agents and dashboard.
2. Infra changes? → `npm run synth` to validate before deploying.
3. Agent changes? → Deploy to test (`npm run deploy`).
4. Dashboard changes? → `npm run dev` for hot reload.
5. Component changes? → Update metadata, test with assembler.

## CDK Stacks

| Stack | Purpose |
|---|---|
| `ApiStack` | API Gateway + CRM JWT/API key validation |
| `PipelineStack` | Step Functions + SQS + agent Lambdas |
| `DatabaseStack` | Database tables — projects, components (DB choice TBD) |
| `GraphStack` | Neo4j Aura connection (Phase 3) |
| `SiteDeployStack` | Vercel deployment Lambda |
| `DashboardStack` | Seller dashboard (OpenNext pattern) |

## Immutable Rules

1. **AI agents are specialized.** Each agent has one job with its own prompt. No monolithic LLM calls.
2. **Assembler is deterministic.** AI handles subjective decisions; the assembler slots content into templates. No LLM in the assembler.
3. **Stack isolation.** CDK stacks never import each other. Resources flow through `MainStage` as props.
4. **Component metadata is truth.** style[], mood[], category, slots[], PAIRS_WITH scores drive all composition decisions.
5. **Ask before assuming.** If requirements are ambiguous, ask before proceeding.
6. **Verify before changing.** Read the relevant code before modifying it.
7. **Small, focused changes.** Don't refactor adjacent code unless asked.
