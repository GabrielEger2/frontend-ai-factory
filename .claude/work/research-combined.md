# Research: Agent v1 — Content Only (End-to-End Pipeline Fix)

## Current State

The Phase 1 infrastructure and all agent code is ALREADY FULLY IMPLEMENTED. All 4 CDK stacks, all Lambda handlers, Step Functions state machine, API Gateway endpoints, segment presets, and component library are in place.

### Existing Code (Complete)
- `infra/stacks/`: ApiStack, DatabaseStack, PipelineStack, SiteDeployStack, MainStage
- `infra/constructs/`: AgentLambda.ts, lambda-defaults.ts
- `agents/content/`: handler.ts, prompt.ts, types.ts (Claude API integration)
- `agents/assembler/`: handler.ts, types.ts, generate-sources.ts, component-sources.generated.ts
- `agents/deploy/`: handler.ts, types.ts (Vercel API integration)
- `agents/api/post-projects/`: handler.ts (POST /projects)
- `agents/api/get-project/`: handler.ts (GET /projects/{id})
- `agents/pipeline-starter/`: handler.ts (SQS → SFN trigger)
- `agents/fail-handler/`: handler.ts (error state handler)
- `agents/shared/`: types.ts, segment-presets.ts
- `agents/scripts/`: seed-components.ts
- `components/library/`: 28 components, all 17 preset IDs present

## Critical Gaps (Will Fail at Runtime)

### 1. Content Agent — Claude JSON Parsing (CRITICAL)
- **File:** `agents/content/handler.ts`
- Claude is called with text mode (not structured output/tool_use). The prompt says "return ONLY valid JSON" but Claude may wrap JSON in markdown code fences (```json ... ```).
- `JSON.parse(rawJson)` will throw if fences are present.
- **Fix:** Strip markdown fences before parsing, OR switch to Claude tool_use mode for guaranteed JSON.

### 2. Assembler — CSS Design Tokens Missing (CRITICAL)
- **File:** `agents/assembler/handler.ts` — `generateGlobalsCss()` function
- The generated `globals.css` only contains `@tailwind base/components/utilities` directives.
- The Tailwind config uses CSS variables like `oklch(var(--color-primary) / <alpha-value>)`.
- Without CSS variable definitions, ALL color tokens resolve to transparent/invalid.
- **Fix:** Add CSS variable block with default design token values to `generateGlobalsCss`.

### 3. Step Functions Retry Policy Too Narrow (SIGNIFICANT)
- **File:** `infra/stacks/PipelineStack.ts`
- `errors: ["States.TaskFailed"]` does NOT cover `Lambda.ServiceException`, `Lambda.AWSLambdaException`, `Lambda.TooManyRequestsException`.
- Transient Lambda errors won't be retried — they'll immediately go to fail-handler.
- **Fix:** Change to `errors: ["States.ALL"]` or enumerate Lambda error types.

### 4. Pre-Deploy Steps Not Automated (SIGNIFICANT)
- SSM parameters (`/sitegen/dev/claude-api-key`, `/sitegen/dev/vercel-api-token`) must be manually created.
- `component-sources.generated.ts` must be regenerated before deploy if components changed.
- ComponentsTable must be seeded after deploy.
- **Fix:** Add `generate-sources` to root pre-deploy script. Document SSM and seed steps.

### 5. Content Agent — Inconsistent List Slot itemSchema (MINOR)
- `faq-accordion-01` and `faq-solutions-01` have `itemSchema` as flat arrays instead of `{ type: "object", fields: [...] }`.
- The Content Agent prompt `JSON.stringify`s whatever is there — inconsistent format sent to Claude.
- **Fix:** Normalize itemSchema format in Content Agent prompt builder, or in metadata.json files.

## Reference Patterns

| Pattern | File | What to Follow |
|---|---|---|
| Agent handler | `agents/content/handler.ts` | SSM cache → Zod parse → DDB read → AI call → DDB write → return PipelineState |
| Deterministic handler | `agents/assembler/handler.ts` | Env var guard → Zod parse → generate files → S3 upload → DDB update |
| Deploy handler | `agents/deploy/handler.ts` | SSM cache → S3 download → Vercel API → poll → DDB update |
| CDK Lambda | `infra/constructs/AgentLambda.ts` | ARM64, Node 20, esbuild, sitegen-<name> |
| Step Functions | `infra/stacks/PipelineStack.ts` | LambdaInvoke + outputPath + addRetry + addCatch |
| Stack wiring | `infra/stages/MainStage.ts` | String props only between stacks |
| Segment presets | `agents/shared/segment-presets.ts` | 5 segments, 6-7 components each |

## Verified Integration Points

| Integration | Status |
|---|---|
| MainStage prop flow | Fully wired |
| SQS → pipeline-starter → SFN | Fully wired |
| API Gateway → post-projects → DDB + SQS | Fully wired |
| Content Agent → Claude API | Wired (JSON parsing gap) |
| Content Agent → DDB components | Wired (needs seed) |
| Assembler → S3 write | Fully wired |
| Deploy → S3 read → Vercel | Fully wired |
| SFN retry/catch | Wired (retry scope too narrow) |
| All 17 preset component IDs | Present in library |

## Implementation Decisions (from context.md — LOCKED)

1. DynamoDB fat document per project (PK=PROJECT#<id>, SK=PROJECT#<id>)
2. Separate ComponentsTable (PK=COMP#<id>)
3. Three-step pipeline: Content → Assembler → Deploy
4. Segment-based presets (5 segments hardcoded)
5. ARM64 Lambdas, Node.js 20, esbuild bundling
6. S3 bucket as pipeline bus (assembler writes tar.gz, deploy reads it)
7. SSM SecureString for secrets
8. Standard Step Functions Workflow
9. New Vercel project per site (sitegen-<projectId>)
10. API Gateway API key auth
