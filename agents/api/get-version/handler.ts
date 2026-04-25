import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import type { ProjectItem } from "../../shared/types";
import { requireSellerId } from "../shared/seller-guard";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

/**
 * GET /projects/{id}/versions/{v} — fetch a single VERSION# snapshot.
 *
 * Response 200: full ProjectVersion item
 * Response 400: missing/invalid path params
 * Response 404: project or version not found
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
  const vParam = event.pathParameters?.v;
  if (!projectId || !vParam) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing path parameters" }),
    };
  }

  const versionNumber = parseInt(vParam, 10);
  if (!Number.isFinite(versionNumber) || versionNumber <= 0) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid version number" }),
    };
  }

  try {
    // Ownership check on project item
    const projectResult = await ddb.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: `PROJECT#${projectId}`,
        },
      }),
    );

    if (!projectResult.Item) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    const project = projectResult.Item as ProjectItem;
    if (project.sellerId !== sellerId) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    const versionSk = `VERSION#${String(versionNumber).padStart(4, "0")}`;

    const versionResult = await ddb.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: versionSk,
        },
      }),
    );

    if (!versionResult.Item) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Version not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(versionResult.Item),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to get version",
        projectId,
        versionNumber,
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
