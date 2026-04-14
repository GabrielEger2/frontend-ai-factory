import { Handler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchGetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import Anthropic from "@anthropic-ai/sdk";

import {
  PipelineState,
  ContentOutput,
  ContentOutputSchema,
  ComponentItem,
} from "../shared/types";
import { getPreset } from "../shared/segment-presets";
import {
  ContentAgentInputSchema,
  ComponentSlotDescriptor,
  ComponentSlot,
} from "./types";
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildRetryUserPrompt,
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
/*  Fetch component metadata from DynamoDB via BatchGet                */
/* ------------------------------------------------------------------ */

async function fetchComponentMetadata(
  componentIds: string[],
): Promise<ComponentItem[]> {
  const tableName = process.env.COMPONENTS_TABLE_NAME;
  if (!tableName) {
    throw new Error("COMPONENTS_TABLE_NAME environment variable is not set");
  }

  // DynamoDB BatchGetItem supports max 100 keys per request
  const BATCH_SIZE = 100;
  const items: ComponentItem[] = [];

  for (let i = 0; i < componentIds.length; i += BATCH_SIZE) {
    const batch = componentIds.slice(i, i + BATCH_SIZE);
    const keys = batch.map((id) => ({ pk: `COMP#${id}` }));

    const result = await ddbClient.send(
      new BatchGetCommand({
        RequestItems: {
          [tableName]: { Keys: keys },
        },
      }),
    );

    const tableItems = result.Responses?.[tableName] ?? [];
    items.push(...(tableItems as ComponentItem[]));
  }

  return items;
}

/* ------------------------------------------------------------------ */
/*  Build component slot descriptors from DynamoDB items               */
/* ------------------------------------------------------------------ */

function buildSlotDescriptors(
  componentIds: string[],
  componentItems: ComponentItem[],
): ComponentSlotDescriptor[] {
  const itemMap = new Map<string, ComponentItem>();
  for (const item of componentItems) {
    itemMap.set(item.id, item);
  }

  return componentIds
    .map((id) => {
      const item = itemMap.get(id);
      if (!item) {
        console.warn(`Component ${id} not found in ComponentsTable, skipping`);
        return null;
      }

      return {
        componentId: item.id,
        componentName: item.name,
        category: item.category,
        slots: item.slots as ComponentSlotDescriptor["slots"],
      };
    })
    .filter((desc): desc is ComponentSlotDescriptor => desc !== null);
}

/* ------------------------------------------------------------------ */
/*  Call Claude API for content generation                             */
/* ------------------------------------------------------------------ */

async function generateContent(
  input: { companyName: string; segment: string; description: string },
  componentSlots: ComponentSlotDescriptor[],
  userPromptOverride?: string,
): Promise<ContentOutput> {
  const apiKey = await getClaudeApiKey();
  const client = new Anthropic({ apiKey });

  const systemPrompt = buildSystemPrompt();
  const userPrompt =
    userPromptOverride ?? buildUserPrompt(input, componentSlots);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Extract text content from response
  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude response did not contain a text block");
  }

  const rawJson = textBlock.text.trim();
  const jsonString = rawJson
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error(
      `Failed to parse Claude response as JSON: ${jsonString.substring(0, 200)}...`,
    );
  }

  const validated = ContentOutputSchema.parse(parsed);
  return validated;
}

/* ------------------------------------------------------------------ */
/*  Validate enum fields in content output                             */
/* ------------------------------------------------------------------ */

interface EnumValidationError {
  componentId: string;
  slot: string;
  message: string;
}

function validateEnums(
  contentOutput: ContentOutput,
  slotDescriptors: ComponentSlotDescriptor[],
): EnumValidationError[] {
  const errors: EnumValidationError[] = [];

  const descriptorMap = new Map<string, ComponentSlotDescriptor>();
  for (const desc of slotDescriptors) {
    descriptorMap.set(desc.componentId, desc);
  }

  for (const component of contentOutput.components) {
    const descriptor = descriptorMap.get(component.componentId);
    if (!descriptor) continue;

    for (const slotDef of descriptor.slots) {
      const value = component.slots[slotDef.name];

      // Check root-level enum
      if (slotDef.enum && value != null) {
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          const allowed = slotDef.enum as unknown[];
          if (!allowed.includes(value)) {
            errors.push({
              componentId: component.componentId,
              slot: slotDef.name,
              message: `valor "${String(value)}" nao e valido. Opcoes: ${JSON.stringify(allowed)}`,
            });
          }
        }
      }

      // Check enum fields within list-type slots with itemSchema
      if (
        slotDef.type === "list" &&
        slotDef.itemSchema &&
        Array.isArray(value)
      ) {
        const itemSchema = slotDef.itemSchema as Record<string, ComponentSlot>;
        // itemSchema may be an object with named fields (object-type items)
        for (let idx = 0; idx < value.length; idx++) {
          const item = value[idx];
          if (
            item != null &&
            typeof item === "object" &&
            !Array.isArray(item)
          ) {
            const itemObj = item as Record<string, unknown>;
            for (const [fieldName, fieldDef] of Object.entries(itemSchema)) {
              if (
                fieldDef &&
                typeof fieldDef === "object" &&
                "enum" in fieldDef &&
                Array.isArray(fieldDef.enum)
              ) {
                const fieldValue = itemObj[fieldName];
                if (fieldValue != null) {
                  const allowed = fieldDef.enum as unknown[];
                  if (!allowed.includes(fieldValue)) {
                    errors.push({
                      componentId: component.componentId,
                      slot: `${slotDef.name}[${idx}].${fieldName}`,
                      message: `valor "${String(fieldValue)}" nao e valido. Opcoes: ${JSON.stringify(allowed)}`,
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/*  Mark project as "content" in DynamoDB (pre-Claude)                 */
/* ------------------------------------------------------------------ */

async function markContentStarted(projectId: string): Promise<void> {
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
        ":status": "content",
        ":now": new Date().toISOString(),
      },
    }),
  );
}

/* ------------------------------------------------------------------ */
/*  Update project in DynamoDB                                         */
/* ------------------------------------------------------------------ */

async function updateProject(
  projectId: string,
  contentOutput: ContentOutput,
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
        "SET contentOutput = :co, #s = :status, updatedAt = :now",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: {
        ":co": contentOutput,
        ":status": "humanizing",
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
      agent: "content",
      projectId: event.projectId,
      segment: event.segment,
    }),
  );

  // 1. Validate input
  const input = ContentAgentInputSchema.parse(event);

  // 2. Get component IDs from segment preset
  const componentIds = getPreset(input.segment);

  // 3. Fetch component metadata from DynamoDB
  const componentItems = await fetchComponentMetadata(componentIds);

  // 4. Build slot descriptors for the prompt
  const slotDescriptors = buildSlotDescriptors(componentIds, componentItems);

  if (slotDescriptors.length === 0) {
    throw new Error(
      `No component metadata found for segment "${input.segment}" components`,
    );
  }

  // 5. Mark project as "content" before calling Claude
  await markContentStarted(input.projectId);

  // 6. Generate content via Claude
  const inputBrief = {
    companyName: input.companyName,
    segment: input.segment,
    description: input.description,
  };

  let contentOutput = await generateContent(inputBrief, slotDescriptors);

  // 6b. Validate enum fields post-generation
  let enumErrors = validateEnums(contentOutput, slotDescriptors);

  if (enumErrors.length > 0) {
    console.log(
      JSON.stringify({
        agent: "content",
        projectId: input.projectId,
        enumErrors: enumErrors.length,
        action: "retrying",
      }),
    );

    const retryPrompt = buildRetryUserPrompt(
      inputBrief,
      slotDescriptors,
      enumErrors,
    );
    contentOutput = await generateContent(
      inputBrief,
      slotDescriptors,
      retryPrompt,
    );

    enumErrors = validateEnums(contentOutput, slotDescriptors);
    if (enumErrors.length > 0) {
      throw new Error(
        `Content enum validation failed after retry: ${JSON.stringify(enumErrors)}`,
      );
    }
  }

  console.log(
    JSON.stringify({
      agent: "content",
      projectId: input.projectId,
      componentsGenerated: contentOutput.components.length,
    }),
  );

  // 7. Persist to DynamoDB (status -> "humanizing")
  await updateProject(input.projectId, contentOutput);

  // 8. Return accumulated pipeline state
  const result: PipelineState = {
    ...event,
    status: "humanizing",
    contentOutput,
  };

  return result;
};
