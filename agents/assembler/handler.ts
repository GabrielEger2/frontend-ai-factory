import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AssemblerInputSchema } from "./types";
import type { AssemblerInput, AssemblerResult } from "./types";
import type {
  HumanizerOutput,
  ImageOutput,
  Palette,
  Typography,
  WorkingDraft,
} from "../shared/types";
import { buildTarBuffer } from "../shared/tar-utils";
import { generateSiteFiles } from "./core";
import { COMPONENT_METADATA } from "./component-sources.generated";
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

/**
 * Default styleKit used when styleOutput.styleKit is missing — matches the
 * fallback applied by the Style Agent post-parse step. Keeps assembler
 * output stable for legacy projects whose styleOutput predates styleKit.
 */
const DEFAULT_STYLE_KIT = {
  card: "base",
  ctaVariant: "default",
  ctaColorScheme: "primary",
  background: "none",
  textDecoration: "none",
} as const;

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
 * which component slots, per component ID, and how each value is transformed
 * before being written to the slot. Used by `applyBuyerFieldOverrides`.
 *
 * SYNC POINT: dashboard/src/lib/gap-detection.ts mirrors this map for the
 * content-gap warning rendered on the Layout Approval panel. Update both
 * files together when adding/removing components or slots.
 */
type SlotTransform = "tel" | "mailto" | "verbatim" | "social";

interface SlotMapping {
  field: keyof AssemblerInput;
  transform: SlotTransform;
}

const BUYER_FIELD_TO_SLOT: Record<string, Record<string, SlotMapping>> = {
  "footer-reveal-01": {
    phoneUrl: { field: "phone", transform: "tel" },
    emailUrl: { field: "email", transform: "mailto" },
    addressText: { field: "address", transform: "verbatim" },
    hoursText: { field: "businessHours", transform: "verbatim" },
    socialLinks: { field: "socialLinks", transform: "social" },
  },
  "contact-locations-map-01": {
    address: { field: "address", transform: "verbatim" },
    phone: { field: "phone", transform: "verbatim" },
    email: { field: "email", transform: "verbatim" },
    hours: { field: "businessHours", transform: "verbatim" },
  },
};

/**
 * Returns a HumanizerOutput with buyer-supplied contact info deterministically
 * merged into footer/contact component slots.
 *
 * Per-slot `transform` controls how the raw buyer value is reshaped:
 * - `tel` — wraps a string as `tel:<value>` (used for URL-typed slots)
 * - `mailto` — wraps a string as `mailto:<value>` (used for URL-typed slots)
 * - `verbatim` — passes the raw value through unchanged (plain-text slots)
 * - `social` — reshapes `{platform,url}[]` (PipelineState shape) to
 *   `{network,url}[]` (footer-reveal-01 slot shape).
 *
 * Missing buyer fields are skipped — the existing humanizer-supplied or
 * component-default value remains untouched (component-default fallback is
 * already handled downstream by `sanitizeSlotValue`).
 */
function applyBuyerFieldOverrides(
  humanizerOutput: HumanizerOutput,
  input: AssemblerInput,
): HumanizerOutput {
  return {
    components: humanizerOutput.components.map((component) => {
      const componentMapping = BUYER_FIELD_TO_SLOT[component.componentId];
      if (!componentMapping) return component;

      const overrides: Record<string, unknown> = {};
      for (const [slotName, mapping] of Object.entries(componentMapping)) {
        const rawValue = input[mapping.field];
        if (rawValue === undefined || rawValue === null) continue;

        let transformed: unknown;
        switch (mapping.transform) {
          case "tel":
            transformed =
              typeof rawValue === "string" ? `tel:${rawValue}` : undefined;
            break;
          case "mailto":
            transformed =
              typeof rawValue === "string" ? `mailto:${rawValue}` : undefined;
            break;
          case "social":
            transformed = Array.isArray(rawValue)
              ? (rawValue as { platform: string; url: string }[]).map((s) => ({
                  network: s.platform,
                  url: s.url,
                }))
              : undefined;
            break;
          case "verbatim":
          default:
            transformed = rawValue;
        }

        if (transformed !== undefined) {
          overrides[slotName] = transformed;
        }
      }

      if (Object.keys(overrides).length === 0) return component;
      return { ...component, slots: { ...component.slots, ...overrides } };
    }),
  };
}

/* ------------------------------------------------------------------ */
/*  Safety-Net Slot Defaults                                           */
/* ------------------------------------------------------------------ */

/**
 * Required slots that nothing in the upstream pipeline populates (image
 * URLs, anchor URLs, logo, etc.) would otherwise leave the assembled site
 * with `undefined` props and trip QA. We deterministically fill those
 * with type-aware placeholders here so the seller always gets a
 * demo-able site; missing values surface to the seller via qaWarnings
 * (downgraded from blocking) and the dashboard's gap-detection panel.
 *
 * Matches the project's deterministic-vs-AI rule: this pass is pure
 * code, runs in the assembler (already deterministic), and never
 * invents text content — only structural placeholders.
 */
interface SlotMetaShape {
  name: string;
  type?: string;
  optional?: boolean;
  enum?: unknown[];
}

const PLACEHOLDER_IMAGE_URL = "https://placehold.co/1200x800?text=Imagem";
const PLACEHOLDER_TEXT = "Em breve";
const PLACEHOLDER_URL = "#";

function defaultForSlot(slotDef: SlotMetaShape): unknown {
  if (slotDef.enum && slotDef.enum.length > 0) {
    return slotDef.enum[0];
  }
  switch (slotDef.type) {
    case "url":
      return PLACEHOLDER_URL;
    case "image":
      return PLACEHOLDER_IMAGE_URL;
    case "video":
      return "";
    case "list":
      return [];
    case "number":
      return 0;
    case "boolean":
      return false;
    case "object":
      return {};
    case "text":
    default:
      return PLACEHOLDER_TEXT;
  }
}

function isMissing(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  return false;
}

/**
 * Decoded image-slot key: either a flat slot name or a nested-list path.
 *
 * Nested keys produced by the Image Resolver have the shape
 * `${listName}[${index}].${fieldName}` — e.g. `entries[0].image` for a
 * gallery-style component whose images live inside a list itemSchema.
 */
const NESTED_KEY_PATTERN = /^([^[]+)\[(\d+)\]\.(.+)$/;

interface NestedSlotKey {
  listName: string;
  index: number;
  field: string;
}

function parseNestedKey(key: string): NestedSlotKey | null {
  const match = NESTED_KEY_PATTERN.exec(key);
  if (!match) return null;
  return {
    listName: match[1],
    index: parseInt(match[2], 10),
    field: match[3],
  };
}

/**
 * Merge imageOutput URLs into humanizerOutput slots.
 * imageOutput takes precedence over any existing value for image/video slots.
 * Called BEFORE applyBuyerFieldOverrides and applySafeDefaults so real URLs
 * from the Image Resolver are not overwritten by placeholder fallbacks.
 *
 * Supports two key shapes:
 *   - flat:   "heroImage"           → component.slots.heroImage = url
 *   - nested: "entries[0].image"    → component.slots.entries[0].image = url
 *
 * Alt-text pairing: for flat `${name}` writes `${name}Alt` if empty;
 * for nested `${list}[${i}].${field}` writes `${list}[${i}].${field}Alt`
 * if empty. The Pexels alt is only written when the existing alt is falsy
 * (null / undefined / empty string).
 */
export function mergeImageOutput(
  humanizerOutput: HumanizerOutput,
  imageOutput: ImageOutput | undefined,
): HumanizerOutput {
  if (!imageOutput) return humanizerOutput;

  const imageMap = new Map(
    imageOutput.components.map((c) => [c.componentId, c.imageSlots]),
  );

  return {
    components: humanizerOutput.components.map((component) => {
      const imageSlots = imageMap.get(component.componentId);
      if (!imageSlots || Object.keys(imageSlots).length === 0) return component;

      const flatOverrides: Record<string, unknown> = {};
      // listName -> index -> partial item override
      const listPatches = new Map<
        string,
        Map<number, Record<string, unknown>>
      >();

      for (const [key, imageSlot] of Object.entries(imageSlots)) {
        const nested = parseNestedKey(key);

        if (nested) {
          const { listName, index, field } = nested;
          if (!listPatches.has(listName)) {
            listPatches.set(listName, new Map());
          }
          const indexMap = listPatches.get(listName)!;
          if (!indexMap.has(index)) indexMap.set(index, {});
          const patch = indexMap.get(index)!;

          patch[field] = imageSlot.url;

          // Alt pairing — peek at the existing item to honor pre-written alts.
          const existingList = component.slots[listName];
          const existingItem = Array.isArray(existingList)
            ? existingList[index]
            : undefined;
          const existingAlt =
            existingItem && typeof existingItem === "object"
              ? (existingItem as Record<string, unknown>)[`${field}Alt`]
              : undefined;
          if (imageSlot.alt && !existingAlt) {
            patch[`${field}Alt`] = imageSlot.alt;
          }
        } else {
          flatOverrides[key] = imageSlot.url;
          const altSlotName = `${key}Alt`;
          if (imageSlot.alt && !component.slots[altSlotName]) {
            flatOverrides[altSlotName] = imageSlot.alt;
          }
        }
      }

      // Apply list patches: rebuild each affected list with patched items.
      // Items not referenced in the patch map pass through unchanged.
      for (const [listName, indexMap] of listPatches) {
        const original = component.slots[listName];
        if (!Array.isArray(original)) continue;
        const newList = original.map((item, idx) => {
          const patch = indexMap.get(idx);
          if (!patch) return item;
          if (!item || typeof item !== "object") return item;
          return { ...(item as Record<string, unknown>), ...patch };
        });
        flatOverrides[listName] = newList;
      }

      return {
        ...component,
        slots: { ...component.slots, ...flatOverrides },
      };
    }),
  };
}

function applySafeDefaults(humanizerOutput: HumanizerOutput): HumanizerOutput {
  return {
    components: humanizerOutput.components.map((component) => {
      const meta = COMPONENT_METADATA[component.componentId];
      if (!meta) return component;

      const slotDefs = meta.slots as SlotMetaShape[];
      const overrides: Record<string, unknown> = {};

      for (const slotDef of slotDefs) {
        if (slotDef.optional === true) continue;
        const current = component.slots[slotDef.name];
        if (isMissing(current)) {
          overrides[slotDef.name] = defaultForSlot(slotDef);
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
  const styleKit = input.styleOutput?.styleKit ?? DEFAULT_STYLE_KIT;

  // Deterministic buyer-field → slot fill (footer/contact contact info).
  // This happens AFTER Humanizer, so it overwrites any LLM-generated
  // placeholder phone/email/address with the seller-supplied real values.
  // Then a final safety-net pass fills any remaining required slots
  // (image URLs, anchor URLs, etc.) with placeholders so the site
  // always renders.
  const humanizerOutput = applySafeDefaults(
    applyBuyerFieldOverrides(
      mergeImageOutput(input.humanizerOutput, input.imageOutput),
      input,
    ),
  );

  const files = generateSiteFiles(
    input.projectId,
    humanizerOutput,
    palette,
    typography,
    styleKit,
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
    ...input,
    status: "qa",
    humanizerOutput,
    assemblerOutput: { s3Key, s3Bucket: bucketName },
  };
};
