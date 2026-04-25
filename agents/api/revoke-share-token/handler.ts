import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import type { ProjectItem } from "../../shared/types";
import { requireSellerId } from "../shared/seller-guard";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

/**
 * DELETE /projects/{id}/share/{tokenId} — revoke a share token.
 *
 * Sets revoked=true on both ProjectsTable (SHARE# item) and
 * ShareTokensTable (SHARE#<token> row) so the public endpoints
 * stop serving content through that link.
 *
 * Response 200: { revoked: true }
 * Response 404: project or share token not found
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const tableName = process.env.PROJECTS_TABLE_NAME;
  const shareTokensTableName = process.env.SHARE_TOKENS_TABLE_NAME;

  if (!tableName || !shareTokensTableName) {
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
  const tokenId = event.pathParameters?.tokenId;
  if (!projectId || !tokenId) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing path parameters" }),
    };
  }

  try {
    // Ownership check
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

    // Fetch the SHARE# record on ProjectsTable to get the raw token string
    const shareResult = await ddb.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: `SHARE#${tokenId}`,
        },
      }),
    );

    if (!shareResult.Item) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Share token not found" }),
      };
    }

    const token = shareResult.Item.token as string | undefined;
    if (!token) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Share record is corrupted: missing token",
        }),
      };
    }

    // Mark revoked on ProjectsTable SHARE# item
    await ddb.send(
      new UpdateCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: `SHARE#${tokenId}`,
        },
        UpdateExpression: "SET revoked = :true",
        ExpressionAttributeValues: { ":true": true },
      }),
    );

    // Mark revoked on ShareTokensTable too so public endpoints reject it
    await ddb.send(
      new UpdateCommand({
        TableName: shareTokensTableName,
        Key: { pk: `SHARE#${token}` },
        UpdateExpression: "SET revoked = :true",
        ExpressionAttributeValues: { ":true": true },
      }),
    );

    console.log(
      JSON.stringify({
        message: "Share token revoked",
        projectId,
        tokenId,
      }),
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revoked: true }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to revoke share token",
        projectId,
        tokenId,
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
