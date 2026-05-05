import { Handler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import Anthropic from "@anthropic-ai/sdk";

import { StyleOutput, StyleOutputSchema } from "../shared/types";
import { StyleAgentInput, StyleAgentInputSchema } from "./types";
import { buildStyleSystemPrompt, buildStyleUserPrompt } from "./prompt";

const DEFAULT_STYLE_KIT = {
  card: "base",
  ctaVariant: "default",
  ctaColorScheme: "primary",
  background: "none",
  textDecoration: "none",
};

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
): Promise<StyleOutput> {
  const apiKey = await getClaudeApiKey();
  const client = new Anthropic({ apiKey });

  const systemPrompt = buildStyleSystemPrompt();
  // Phase A removes the Neo4j-derived palette suggestions; the prompt-side
  // `paletteSuggestions` parameter (typed as PaletteSuggestionHint[]) defaults
  // to [] and the conditional rendering produces no section on empty input.
  const userPrompt = buildStyleUserPrompt(input, []);

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
  // Safety sync: ensure palette exactly matches the active mode variant.
  // Prevents propagation downstream if the LLM returns inconsistent paletteModes.
  validated.palette = validated.paletteModes[validated.paletteMode];
  validated.styleKit = validated.styleKit ?? DEFAULT_STYLE_KIT;
  validated.imageryDensity = validated.imageryDensity ?? "medium";
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

  // 3. Generate style via Claude. Neo4j palette suggestions are gone in
  //    Phase A; paletteSource is always "fallback". The enum on
  //    StyleOutputSchema retains "graph" as a legacy value (existing DDB
  //    items written during Stage 2 still parse), but new executions always
  //    write "fallback".
  const styleOutput = await generateStyle(input);
  styleOutput.paletteSource = "fallback";

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
