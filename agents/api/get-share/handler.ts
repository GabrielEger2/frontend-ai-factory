import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import type { ProjectItem } from "../../shared/types";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

/**
 * GET /share/{token} — PUBLIC read of a shared project's workingDraft.
 *
 * Does NOT call requireSellerId. Token validation:
 *   - ShareTokensTable lookup by pk=SHARE#<token>
 *   - must not be revoked
 *   - must not be expired (expiresAt epoch > now)
 *
 * Response 200: { workingDraft, companyName, projectId }
 * Response 404: token unknown, revoked, or expired
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

  const token = event.pathParameters?.token;
  if (!token) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing token path parameter" }),
    };
  }

  try {
    const shareResult = await ddb.send(
      new GetCommand({
        TableName: shareTokensTableName,
        Key: { pk: `SHARE#${token}` },
      }),
    );

    if (!shareResult.Item) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Share link not found or expired" }),
      };
    }

    const share = shareResult.Item as {
      projectId: string;
      revoked: boolean;
      expiresAt: number;
    };

    if (share.revoked === true) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Share link not found or expired" }),
      };
    }

    const nowEpoch = Math.floor(Date.now() / 1000);
    if (typeof share.expiresAt !== "number" || share.expiresAt <= nowEpoch) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Share link not found or expired" }),
      };
    }

    // Load project
    const projectResult = await ddb.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${share.projectId}`,
          sk: `PROJECT#${share.projectId}`,
        },
      }),
    );

    if (!projectResult.Item) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Share link not found or expired" }),
      };
    }

    const project = projectResult.Item as ProjectItem;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workingDraft: project.workingDraft ?? null,
        companyName: project.companyName,
        projectId: project.projectId,
      }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to fetch share",
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
