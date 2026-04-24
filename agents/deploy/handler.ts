import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import * as zlib from "zlib";
import { DeployInputSchema } from "./types";
import type { DeployResult } from "./types";
import {
  deployToVercel,
  extractTar,
  getVercelToken,
  pollVercelDeployment,
  type VercelFile,
} from "../shared/vercel-deploy";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});

/* ------------------------------------------------------------------ */
/*  Handler                                                            */
/* ------------------------------------------------------------------ */

/**
 * Deploy Lambda handler.
 *
 * Fetches the site archive from S3, decompresses it, and deploys
 * the files to Vercel via their Deployments API. Updates DynamoDB
 * with the preview URL and status "deployed".
 *
 * Invoked by Step Functions.
 */
export const handler = async (event: unknown): Promise<DeployResult> => {
  const tableName = process.env.PROJECTS_TABLE_NAME;
  if (!tableName) {
    throw new Error("PROJECTS_TABLE_NAME environment variable is not set");
  }

  /* ---- Validate input ---- */
  const input = DeployInputSchema.parse(event);

  console.log(
    JSON.stringify({
      message: "Deploy started",
      projectId: input.projectId,
      s3Key: input.assemblerOutput.s3Key,
      s3Bucket: input.assemblerOutput.s3Bucket,
    }),
  );

  /* ---- Fetch Vercel token from SSM ---- */
  const vercelToken = await getVercelToken();

  /* ---- Download archive from S3 ---- */
  const s3Response = await s3.send(
    new GetObjectCommand({
      Bucket: input.assemblerOutput.s3Bucket,
      Key: input.assemblerOutput.s3Key,
    }),
  );

  if (!s3Response.Body) {
    throw new Error(`S3 object ${input.assemblerOutput.s3Key} has no body`);
  }

  const gzBuffer = Buffer.from(await s3Response.Body.transformToByteArray());

  /* ---- Decompress tar.gz ---- */
  const tarBuffer = zlib.gunzipSync(gzBuffer);
  const entries = extractTar(tarBuffer);

  console.log(
    JSON.stringify({
      message: "Archive decompressed",
      projectId: input.projectId,
      fileCount: entries.length,
      archiveSize: gzBuffer.length,
    }),
  );

  /* ---- Build Vercel file array ---- */
  const vercelFiles: VercelFile[] = entries.map((entry) => ({
    file: entry.path,
    data: entry.content.toString("base64"),
    encoding: "base64" as const,
  }));

  /* ---- Deploy to Vercel ---- */
  const deployment = await deployToVercel(
    vercelToken,
    input.projectId,
    vercelFiles,
  );

  const previewUrl = `https://${deployment.url}`;

  console.log(
    JSON.stringify({
      message: "Deployed to Vercel",
      projectId: input.projectId,
      previewUrl,
      deploymentId: deployment.id,
      readyState: deployment.readyState,
    }),
  );

  /* ---- Poll Vercel for readiness ---- */
  console.log(
    JSON.stringify({
      message: "Polling Vercel for readiness",
      deploymentId: deployment.id,
    }),
  );
  await pollVercelDeployment(vercelToken, deployment.id);

  /* ---- Update DynamoDB ---- */
  const now = new Date().toISOString();

  await ddb.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        pk: `PROJECT#${input.projectId}`,
        sk: `PROJECT#${input.projectId}`,
      },
      UpdateExpression:
        "SET previewUrl = :url, #st = :status, updatedAt = :now",
      ExpressionAttributeNames: { "#st": "status" },
      ExpressionAttributeValues: {
        ":url": previewUrl,
        ":status": "deployed",
        ":now": now,
      },
    }),
  );

  /* ---- Return pipeline state ---- */
  return {
    projectId: input.projectId,
    status: "deployed",
    companyName: input.companyName,
    segment: input.segment,
    description: input.description,
    sellerId: input.sellerId,
    contentOutput: input.contentOutput,
    assemblerOutput: input.assemblerOutput,
    previewUrl,
  };
};
