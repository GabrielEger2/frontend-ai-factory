import type { APIGatewayProxyHandler } from "aws-lambda";
import {
  ConditionalCheckFailedException,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { ZodError } from "zod";
import { ProjectBriefSchema } from "../../pipeline-starter/types";
import { requireSellerId } from "../shared/seller-guard";
import crypto from "crypto";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const sqs = new SQSClient({});

// Derive the create-project request schema from the canonical ProjectBriefSchema
// to eliminate drift. Strip pipeline-internal fields the API caller does not
// supply (projectId, sellerId, executionName) — these are filled in by the
// handler / pipeline-starter respectively.
const CreateProjectSchema = ProjectBriefSchema.omit({
  projectId: true,
  sellerId: true,
  executionName: true,
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

  const sellerIdOrErr = requireSellerId(event);
  if (typeof sellerIdOrErr !== "string") return sellerIdOrErr;
  const sellerId = sellerIdOrErr;

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
          sellerId,
          status: "queued",
          createdAt: now,
          updatedAt: now,
          // Spread all validated brief fields. DDB silently drops `undefined`
          // values, so optional Zod fields that are absent simply won't be
          // written. attribute_not_exists(pk) still guards against duplicates.
          ...input,
        },
        ConditionExpression: "attribute_not_exists(pk)",
      }),
    );

    await sqs.send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify({
          projectId,
          sellerId,
          ...input,
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

    if (err instanceof ConditionalCheckFailedException) {
      return {
        statusCode: 409,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Project already exists" }),
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
