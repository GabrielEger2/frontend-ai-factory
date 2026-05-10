// Deterministic Image Resolver — heuristic only, no LLM.
// Named 'image agent' for directory-layout consistency with other pipeline steps.
// Closest spiritual kin: Assembler (also deterministic, not an AI agent).

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import type { ImageOutput, PipelineState } from "../shared/types";
import { ImageAgentInputSchema } from "./types";
import { resolveImageSlot } from "./resolver";
import { COMPONENT_METADATA } from "../assembler/component-sources.generated";
import { fieldsFromItemSchema } from "../assembler/core";
import { SKIP_PATTERN } from "./slot-keywords";

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
  itemSchema?: unknown;
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

    /**
     * Enumerated targets for this component — covers both top-level slots
     * and image/video fields nested inside list `itemSchema`.
     *
     * `outputKey` is the key used in `imageSlots` (and decoded by the
     * Assembler's `mergeImageOutput`). For top-level slots it's just the
     * slot name; for nested-list fields it's `${listName}[${index}].${field}`.
     */
    interface MediaTarget {
      outputKey: string;
      slotName: string;
      slotType: "image" | "video";
      aspectRatio: string | undefined;
      existingAltText: string | null;
    }

    const targets: MediaTarget[] = [];

    for (const slotDef of slotDefs) {
      // Case 1: top-level image / video slot.
      if (slotDef.type === "image" || slotDef.type === "video") {
        const altSlotName = `${slotDef.name}Alt`;
        const rawAlt = component.slots[altSlotName];
        const existingAltText =
          typeof rawAlt === "string" && rawAlt.trim().length > 0
            ? rawAlt
            : null;

        targets.push({
          outputKey: slotDef.name,
          slotName: slotDef.name,
          slotType: slotDef.type,
          aspectRatio: slotDef.aspectRatio,
          existingAltText,
        });
        continue;
      }

      // Case 2: list slot — descend into itemSchema.fields[] looking for
      // image/video fields, one resolution per existing list item.
      if (slotDef.type === "list" && slotDef.itemSchema) {
        const fieldDecls = fieldsFromItemSchema(slotDef.itemSchema);
        const listValue = component.slots[slotDef.name];
        if (!Array.isArray(listValue)) continue;

        for (let idx = 0; idx < listValue.length; idx++) {
          const item = listValue[idx];
          if (!item || typeof item !== "object") continue;
          const itemRecord = item as Record<string, unknown>;

          for (const fieldDecl of Object.values(fieldDecls)) {
            if (fieldDecl.type !== "image" && fieldDecl.type !== "video") {
              continue;
            }

            const altFieldName = `${fieldDecl.name}Alt`;
            const rawAlt = itemRecord[altFieldName];
            const existingAltText =
              typeof rawAlt === "string" && rawAlt.trim().length > 0
                ? rawAlt
                : null;

            targets.push({
              outputKey: `${slotDef.name}[${idx}].${fieldDecl.name}`,
              slotName: fieldDecl.name,
              slotType: fieldDecl.type,
              aspectRatio: fieldDecl.aspectRatio,
              existingAltText,
            });
          }
        }
      }
    }

    for (const target of targets) {
      // Skipped slots (logos / avatars) — count them up front so the
      // counter is accurate regardless of where the slot lived.
      if (SKIP_PATTERN.test(target.slotName)) {
        skipped += 1;
        continue;
      }

      const result = await resolveImageSlot({
        slotName: target.slotName,
        slotType: target.slotType,
        aspectRatio: target.aspectRatio,
        existingAltText: target.existingAltText,
        vertical,
        mood,
        ddb,
        cacheTableName,
        projectId: input.projectId,
        componentId: component.componentId,
      });

      if (result === null) {
        failed += 1;
        continue;
      }

      imageSlots[target.outputKey] = result;
      resolved += 1;
    }

    if (Object.keys(imageSlots).length > 0) {
      componentEntries.push({
        componentId: component.componentId,
        imageSlots,
      });
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
