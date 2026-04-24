# Neo4j Aura Provisioning Runbook

Ops reference for setting up the Neo4j Aura graph database and seeding it with component compatibility data.

## Prerequisites

- Neo4j Aura account ([console.neo4j.io](https://console.neo4j.io))
- AWS CLI configured with credentials that can write to SSM Parameter Store
- Node.js 20+
- Project dependencies installed (`npm install` at repo root)

## Step 1: Provision Neo4j Aura Instance

1. Log in to [Neo4j Aura Console](https://console.neo4j.io).
2. Create a new **Free** or **Professional** instance.
3. Note the **Connection URI** (format: `neo4j+s://xxxxxxxx.databases.neo4j.io`).
4. Save the generated **password** immediately -- it is shown only once.
5. Wait for the instance status to show **Running** before proceeding.

> **⚠️ Important — CDK provisions the URI placeholder only**
>
> `cdk deploy` creates `/sitegen/dev/neo4j-uri` in SSM with the placeholder value `REPLACE_AFTER_AURA_PROVISION` (`DeletionPolicy: Retain` so redeploys do not wipe your real value).
>
> The password parameter (`/sitegen/dev/neo4j-password`) is **NOT** created by CDK because CloudFormation does not support creating `SecureString` SSM parameters (only `String` and `StringList`). You must create it manually via AWS CLI after provisioning Aura — see Step 2b below.
>
> **If you previously created the URI parameter manually**, CloudFormation will fail on first deploy with `ResourceAlreadyExistsException`. To resolve:
>
> ```bash
> aws ssm delete-parameter --name "/sitegen/dev/neo4j-uri"
> ```
>
> Then run `npm run deploy` again. Alternatively, use `aws cloudformation import-existing-resources` to bring the existing parameter under CloudFormation management.

## Step 2: Register SSM Parameters

The `setup-ssm.sh` script handles all SSM parameter creation interactively. It stores Neo4j credentials alongside other SiteGen secrets:

```bash
bash agents/scripts/setup-ssm.sh
# Prompts for: Claude API key, Vercel token, Neo4j URI, Neo4j password
```

To target a specific region or environment:

```bash
bash agents/scripts/setup-ssm.sh --region us-east-1 --env production
```

This creates four SSM SecureString parameters:

| Parameter | Description |
|---|---|
| `/sitegen/<env>/claude-api-key` | Claude API key |
| `/sitegen/<env>/vercel-token` | Vercel deploy token |
| `/sitegen/<env>/neo4j-uri` | Neo4j Aura connection URI |
| `/sitegen/<env>/neo4j-password` | Neo4j Aura password |

If you need to update only Neo4j parameters manually:

```bash
aws ssm put-parameter \
  --name "/sitegen/dev/neo4j-uri" \
  --type SecureString \
  --value "neo4j+s://xxxxxxxx.databases.neo4j.io" \
  --overwrite

aws ssm put-parameter \
  --name "/sitegen/dev/neo4j-password" \
  --type SecureString \
  --value "your-password" \
  --overwrite
```

## Step 2b: Set Real Credential Values

After `cdk deploy` succeeds, the URI parameter exists with a placeholder value. The password parameter does not exist yet — create it, and overwrite the URI placeholder with your real Aura credentials:

```bash
# Overwrite URI placeholder (created by CDK as type=String)
aws ssm put-parameter \
  --name "/sitegen/dev/neo4j-uri" \
  --type String \
  --value "neo4j+s://xxxxxxxx.databases.neo4j.io" \
  --overwrite

# Create password parameter (CDK cannot create SecureString — this is the first time)
aws ssm put-parameter \
  --name "/sitegen/dev/neo4j-password" \
  --type SecureString \
  --value "your-password-here"
```

On subsequent rotations, add `--overwrite` to the password command.

## Step 2c: Export Credentials from SSM

Before running `npm run seed:graph` or `npm run verify:graph`, export credentials into your shell:

```bash
export NEO4J_URI=$(aws ssm get-parameter --name /sitegen/dev/neo4j-uri --query Parameter.Value --output text)
export NEO4J_PASSWORD=$(aws ssm get-parameter --name /sitegen/dev/neo4j-password --with-decryption --query Parameter.Value --output text)
```

## Step 3: Generate Pair Scores

Before seeding the graph, generate the component compatibility scores. This is a local computation (no Neo4j connection needed):

```bash
cd agents
npx ts-node scripts/generate-pair-scores.ts
```

Output: `agents/scripts/seed-data/pairs-scores.json`

This file is generated -- do not hand-edit. Re-run after any component metadata changes.

## Step 4: Seed the Graph

Seed all nodes (Segment, Mood, Style, Component, PaletteProfile, Variant) and relationships (NATURALLY_FEELS, EXPRESSED_AS, SUGGESTS_PALETTE, HAS_STYLE, HAS_MOOD, VARIANT_OF, PAIRS_WITH):

```bash
cd agents
NEO4J_URI=neo4j+s://xxxxxxxx.databases.neo4j.io \
NEO4J_PASSWORD=your-password \
npx ts-node scripts/seed-graph.ts
```

The script reads from:
- `agents/scripts/seed-data/graph-seed.json` -- segments, moods-to-styles mappings, palette profiles
- `agents/scripts/seed-data/pairs-scores.json` -- algorithmic pair compatibility scores (must exist)
- `components/library/**/metadata.json` -- component nodes, styles, moods, variants

## Step 5: Verify

Run the verification script to assert expected node/relationship counts and spot-check traversals:

```bash
cd agents
NEO4J_URI=neo4j+s://xxxxxxxx.databases.neo4j.io \
NEO4J_PASSWORD=your-password \
npx ts-node scripts/verify-graph.ts
```

Exit code `0` = all assertions pass. Exit code `1` = one or more assertions failed (details printed to stderr).

## Step 6: Confirm Graph Source End-to-End

After seeding, trigger a pipeline run via the dashboard:

1. Open the SiteGen dashboard and create a new project.
2. After the pipeline completes, open the project detail page.
3. **StyleView** should display a `graph palette` badge (not `fallback palette`).
4. **ComposerView** should display a `graph` source badge and a numeric `avg pair X.XX` badge.

If either badge shows "fallback", check CloudWatch Logs for the `SiteGen/Neo4j` namespace `QueryError` metric — Neo4j connectivity or seeding may have failed.

## Maintenance Notes

**When to re-run:**
- New components added to `components/library/`
- Component metadata changed (style, mood, pairsWell, pairsPoorly, variants)
- Palette profiles or segment mappings updated in `graph-seed.json`

**Re-seed procedure:**
1. Run `generate-pair-scores.ts` (Step 3) to regenerate scores
2. Run `seed-graph.ts` (Step 4) to update the graph
3. Run `verify-graph.ts` (Step 5) to confirm correctness

**Idempotent seeding:** All Cypher operations use `MERGE` (not `CREATE`), so re-running the seed script is safe. Existing nodes and relationships are updated in place, not duplicated.
