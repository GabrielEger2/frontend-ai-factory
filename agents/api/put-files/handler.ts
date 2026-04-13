import type { APIGatewayProxyHandler } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as zlib from "zlib";
import { buildTarBuffer } from "../../shared/tar-utils";

const s3 = new S3Client({});

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
