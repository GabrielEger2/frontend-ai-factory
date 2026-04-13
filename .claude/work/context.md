# CDK Infrastructure Scaffolding — Phase 1

## Task Boundary
Scaffold the CDK infrastructure for SiteGen Phase 1: 4 CDK stacks (ApiStack, DatabaseStack, PipelineStack, SiteDeployStack), the `infra/` workspace, the `agents/` workspace with Content Agent handler, and the simplified 3-step pipeline. No dashboard infra, no graph.

## Implementation Decisions (LOCKED)

### 1. DynamoDB — Fat Document for Projects
- Single item per project: PK=PROJECT#<id>, SK=PROJECT#<id>
- Each agent appends its output as a top-level attribute (researchOutput, styleOutput, contentOutput, etc.)
- Status field tracks pipeline progress: queued → content → assembling → deploying → deployed → failed
- 400KB limit is plenty for one site's data

### 2. Separate Components Table
- Dedicated ComponentsTable with PK=COMP#<id>
- Seeded from metadata.json files in components/library/
- Composer Agent queries this table (Phase 2+); Phase 1 uses segment-based presets instead

### 3. Three-Step Pipeline (Phase 1)
- SQS trigger → Step Function with 3 states:
  1. ContentAgent Lambda — calls Claude API, generates copy for hardcoded component slots
  2. Assembler Lambda — deterministic, slots content into templates, produces Next.js files
  3. Deploy Lambda — pushes assembled files to Vercel API
- Each step updates project status in DynamoDB
- Error handling: Catch block per step, 2 retries with exponential backoff

### 4. Segment-Based Presets (Hardcoded Composition)
- 3-5 preset layouts mapped to segments (pet-shop, law-firm, restaurant, etc.)
- Each preset is an ordered list of component IDs from the library
- Content Agent receives the preset layout and generates copy for each component's slots
- No AI composition — that's Phase 2 (Composer Agent)

### 5. CDK Conventions (Fresh, Codex Arcana Style)
- Start fresh, don't port code from Codex Arcana
- ARM64 Lambdas, Node.js 20, esbuild bundling
- Typed environment variables
- Construct-per-resource pattern
- Stack isolation: stacks never import each other, resources flow through MainStage as props

### 6. Skip Dashboard Infrastructure
- No DashboardStack in Phase 1
- Dashboard runs locally with `npm run dev`
- Will scaffold DashboardStack in Phase 2 or later

### 7. Minimal API Surface
- POST /projects — submit brief (companyName, segment, description) → SQS → returns projectId
- GET /projects/{id} — poll status + previewUrl
- That's it for Phase 1

### 8. API Gateway API Key Auth
- Built-in API Gateway API key + usage plan
- x-api-key header from dashboard
- One key per environment
- Throttle: rateLimit 10, burstLimit 5

### 9. Standard Step Functions Workflow
- Standard Workflow (not Express) for full execution history and visual debugging
- Exactly-once semantics
- Worth the marginal cost increase for observability during Phase 1

### 10. New Vercel Project Per Site
- Each generated site gets its own Vercel project: sitegen-<projectId>
- Preview URL: sitegen-<projectId>.vercel.app
- Clean isolation, production-ready from day one
- Phase 4 adds custom domains

### 11. S3 Bucket as Pipeline Bus
- Step Functions state carries only projectId + status + s3Key (tiny payload)
- Assembler writes generated Next.js files to S3 bucket as zip
- Deploy Lambda reads from S3 and pushes to Vercel
- DynamoDB stores full project doc (all agent outputs persisted)
- Avoids Step Functions 256KB payload limit entirely

### 12. Secrets in SSM SecureString
- Claude API key: /sitegen/dev/claude-api-key
- Vercel API token: /sitegen/dev/vercel-api-token
- SSM SecureString (cheaper than Secrets Manager for Phase 1)
- Lambdas get ssm:GetParameter permission on specific paths

## Claude's Discretion
- Exact CDK construct interface design
- Lambda handler internal structure (but follow: handler.ts + prompt.ts + types.ts per agent)
- esbuild bundling config details
- SQS queue settings (visibility timeout, DLQ config)
- Step Function definition language details
- How to structure the seed script for components table
- Whether to use a shared types package or duplicate types minimally

## Existing Code Insights
- 28 components in components/library/ with full metadata.json — source data for ComponentsTable seeding
- components/lib/style-kit.ts has StyleKit interface — relevant for Content Agent output typing
- No existing infra/, agents/, or dashboard/ directories — building from scratch
- Root package.json already declares workspaces: ["components", "dashboard", "agents", "infra"]

## Specific Ideas
- Segment presets example: pet-shop → hero-parallax-images-01, layout-cardgrid-01, stats-count-up-01, cta-banner-01, footer-reveal-01
- Segment presets example: law-firm → hero-split-image-01, layout-iconlistsplit-01, faq-accordion-01, contact-form-01, footer-reveal-01
- Project statuses: queued | content | assembling | deploying | deployed | failed

## Deferred Ideas
- DashboardStack (Phase 2+)
- GraphStack / Neo4j (Phase 3)
- WebSocket API for real-time progress (Phase 2)
- CRM JWT auth / Lambda authorizer (Phase 2)
- Full 8-step pipeline with all agents (Phase 2)
