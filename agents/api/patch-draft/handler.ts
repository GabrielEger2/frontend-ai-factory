import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import type { ProjectItem } from "../../shared/types";
import { WorkingDraftSchema } from "../../shared/types";
import { requireSellerId } from "../shared/seller-guard";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

/**
 * PATCH /projects/{id}/draft — patch workingDraft on the project item.
 *
 * Body: { workingDraft: WorkingDraft }
 * Response 200: { updated: true }
 * Response 400: missing body or invalid workingDraft
 * Response 404: project not found (also used for ownership mismatch)
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const tableName = process.env.PROJECTS_TABLE_NAME;

  if (!tableName) {
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

  // Parse and validate workingDraft from request body
  let workingDraft;
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    const body = JSON.parse(event.body);
    workingDraft = WorkingDraftSchema.parse(body.workingDraft);
  } catch (err) {
    if (err instanceof SyntaxError) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid JSON in request body" }),
      };
    }
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Invalid workingDraft",
        details: err instanceof Error ? err.message : String(err),
      }),
    };
  }

  try {
    // Ownership check
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

    // Stamp updatedAt on the draft itself plus the project updatedAt field
    const now = new Date().toISOString();
    const draftToWrite = { ...workingDraft, updatedAt: now };

    await ddb.send(
      new UpdateCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: `PROJECT#${projectId}`,
        },
        UpdateExpression: "SET workingDraft = :wd, updatedAt = :now",
        ExpressionAttributeValues: {
          ":wd": draftToWrite,
          ":now": now,
        },
      }),
    );

    console.log(
      JSON.stringify({
        message: "workingDraft patched",
        projectId,
        sellerId,
      }),
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updated: true }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to patch workingDraft",
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
