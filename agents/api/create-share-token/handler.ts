import type { APIGatewayProxyHandler } from "aws-lambda";
import * as crypto from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";

import type { ProjectItem } from "../../shared/types";
import { requireSellerId } from "../shared/seller-guard";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const SHARE_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * POST /projects/{id}/share — create a public share token for a project.
 *
 * Writes two records atomically:
 *   - ProjectsTable: pk=PROJECT#<id>, sk=SHARE#<tokenId>  (human-readable ISO expiresAt)
 *   - ShareTokensTable: pk=SHARE#<token>                  (epoch expiresAt for DDB TTL)
 *
 * Response 200: { token, tokenId, expiresAt (ISO string) }
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
  if (!projectId) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing project id path parameter" }),
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

    // Generate token and metadata
    const token = crypto.randomBytes(24).toString("base64url");
    const tokenId = crypto.randomUUID();
    const nowMs = Date.now();
    const createdAt = new Date(nowMs).toISOString();
    const expiresAtEpoch = Math.floor(nowMs / 1000) + SHARE_TTL_SECONDS;
    const expiresAtIso = new Date(expiresAtEpoch * 1000).toISOString();

    await ddb.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: tableName,
              Item: {
                pk: `PROJECT#${projectId}`,
                sk: `SHARE#${tokenId}`,
                tokenId,
                token,
                projectId,
                sellerId,
                createdAt,
                expiresAt: expiresAtIso,
                revoked: false,
              },
              ConditionExpression:
                "attribute_not_exists(pk) AND attribute_not_exists(sk)",
            },
          },
          {
            Put: {
              TableName: shareTokensTableName,
              Item: {
                pk: `SHARE#${token}`,
                token,
                tokenId,
                projectId,
                sellerId,
                createdAt,
                expiresAt: expiresAtEpoch,
                revoked: false,
              },
              ConditionExpression: "attribute_not_exists(pk)",
            },
          },
        ],
      }),
    );

    console.log(
      JSON.stringify({
        message: "Share token created",
        projectId,
        tokenId,
      }),
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, tokenId, expiresAt: expiresAtIso }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to create share token",
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
