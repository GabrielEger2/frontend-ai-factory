import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

import type { ProjectItem } from "../../shared/types";
import { requireSellerId } from "../shared/seller-guard";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const sqs = new SQSClient({});

/**
 * POST /projects/{id}/restart — restart a failed pipeline from scratch.
 *
 * Used as a fallback when a single-step retry isn't possible (e.g. composer
 * step failed mid-execution and the SFN execution is dead). Resets the
 * project document, clears all agent outputs, and re-enqueues a brief to SQS
 * with a fresh SFN execution name (`${projectId}-${timestamp}`).
 *
 * Gate: only `status === "failed"` is restartable. Active in-flight statuses
 * are rejected with 409.
 *
 * Response 202: { message, projectId, executionName }
 * Response 400: missing project id
 * Response 404: project not found (or not owned by this seller)
 * Response 409: project is not in `failed` status
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

  const projectId = event.pathParameters?.id;

  if (!projectId) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing project id path parameter" }),
    };
  }

  try {
    const result = await ddb.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: `PROJECT#${projectId}`,
        },
      }),
    );

    if (!result.Item) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    const item = result.Item as ProjectItem;

    if (item.sellerId !== sellerId) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    if (item.status !== "failed") {
      return {
        statusCode: 409,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `Project is not in failed status (current: ${item.status})`,
        }),
      };
    }

    const now = new Date().toISOString();
    const executionName = `${projectId}-${Date.now()}`;

    // Full wipe: clear every agent output + cached tokens + transient flags so
    // the restart starts from scratch. Brief intake fields (companyName,
    // segment, description, brandColor, ...) are preserved.
    await ddb.send(
      new UpdateCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: `PROJECT#${projectId}`,
        },
        UpdateExpression:
          "SET #s = :status, updatedAt = :now REMOVE failureReason, researchOutput, styleOutput, composerOutput, contentOutput, humanizerOutput, assemblerOutput, qaOutput, qaIssues, previewUrl, styleApprovalTaskToken, layoutApprovalTaskToken",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: {
          ":status": "queued",
          ":now": now,
        },
      }),
    );

    await sqs.send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify({
          projectId,
          sellerId,
          companyName: item.companyName,
          segment: item.segment,
          description: item.description,
          brandColor: item.brandColor,
          desiredSections: item.desiredSections,
          brandToneKeywords: item.brandToneKeywords,
          objectives: item.objectives,
          businessHours: item.businessHours,
          address: item.address,
          phone: item.phone,
          email: item.email,
          socialLinks: item.socialLinks,
          executionName,
          pageType: item.pageType ?? null,
        }),
      }),
    );

    console.log(
      JSON.stringify({
        message: "Pipeline restart enqueued",
        projectId,
        executionName,
      }),
    );

    return {
      statusCode: 202,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Pipeline restart enqueued",
        projectId,
        executionName,
      }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to restart pipeline",
        projectId,
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
