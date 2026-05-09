import * as crypto from "crypto";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import {
  searchPexelsPhotos,
  searchPexelsVideos,
  type PexelsOrientation,
} from "../shared/pexels-client";
import {
  SKIP_PATTERN,
  SLOT_KEYWORD_MAP,
  VERTICAL_KEYWORD_MAP,
  ASPECT_TO_ORIENTATION,
} from "./slot-keywords";
import type { ImageSlot } from "../shared/types";

/* ------------------------------------------------------------------ */
/*  Pure helpers                                                       */
/* ------------------------------------------------------------------ */

/**
 * Build a Pexels search query string.
 *
 * Concatenates `${verticalKeyword} ${slotKeyword} ${moodTag}` and
 * trims/normalizes whitespace so empty vertical or empty mood do not
 * leave stray whitespace in the query.
 */
export function buildQuery(
  verticalKeyword: string,
  slotKeyword: string,
  moodTag: string,
): string {
  return [verticalKeyword, slotKeyword, moodTag]
    .filter((p) => p && p.length > 0)
    .join(" ")
    .trim();
}

/**
 * Build a deterministic SHA256 cache key for a (query, orientation, type)
 * triple. Identical inputs always yield the same key; different
 * orientation or type values produce different keys.
 */
export function buildCacheKey(
  query: string,
  orientation: string | undefined,
  type: "photo" | "video",
): string {
  const normalized = `${query}|${orientation ?? "any"}|${type}`;
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/* ------------------------------------------------------------------ */
/*  Cache item                                                         */
/* ------------------------------------------------------------------ */

interface CachedImageItem {
  pk: string;
  url: string;
  alt?: string;
  photographerCredit?: string;
  cachedAt: number;
  expiresAt: number;
}

const CACHE_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

/* ------------------------------------------------------------------ */
/*  resolveImageSlot                                                   */
/* ------------------------------------------------------------------ */

export interface ResolveImageSlotOptions {
  slotName: string;
  slotType: "image" | "video";
  aspectRatio: string | undefined;
  existingAltText: string | null;
  vertical: string[];
  mood: string[];
  ddb: DynamoDBDocumentClient;
  cacheTableName: string;
  /** Optional context for structured logging (projectId, componentId). */
  projectId?: string;
  componentId?: string;
}

/**
 * Resolve a single image/video slot to a Pexels URL.
 *
 * Returns `null` when:
 *   - the slot name matches `SKIP_PATTERN` (logos/avatars never call Pexels)
 *   - the API returns zero usable results
 *   - any unexpected exception occurs (DDB or HTTP error)
 *
 * On `null` the caller falls through to the Assembler's existing
 * `applySafeDefaults()` placeholder behavior — the pipeline never blocks.
 *
 * Resolution flow (per plan §Item 2.2):
 *   1. SKIP_PATTERN check
 *   2. Derive slotKeyword from SLOT_KEYWORD_MAP
 *   3. Derive verticalKeyword from VERTICAL_KEYWORD_MAP
 *   4. Derive orientation from aspectRatio
 *   5. Build query
 *   6. Build cache key
 *   7. DDB cache GET — return on hit
 *   8. Pexels API call (photo or video)
 *   9. Discard on empty results
 *  10. Take first usable result
 *  11. Decide alt text (existing humanizer alt > Pexels alt)
 *  12. DDB cache PUT
 *  13. Return ImageSlot
 */
export async function resolveImageSlot(
  opts: ResolveImageSlotOptions,
): Promise<ImageSlot | null> {
  const {
    slotName,
    slotType,
    aspectRatio,
    existingAltText,
    vertical,
    mood,
    ddb,
    cacheTableName,
    projectId,
    componentId,
  } = opts;

  // 1. Skip logos / avatars / member photos — stock photography is a bad fit.
  if (SKIP_PATTERN.test(slotName)) {
    return null;
  }

  // 2-5. Derive query parts.
  const slotKeyword = SLOT_KEYWORD_MAP[slotName] ?? "business";
  const firstVertical = vertical[0];
  const verticalKeyword = firstVertical
    ? (VERTICAL_KEYWORD_MAP[firstVertical] ?? "")
    : "";
  const orientation: PexelsOrientation | undefined =
    ASPECT_TO_ORIENTATION[aspectRatio ?? "auto"];
  const moodTag = mood[0] ?? "";
  const query = buildQuery(verticalKeyword, slotKeyword, moodTag);

  // 6. Cache key.
  const cacheKey = buildCacheKey(
    query,
    orientation,
    slotType === "video" ? "video" : "photo",
  );

  try {
    // 7. DDB cache check.
    const nowSec = Math.floor(Date.now() / 1000);
    const cacheGet = await ddb.send(
      new GetCommand({
        TableName: cacheTableName,
        Key: { pk: cacheKey },
      }),
    );

    const cached = cacheGet.Item as CachedImageItem | undefined;
    if (
      cached &&
      cached.url &&
      (!cached.expiresAt || cached.expiresAt > nowSec)
    ) {
      // existingAltText still wins on cache hits — Humanizer alt is
      // contextual and may differ between projects sharing a query.
      const alt =
        existingAltText && existingAltText.trim().length > 0
          ? existingAltText
          : cached.alt;
      return {
        url: cached.url,
        ...(alt ? { alt } : {}),
        ...(cached.photographerCredit
          ? { photographerCredit: cached.photographerCredit }
          : {}),
      };
    }

    // 8. Pexels API call.
    const results =
      slotType === "video"
        ? await searchPexelsVideos(query, { orientation, perPage: 15 })
        : await searchPexelsPhotos(query, { orientation, perPage: 15 });

    // 9. Empty results — log and bail to placeholder.
    if (results.length === 0) {
      console.warn(
        JSON.stringify({
          level: "warn",
          agent: "image",
          reason: "no-results",
          projectId,
          componentId,
          slotName,
          slotType,
          query,
          orientation,
        }),
      );
      return null;
    }

    // 10. Take the first usable result. The pexels-client already filters
    // by min resolution; pick index 0.
    const first = results[0];
    if (!first || !first.url) {
      console.warn(
        JSON.stringify({
          level: "warn",
          agent: "image",
          reason: "all-results-too-small",
          projectId,
          componentId,
          slotName,
          slotType,
          query,
          orientation,
        }),
      );
      return null;
    }

    // 11. Alt text decision: existing humanizer alt wins; fall back to
    // Pexels-provided alt for photos. Videos do not carry alt from the
    // Pexels API — undefined unless humanizer provided one.
    const pexelsAlt =
      slotType === "video" ? undefined : (first as { alt?: string }).alt;
    const alt =
      existingAltText && existingAltText.trim().length > 0
        ? existingAltText
        : pexelsAlt && pexelsAlt.length > 0
          ? pexelsAlt
          : undefined;

    const photographerCredit =
      first.photographerCredit && first.photographerCredit.length > 0
        ? first.photographerCredit
        : undefined;

    // 12. DDB cache write — store Pexels alt (NOT existingAltText) so a
    // future project hitting this query can decide for itself whether to
    // override. expiresAt is epoch SECONDS for DDB TTL.
    const expiresAt = nowSec + CACHE_TTL_SECONDS;
    await ddb.send(
      new PutCommand({
        TableName: cacheTableName,
        Item: {
          pk: cacheKey,
          url: first.url,
          ...(pexelsAlt && pexelsAlt.length > 0 ? { alt: pexelsAlt } : {}),
          ...(photographerCredit ? { photographerCredit } : {}),
          cachedAt: Date.now(),
          expiresAt,
        },
      }),
    );

    // 13. Return resolved slot.
    return {
      url: first.url,
      ...(alt ? { alt } : {}),
      ...(photographerCredit ? { photographerCredit } : {}),
    };
  } catch (err) {
    console.warn(
      JSON.stringify({
        level: "warn",
        agent: "image",
        reason: "api-error",
        projectId,
        componentId,
        slotName,
        slotType,
        query,
        orientation,
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return null;
  }
}
