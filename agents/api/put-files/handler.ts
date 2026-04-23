import type { APIGatewayProxyHandler } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import * as zlib from "zlib";
import { buildTarBuffer } from "../../shared/tar-utils";
import { requireSellerId } from "../shared/seller-guard";

const s3 = new S3Client({});
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const MAX_BODY_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * PUT /projects/{id}/files — receives a map of file contents,
 * re-archives them as tar.gz, and uploads to S3.
 *
 * Path parameter: id (project ID)
 * Request body: { files: Record<string, string> }
 * Response 200: { message, projectId }
 * Response 400: missing id, malformed body, or payload too large
 * Response 500: server config error or internal error
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const sellerIdOrErr = requireSellerId(event);
  if (typeof sellerIdOrErr !== "string") return sellerIdOrErr;
  const sellerId = sellerIdOrErr;

  const tableName = process.env.PROJECTS_TABLE_NAME;
  const bucketName = process.env.PIPELINE_BUCKET_NAME;

  if (!tableName || !bucketName) {
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
    // Ownership check — MUST run before any S3 write to prevent
    // tenant-crossing writes.
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

    if (item.sellerId !== sellerId) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    const rawBody = event.body || "{}";

    if (rawBody.length > MAX_BODY_SIZE) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Payload too large" }),
      };
    }

    const body = JSON.parse(rawBody);

    if (
      !body.files ||
      typeof body.files !== "object" ||
      Array.isArray(body.files) ||
      Object.keys(body.files).length === 0
    ) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Invalid request body: files must be a non-empty object",
        }),
      };
    }

    const tarBuffer = buildTarBuffer(body.files);
    const gzBuffer = zlib.gzipSync(tarBuffer);

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: `projects/${projectId}/site.tar.gz`,
        Body: gzBuffer,
        ContentType: "application/gzip",
      }),
    );

    console.log(
      JSON.stringify({
        message: "Files saved to S3",
        projectId,
        fileCount: Object.keys(body.files).length,
      }),
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Files saved", projectId }),
    };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid JSON in request body" }),
      };
    }

    console.error(
      JSON.stringify({
        message: "Failed to save files",
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
