import { Handler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  UpdateCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import Anthropic from "@anthropic-ai/sdk";

import {
  ComposerOutput,
  ComposerOutputSchema,
  ComponentItem,
  StyleOutput,
} from "../shared/types";
import { getDriver, getNeo4jDatabase } from "../shared/neo4j-client";
import { emitNeo4jQueryError } from "../shared/metrics";
import { ComposerAgentInput, ComposerAgentInputSchema } from "./types";
import {
  buildSystemPrompt,
  buildUserPrompt,
  CandidateComponent,
} from "./prompt";
import { runPairPostCheck } from "./post-check";
import { COMPONENT_METADATA } from "../assembler/component-sources.generated";

/* ------------------------------------------------------------------ */
/*  Layout constraint violation                                        */
/* ------------------------------------------------------------------ */

/**
 * Thrown when the composed layout violates a hard rule from the buyer
 * intake form (desired/excluded section categories). SFN composerStep
 * retry policy will re-invoke the agent with the same input; on second
 * failure the Catch routes to the fail handler. This is preferred over
 * deterministic injection because randomly inserting a category disrupts
 * the LLM's ordering decisions and produces worse layouts than a retry.
 */
class LayoutConstraintError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LayoutConstraintError";
  }
}

/* ------------------------------------------------------------------ */
/*  Pair matrix entry (pair compatibility between candidate components) */
/* ------------------------------------------------------------------ */

export interface PairMatrixEntry {
  a: string;
  b: string;
  score: number;
}

/* ------------------------------------------------------------------ */
/*  Mandatory navbar/footer enforcement                                */
/* ------------------------------------------------------------------ */

const NAVBAR_ID = "navbar-sticky-01";
const FOOTER_ID = "footer-reveal-01";

/**
 * Ensure every layout begins with the mandatory navbar and ends with the
 * mandatory footer. This is an ID-based comparison: Phase 1 has exactly one
 * navbar (`navbar-sticky-01`) and one footer (`footer-reveal-01`), so direct
 * ID matching is sufficient and avoids a metadata lookup. Upgrade this to a
 * category-based check (`category === "navigation" | "footer"`) when a
 * second navbar or footer component is added.
 */
function enforceNavbarFooter(output: ComposerOutput): ComposerOutput {
  for (const layout of output.layouts) {
    if (layout.components[0] !== NAVBAR_ID) {
      layout.components.unshift(NAVBAR_ID);
    }
    const last = layout.components[layout.components.length - 1];
    if (last !== FOOTER_ID) {
      layout.components.push(FOOTER_ID);
    }
  }
  return output;
}

/**
 * Validates the buyer's section selections against the SELECTED layout.
 *
 * Scope difference vs `enforceNavbarFooter`: this validates ONLY
 * `output.layouts[output.selectedLayout].components`, not all layouts —
 * the seller approves the selected layout, so only that one needs to honor
 * the hard rules. Validating all layouts would reject perfectly good
 * alternates that the seller may never see.
 *
 * Throws `LayoutConstraintError` on violation. Composer SFN retry policy
 * re-invokes with the same input; the prompt's hard-rule sections give the
 * LLM a second chance. On second failure, Catch routes to the fail handler.
 *
 * Category lookup uses the `candidates` array already in scope inside
 * `composeLayouts` (each entry has `.category`). DO NOT re-read manifest.json
 * here — the candidate set is the authoritative source for this run.
 */
function enforceDesiredSections(
  output: ComposerOutput,
  desired: string[],
  candidates: CandidateComponent[],
): ComposerOutput {
  if (desired.length === 0) {
    return output;
  }

  const categoryById = new Map<string, string>();
  for (const c of candidates) {
    categoryById.set(c.id, c.category);
  }

  const selected = output.layouts[output.selectedLayout];
  if (!selected) {
    throw new LayoutConstraintError(
      `Selected layout index ${output.selectedLayout} is out of range (have ${output.layouts.length}).`,
    );
  }

  const presentCategories = new Set<string>();
  for (const id of selected.components) {
    const cat = categoryById.get(id);
    if (cat) presentCategories.add(cat);
  }

  // Required categories must all appear at least once.
  const missing = desired.filter((c) => !presentCategories.has(c));
  if (missing.length > 0) {
    throw new LayoutConstraintError(
      `Selected layout is missing required categories: ${missing.join(", ")}`,
    );
  }

  return output;
}

/* ------------------------------------------------------------------ */
/*  Clients (reused across Lambda invocations)                         */
/* ------------------------------------------------------------------ */

const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ssmClient = new SSMClient({});

/* ------------------------------------------------------------------ */
/*  SSM-cached Claude API key                                          */
/* ------------------------------------------------------------------ */

let cachedApiKey: string | undefined;

async function getClaudeApiKey(): Promise<string> {
  if (cachedApiKey) return cachedApiKey;

  const ssmPath = process.env.CLAUDE_API_KEY_SSM_PATH;
  if (!ssmPath) {
    throw new Error("CLAUDE_API_KEY_SSM_PATH environment variable is not set");
  }

  const result = await ssmClient.send(
    new GetParameterCommand({ Name: ssmPath, WithDecryption: true }),
  );

  if (!result.Parameter?.Value) {
    throw new Error(`SSM parameter ${ssmPath} not found or has no value`);
  }

  cachedApiKey = result.Parameter.Value;
  return cachedApiKey;
}

/* ------------------------------------------------------------------ */
/*  Neo4j graph query for candidate components                         */
/* ------------------------------------------------------------------ */

async function getGraphCandidates(
  segment: string,
  imageryDensityScale: number,
): Promise<{
  candidates: CandidateComponent[];
  pairMatrix: PairMatrixEntry[];
}> {
  const driver = await getDriver();
  const database = await getNeo4jDatabase();
  const session = driver.session({ database });

  try {
    const result = await session.run(
      `
      CALL {
        MATCH (seg:Segment {id: $segmentId})
          -[:NATURALLY_FEELS]->(m:Mood)
          -[:EXPRESSED_AS]->(st:Style)
          <-[:HAS_STYLE]-(c:Component)
        RETURN c, count(DISTINCT m) AS moodHits, count(DISTINCT st) AS styleHits
        UNION ALL
        MATCH (seg:Segment {id: $segmentId})
          -[:NATURALLY_FEELS]->(m:Mood)
          <-[:HAS_MOOD]-(c:Component)
        RETURN c, count(DISTINCT m) AS moodHits, 0 AS styleHits
      }
      WITH c, sum(moodHits) AS moodHits, max(styleHits) AS styleHits
      OPTIONAL MATCH (c)-[pw:PAIRS_WITH]->()
      WITH c, moodHits, styleHits,
        avg(pw.score) AS avgPairScore
      RETURN c.id AS id, c.name AS name, c.category AS category,
             c.density AS density, c.layout AS layout,
             c.imageWeight AS imageWeight,
             moodHits, styleHits,
             coalesce(avgPairScore, 0.5) AS avgPairScore
      ORDER BY (moodHits * 2 + styleHits + avgPairScore + coalesce(c.imageWeight, 0) * $imageryDensityScale) DESC
      LIMIT 20
      `,
      { segmentId: segment, imageryDensityScale },
    );

    const candidates: CandidateComponent[] = result.records.map((record) => ({
      id: record.get("id") as string,
      name: record.get("name") as string,
      category: record.get("category") as string,
      density: record.get("density") as string,
      layout: record.get("layout") as string,
      moodHits:
        typeof record.get("moodHits") === "object"
          ? (record.get("moodHits") as { toNumber(): number }).toNumber()
          : (record.get("moodHits") as number),
      styleHits:
        typeof record.get("styleHits") === "object"
          ? (record.get("styleHits") as { toNumber(): number }).toNumber()
          : (record.get("styleHits") as number),
      avgPairScore:
        typeof record.get("avgPairScore") === "object"
          ? (record.get("avgPairScore") as { toNumber(): number }).toNumber()
          : (record.get("avgPairScore") as number),
      imageWeight: (() => {
        const raw = record.get("imageWeight");
        if (raw === null || raw === undefined) return undefined;
        if (typeof raw === "object" && raw !== null && "toNumber" in raw) {
          return (raw as { toNumber(): number }).toNumber();
        }
        return raw as number;
      })(),
    }));

    const candidateIds = candidates.map((c) => c.id);

    const pairResult = await session.run(
      `
      MATCH (a:Component)-[pw:PAIRS_WITH]->(b:Component)
      WHERE a.id IN $candidateIds AND b.id IN $candidateIds
        AND a.id < b.id
      RETURN a.id AS a, b.id AS b, pw.score AS score
      ORDER BY pw.score DESC
      `,
      { candidateIds },
    );

    const pairMatrix: PairMatrixEntry[] = pairResult.records.map((record) => ({
      a: record.get("a") as string,
      b: record.get("b") as string,
      score:
        typeof record.get("score") === "object"
          ? (record.get("score") as { toNumber(): number }).toNumber()
          : (record.get("score") as number),
    }));

    return { candidates, pairMatrix };
  } finally {
    await session.close();
  }
}

/* ------------------------------------------------------------------ */
/*  DynamoDB fallback — scan ComponentsTable when Neo4j is unavailable */
/* ------------------------------------------------------------------ */

async function getDynamoFallbackCandidates(
  styleOutput: StyleOutput,
  imageryDensityScale: number,
): Promise<CandidateComponent[]> {
  const tableName = process.env.COMPONENTS_TABLE_NAME;
  if (!tableName) {
    throw new Error("COMPONENTS_TABLE_NAME environment variable is not set");
  }

  const result = await ddbClient.send(
    new ScanCommand({ TableName: tableName }),
  );

  const items = (result.Items ?? []) as ComponentItem[];

  const approvedMoods = new Set<string>(styleOutput.mood);
  const approvedStyles = new Set<string>(styleOutput.style);

  const candidates: CandidateComponent[] = items
    .map((item) => {
      const moodHits = (item.mood ?? []).filter((m) =>
        approvedMoods.has(m),
      ).length;
      const styleHits = (item.style ?? []).filter((s) =>
        approvedStyles.has(s),
      ).length;

      // Derive a simple pair score from pairsWell array length
      const pairsWellCount = (item.pairsWell ?? []).length;
      const avgPairScore = pairsWellCount > 0 ? 0.65 : 0.5;

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        density:
          (item as unknown as Record<string, string>).density ?? "medium",
        layout: (item as unknown as Record<string, string>).layout ?? "full",
        moodHits,
        styleHits,
        avgPairScore,
        imageWeight: item.imageWeight,
      };
    })
    .filter((c) => c.moodHits > 0 || c.styleHits > 0)
    .sort(
      (a, b) =>
        b.moodHits * 2 +
        b.styleHits +
        b.avgPairScore +
        (b.imageWeight ?? 0) * imageryDensityScale -
        (a.moodHits * 2 +
          a.styleHits +
          a.avgPairScore +
          (a.imageWeight ?? 0) * imageryDensityScale),
    )
    .slice(0, 20);

  return candidates;
}

/* ------------------------------------------------------------------ */
/*  Mark project as "composing" in DynamoDB                            */
/* ------------------------------------------------------------------ */

// On SFN retry this overwrites status from awaiting_layout_approval back to
// composing — same behavior as Style Agent (also overwrites awaiting_style_approval
// on retry). Accepted: the retry path always reaches saveComposerAndToken at the
// end, which restores awaiting_layout_approval before SFN observes the value.
async function markComposingStarted(projectId: string): Promise<void> {
  const tableName = process.env.PROJECTS_TABLE_NAME;
  if (!tableName) {
    throw new Error("PROJECTS_TABLE_NAME environment variable is not set");
  }

  await ddbClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { pk: `PROJECT#${projectId}`, sk: `PROJECT#${projectId}` },
      UpdateExpression: "SET #s = :status, updatedAt = :now",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: {
        ":status": "composing",
        ":now": new Date().toISOString(),
      },
    }),
  );
}

/* ------------------------------------------------------------------ */
/*  Call Claude API for layout composition                             */
/* ------------------------------------------------------------------ */

async function composeLayouts(
  input: ReturnType<typeof ComposerAgentInputSchema.parse>,
  candidates: CandidateComponent[],
  source: "graph" | "fallback",
  pairMatrix: PairMatrixEntry[],
): Promise<ComposerOutput> {
  const apiKey = await getClaudeApiKey();
  const client = new Anthropic({ apiKey });

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(input, candidates, source, pairMatrix);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Extract text content from response
  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude response did not contain a text block");
  }

  // Strip markdown code fences if present
  const rawJson = textBlock.text.trim();
  const jsonString = rawJson
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error(
      `Failed to parse Composer Claude response as JSON: ${jsonString.substring(0, 200)}...`,
    );
  }

  const validated = ComposerOutputSchema.parse(parsed);

  validated.candidateCount = candidates.length;
  const selectedComponents =
    validated.layouts[validated.selectedLayout].components;
  const pairLookup = new Map<string, number>();
  for (const entry of pairMatrix) {
    const key = [entry.a, entry.b].sort().join("|");
    pairLookup.set(key, entry.score);
  }
  let scoreSum = 0;
  let scoreCount = 0;
  for (let i = 0; i < selectedComponents.length - 1; i++) {
    const key = [selectedComponents[i], selectedComponents[i + 1]]
      .sort()
      .join("|");
    const score = pairLookup.get(key);
    if (score !== undefined) {
      scoreSum += score;
      scoreCount++;
    }
  }
  validated.avgScore = scoreCount > 0 ? scoreSum / scoreCount : null;

  const enforced = enforceNavbarFooter(validated);

  // Hard-rule validation against buyer-supplied section selections. Throws
  // LayoutConstraintError on violation; SFN retry/Catch handle the failure.
  enforceDesiredSections(enforced, input.desiredSections ?? [], candidates);

  // Deterministic post-LLM passes: sequence, same-category adjacency,
  // pairsPoorly. Warnings are surfaced on the ComposerOutput for the
  // dashboard / learning loop. Pure — does not throw.
  const { result: checked, warnings } = runPairPostCheck(
    enforced,
    candidates,
    COMPONENT_METADATA,
    input.desiredSections ?? [],
  );
  return { ...checked, warnings };
}

/* ------------------------------------------------------------------ */
/*  Save composer output to DynamoDB                                    */
/* ------------------------------------------------------------------ */

/**
 * SFN path: persist composerOutput, the WAIT_FOR_TASK_TOKEN task token, and
 * advance status to `awaiting_layout_approval`. The state machine remains
 * paused until the approve-layout API handler calls SendTaskSuccess.
 *
 * Mirrors `saveStyleAndToken` in `agents/style/handler.ts`.
 */
async function saveComposerAndToken(
  projectId: string,
  composerOutput: ComposerOutput,
  taskToken: string,
): Promise<void> {
  const tableName = process.env.PROJECTS_TABLE_NAME;
  if (!tableName) {
    throw new Error("PROJECTS_TABLE_NAME environment variable is not set");
  }

  await ddbClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { pk: `PROJECT#${projectId}`, sk: `PROJECT#${projectId}` },
      UpdateExpression:
        "SET composerOutput = :co, layoutApprovalTaskToken = :token, #s = :status, updatedAt = :now",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: {
        ":co": composerOutput,
        ":token": taskToken,
        ":status": "awaiting_layout_approval",
        ":now": new Date().toISOString(),
      },
    }),
  );
}

/**
 * Regenerate path: write composerOutput only. NO token write, NO status
 * change — the SFN execution remains paused on the original task token
 * captured during the initial Composer run; only the seller's eventual
 * approve-layout call releases it.
 *
 * Used by the regenerate-layout API handler when the seller asks for a
 * fresh layout pass.
 */
async function saveComposerOutputOnly(
  projectId: string,
  composerOutput: ComposerOutput,
): Promise<void> {
  const tableName = process.env.PROJECTS_TABLE_NAME;
  if (!tableName) {
    throw new Error("PROJECTS_TABLE_NAME environment variable is not set");
  }

  await ddbClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { pk: `PROJECT#${projectId}`, sk: `PROJECT#${projectId}` },
      UpdateExpression: "SET composerOutput = :co, updatedAt = :now",
      ExpressionAttributeValues: {
        ":co": composerOutput,
        ":now": new Date().toISOString(),
      },
    }),
  );
}

/* ------------------------------------------------------------------ */
/*  Lambda Handler                                                     */
/* ------------------------------------------------------------------ */

// SFN WAIT_FOR_TASK_TOKEN: when invoked from the state machine, the input
// includes `taskToken` and the Lambda return value is ignored — the state
// machine resumes only when SendTaskSuccess is called from approve-layout.
//
// Regenerate-layout sync invoke: input has NO `taskToken`. The handler
// persists composerOutput without touching the token or status, and returns
// the new ComposerOutput in the Lambda response payload.
export const handler: Handler<
  ComposerAgentInput,
  ComposerOutput | void
> = async (event) => {
  console.log(
    JSON.stringify({
      agent: "composer",
      projectId: event.projectId,
      segment: event.segment,
      hasTaskToken: Boolean(event.taskToken),
    }),
  );

  // 1. Validate input (taskToken is optional — SFN provides it; regenerate omits it)
  const input = ComposerAgentInputSchema.parse(event);

  // 2. Mark project as "composing" before processing
  await markComposingStarted(input.projectId);

  // 3. Get candidate components — try graph first, fallback to DynamoDB
  let candidates: CandidateComponent[];
  let source: "graph" | "fallback";
  let pairMatrix: PairMatrixEntry[] = [];

  // Compute imageryDensityScale to bias candidate scoring by visual density.
  // Negative scale demotes image-heavy components (e.g. SaaS-tooling),
  // positive scale promotes them (e.g. real-estate, portfolio, fashion).
  const imageryDensityScale =
    { low: -1, medium: 0, high: 2 }[
      input.styleOutput?.imageryDensity ?? "medium"
    ] ?? 0;

  try {
    const graphResult = await getGraphCandidates(
      input.segment,
      imageryDensityScale,
    );
    candidates = graphResult.candidates;
    pairMatrix = graphResult.pairMatrix;
    source = "graph";
    console.log(
      JSON.stringify({
        agent: "composer",
        projectId: input.projectId,
        candidateSource: "graph",
        candidateCount: candidates.length,
      }),
    );
  } catch (err) {
    console.warn(
      JSON.stringify({
        agent: "composer",
        projectId: input.projectId,
        warning: "Neo4j unavailable, falling back to DynamoDB scan",
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    emitNeo4jQueryError("composer");
    candidates = await getDynamoFallbackCandidates(
      input.styleOutput,
      imageryDensityScale,
    );
    source = "fallback";
    console.log(
      JSON.stringify({
        agent: "composer",
        projectId: input.projectId,
        candidateSource: "fallback",
        candidateCount: candidates.length,
      }),
    );
  }

  if (candidates.length === 0) {
    throw new Error(
      `No candidate components found for segment "${input.segment}"`,
    );
  }

  // 4. Call Claude to compose layouts from candidates
  const composerOutput = await composeLayouts(
    input,
    candidates,
    source,
    pairMatrix,
  );

  console.log(
    JSON.stringify({
      agent: "composer",
      projectId: input.projectId,
      layoutCount: composerOutput.layouts.length,
      selectedLayout: composerOutput.selectedLayout,
      source: composerOutput.source,
      candidateCount: composerOutput.candidateCount,
      avgScore: composerOutput.avgScore,
    }),
  );

  // 5. Branch on taskToken presence:
  //    - SFN path: write composerOutput + token + status=awaiting_layout_approval, return void.
  //    - Regenerate path: write composerOutput only, return it to the API caller.
  if (input.taskToken) {
    await saveComposerAndToken(
      input.projectId,
      composerOutput,
      input.taskToken,
    );
    return;
  }

  await saveComposerOutputOnly(input.projectId, composerOutput);
  return composerOutput;
};
