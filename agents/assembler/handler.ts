import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AssemblerInputSchema } from "./types";
import type { AssemblerInput, AssemblerResult } from "./types";
import type {
  HumanizerOutput,
  Palette,
  Typography,
  WorkingDraft,
} from "../shared/types";
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
/*  Deterministic Buyer-Field → Slot Fill                              */
/* ------------------------------------------------------------------ */

/**
 * IMMUTABLE RULE: Buyer-supplied contact data NEVER flows through the
 * Content Agent or Humanizer Agent. It is applied here, deterministically,
 * directly onto component slots. The Assembler is the only place buyer
 * contact data touches the generated site — preserving exact strings,
 * URLs, and formatting without any LLM rewriting.
 *
 * This map enumerates which buyer-supplied PipelineState fields target
 * which component slots, per component ID. Used by `applyBuyerFieldOverrides`.
 */
const BUYER_FIELD_TO_SLOT: Record<
  string,
  Partial<{
    phoneUrl: "phone";
    emailUrl: "email";
    addressText: "address";
    hoursText: "businessHours";
    socialLinks: "socialLinks";
  }>
> = {
  "footer-reveal-01": {
    phoneUrl: "phone",
    emailUrl: "email",
    addressText: "address",
    hoursText: "businessHours",
    socialLinks: "socialLinks",
  },
  "contact-form-01": {
    phoneUrl: "phone",
    emailUrl: "email",
    addressText: "address",
    hoursText: "businessHours",
  },
};

/**
 * Returns a HumanizerOutput with buyer-supplied contact info deterministically
 * merged into footer/contact component slots.
 *
 * - `phone` becomes `tel:${phone}` on the matching `phoneUrl` slot
 * - `email` becomes `mailto:${email}` on the matching `emailUrl` slot
 * - `address`, `businessHours` are passed through verbatim
 * - `socialLinks` is reshaped from `{platform,url}[]` (PipelineState shape)
 *   to `{network,url}[]` (footer-reveal-01 slot shape).
 *
 * Missing buyer fields are skipped — the existing humanizer-supplied or
 * component-default value remains untouched (component-default fallback is
 * already handled downstream by `sanitizeSlotValue`).
 */
function applyBuyerFieldOverrides(
  humanizerOutput: HumanizerOutput,
  input: AssemblerInput,
): HumanizerOutput {
  const sources: Record<string, unknown> = {
    phone: input.phone ? `tel:${input.phone}` : undefined,
    email: input.email ? `mailto:${input.email}` : undefined,
    address: input.address,
    businessHours: input.businessHours,
    socialLinks: input.socialLinks?.map((s) => ({
      network: s.platform,
      url: s.url,
    })),
  };

  return {
    components: humanizerOutput.components.map((component) => {
      const mapping = BUYER_FIELD_TO_SLOT[component.componentId];
      if (!mapping) return component;

      const overrides: Record<string, unknown> = {};
      for (const [slotName, fieldName] of Object.entries(mapping)) {
        if (!fieldName) continue;
        const value = sources[fieldName];
        if (value !== undefined) {
          overrides[slotName] = value;
        }
      }

      if (Object.keys(overrides).length === 0) return component;
      return { ...component, slots: { ...component.slots, ...overrides } };
    }),
  };
}

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

  // Deterministic buyer-field → slot fill (footer/contact contact info).
  // This happens AFTER Humanizer, so it overwrites any LLM-generated
  // placeholder phone/email/address with the seller-supplied real values.
  const humanizerOutput = applyBuyerFieldOverrides(
    input.humanizerOutput,
    input,
  );

  const files = generateSiteFiles(
    input.projectId,
    humanizerOutput,
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

  /* ---- Build workingDraft from frozen pipeline outputs ---- */
  // The assembler is the single source of the first workingDraft. Populating
  // it here is what lets the pipeline terminate at "ready_for_review" after QA
  // and hand control to the seller's visual editor / Deploy button.
  if (!input.composerOutput) {
    throw new Error(
      `composerOutput missing for project ${input.projectId} — pipeline state is broken`,
    );
  }

  const now = new Date().toISOString();

  const workingDraft: WorkingDraft = {
    blueprint:
      input.composerOutput.layouts[input.composerOutput.selectedLayout],
    contentSlots: humanizerOutput,
    palette,
    typography,
    density: input.styleOutput?.density ?? "medium",
    updatedAt: now,
  };

  /* ---- Update DynamoDB ---- */
  await ddb.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        pk: `PROJECT#${input.projectId}`,
        sk: `PROJECT#${input.projectId}`,
      },
      UpdateExpression:
        "SET assemblerOutput = :ao, workingDraft = :wd, #st = :status, updatedAt = :now",
      ExpressionAttributeNames: { "#st": "status" },
      ExpressionAttributeValues: {
        ":ao": { s3Key, s3Bucket: bucketName },
        ":wd": workingDraft,
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
    humanizerOutput,
    assemblerOutput: { s3Key, s3Bucket: bucketName },
  };
};
