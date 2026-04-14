import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

/**
 * GET /projects/{id} — reads project status and preview URL from DynamoDB.
 *
 * Path parameter: id (project ID)
 * Response 200: { projectId, status, previewUrl, createdAt, updatedAt, researchOutput, styleOutput, contentOutput, humanizerOutput, assemblerOutput, qaOutput, qaIssues }
 * Response 400: missing id
 * Response 404: project not found
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

    const item = result.Item;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: item.projectId,
        status: item.status,
        previewUrl: item.previewUrl ?? null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        researchOutput: item.researchOutput ?? null,
        styleOutput: item.styleOutput ?? null,
        contentOutput: item.contentOutput ?? null,
        humanizerOutput: item.humanizerOutput ?? null,
        assemblerOutput: item.assemblerOutput ?? null,
        qaOutput: item.qaOutput ?? null,
        qaIssues: item.qaIssues ?? null,
      }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to get project",
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
