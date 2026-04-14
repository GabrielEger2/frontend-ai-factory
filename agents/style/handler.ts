import { Handler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import Anthropic from "@anthropic-ai/sdk";

import { StyleOutput, StyleOutputSchema } from "../shared/types";
import { StyleAgentInput, StyleAgentInputSchema } from "./types";
import { buildStyleSystemPrompt, buildStyleUserPrompt } from "./prompt";
import { getDriver } from "../shared/neo4j-client";

/* ------------------------------------------------------------------ */
/*  Palette suggestion from Neo4j graph                                */
/* ------------------------------------------------------------------ */

interface PaletteSuggestion {
  moodId: string;
  paletteId: string;
  paletteName: string;
  temperatureRange: string;
  contrastLevel: string;
  saturationRange: string;
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
/*  Neo4j graph query for palette suggestions                          */
/* ------------------------------------------------------------------ */

async function queryPaletteSuggestions(
  segment: string,
): Promise<PaletteSuggestion[]> {
  try {
    const driver = await getDriver();
    const session = driver.session({ database: "neo4j" });

    try {
      const result = await session.run(
        `
        MATCH (seg:Segment {id: $segmentId})
          -[:NATURALLY_FEELS]->(m:Mood)
          -[:SUGGESTS_PALETTE]->(p:PaletteProfile)
        RETURN m.id AS moodId, p.id AS paletteId, p.name AS paletteName,
               p.temperatureRange AS temperatureRange, p.contrastLevel AS contrastLevel,
               p.saturationRange AS saturationRange
        ORDER BY m.id, p.id
        `,
        { segmentId: segment },
      );

      return result.records.map((record) => ({
        moodId: record.get("moodId") as string,
        paletteId: record.get("paletteId") as string,
        paletteName: record.get("paletteName") as string,
        temperatureRange: record.get("temperatureRange") as string,
        contrastLevel: record.get("contrastLevel") as string,
        saturationRange: record.get("saturationRange") as string,
      }));
    } finally {
      await session.close();
    }
  } catch (err) {
    console.warn(
      JSON.stringify({
        agent: "style",
        warning: "Neo4j unavailable, skipping palette suggestions",
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Mark project as "styling" in DynamoDB                              */
/* ------------------------------------------------------------------ */

async function markStylingStarted(projectId: string): Promise<void> {
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
        ":status": "styling",
        ":now": new Date().toISOString(),
      },
    }),
  );
}

/* ------------------------------------------------------------------ */
/*  Call Claude API for style generation                               */
/* ------------------------------------------------------------------ */

async function generateStyle(
  input: ReturnType<typeof StyleAgentInputSchema.parse>,
  paletteSuggestions: PaletteSuggestion[],
): Promise<StyleOutput> {
  // TODO(3.3): pass paletteSuggestions to buildStyleUserPrompt()
  void paletteSuggestions;

  const apiKey = await getClaudeApiKey();
  const client = new Anthropic({ apiKey });

  const systemPrompt = buildStyleSystemPrompt();
  const userPrompt = buildStyleUserPrompt(input);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
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
      `Failed to parse Style Claude response as JSON: ${jsonString.substring(0, 200)}...`,
    );
  }

  const validated = StyleOutputSchema.parse(parsed);
  return validated;
}

/* ------------------------------------------------------------------ */
/*  Save style output + task token to DynamoDB                         */
/* ------------------------------------------------------------------ */

async function saveStyleAndToken(
  projectId: string,
  styleOutput: StyleOutput,
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
        "SET styleOutput = :so, styleApprovalTaskToken = :token, #s = :status, updatedAt = :now",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: {
        ":so": styleOutput,
        ":token": taskToken,
        ":status": "awaiting_style_approval",
        ":now": new Date().toISOString(),
      },
    }),
  );
}

/* ------------------------------------------------------------------ */
/*  Lambda Handler                                                     */
/* ------------------------------------------------------------------ */

// SFN WaitForTaskToken — Lambda return value is ignored.
// The state machine resumes only when SendTaskSuccess is called
// from the approve-style API handler.
export const handler: Handler<StyleAgentInput, void> = async (event) => {
  console.log(
    JSON.stringify({
      agent: "style",
      projectId: event.projectId,
      segment: event.segment,
    }),
  );

  // 1. Validate input (includes taskToken from SFN)
  const input = StyleAgentInputSchema.parse(event);

  // 2. Mark project as "styling" before calling Claude
  await markStylingStarted(input.projectId);

  // 3. Query Neo4j for palette suggestions (graceful degradation — empty array on failure)
  const paletteSuggestions = await queryPaletteSuggestions(input.segment);

  console.log(
    JSON.stringify({
      agent: "style",
      projectId: input.projectId,
      paletteSuggestionsCount: paletteSuggestions.length,
    }),
  );

  // 4. Generate style via Claude
  const styleOutput = await generateStyle(input, paletteSuggestions);

  console.log(
    JSON.stringify({
      agent: "style",
      projectId: input.projectId,
      mood: styleOutput.mood,
      style: styleOutput.style,
      density: styleOutput.density,
    }),
  );

  // 5. Save style output + task token to DynamoDB (status -> "awaiting_style_approval")
  // SFN will pause here until the seller approves via the approve-style API
  await saveStyleAndToken(input.projectId, styleOutput, input.taskToken);

  // Return is void — SFN ignores Lambda return with WaitForTaskToken
};
