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
  PipelineState,
  ComposerOutput,
  ComposerOutputSchema,
  ComponentItem,
  StyleOutput,
} from "../shared/types";
import { getDriver, getNeo4jDatabase } from "../shared/neo4j-client";
import { emitNeo4jQueryError } from "../shared/metrics";
import { ComposerAgentInputSchema } from "./types";
import {
  buildSystemPrompt,
  buildUserPrompt,
  CandidateComponent,
} from "./prompt";

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

async function getGraphCandidates(segment: string): Promise<{
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
             moodHits, styleHits,
             coalesce(avgPairScore, 0.5) AS avgPairScore
      ORDER BY (moodHits * 2 + styleHits + avgPairScore) DESC
      LIMIT 20
      `,
      { segmentId: segment },
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
      };
    })
    .filter((c) => c.moodHits > 0 || c.styleHits > 0)
    .sort(
      (a, b) =>
        b.moodHits * 2 +
        b.styleHits +
        b.avgPairScore -
        (a.moodHits * 2 + a.styleHits + a.avgPairScore),
    )
    .slice(0, 20);

  return candidates;
}

/* ------------------------------------------------------------------ */
/*  Mark project as "composing" in DynamoDB                            */
/* ------------------------------------------------------------------ */

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

  return enforced;
}

/* ------------------------------------------------------------------ */
/*  Save composer output to DynamoDB                                    */
/* ------------------------------------------------------------------ */

async function saveComposerOutput(
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
      UpdateExpression:
        "SET composerOutput = :co, #s = :status, updatedAt = :now",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: {
        ":co": composerOutput,
        ":status": "content",
        ":now": new Date().toISOString(),
      },
    }),
  );
}

/* ------------------------------------------------------------------ */
/*  Lambda Handler                                                     */
/* ------------------------------------------------------------------ */

export const handler: Handler<PipelineState, PipelineState> = async (event) => {
  console.log(
    JSON.stringify({
      agent: "composer",
      projectId: event.projectId,
      segment: event.segment,
    }),
  );

  // 1. Validate input
  const input = ComposerAgentInputSchema.parse(event);

  // 2. Mark project as "composing" before processing
  await markComposingStarted(input.projectId);

  // 3. Get candidate components — try graph first, fallback to DynamoDB
  let candidates: CandidateComponent[];
  let source: "graph" | "fallback";
  let pairMatrix: PairMatrixEntry[] = [];

  try {
    const graphResult = await getGraphCandidates(input.segment);
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
    candidates = await getDynamoFallbackCandidates(input.styleOutput);
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

  // 5. Persist to DynamoDB (status -> "content")
  await saveComposerOutput(input.projectId, composerOutput);

  // 6. Return accumulated pipeline state
  const result: PipelineState = {
    ...event,
    status: "content",
    composerOutput,
  };

  return result;
};
