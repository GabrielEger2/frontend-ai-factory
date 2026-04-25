import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as zlib from "zlib";

import type {
  ComposerOutput,
  ProjectItem,
  StyleOutput,
} from "../../shared/types";
import { generateSiteFiles } from "../../assembler/core";
import { buildTarBuffer } from "../../shared/tar-utils";
import {
  deployToVercel,
  getVercelToken,
  pollVercelDeployment,
  type VercelFile,
} from "../../shared/vercel-deploy";
import { requireSellerId } from "../shared/seller-guard";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});

/**
 * POST /projects/{id}/deploy — assemble workingDraft, upload to S3,
 * deploy to Vercel, snapshot as VERSION#<n> item, and promote draft
 * into frozen project outputs.
 *
 * Response 200: { versionNumber, previewUrl, deployedAt }
 * Response 400: no workingDraft / bad state
 * Response 404: project not found or ownership mismatch
 * Response 500: configuration or Vercel/S3/DDB error
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const tableName = process.env.PROJECTS_TABLE_NAME;
  const bucketName = process.env.PIPELINE_BUCKET_NAME;
  const vercelTokenSsmPath = process.env.VERCEL_TOKEN_SSM_PATH;

  if (!tableName || !bucketName || !vercelTokenSsmPath) {
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

    await pollVercelDeployment(vercelToken, deployment.id);

    /* ---- 7. Persist version snapshot + promote draft ---- */
    console.log(
      JSON.stringify({
        stage: "persisting",
        projectId,
        versionNumber: nextVersionNumber,
      }),
    );

    const now = new Date().toISOString();

    // Reconstruct full ComposerOutput for version snapshot. workingDraft stores
    // only the selected ComposerLayout; the version item keeps a full
    // single-layout ComposerOutput so revert can restore cleanly.
    const versionBlueprint: ComposerOutput = {
      layouts: [workingDraft.blueprint],
      selectedLayout: 0,
      source: item.composerOutput?.source ?? "fallback",
      candidateCount: item.composerOutput?.candidateCount,
      avgScore: item.composerOutput?.avgScore ?? null,
    };

    // Merge new palette/typography/density into the frozen styleOutput,
    // preserving prior mood/style arrays and paletteSource.
    const promotedStyleOutput: StyleOutput = {
      palette: workingDraft.palette,
      typography: workingDraft.typography,
      density: workingDraft.density,
      mood: item.styleOutput?.mood ?? [],
      style: item.styleOutput?.style ?? [],
      paletteMode: item.styleOutput?.paletteMode ?? "single",
      paletteModes: item.styleOutput?.paletteModes ?? {
        single: workingDraft.palette,
        dual: workingDraft.palette,
        monochromatic: workingDraft.palette,
      },
      paletteSource: item.styleOutput?.paletteSource,
      paletteSuggestions: item.styleOutput?.paletteSuggestions,
    };

    const versionItem = {
      pk: `PROJECT#${projectId}`,
      sk: versionSk,
      versionNumber: nextVersionNumber,
      createdAt: now,
      deployedAt: now,
      blueprint: versionBlueprint,
      contentSlots: workingDraft.contentSlots,
      palette: workingDraft.palette,
      typography: workingDraft.typography,
      density: workingDraft.density,
      assembledTarGzKey: versionedKey,
      vercelDeploymentId: deployment.id,
    };

    await ddb.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: tableName,
              Item: versionItem,
              ConditionExpression:
                "attribute_not_exists(pk) AND attribute_not_exists(sk)",
            },
          },
          {
            Update: {
              TableName: tableName,
              Key: {
                pk: `PROJECT#${projectId}`,
                sk: `PROJECT#${projectId}`,
              },
              UpdateExpression:
                "SET composerOutput = :co, humanizerOutput = :ho, styleOutput = :so, currentVersionNumber = :v, previewUrl = :url, #st = :status, updatedAt = :now REMOVE workingDraft",
              ExpressionAttributeNames: { "#st": "status" },
              ExpressionAttributeValues: {
                ":co": versionBlueprint,
                ":ho": workingDraft.contentSlots,
                ":so": promotedStyleOutput,
                ":v": nextVersionNumber,
                ":url": previewUrl,
                ":status": "deployed",
                ":now": now,
              },
            },
          },
        ],
      }),
    );

    console.log(
      JSON.stringify({
        message: "Deploy from draft complete",
        projectId,
        versionNumber: nextVersionNumber,
        previewUrl,
        deploymentId: deployment.id,
      }),
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        versionNumber: nextVersionNumber,
        previewUrl,
        deployedAt: now,
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
