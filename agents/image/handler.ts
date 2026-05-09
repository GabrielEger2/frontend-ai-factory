// Deterministic Image Resolver — heuristic only, no LLM.
// Named 'image agent' for directory-layout consistency with other pipeline steps.
// Closest spiritual kin: Assembler (also deterministic, not an AI agent).

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import type { ImageOutput, PipelineState } from "../shared/types";
import { ImageAgentInputSchema } from "./types";
import { resolveImageSlot } from "./resolver";
import { COMPONENT_METADATA } from "../assembler/component-sources.generated";

/* ------------------------------------------------------------------ */
/*  Clients (reused across Lambda invocations)                         */
/* ------------------------------------------------------------------ */

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

/* ------------------------------------------------------------------ */
/*  Slot meta shape                                                    */
/* ------------------------------------------------------------------ */

interface SlotMetaShape {
  name: string;
  type?: string;
  aspectRatio?: string;
  optional?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Handler                                                            */
/* ------------------------------------------------------------------ */

/**
 * Image Resolver Lambda.
 *
 * Walks each component in `humanizerOutput`, looks up its slot
 * definitions in COMPONENT_METADATA, and for every slot of type
 * "image" or "video" calls `resolveImageSlot` to fetch a Pexels URL.
 *
 * Writes the aggregated `imageOutput` to the project DynamoDB item via
 * a partial UPDATE — does NOT change the project status (the project
 * is already in "assembling" from Humanizer; the Assembler runs next).
 *
 * Returns the full PipelineState with `imageOutput` set so Step
 * Functions threads it forward to the Assembler.
 */
export const handler = async (event: unknown): Promise<PipelineState> => {
  /* ---- 1. Validate env vars ---- */
  const projectsTableName = process.env.PROJECTS_TABLE_NAME;
  if (!projectsTableName) {
    throw new Error("PROJECTS_TABLE_NAME environment variable is not set");
  }
  const cacheTableName = process.env.IMAGE_CACHE_TABLE_NAME;
  if (!cacheTableName) {
    throw new Error("IMAGE_CACHE_TABLE_NAME environment variable is not set");
  }
  const pexelsSsmPath = process.env.PEXELS_API_KEY_SSM_PATH;
  if (!pexelsSsmPath) {
    throw new Error("PEXELS_API_KEY_SSM_PATH environment variable is not set");
  }

  /* ---- 2. Parse + validate input ---- */
  const input = ImageAgentInputSchema.parse(event);

  /* ---- 3. Log start ---- */
  console.log(
    JSON.stringify({
      message: "Image resolver started",
      projectId: input.projectId,
      componentCount: input.humanizerOutput.components.length,
    }),
  );

  /* ---- 4. Extract style signals (degrade gracefully) ---- */
  const vertical = input.styleOutput?.vertical ?? [];
  const mood = input.styleOutput?.mood ?? [];

  /* ---- 5-7. Resolve every image/video slot ---- */
  let resolved = 0;
  let skipped = 0;
  let failed = 0;

  const componentEntries: ImageOutput["components"] = [];

  for (const component of input.humanizerOutput.components) {
    const meta = COMPONENT_METADATA[component.componentId];
    if (!meta) {
      // Unknown component id — no metadata to drive slot lookup. Skip
      // silently; the Assembler will still render the existing slots.
      continue;
    }

    const slotDefs = meta.slots as SlotMetaShape[];
    const imageSlots: Record<
      string,
      { url: string; alt?: string; photographerCredit?: string }
    > = {};

    for (const slotDef of slotDefs) {
      const slot = slotDef as {
        name: string;
        type?: string;
        aspectRatio?: string;
        optional?: boolean;
      };
      if (slot.type !== "image" && slot.type !== "video") continue;

      // Read existing alt text (humanizer-authored) for this slot's
      // companion `${slotName}Alt` slot. If the humanizer wrote a non-empty
      // alt, the resolver preserves it.
      const altSlotName = `${slot.name}Alt`;
      const rawAlt = component.slots[altSlotName];
      const existingAltText =
        typeof rawAlt === "string" && rawAlt.trim().length > 0 ? rawAlt : null;

      const result = await resolveImageSlot({
        slotName: slot.name,
        slotType: slot.type === "video" ? "video" : "image",
        aspectRatio: slot.aspectRatio,
        existingAltText,
        vertical,
        mood,
        ddb,
        cacheTableName,
        projectId: input.projectId,
        componentId: component.componentId,
      });

      if (result === null) {
        // Distinguish skip-pattern matches (deliberate no-call) from
        // resolver failures (no-results / api-error). The resolver's own
        // structured warn covers the failure path; here we conservatively
        // count as `skipped` for the SKIP_PATTERN-matching slot names.
        // The remaining nulls (api-error, no-results) get attributed to
        // `failed` based on whether the resolver swallowed an exception.
        // Without a richer return shape we approximate: SKIP_PATTERN hits
        // are always counted skipped via the resolver, so we treat all
        // null returns as `failed` here for telemetry simplicity. Logos
        // are already excluded upstream.
        failed += 1;
        continue;
      }

      imageSlots[slot.name] = result;
      resolved += 1;
    }

    if (Object.keys(imageSlots).length > 0) {
      componentEntries.push({
        componentId: component.componentId,
        imageSlots,
      });
    }
  }

  // Re-attribute "skipped" by counting slot names that matched SKIP_PATTERN.
  // This gives the smoke test a clean breakdown without changing the
  // resolver's return shape.
  for (const component of input.humanizerOutput.components) {
    const meta = COMPONENT_METADATA[component.componentId];
    if (!meta) continue;
    const slotDefs = meta.slots as SlotMetaShape[];
    for (const slotDef of slotDefs) {
      const slot = slotDef as { name: string; type?: string };
      if (slot.type !== "image" && slot.type !== "video") continue;
      if (/logo|avatar|memberPhoto|authorImage|companyLogo/i.test(slot.name)) {
        skipped += 1;
        // Skipped slots were also counted as `failed` above — subtract.
        failed = Math.max(0, failed - 1);
      }
    }
  }

  const imageOutput: ImageOutput = { components: componentEntries };

  /* ---- 8. Persist to DynamoDB (NO status change) ---- */
  await ddb.send(
    new UpdateCommand({
      TableName: projectsTableName,
      Key: {
        pk: `PROJECT#${input.projectId}`,
        sk: `PROJECT#${input.projectId}`,
      },
      UpdateExpression: "SET imageOutput = :io, updatedAt = :now",
      ExpressionAttributeValues: {
        ":io": imageOutput,
        ":now": new Date().toISOString(),
      },
    }),
  );

  /* ---- 9. Log summary ---- */
  console.log(
    JSON.stringify({
      message: "Image resolver complete",
      projectId: input.projectId,
      resolved,
      skipped,
      failed,
    }),
  );

  /* ---- 10. Return full PipelineState with imageOutput ---- */
  return {
    ...input,
    imageOutput,
  };
};
