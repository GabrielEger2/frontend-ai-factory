---
title: Scaffold CDK infrastructure for SiteGen Phase 1 — 4 stacks, agents workspace, 3-step pipeline
type: Infrastructure
branch: feat/infra-phase1
created: 2026-04-12
---

## Context

SiteGen Phase 1 requires all AWS backend infrastructure built from scratch. The `infra/` and `agents/` workspaces do not yet exist. The root `package.json` already declares both as workspaces. The task scaffolds both workspaces with CDK stacks (ApiStack, DatabaseStack, PipelineStack, SiteDeployStack), the AgentLambda construct, the 3-step pipeline (Content -> Assembler -> Deploy), API Gateway handlers, segment presets, and a seed script for ComponentsTable.

## Docs to Read

- `.claude/rules/domains/pipeline.md`
- `.claude/rules/general.md`
- `.claude/work/context.md`

## Rules to Read

- `.claude/rules/git.md`

## Reference Patterns

- Component metadata: `components/library/heroes/HeroSplitImage/metadata.json`
- StyleKit types: `components/lib/style-kit.ts`
- Root package.json: `package.json` (workspace declarations)

## Work Items

### Wave 1 — Workspace Bootstrapping

### 1. Bootstrap infra workspace

- **Status:** created
- **Scope:** infra
- **Depends:** —
- **Files:**
  - `infra/package.json` — workspace manifest with CDK deps
  - `infra/tsconfig.json` — TypeScript config for CDK
  - `infra/cdk.json` — CDK app entry point config
- **Action:** Create `infra/package.json` with name `@sitegen/infra`, private true. Dependencies: `aws-cdk-lib@^2`, `constructs@^10`, `esbuild`. DevDeps: `@types/node`, `typescript`, `aws-cdk`. Scripts: `build: tsc`, `synth: cdk synth`, `deploy: cdk deploy --all`. Create `tsconfig.json` with target ES2020, module commonjs, outDir dist, rootDir ., strict true, resolveJsonModule true, esModuleInterop true. Create `cdk.json` with app pointing to `npx ts-node bin/main.ts`.
- **Validate:** `cd infra && npm install`
- **Commit:** `chore(infra): bootstrap infra workspace config files`

### 2. Bootstrap agents workspace

- **Status:** created
- **Scope:** agents
- **Depends:** —
- **Files:**
  - `agents/package.json` — workspace manifest with Lambda deps
  - `agents/tsconfig.json` — TypeScript config for Lambda handlers
- **Action:** Create `agents/package.json` with name `@sitegen/agents`, private true. Dependencies: `@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`, `@aws-sdk/client-s3`, `@aws-sdk/client-ssm`, `@aws-sdk/client-sfn`, `@aws-sdk/client-sqs`, `zod`. DevDeps: `@types/aws-lambda`, `@types/node`, `typescript`. Create `tsconfig.json` with target ES2020, module commonjs, outDir dist, rootDir ., strict true, resolveJsonModule true, esModuleInterop true.
- **Validate:** `cd agents && npm install`
- **Commit:** `chore(agents): bootstrap agents workspace with package.json and tsconfig`

---

### Wave 2 — Shared Foundations

### 3. Add shared pipeline types

- **Status:** created
- **Scope:** agents
- **Depends:** 2
- **Files:**
  - `agents/shared/types.ts` — cross-agent TypeScript interfaces
- **Action:** Create agents/shared/types.ts. Define and export:
  - `ProjectStatus` union: `"queued" | "content" | "assembling" | "deploying" | "deployed" | "failed"`
  - `ProjectItem` interface: pk, sk (both PROJECT#id), projectId, status, companyName, segment, description, contentOutput?, assemblerOutput?, previewUrl?, createdAt, updatedAt
  - `ContentOutput` interface: `components: Array<{ componentId: string; slots: Record<string, unknown> }>`
  - `AssemblerOutput` interface: `s3Key: string`, `s3Bucket: string`
  - `PipelineState` interface: `projectId: string`, `status: ProjectStatus`, `companyName: string`, `segment: string`, `description: string`, `contentOutput?: ContentOutput`, `assemblerOutput?: AssemblerOutput`, `previewUrl?: string`
  - `ComponentItem` interface: pk, id, name, category, style[], mood[], purpose[], slots, pairsWell[], pairsPoorly[], acceptsStyleKit
  - Zod schemas for PipelineState, ContentOutput, AssemblerOutput
- **Validate:** `cd agents && npx tsc --noEmit`
- **Commit:** `feat(agents): add shared pipeline types for project and component models`

### 4. Add segment presets

- **Status:** created
- **Scope:** agents
- **Depends:** 3
- **Files:**
  - `agents/shared/segment-presets.ts` — hardcoded component layouts per segment
- **Action:** Create agents/shared/segment-presets.ts. Export SEGMENT_PRESETS Record<string, string[]>:
  - `pet-shop`: hero-parallax-images-01, layout-cardgrid-01, stats-count-up-01, cta-banner-01, footer-reveal-01
  - `law-firm`: hero-split-image-01, layout-iconlistsplit-01, faq-accordion-01, contact-form-01, footer-reveal-01
  - `restaurant`: hero-geometric-01, layout-imagetext-01, layout-simplegrid-01, contact-form-01, footer-reveal-01
  - `saas`: hero-split-image-01, layout-stickycards-01, layout-cardgrid-01, faq-solutions-01, cta-banner-01, footer-reveal-01
  - `ecommerce`: hero-parallax-images-01, layout-cardgrid-01, layout-infinitescroll-01, cta-inline-01, footer-reveal-01
  Export getPreset(segment: string): string[] that returns preset or throws. Export SUPPORTED_SEGMENTS = Object.keys(SEGMENT_PRESETS).
- **Validate:** `cd agents && npx tsc --noEmit`
- **Commit:** `feat(agents): add segment presets with hardcoded layouts per segment`

### 5. Add Lambda defaults utility

- **Status:** created
- **Scope:** infra
- **Depends:** 1
- **Files:**
  - `infra/constructs/lambda-defaults.ts` — shared Lambda configuration
- **Action:** Create infra/constructs/lambda-defaults.ts. Export LAMBDA_DEFAULTS object: runtime NODEJS_20_X, architecture ARM_64, memorySize 256, timeout 30s. Export AGENT_LAMBDA_DEFAULTS: same but memorySize 512, timeout 5 min. Export ESBUILD_DEFAULTS for NodejsFunction bundling: minify true, sourceMap false, target node20, externalModules ["@aws-sdk/*"]. Import from aws-cdk-lib/aws-lambda and aws-cdk-lib/aws-lambda-nodejs.
- **Validate:** `cd infra && npx tsc --noEmit`
- **Commit:** `feat(infra): add lambda-defaults for ARM64 Node20 esbuild config`

---

### Wave 3 — CDK Constructs

### 6. Add AgentLambda construct

- **Status:** created
- **Scope:** infra
- **Depends:** 5
- **Files:**
  - `infra/constructs/AgentLambda.ts` — reusable construct for agent Lambda functions
- **Action:** Create infra/constructs/AgentLambda.ts. Define AgentLambdaProps interface: entry (string, absolute path to handler.ts), agentName (string), environment (Record<string, string>), timeout? (Duration, default 5 min), memorySize? (number, default 512). Create class AgentLambda extends Construct. Constructor creates NodejsFunction using AGENT_LAMBDA_DEFAULTS spread with props. Expose fn: NodejsFunction as public readonly. Do NOT wire IAM permissions here — stacks handle grants via the exposed fn reference.
- **Validate:** `cd infra && npx tsc --noEmit`
- **Commit:** `feat(infra): add AgentLambda construct for standardized Lambda creation`

---

### Wave 4 — CDK Stacks

### 7. Add DatabaseStack

- **Status:** created
- **Scope:** infra
- **Depends:** 5
- **Files:**
  - `infra/stacks/DatabaseStack.ts` — DynamoDB tables + S3 pipeline bucket
- **Action:** Create infra/stacks/DatabaseStack.ts. DatabaseStackProps extends StackProps (no cross-stack imports). Creates:
  - projectsTable: Table with pk (string partition key), sk (string sort key), PAY_PER_REQUEST, RETAIN
  - componentsTable: Table with pk (string partition key only, no SK), PAY_PER_REQUEST, RETAIN
  - pipelineBucket: Bucket with S3_MANAGED encryption, BLOCK_ALL public access, 7-day lifecycle expiration, DESTROY removal with autoDeleteObjects
  Expose all three as public readonly properties. Also expose tableName and tableArn for each table, and bucketName/bucketArn for the bucket.
- **Validate:** `cd infra && npx tsc --noEmit`
- **Commit:** `feat(infra): add DatabaseStack with tables and pipeline S3 bucket`

### 8. Add ApiStack

- **Status:** created
- **Scope:** infra
- **Depends:** 6
- **Files:**
  - `infra/stacks/ApiStack.ts` — API Gateway REST API + API key auth + Lambda integrations
- **Action:** Create infra/stacks/ApiStack.ts. ApiStackProps extends StackProps with: projectsTableName, projectsTableArn, pipelineQueueUrl, pipelineQueueArn (all strings). Creates:
  - RestApi named sitegen-api, stageName v1, CORS all origins for GET/POST/OPTIONS
  - ApiKey + UsagePlan with rateLimit 10, burstLimit 5
  - postProjectsFn: NodejsFunction (using LAMBDA_DEFAULTS, not agent defaults), entry agents/api/post-projects/handler.ts, env PROJECTS_TABLE_NAME + PIPELINE_QUEUE_URL. Grant DynamoDB write + SQS sendMessage via IAM policy using ARN props.
  - getProjectFn: NodejsFunction, entry agents/api/get-project/handler.ts, env PROJECTS_TABLE_NAME. Grant DynamoDB read.
  - /projects resource with POST method (apiKeyRequired true, LambdaIntegration)
  - /projects/{id} resource with GET method (apiKeyRequired true, LambdaIntegration)
  Expose restApi as public readonly.
- **Validate:** `cd infra && npx tsc --noEmit`
- **Commit:** `feat(infra): add ApiStack with REST API, API key auth, and routes`

### 9. Add SiteDeployStack

- **Status:** created
- **Scope:** infra
- **Depends:** 6
- **Files:**
  - `infra/stacks/SiteDeployStack.ts` — Vercel deploy Lambda with SSM + S3 permissions
- **Action:** Create infra/stacks/SiteDeployStack.ts. SiteDeployStackProps extends StackProps with: pipelineBucketName, pipelineBucketArn, projectsTableName, projectsTableArn (all strings). Creates:
  - deployFn: NodejsFunction via AgentLambda construct, entry agents/deploy/handler.ts, timeout 10 min, memory 512. Env: PIPELINE_BUCKET_NAME, PROJECTS_TABLE_NAME, VERCEL_TOKEN_SSM_PATH="/sitegen/dev/vercel-api-token".
  - IAM: ssm:GetParameter on arn:aws:ssm:*:*:parameter/sitegen/dev/vercel-api-token (use Stack.of(this).region/account for specific ARN). S3 read on pipeline bucket via Bucket.fromBucketArn. DynamoDB read+write on projects table via Table.fromTableArn.
  Expose deployFn as public readonly.
- **Validate:** `cd infra && npx tsc --noEmit`
- **Commit:** `feat(infra): add SiteDeployStack with Vercel deploy Lambda`

### 10. Add PipelineStack

- **Status:** created
- **Scope:** infra
- **Depends:** 6, 9
- **Files:**
  - `infra/stacks/PipelineStack.ts` — SQS + Step Functions + Content/Assembler Lambdas + pipeline starter
- **Action:** Create infra/stacks/PipelineStack.ts. PipelineStackProps extends StackProps with: projectsTableName, projectsTableArn, componentsTableName, componentsTableArn, pipelineBucketName, pipelineBucketArn, deployFunctionArn (all strings). Creates:
  - dlq: Queue with 7-day retention
  - queue: Queue with visibilityTimeout 600s, DLQ maxReceiveCount 3
  - contentFn: AgentLambda, entry agents/content/handler.ts, timeout 5 min, memory 512. Env: PROJECTS_TABLE_NAME, COMPONENTS_TABLE_NAME, CLAUDE_API_KEY_SSM_PATH="/sitegen/dev/claude-api-key". Grant DynamoDB read+write on both tables, SSM read on claude key path.
  - assemblerFn: AgentLambda, entry agents/assembler/handler.ts, timeout 5 min, memory 1024. Env: PROJECTS_TABLE_NAME, PIPELINE_BUCKET_NAME. Grant DynamoDB read+write, S3 write on pipeline bucket.
  - Import deployFn via Function.fromFunctionArn(deployFunctionArn)
  - Step Functions Standard state machine:
    - ContentStep: LambdaInvoke contentFn, outputPath $.Payload, retry 2x backoff 2x interval 5s, catch -> FailState
    - AssemblerStep: LambdaInvoke assemblerFn, same retry/catch
    - DeployStep: LambdaInvoke deployFn, same retry/catch
    - Chain: Content -> Assembler -> Deploy -> Succeed
    - FailState: Pass state that represents pipeline failure
  - pipelineStarterFn: NodejsFunction (LAMBDA_DEFAULTS), entry agents/pipeline-starter/handler.ts, env STATE_MACHINE_ARN + PROJECTS_TABLE_NAME. Grant startExecution on state machine, DynamoDB read+write. Add SqsEventSource from queue with batchSize 1.
  Expose queue (Queue) as public readonly for ApiStack.
- **Validate:** `cd infra && npx tsc --noEmit`
- **Commit:** `feat(infra): add PipelineStack with SQS, Step Functions, agent Lambdas`

---

### Wave 5 — Agent Handlers

### 11. Add pipeline-starter Lambda handler

- **Status:** created
- **Scope:** agents
- **Depends:** 3
- **Files:**
  - `agents/pipeline-starter/handler.ts` — SQS-triggered Lambda, starts Step Functions
  - `agents/pipeline-starter/types.ts` — SQS message body Zod schema
- **Action:** Create types.ts with ProjectBrief Zod schema: projectId string, segment string, companyName string, description string. Create handler.ts as SQSHandler. For each SQS record: parse body JSON, validate with ProjectBrief schema. Call sfn.StartExecution with stateMachineArn from env, name = projectId, input = JSON.stringify({ projectId, segment, companyName, description, status: "queued" }). Use SFNClient from @aws-sdk/client-sfn.
- **Validate:** `cd agents && npx tsc --noEmit`
- **Commit:** `feat(agents): add pipeline-starter handler for SQS to Step Functions`

### 12. Add API handlers

- **Status:** created
- **Scope:** agents
- **Depends:** 3
- **Files:**
  - `agents/api/post-projects/handler.ts` — creates project in DDB, sends to SQS
  - `agents/api/get-project/handler.ts` — reads project status from DDB
- **Action:** Create post-projects/handler.ts as APIGatewayProxyHandler. Parse body, validate with Zod: companyName string, segment enum(SUPPORTED_SEGMENTS), description string. Generate projectId via crypto.randomUUID(). PutCommand to DDB: pk "PROJECT#"+id, sk "PROJECT#"+id, status "queued", timestamps. SendMessage to SQS with brief. Return 201 { projectId }. Handle Zod errors -> 400, AWS errors -> 500.
  Create get-project/handler.ts as APIGatewayProxyHandler. Read pathParameters.id. GetCommand from DDB. Return 200 { projectId, status, previewUrl, createdAt, updatedAt }. Not found -> 404.
  Both use DynamoDBDocumentClient. Table name from PROJECTS_TABLE_NAME env. Queue URL from PIPELINE_QUEUE_URL env.
- **Validate:** `cd agents && npx tsc --noEmit`
- **Commit:** `feat(agents): add POST and GET /projects API handlers`

### 13. Add Content Agent handler and prompt

- **Status:** created
- **Scope:** agents
- **Depends:** 3, 4
- **Files:**
  - `agents/content/handler.ts` — Lambda handler for content generation
  - `agents/content/prompt.ts` — Claude system and user prompts
  - `agents/content/types.ts` — input/output Zod schemas
- **Action:** Add `@anthropic-ai/sdk` to agents/package.json dependencies first.
  Create types.ts: ContentAgentInput Zod schema extending PipelineState fields (projectId, companyName, segment, description). ContentAgentOutput with contentOutput field.
  Create prompt.ts: buildSystemPrompt() returns prompt instructing Claude to generate website copy for each component slot, return structured JSON matching ContentOutput schema, write in pt-BR, respect maxLength constraints, use null for image/url slots. buildUserPrompt(input, componentSlots) formats company info + slot schemas.
  Create handler.ts: Validate input with Zod. Call getPreset(input.segment) for component list. BatchGet from ComponentsTable for slot metadata of each component ID. Fetch Claude API key from SSM (cache in module scope). Call Anthropic SDK with system + user prompts, response_format json. Parse response, validate with ContentOutput Zod schema. Update DDB project: contentOutput, status "assembling", updatedAt. Return full PipelineState with contentOutput added.
- **Validate:** `cd agents && npx tsc --noEmit`
- **Commit:** `feat(content): add content agent handler, prompt, and types`

### 14. Add Assembler Lambda handler

- **Status:** created
- **Scope:** agents
- **Depends:** 3
- **Files:**
  - `agents/assembler/handler.ts` — deterministic Next.js file generator
  - `agents/assembler/types.ts` — input/output Zod schemas
- **Action:** Create types.ts: AssemblerInput extends PipelineState requiring contentOutput. AssemblerOutput adds assemblerOutput { s3Key, s3Bucket }.
  Create handler.ts: Validate input. For each component in contentOutput.components: generate a Next.js page section as JSX import + props. Compose full page.tsx that imports and renders all components in order. Generate package.json for minimal Next.js app. Generate next.config.js and tailwind.config.js. Create zip buffer using Node.js zlib/archiver utilities. PutObject to S3: key "projects/{projectId}/site.zip", bucket from PIPELINE_BUCKET_NAME env. Update DDB: assemblerOutput { s3Key, s3Bucket }, status "deploying", updatedAt. Return PipelineState with assemblerOutput.
  CRITICAL: No LLM calls. Deterministic string concatenation only.
- **Validate:** `cd agents && npx tsc --noEmit`
- **Commit:** `feat(assembler): add deterministic assembler that zips Next.js files to S3`

### 15. Add Deploy Lambda handler

- **Status:** created
- **Scope:** agents
- **Depends:** 3
- **Files:**
  - `agents/deploy/handler.ts` — reads zip from S3, deploys to Vercel
  - `agents/deploy/types.ts` — input/output Zod schemas
- **Action:** Create types.ts: DeployInput extends PipelineState requiring assemblerOutput. DeployOutput adds previewUrl.
  Create handler.ts: Validate input. Fetch Vercel token from SSM (cache in module scope). GetObject from S3 using assemblerOutput.s3Key/s3Bucket. Decompress zip buffer. Call Vercel API: POST /v13/deployments with name "sitegen-{projectId}", files array (each file as { file: path, data: base64 content }), projectSettings { framework: "nextjs" }, Authorization Bearer token. Extract url from response. Update DDB: previewUrl "https://"+url, status "deployed", updatedAt. Return PipelineState with previewUrl.
  Handle Vercel 429 (rate limit) by throwing to trigger Step Functions retry.
- **Validate:** `cd agents && npx tsc --noEmit`
- **Commit:** `feat(agents): add deploy handler for Vercel API deployment`

---

### Wave 6 — CDK Wiring

### 16. Add MainStage and bin/main.ts

- **Status:** created
- **Scope:** infra
- **Depends:** 7, 8, 9, 10
- **Files:**
  - `infra/stages/MainStage.ts` — wires all four stacks with prop passing
  - `infra/bin/main.ts` — CDK app entry point
- **Action:** Create stages/MainStage.ts extending cdk.Stage. Constructor instantiates in dependency order:
  1. DatabaseStack -> captures table names/ARNs, bucket name/ARN
  2. SiteDeployStack(pipelineBucket*, projectsTable*) -> captures deployFn ARN
  3. PipelineStack(projectsTable*, componentsTable*, pipelineBucket*, deployFnArn) -> captures queue URL/ARN
  4. ApiStack(projectsTable*, pipelineQueue*)
  All wiring is string props only (names, ARNs, URLs). No construct objects cross stack boundaries.
  Create bin/main.ts: new App(), new MainStage(app, "SitegenDev", { env: { account: CDK_DEFAULT_ACCOUNT, region: CDK_DEFAULT_REGION } }), app.synth().
- **Validate:** `cd infra && npx ts-node bin/main.ts` (CDK synth)
- **Commit:** `feat(infra): add MainStage and app entry wiring all CDK stacks`

---

### Wave 7 — Seed Script + Root Updates

### 17. Add ComponentsTable seed script

- **Status:** created
- **Scope:** agents
- **Depends:** 3
- **Files:**
  - `agents/scripts/seed-components.ts` — reads metadata.json, writes to DynamoDB
- **Action:** Add ts-node to agents devDependencies. Create scripts/seed-components.ts. Walk components/library/**/ recursively, find all metadata.json files. For each: read JSON, build ComponentItem with pk "COMP#"+id plus all metadata fields. Also capture componentName (directory name) and categoryPath (parent directory) for Assembler mapping. BatchWriteCommand in batches of 25 to ComponentsTable. Table name from COMPONENTS_TABLE_NAME env or CLI arg. Log progress. Add script to agents/package.json: "seed:components": "ts-node scripts/seed-components.ts".
- **Validate:** `cd agents && npx tsc --noEmit agents/scripts/seed-components.ts`
- **Commit:** `feat(agents): add ComponentsTable seed script from library metadata`

### 18. Update root package.json scripts

- **Status:** created
- **Scope:** infra
- **Depends:** 16
- **Files:**
  - `package.json` — root monorepo manifest
- **Action:** Add scripts to root package.json:
  - "synth": "cd infra && npx ts-node bin/main.ts"
  - "deploy": "cd infra && npx cdk deploy --all"
  - "db:seed": "npm run seed:components --workspace=agents"
  Verify synth produces CloudFormation for all 4 stacks.
- **Validate:** `npm run synth` from root
- **Commit:** `chore(infra): add synth, deploy, and seed scripts to root package.json`

---

## Expected Outputs

| # | Output | Path | Wired To |
|---|--------|------|----------|
| 1 | infra workspace | infra/package.json, tsconfig.json, cdk.json | Root workspaces |
| 2 | agents workspace | agents/package.json, tsconfig.json | Root workspaces |
| 3 | Pipeline types | agents/shared/types.ts | All agent handlers |
| 4 | Segment presets | agents/shared/segment-presets.ts | Content Agent |
| 5 | Lambda defaults | infra/constructs/lambda-defaults.ts | AgentLambda construct |
| 6 | AgentLambda construct | infra/constructs/AgentLambda.ts | All stacks |
| 7 | DatabaseStack | infra/stacks/DatabaseStack.ts | MainStage |
| 8 | ApiStack | infra/stacks/ApiStack.ts | MainStage |
| 9 | SiteDeployStack | infra/stacks/SiteDeployStack.ts | MainStage |
| 10 | PipelineStack | infra/stacks/PipelineStack.ts | MainStage |
| 11 | Pipeline starter | agents/pipeline-starter/handler.ts | PipelineStack SQS |
| 12 | API handlers | agents/api/post-projects/, agents/api/get-project/ | ApiStack |
| 13 | Content Agent | agents/content/handler.ts, prompt.ts, types.ts | PipelineStack |
| 14 | Assembler | agents/assembler/handler.ts, types.ts | PipelineStack |
| 15 | Deploy handler | agents/deploy/handler.ts, types.ts | SiteDeployStack |
| 16 | MainStage + bin | infra/stages/MainStage.ts, infra/bin/main.ts | CDK app |
| 17 | Seed script | agents/scripts/seed-components.ts | ComponentsTable |
| 18 | Root scripts | package.json | Developer CLI |

## Gotchas

- **Stack isolation:** CDK stacks pass string props (names, ARNs) through MainStage. Never pass construct objects across stacks.
- **MainStage order:** SiteDeployStack before PipelineStack (PipelineStack needs deployFn ARN).
- **State size:** Step Functions carries only { projectId, status, s3Key }. DynamoDB is the full data store.
- **Vercel file format:** Vercel expects files[] array, not zip. Deploy handler must decompress.
- **esbuild externals:** @aws-sdk/* is external (Lambda-bundled). anthropic and zod must be bundled.
- **SSM cold start:** Cache SSM parameter values in module scope for Lambda container reuse.
- **SQS visibility:** 600s >> 30s pipeline-starter timeout. Safe.
- **Assembler is deterministic:** Zero LLM calls. Immutable rule.

## Execution Summary

| # | Item | Commit | Status | Notes |
|---|------|--------|--------|-------|
| 1 | Bootstrap infra workspace | chore(infra): bootstrap infra workspace config files | created | |
| 2 | Bootstrap agents workspace | chore(agents): bootstrap agents workspace with package.json and tsconfig | created | |
| 3 | Shared pipeline types | feat(agents): add shared pipeline types for project and component models | created | |
| 4 | Segment presets | feat(agents): add segment presets with hardcoded layouts per segment | created | |
| 5 | Lambda defaults | feat(infra): add lambda-defaults for ARM64 Node20 esbuild config | created | |
| 6 | AgentLambda construct | feat(infra): add AgentLambda construct for standardized Lambda creation | created | |
| 7 | DatabaseStack | feat(infra): add DatabaseStack with tables and pipeline S3 bucket | created | |
| 8 | ApiStack | feat(infra): add ApiStack with REST API, API key auth, and routes | created | |
| 9 | SiteDeployStack | feat(infra): add SiteDeployStack with Vercel deploy Lambda | created | |
| 10 | PipelineStack | feat(infra): add PipelineStack with SQS, Step Functions, agent Lambdas | created | |
| 11 | Pipeline starter | feat(agents): add pipeline-starter handler for SQS to Step Functions | created | |
| 12 | API handlers | feat(agents): add POST and GET /projects API handlers | created | |
| 13 | Content Agent | feat(content): add content agent handler, prompt, and types | created | |
| 14 | Assembler | feat(assembler): add deterministic assembler that zips Next.js files to S3 | created | |
| 15 | Deploy handler | feat(agents): add deploy handler for Vercel API deployment | created | |
| 16 | MainStage + bin | feat(infra): add MainStage and app entry wiring all CDK stacks | created | |
| 17 | Seed script | feat(agents): add ComponentsTable seed script from library metadata | created | |
| 18 | Root scripts | chore(infra): add synth, deploy, and seed scripts to root package.json | created | |
