import { Handler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import Anthropic from "@anthropic-ai/sdk";

import {
  PipelineState,
  ResearchOutput,
  ResearchOutputSchema,
} from "../shared/types";
import { ResearchAgentInputSchema } from "./types";
import { buildResearchSystemPrompt, buildResearchUserPrompt } from "./prompt";

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
/*  Mark project as "researching" in DynamoDB                          */
/* ------------------------------------------------------------------ */

async function markResearchStarted(projectId: string): Promise<void> {
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
        ":status": "researching",
        ":now": new Date().toISOString(),
      },
    }),
  );
}

/* ------------------------------------------------------------------ */
/*  Call Claude API for research analysis                               */
/* ------------------------------------------------------------------ */

async function generateResearch(
  input: ReturnType<typeof ResearchAgentInputSchema.parse>,
): Promise<ResearchOutput> {
  const apiKey = await getClaudeApiKey();
  const client = new Anthropic({ apiKey });

  const systemPrompt = buildResearchSystemPrompt();
  const userPrompt = buildResearchUserPrompt(input);

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
      `Failed to parse Research Claude response as JSON: ${jsonString.substring(0, 200)}...`,
    );
  }

  const validated = ResearchOutputSchema.parse(parsed);
  return validated;
}

/* ------------------------------------------------------------------ */
/*  Update project in DynamoDB                                         */
/* ------------------------------------------------------------------ */

async function updateProject(
  projectId: string,
  researchOutput: ResearchOutput,
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
        "SET researchOutput = :ro, #s = :status, updatedAt = :now",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: {
        ":ro": researchOutput,
        ":status": "styling",
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
      agent: "research",
      projectId: event.projectId,
      segment: event.segment,
    }),
  );

  // 1. Validate input
  const input = ResearchAgentInputSchema.parse(event);

  // 2. Mark project as "researching" before calling Claude
  await markResearchStarted(input.projectId);

  // 3. Generate research via Claude
  const researchOutput = await generateResearch(input);

  console.log(
    JSON.stringify({
      agent: "research",
      projectId: input.projectId,
      segment: researchOutput.segment,
      toneKeywords: researchOutput.toneKeywords,
    }),
  );

  // 4. Persist to DynamoDB (status -> "styling")
  await updateProject(input.projectId, researchOutput);

  // 5. Return accumulated pipeline state
  const result: PipelineState = {
    ...event,
    status: "styling",
    researchOutput,
  };

  return result;
};
