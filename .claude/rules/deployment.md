---
paths:
  - "infra/**/*.ts"
---
# Deployment & Infrastructure Rules

## CDK Architecture
- Single `MainStage` orchestrates all stacks. No multi-stage pipelines.
- **Stack isolation:** one Stack per concern. Stacks never import each other directly.
- Cross-stack dependencies flow through `MainStage` as props.
- Single API Gateway in `ApiStack`. Other stacks consume it via props.

## CDK Stacks

| Stack | Purpose |
|---|---|
| `ApiStack` | API Gateway + CRM JWT/API key validation |
| `PipelineStack` | Step Functions + SQS + agent Lambdas |
| `DatabaseStack` | Database tables — projects, components (DB choice TBD) |
| `GraphStack` | Neo4j Aura connection (Phase 3) |
| `SiteDeployStack` | Vercel deployment Lambda |
| `DashboardStack` | Seller dashboard (OpenNext pattern) |

## Reusable Constructs

- `AgentLambda` — reusable construct for each AI agent Lambda (handler path, environment, timeout, memory)
- `AgentPipeline` — Step Function definition with all agent steps

## Lambda Defaults
- All lambdas use shared defaults: Node.js 20, ARM64/Graviton, esbuild bundled.
- AI agent lambdas need higher memory and longer timeouts than API handlers (LLM calls are slow).
- Entry points: `agents/<agent-name>/handler.ts`. All export `handler`.

## IAM Permissions
- Read-only lambdas: `grantReadData`. Write lambdas: `grantReadWriteData` on own table only.
- AI agent lambdas: need Secrets Manager or SSM read access for API keys.
- Cross-stack access: always minimum needed.

## Adding a New Agent
1. Create `agents/<name>/handler.ts` + `agents/<name>/prompt.ts`.
2. Add `AgentLambda` construct in `PipelineStack`.
3. Add step to `AgentPipeline` Step Function definition.
4. Wire environment variables (table names, API key references).
5. Run `npm run synth` to validate.
