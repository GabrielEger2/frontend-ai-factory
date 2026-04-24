import type { APIGatewayProxyHandler } from "aws-lambda";
import * as crypto from "crypto";
import { z } from "zod";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const FeedbackBodySchema = z.object({
  message: z.string().min(1).max(5000),
  clientName: z.string().max(200).optional(),
  clientEmail: z.string().email().max(200).optional(),
  // Honeypot field — if set, we silently drop the submission.
  website: z.string().optional(),
});

/**
 * POST /share/{token}/feedback — PUBLIC feedback submission.
 *
 * Does NOT call requireSellerId. Validates share token (not revoked,
 * not expired) then writes FEEDBACK# item to ProjectsTable.
 *
 * Response 200: { submitted: true }
 * Response 400: invalid body
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

  // Parse body
  let body;
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }
    body = FeedbackBodySchema.parse(JSON.parse(event.body));
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
        error: "Invalid feedback body",
        details: err instanceof Error ? err.message : String(err),
      }),
    };
  }

  // Honeypot — bot-trap field. Acknowledge without writing.
  if (body.website && body.website.length > 0) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submitted: true }),
    };
  }

  try {
    // Validate share token
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
      tokenId?: string;
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

    const nowMs = Date.now();
    const submittedAt = new Date(nowMs).toISOString();
    const feedbackId = `${nowMs}-${crypto.randomUUID()}`;

    await ddb.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          pk: `PROJECT#${share.projectId}`,
          sk: `FEEDBACK#${feedbackId}`,
          message: body.message,
          clientName: body.clientName,
          clientEmail: body.clientEmail,
          submittedAt,
          shareTokenId: share.tokenId ?? token,
        },
      }),
    );

    console.log(
      JSON.stringify({
        message: "Feedback submitted",
        projectId: share.projectId,
        feedbackId,
      }),
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submitted: true }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to submit feedback",
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
