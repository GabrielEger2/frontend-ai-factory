import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

/**
 * GET /projects — scans DynamoDB for all projects and returns summaries.
 *
 * Response 200: { projects: [{ projectId, companyName, segment, status, createdAt }] }
 */
export const handler: APIGatewayProxyHandler = async () => {
  const tableName = process.env.PROJECTS_TABLE_NAME;

  if (!tableName) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server configuration error" }),
    };
  }

  try {
    const result = await ddb.send(
      new ScanCommand({
        TableName: tableName,
      }),
    );

    const projects = (result.Items ?? []).map((item) => ({
      projectId: item.projectId,
      companyName: item.companyName,
      segment: item.segment,
      status: item.status,
      createdAt: item.createdAt,
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projects }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to list projects",
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
