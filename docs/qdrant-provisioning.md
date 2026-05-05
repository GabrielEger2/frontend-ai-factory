# Qdrant Cloud Provisioning Runbook

Ops reference for setting up the Qdrant Cloud vector database, generating component descriptions, seeding the `components` collection, and running a sanity-check query. This is the Stage 1 vector retrieval foundation that Stage 2 (Composer Agent) consumes at runtime.

## Prerequisites

- Qdrant Cloud account ([cloud.qdrant.io](https://cloud.qdrant.io)) — free tier is sufficient for Stage 1
- OpenAI API key (used for `text-embedding-3-small` — 1536 dimensions)
- Claude API key already provisioned in SSM at `/sitegen/dev/claude-api-key` (created during Neo4j setup; reused here by `describe:components`)
- AWS CLI configured with credentials that can read/write SSM Parameter Store
- CDK app deployed (`npm run deploy` from repo root) — `VectorStack` creates the `/sitegen/dev/qdrant-endpoint` placeholder
- Node.js 20+ and project dependencies installed (`npm install` at repo root)

## Step 1: Provision Qdrant Cloud Cluster

1. Log in to [Qdrant Cloud Console](https://cloud.qdrant.io).
2. Create a new **Free Tier** cluster in the region closest to your AWS deployment.
3. Note the **Cluster URL** (format: `https://xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.<region>.aws.cloud.qdrant.io:6333`).
4. Generate an **API key** under the cluster's API Keys tab. Copy the key immediately — it is shown only once.
5. Wait for the cluster status to show **Healthy** before proceeding.

> **⚠️ Important — CDK provisions the endpoint placeholder only**
>
> `cdk deploy` creates `/sitegen/dev/qdrant-endpoint` in SSM with the placeholder value `REPLACE_AFTER_QDRANT_PROVISION` (`DeletionPolicy: Retain` so redeploys do not wipe your real value).
>
> The API key parameters (`/sitegen/dev/qdrant-api-key` and `/sitegen/dev/openai-api-key`) are **NOT** created by CDK because CloudFormation does not support creating `SecureString` SSM parameters (only `String` and `StringList`). You must create both manually via AWS CLI after provisioning Qdrant — see Step 2 below.
>
> **If you previously created the endpoint parameter manually**, CloudFormation will fail on first deploy with `ResourceAlreadyExistsException`. To resolve:
>
> ```bash
> aws ssm delete-parameter --name "/sitegen/dev/qdrant-endpoint"
> ```
>
> Then run `npm run deploy` again. Alternatively, use `aws cloudformation import-existing-resources` to bring the existing parameter under CloudFormation management.

## Step 2: Populate SSM Parameters

After `cdk deploy` succeeds, the endpoint parameter exists with a placeholder value. Overwrite the placeholder with your real cluster URL, then create both API key SecureStrings:

```bash
# Overwrite endpoint placeholder (created by CDK as type=String)
aws ssm put-parameter \
  --name "/sitegen/dev/qdrant-endpoint" \
  --type String \
  --value "https://xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.<region>.aws.cloud.qdrant.io:6333" \
  --overwrite

# Create Qdrant API key (CDK cannot create SecureString — first time only)
aws ssm put-parameter \
  --name "/sitegen/dev/qdrant-api-key" \
  --type SecureString \
  --value "your-qdrant-api-key-here"

# Create OpenAI API key (CDK cannot create SecureString — first time only)
aws ssm put-parameter \
  --name "/sitegen/dev/openai-api-key" \
  --type SecureString \
  --value "sk-proj-..."
```

On subsequent rotations, add `--overwrite` to either API key command.

> **Note:** `CLAUDE_API_KEY_SSM_PATH` already points at `/sitegen/dev/claude-api-key`, which was created during Neo4j setup (see `docs/neo4j-provisioning.md` Step 2b). The `describe:components` script in Step 3 below reads this parameter — confirm it exists with `aws ssm get-parameter --name /sitegen/dev/claude-api-key --with-decryption` before running.

## Step 3: Generate Component Descriptions

Each `metadata.json` gets an LLM-authored 1–2 sentence description (design purpose + best-fit use case). The description becomes part of the embedding input and is the largest single contributor to retrieval quality.

Export the SSM-path env vars (the scripts read SSM paths, not raw secrets):

```bash
export QDRANT_ENDPOINT_SSM_PATH=/sitegen/dev/qdrant-endpoint
export QDRANT_API_KEY_SSM_PATH=/sitegen/dev/qdrant-api-key
export OPENAI_API_KEY_SSM_PATH=/sitegen/dev/openai-api-key
export CLAUDE_API_KEY_SSM_PATH=/sitegen/dev/claude-api-key
```

Then run:

```bash
npm run describe:components --workspace=agents
```

The script walks `components/library/**/metadata.json`, calls Claude `claude-sonnet-4-20250514` for each component, and writes the `description` field back into the same file. It is **idempotent**: components with a non-empty `description` are skipped on re-runs. To regenerate all descriptions (and incur LLM cost for every component), pass `--force`:

```bash
npm run describe:components --workspace=agents -- --force
```

After descriptions are written, regenerate the component manifest so downstream tooling (composer fallback, dashboard) sees the new field:

```bash
cd components && npm run build:manifest
```

## Step 4: Seed Vectors

Embed every component (`name` + `category` + `style[]` + `mood[]` + `purpose[]` + `description`) with OpenAI `text-embedding-3-small` (1536-dim, cosine distance) and upsert the points into the Qdrant `components` collection:

```bash
npm run seed:vectors --workspace=agents
```

The script:

- Verifies all three SSM-path env vars are exported and exits with a descriptive error if any are missing.
- Calls `ensureCollection("components")` — idempotent. Creates the collection on first run; no-op on subsequent runs.
- Computes a deterministic point ID from `componentId` (djb2 hash → unsigned 32-bit), so re-runs **upsert in place** rather than duplicating.
- Batches upserts in groups of 100.

Re-run any time component metadata changes (new components, edited tags, regenerated descriptions). Existing points are overwritten, not duplicated.

## Step 5: Demo Query

Sanity-check the retrieval pipeline end-to-end with a natural-language brief:

```bash
npm run query:vectors --workspace=agents -- "luxury bakery in São Paulo"
```

Expected output: a markdown table of the top-5 components ranked by cosine similarity, e.g.

```
> Query: "luxury bakery in São Paulo"

| Rank | ID | Name | Category | Score |
|------|----|------|----------|-------|
| 1    | hero-bold-editorial-01 | Bold Editorial Hero | hero | 0.4123 |
| 2    | testimonial-stacked-split-01 | Stacked Split Testimonial | testimonial | 0.3891 |
| ...  | ... | ... | ... | ... |
```

If the table is empty or scores look uniformly low, re-check Steps 3 and 4 — the most common cause is a missing `description` field in one or more `metadata.json` files (the embedding input loses its strongest signal).

## Env Var Export Block

Copy-paste ready block for any new shell session that needs to run `describe:components`, `seed:vectors`, or `query:vectors`:

```bash
export QDRANT_ENDPOINT_SSM_PATH=/sitegen/dev/qdrant-endpoint
export QDRANT_API_KEY_SSM_PATH=/sitegen/dev/qdrant-api-key
export OPENAI_API_KEY_SSM_PATH=/sitegen/dev/openai-api-key
export CLAUDE_API_KEY_SSM_PATH=/sitegen/dev/claude-api-key
```

The scripts read **SSM parameter paths**, not the secrets themselves. The shared clients (`agents/shared/embeddings.ts`, `agents/shared/qdrant-client.ts`) resolve these paths against SSM with `WithDecryption: true` at call time and cache the result for the process lifetime. This matches the Lambda runtime code path that Stage 2 will use.

## Free Tier Idle Pause

Qdrant Cloud free tier clusters automatically pause after roughly **3 days of inactivity**. The first request after a pause incurs a **~2–5 second cold start** while the cluster wakes.

For Stage 1 this only affects ad-hoc `query:vectors` runs — no production impact. In **Stage 2**, when the Composer Lambda calls Qdrant at runtime per project, this cold-start tax falls inside the user-visible pipeline latency budget. Mitigations to consider for Stage 2:

- Upgrade to a paid (always-on) cluster.
- Schedule a CloudWatch Events keep-alive ping (cheap workaround for low-traffic environments).
- Add a Qdrant timeout to the Composer Lambda and fall back to the existing DynamoDB metadata filter on cold-start failure.

## SecureString Note

CloudFormation cannot create `SecureString` SSM parameters — only `String` and `StringList`. This is a hard CDK / CloudFormation limitation, not a SiteGen choice.

Practical consequences:

- `VectorStack` (in `infra/stacks/VectorStack.ts`) creates only the `String` placeholder for `/sitegen/dev/qdrant-endpoint`.
- Both API key parameters (`/sitegen/dev/qdrant-api-key` and `/sitegen/dev/openai-api-key`) MUST be created via `aws ssm put-parameter --type SecureString` — see Step 2 above.
- Re-running `cdk deploy` will never overwrite or delete the SecureString parameters; they live entirely outside CloudFormation's lifecycle.
- Rotation: re-run the same `aws ssm put-parameter --type SecureString --overwrite` command with the new value. No CDK redeploy required.

The shared clients (`embeddings.ts`, `qdrant-client.ts`) call `GetParameterCommand({ Name, WithDecryption: true })` — ensure the IAM role used by `describe:components` / `seed:vectors` / `query:vectors` (or the Stage 2 Composer Lambda) has `ssm:GetParameter` and `kms:Decrypt` on the default SSM key.

## Maintenance Notes

**When to re-run:**

- New components added to `components/library/`
- Component metadata changed (style, mood, purpose, description)
- OpenAI embedding model bumped (full re-seed required — vector dimension or semantics shifted)

**Re-seed procedure:**

1. Run `npm run describe:components --workspace=agents` (Step 3) — only new components are described unless `--force` is passed.
2. Run `cd components && npm run build:manifest` to regenerate the manifest.
3. Run `npm run seed:vectors --workspace=agents` (Step 4) — upserts in place via deterministic point IDs.
4. Run `npm run query:vectors --workspace=agents -- "<sanity-check brief>"` (Step 5) to confirm retrieval still looks reasonable.

**Idempotent seeding:** All Qdrant writes are upserts keyed by a deterministic hash of `componentId`. Re-running the seed script is safe — existing points are updated in place, not duplicated.
