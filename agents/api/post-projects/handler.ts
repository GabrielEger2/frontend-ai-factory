import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { z, ZodError } from "zod";
import { SUPPORTED_SEGMENTS } from "../../shared/segment-presets";
import crypto from "crypto";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const sqs = new SQSClient({});

const CreateProjectSchema = z.object({
  companyName: z.string().min(1),
  segment: z.enum(SUPPORTED_SEGMENTS as [string, ...string[]]),
  description: z.string().min(1),
});

/**
 * POST /projects — creates a new project in DynamoDB and enqueues
 * a pipeline brief to SQS for Step Functions processing.
 *
 * Request body: { companyName, segment, description }
 * Response 201: { projectId }
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const tableName = process.env.PROJECTS_TABLE_NAME;
  const queueUrl = process.env.PIPELINE_QUEUE_URL;

  if (!tableName || !queueUrl) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server configuration error" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const input = CreateProjectSchema.parse(body);

    const projectId = crypto.randomUUID();
    const now = new Date().toISOString();

    await ddb.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          pk: `PROJECT#${projectId}`,
          sk: `PROJECT#${projectId}`,
          projectId,
          companyName: input.companyName,
          segment: input.segment,
          description: input.description,
          status: "queued",
          createdAt: now,
          updatedAt: now,
        },
      }),
    );

    await sqs.send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify({
          projectId,
          companyName: input.companyName,
          segment: input.segment,
          description: input.description,
        }),
      }),
    );

    console.log(
      JSON.stringify({
        message: "Project created and queued",
        projectId,
        segment: input.segment,
      }),
    );

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Invalid request body",
          details: err.errors,
        }),
      };
    }

    if (err instanceof SyntaxError) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid JSON in request body" }),
      };
    }

    console.error(
      JSON.stringify({
        message: "Failed to create project",
        error: err instanceof Error ? err.message : String(err),
      }),
    );

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
