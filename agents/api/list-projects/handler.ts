import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { requireSellerId } from "../shared/seller-guard";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const PAGE_SIZE = 20;

/**
 * GET /projects — queries DynamoDB GSI (sellerId-createdAt-index) for the
 * calling seller's projects and returns summaries with cursor pagination.
 *
 * Headers: X-Seller-Id (required)
 * Query: cursor (optional, base64-encoded LastEvaluatedKey JSON)
 * Response 200: { projects: [...], nextCursor: string | null }
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const tableName = process.env.PROJECTS_TABLE_NAME;
  const indexName = process.env.PROJECTS_SELLER_INDEX_NAME;

  if (!tableName || !indexName) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server configuration error" }),
    };
  }

  const sellerIdOrErr = requireSellerId(event);
  if (typeof sellerIdOrErr !== "string") return sellerIdOrErr;
  const sellerId = sellerIdOrErr;

  // Decode optional cursor. Tampered/malformed cursors must return 400,
  // never 500 — a bad client should not crash the handler.
  const rawCursor = event.queryStringParameters?.cursor;
  let exclusiveStartKey: Record<string, unknown> | undefined;
  if (rawCursor) {
    try {
      exclusiveStartKey = JSON.parse(
        Buffer.from(rawCursor, "base64").toString(),
      );
    } catch {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid cursor" }),
      };
    }
  }

  try {
    const result = await ddb.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: "sellerId = :sellerId",
        ExpressionAttributeValues: { ":sellerId": sellerId },
        ScanIndexForward: false,
        Limit: PAGE_SIZE,
        ...(exclusiveStartKey && { ExclusiveStartKey: exclusiveStartKey }),
      }),
    );

    const projects = (result.Items ?? []).map((item) => ({
      projectId: item.projectId,
      companyName: item.companyName,
      segment: item.segment,
      status: item.status,
      createdAt: item.createdAt,
      sellerId: item.sellerId,
    }));

    const nextCursor = result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString("base64")
      : null;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projects, nextCursor }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to list projects",
        sellerId,
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
