---
title: Fix 6 gaps in Agent v1 Content-Only pipeline
type: NewFeature
branch: fix/agent-v1-gaps
created: 2026-04-12
---

## Context

The Agent v1 pipeline (Content Agent -> Assembler -> Deploy) is fully implemented but has 6 gaps: no failure status handler, missing "content" status transition, stub components instead of real ones, Vercel readiness not polled, Vercel v13 file format missing encoding field, and no SSM setup documentation.

## Docs to Read

- `.claude/rules/domains/pipeline.md`
- `.claude/rules/domains/components.md`
- `.claude/rules/general.md`
- `.claude/rules/git.md`

## Rules to Read

- `.claude/rules/domains/pipeline.md`
- `.claude/rules/domains/components.md`

## Reference Patterns

- Agent handler pattern: `agents/content/handler.ts`
- SSM cache pattern: `agents/content/handler.ts`
- DDB client pattern: `agents/deploy/handler.ts`
- AgentLambda construct: `infra/constructs/AgentLambda.ts`
- Step Functions chain: `infra/stacks/PipelineStack.ts`

## Work Items

### 1. Add fail-handler Lambda

- **Status:** created
- **Scope:** agents
- **Depends:** —
- **Files:**
  - `agents/fail-handler/handler.ts` — create new fail handler Lambda
  - `agents/fail-handler/types.ts` — create Zod schema for fail handler input
  - `agents/tsconfig.json` — add `"fail-handler/**/*.ts"` to include array
- **Action:**
  Create `agents/fail-handler/types.ts` with FailHandlerInputSchema (Zod): projectId string at top level, plus error object with optional Error and Cause strings (from Step Functions catch resultPath).
  Create `agents/fail-handler/handler.ts`: module-scope DynamoDBDocumentClient, read PROJECTS_TABLE_NAME from env, validate input with Zod, UpdateCommand to set status="failed" + failureReason + updatedAt. Wrap DDB write in try/catch (don't throw so sfn.Fail is reached). Return { projectId, status: "failed" }.
  Update `agents/tsconfig.json`: add "fail-handler/**/*.ts" to include array.
- **Validate:** `cd agents && npx tsc --noEmit`
- **Commit:** `feat(agents): add fail-handler lambda to write status:failed on pipeline error`

### 2. Wire fail-handler into Step Functions catch path

- **Status:** created
- **Scope:** infra
- **Depends:** 1
- **Files:**
  - `infra/stacks/PipelineStack.ts` — add AgentLambda construct, rewire addCatch calls
- **Action:**
  Add AgentLambda for fail-handler (30s timeout, 256MB, PROJECTS_TABLE_NAME env). Grant DDB read+write.
  Replace bare sfn.Fail with failHandlerStep (LambdaInvoke) -> terminalFail (sfn.Fail).
  Update all three addCatch calls to use failHandlerStep with resultPath: "$.error".
- **Validate:** `npm run synth`
- **Commit:** `feat(infra): wire fail-handler lambda into step functions catch path`

### 3. Write status:content before Claude API call

- **Status:** created
- **Scope:** agents
- **Depends:** —
- **Files:**
  - `agents/content/handler.ts` — add pre-Claude DynamoDB status write
- **Action:**
  Add markContentStarted function: UpdateCommand setting status="content" + updatedAt.
  Call it after component fetch but before generateContent (Claude API call).
  Existing updateProject for status="assembling" stays unchanged.
- **Validate:** `cd agents && npx tsc --noEmit`
- **Commit:** `fix(content): write status:content before claude call, status:assembling after`

### 4. Add generate-sources build script for assembler

- **Status:** created
- **Scope:** agents
- **Depends:** —
- **Files:**
  - `agents/assembler/generate-sources.ts` — create build-time code generation script
  - `agents/package.json` — add generate-sources script entry
  - `.gitignore` — add pattern for generated file
- **Action:**
  Create generate-sources.ts: reads components/library/**/*.tsx (not stories), components/ui/**/*.{ts,tsx}, components/lib/**/*.ts. Computes generated-site paths. Rewrites alias imports (@ui/ -> @/lib/ui/, @lib/ -> @/lib/, @components/ -> @/components/). Reads metadata.json for component ID mapping. Writes component-sources.generated.ts with COMPONENT_SOURCES and COMPONENT_ID_TO_PATH exports.
  Add "generate-sources": "ts-node assembler/generate-sources.ts" to agents/package.json.
  Add "agents/assembler/*.generated.ts" to .gitignore.
- **Validate:** `cd agents && npm run generate-sources && npx tsc --noEmit`
- **Commit:** `feat(assembler): add generate-sources script to bundle component TSX at build time`

### 5. Replace component stubs with real library sources in assembler

- **Status:** created
- **Scope:** agents
- **Depends:** 4
- **Files:**
  - `agents/assembler/handler.ts` — replace stub generation with real component inclusion
- **Action:**
  Import COMPONENT_SOURCES and COMPONENT_ID_TO_PATH from generated file.
  Replace generateComponentStub: include all real component files from COMPONENT_SOURCES.
  Update generatePageTsx imports to use correct paths from COMPONENT_ID_TO_PATH.
  Update generatePackageJson with real deps (framer-motion, react-icons, clsx, tailwind-merge, motion, lenis, rough-notation, tailwindcss-animate).
  Update generateTailwindConfig with full token set from components/tailwind.config.ts.
  Update generateTsConfig with @/* path alias.
  Update Tailwind content array to include src/lib/**/*.
- **Validate:** `cd agents && npm run generate-sources && npx tsc --noEmit`
- **Commit:** `feat(assembler): replace component stubs with real library source files`

### 6. Fix Vercel v13 file format encoding field

- **Status:** created
- **Scope:** agents
- **Depends:** —
- **Files:**
  - `agents/deploy/handler.ts` — add encoding: "base64" to VercelFile
- **Action:**
  Add encoding: "base64" to VercelFile interface and to the file mapping.
- **Validate:** `cd agents && npx tsc --noEmit`
- **Commit:** `fix(deploy): add encoding:base64 field to vercel v13 file format`

### 7. Add Vercel deployment readiness polling

- **Status:** created
- **Scope:** agents
- **Depends:** 6
- **Files:**
  - `agents/deploy/handler.ts` — add pollVercelDeployment function
- **Action:**
  Add pollVercelDeployment (5s interval, 90 max attempts). Call after deployToVercel before DDB update. Throw on ERROR state. Log warning at attempt 60. Verify Deploy Lambda timeout >= 10min in SiteDeployStack.
- **Validate:** `cd agents && npx tsc --noEmit`
- **Commit:** `fix(deploy): poll vercel for readyState:READY before marking project deployed`

### 8. Add SSM parameter setup script

- **Status:** created
- **Scope:** agents
- **Depends:** —
- **Files:**
  - `agents/scripts/setup-ssm.sh` — create interactive setup script
- **Action:**
  Create shell script with prompts for Claude API key and Vercel token. Uses aws ssm put-parameter with SecureString. Configurable region and environment.
- **Validate:** `bash -n agents/scripts/setup-ssm.sh`
- **Commit:** `docs(agents): add setup-ssm.sh script for claude and vercel ssm parameters`

## Expected Outputs

| # | Output | Path | Wired To |
|---|--------|------|----------|
| 1 | Fail handler Lambda | agents/fail-handler/handler.ts | PipelineStack catch path |
| 2 | Fail handler CDK wiring | infra/stacks/PipelineStack.ts | Step Functions state machine |
| 3 | Content status transition | agents/content/handler.ts | DynamoDB project status |
| 4 | Generate-sources script | agents/assembler/generate-sources.ts | Assembler handler import |
| 5 | Real component bundling | agents/assembler/handler.ts | Vercel deployed site |
| 6 | Vercel file format fix | agents/deploy/handler.ts | Vercel v13 API |
| 7 | Vercel readiness polling | agents/deploy/handler.ts | Deploy Lambda flow |
| 8 | SSM setup script | agents/scripts/setup-ssm.sh | Manual setup step |

## Gotchas

- **Fail handler input shape:** resultPath: "$.error" merges error at $.error, projectId stays top-level
- **Fail handler must not throw:** Wrap DDB write in try/catch
- **Generate-sources paths:** Use path.resolve(__dirname, "../../components")
- **Alias rewriting:** @ui/ -> @/lib/ui/, @lib/ -> @/lib/, @components/ -> @/components/
- **Archive size:** ~300-400KB for full library, within limits
- **Vercel polling:** 7.5min max, Lambda timeout must be >= 10min
- **Generated file not committed:** component-sources.generated.ts in .gitignore

## Execution Summary

<!-- Filled by executor after execution -->

| # | Item | Commit | Status | Notes |
|---|------|--------|--------|-------|
