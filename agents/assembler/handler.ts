import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AssemblerInputSchema } from "./types";
import type { AssemblerResult } from "./types";
import type { Palette, Typography } from "../shared/types";
import { buildTarBuffer } from "../shared/tar-utils";
import { generateSiteFiles } from "./core";
import * as zlib from "zlib";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});

/* ------------------------------------------------------------------ */
/*  Fallback Palette / Typography                                      */
/* ------------------------------------------------------------------ */

/**
 * Default palette used when styleOutput is missing — preserves the
 * original hardcoded look of pre-parameterized generateGlobalsCss.
 * Values are sRGB hex approximations of the legacy OKLCH defaults.
 */
const DEFAULT_PALETTE: Palette = {
  primary: "#3b5bdb",
  secondary: "#4dabf7",
  accent: "#7048e8",
  neutral: "#374151",
  primaryLight: "#f5f5f4",
  primaryDark: "#d4d4d3",
};

const DEFAULT_TYPOGRAPHY: Typography = {
  heading: "ui-serif",
  body: "ui-sans-serif",
};

/* ------------------------------------------------------------------ */
/*  Handler                                                            */
/* ------------------------------------------------------------------ */

/**
 * Assembler Lambda handler.
 *
 * DETERMINISTIC — zero LLM calls. Takes content output from the
 * Content Agent, generates Next.js source files as strings, creates
 * a tar.gz archive, and uploads to S3.
 *
 * Invoked by Step Functions.
 */
export const handler = async (event: unknown): Promise<AssemblerResult> => {
  const tableName = process.env.PROJECTS_TABLE_NAME;
  if (!tableName) {
    throw new Error("PROJECTS_TABLE_NAME environment variable is not set");
  }

  const bucketName = process.env.PIPELINE_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("PIPELINE_BUCKET_NAME environment variable is not set");
  }

  /* ---- Validate input ---- */
  const input = AssemblerInputSchema.parse(event);

  console.log(
    JSON.stringify({
      message: "Assembler started",
      projectId: input.projectId,
      componentCount: input.humanizerOutput.components.length,
    }),
  );

  /* ---- Generate files ---- */
  const palette = input.styleOutput?.palette ?? DEFAULT_PALETTE;
  const typography = input.styleOutput?.typography ?? DEFAULT_TYPOGRAPHY;

  const files = generateSiteFiles(
    input.projectId,
    input.humanizerOutput,
    palette,
    typography,
  );

  /* ---- Create tar.gz archive ---- */
  const tarBuffer = buildTarBuffer(files);
  const gzBuffer = zlib.gzipSync(tarBuffer);

  /* ---- Upload to S3 ---- */
  const s3Key = `projects/${input.projectId}/site.tar.gz`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: gzBuffer,
      ContentType: "application/gzip",
    }),
  );

  console.log(
    JSON.stringify({
      message: "Site archive uploaded to S3",
      projectId: input.projectId,
      s3Key,
      s3Bucket: bucketName,
      archiveSize: gzBuffer.length,
      fileCount: Object.keys(files).length,
    }),
  );

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
        "SET assemblerOutput = :ao, #st = :status, updatedAt = :now",
      ExpressionAttributeNames: { "#st": "status" },
      ExpressionAttributeValues: {
        ":ao": { s3Key, s3Bucket: bucketName },
        ":status": "qa",
        ":now": now,
      },
    }),
  );

  /* ---- Return pipeline state ---- */
  return {
    projectId: input.projectId,
    status: "qa",
    companyName: input.companyName,
    segment: input.segment,
    description: input.description,
    sellerId: input.sellerId,
    humanizerOutput: input.humanizerOutput,
    assemblerOutput: { s3Key, s3Bucket: bucketName },
  };
};
