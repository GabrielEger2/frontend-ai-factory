import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import * as zlib from "zlib";

import type { ProjectItem } from "../../shared/types";
import { generateSiteFiles } from "../../assembler/core";
import { buildTarBuffer } from "../../shared/tar-utils";
import {
  deployToVercel,
  getVercelToken,
  type VercelFile,
} from "../../shared/vercel-deploy";
import { requireSellerId } from "../shared/seller-guard";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});
const lambda = new LambdaClient({});

/**
 * POST /projects/{id}/deploy — fast async kickoff. Assembles workingDraft,
 * uploads to S3, kicks off the Vercel deploy, flips status to "deploying",
 * and asynchronously invokes the deploy-completer Lambda. The completer
 * polls Vercel and writes the terminal status (deployed / deploy_failed).
 *
 * Response 202: { status: "deploying", previewUrl, deploymentId }
 * Response 202: { status: "already_deploying" } when idempotent
 * Response 400: no workingDraft / bad state
 * Response 404: project not found or ownership mismatch
 * Response 500: configuration or Vercel/S3/DDB error
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const tableName = process.env.PROJECTS_TABLE_NAME;
  const bucketName = process.env.PIPELINE_BUCKET_NAME;
  const vercelTokenSsmPath = process.env.VERCEL_TOKEN_SSM_PATH;
  const completerFunctionName = process.env.DEPLOY_COMPLETER_FUNCTION_NAME;

  if (
    !tableName ||
    !bucketName ||
    !vercelTokenSsmPath ||
    !completerFunctionName
  ) {
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
    /* ---- 1. Load project and validate state ---- */
    const getResult = await ddb.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: `PROJECT#${projectId}`,
        },
      }),
    );

    if (!getResult.Item) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    const item = getResult.Item as ProjectItem;

    if (item.sellerId !== sellerId) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    if (item.status === "deploying") {
      return {
        statusCode: 202,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "already_deploying" }),
      };
    }

    const workingDraft = item.workingDraft;
    if (!workingDraft) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Project has no workingDraft to deploy",
        }),
      };
    }

    /* ---- 2. Assemble site files ---- */
    console.log(
      JSON.stringify({
        stage: "assembling",
        projectId,
      }),
    );

    // workingDraft.contentSlots is already HumanizerOutput-shaped
    const files = generateSiteFiles(
      projectId,
      workingDraft.contentSlots,
      workingDraft.palette,
      workingDraft.typography,
    );
    const fileCount = Object.keys(files).length;

    /* ---- 3. Build tar + gzip ---- */
    console.log(
      JSON.stringify({
        stage: "uploading",
        projectId,
        fileCount,
      }),
    );

    const tarBuffer = buildTarBuffer(files);
    const gzBuffer = zlib.gzipSync(tarBuffer);

    /* ---- 4. Compute next version number ---- */
    const nextVersionNumber = (item.currentVersionNumber ?? 0) + 1;
    const versionSk = `VERSION#${String(nextVersionNumber).padStart(4, "0")}`;
    const versionedKey = `projects/${projectId}/versions/${String(
      nextVersionNumber,
    ).padStart(4, "0")}/site.tar.gz`;
    const currentKey = `projects/${projectId}/site.tar.gz`;

    /* ---- 5. S3 writes — versioned + current ---- */
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: versionedKey,
        Body: gzBuffer,
        ContentType: "application/gzip",
      }),
    );

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: currentKey,
        Body: gzBuffer,
        ContentType: "application/gzip",
      }),
    );

    /* ---- 6. Deploy to Vercel ---- */
    console.log(
      JSON.stringify({
        stage: "deploying",
        projectId,
      }),
    );

    const vercelToken = await getVercelToken();

    const vercelFiles: VercelFile[] = Object.entries(files).map(
      ([filePath, content]) => ({
        file: filePath,
        data: Buffer.from(content, "utf-8").toString("base64"),
        encoding: "base64" as const,
      }),
    );

    const deployment = await deployToVercel(
      vercelToken,
      projectId,
      vercelFiles,
    );
    const previewUrl = `https://${deployment.url}`;

    /* ---- 7. Flip status to deploying + fire-and-forget completer ---- */
    const now = new Date().toISOString();

    // Flip status to deploying immediately so dashboard surfaces in-progress state
    await ddb.send(
      new UpdateCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: `PROJECT#${projectId}`,
        },
        UpdateExpression:
          "SET #st = :deploying, vercelDeploymentId = :did, vercelPreviewUrl = :purl, updatedAt = :now",
        ExpressionAttributeNames: { "#st": "status" },
        ExpressionAttributeValues: {
          ":deploying": "deploying",
          ":did": deployment.id,
          ":purl": previewUrl,
          ":now": now,
        },
      }),
    );

    // Fire-and-forget: completer polls Vercel and writes terminal state
    const completerPayload = {
      projectId,
      deploymentId: deployment.id,
      previewUrl,
      nextVersionNumber,
      versionSk,
      versionedKey,
      currentKey,
      workingDraft,
      composerOutput: item.composerOutput ?? null,
      styleOutput: item.styleOutput ?? null,
    };

    await lambda.send(
      new InvokeCommand({
        FunctionName: completerFunctionName,
        InvocationType: "Event",
        Payload: Buffer.from(JSON.stringify(completerPayload)),
      }),
    );

    console.log(
      JSON.stringify({
        message: "Deploy kickoff complete",
        projectId,
        deploymentId: deployment.id,
        previewUrl,
      }),
    );

    return {
      statusCode: 202,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "deploying",
        previewUrl,
        deploymentId: deployment.id,
      }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to deploy workingDraft",
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
