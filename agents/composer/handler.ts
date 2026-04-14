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
import { getDriver } from "../shared/neo4j-client";
import { ComposerAgentInputSchema } from "./types";
import {
  buildSystemPrompt,
  buildUserPrompt,
  CandidateComponent,
} from "./prompt";

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
): Promise<CandidateComponent[]> {
  const driver = await getDriver();
  const session = driver.session({ database: "neo4j" });

  try {
    const result = await session.run(
      `
      MATCH (seg:Segment {id: $segmentId})
        -[:NATURALLY_FEELS]->(m:Mood)
        -[:EXPRESSED_AS]->(st:Style)
        <-[:HAS_STYLE]-(c:Component)
      WITH c,
        count(DISTINCT m) AS moodHits,
        count(DISTINCT st) AS styleHits
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

    return result.records.map((record) => ({
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
): Promise<ComposerOutput> {
  const apiKey = await getClaudeApiKey();
  const client = new Anthropic({ apiKey });

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(input, candidates, source);

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
  return validated;
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

  try {
    candidates = await getGraphCandidates(input.segment);
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
  const composerOutput = await composeLayouts(input, candidates, source);

  console.log(
    JSON.stringify({
      agent: "composer",
      projectId: input.projectId,
      layoutCount: composerOutput.layouts.length,
      selectedLayout: composerOutput.selectedLayout,
      source: composerOutput.source,
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
