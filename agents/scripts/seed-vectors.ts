/**
 * Embed every component metadata file with OpenAI text-embedding-3-small
 * (1536-d) and upsert the resulting vectors into the Qdrant `components`
 * collection.
 *
 * Idempotent: each component's point ID is a deterministic djb2 hash of
 * its `componentId`, so re-running overwrites in place rather than
 * creating duplicates.
 *
 * Usage:
 *   QDRANT_ENDPOINT_SSM_PATH=/sitegen/dev/qdrant-endpoint \
 *   QDRANT_API_KEY_SSM_PATH=/sitegen/dev/qdrant-api-key \
 *   OPENAI_API_KEY_SSM_PATH=/sitegen/dev/openai-api-key \
 *     ts-node scripts/seed-vectors.ts
 *
 * Walks components/library/ recursively, finds every metadata.json,
 * builds one embedding per component (sequential — 33 calls), batches
 * them into Qdrant upserts of 100 points at a time.
 */

import * as fs from "fs";
import * as path from "path";
import { getEmbedding } from "../shared/embeddings";
import { getQdrantClient, ensureCollection } from "../shared/qdrant-client";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const COLLECTION_NAME = "components";
const UPSERT_BATCH_SIZE = 100;

/* ------------------------------------------------------------------ */
/*  Resolve library root                                               */
/* ------------------------------------------------------------------ */

const LIBRARY_ROOT = path.resolve(
  __dirname,
  "..",
  "..",
  "components",
  "library",
);

/* ------------------------------------------------------------------ */
/*  Walk directory tree and collect metadata.json paths                */
/* ------------------------------------------------------------------ */

function findMetadataFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMetadataFiles(fullPath));
    } else if (entry.name === "metadata.json") {
      results.push(fullPath);
    }
  }

  return results;
}

/* ------------------------------------------------------------------ */
/*  Local MetadataJson interface                                       */
/*  Mirrors agents/scripts/seed-components.ts::MetadataJson             */
/* ------------------------------------------------------------------ */

interface ComponentVariantEntry {
  id: string;
  name: string;
  density: string;
  colorMode: string;
  styleOverrides: string[];
}

interface MetadataJson {
  id: string;
  name: string;
  category: string;
  style: string[];
  mood: string[];
  purpose: string[];
  acceptsStyleKit: Record<string, boolean>;
  layout: string;
  density: string;
  imageWeight?: number;
  slots: unknown[];
  mobileBehavior: string;
  pairsWell: string[];
  pairsPoorly: string[];
  variants?: ComponentVariantEntry[];
  descriptions?: { descriptive: string; usage: string; audienceFit: string };
}

/* ------------------------------------------------------------------ */
/*  Deterministic djb2 hash                                            */
/*                                                                     */
/*  Classic djb2 by Dan Bernstein — chosen for being simple,           */
/*  well-known, and producing well-distributed 32-bit integers from    */
/*  short ASCII strings (component IDs).                               */
/*                                                                     */
/*    hash = 5381                                                       */
/*    for each char c: hash = ((hash << 5) + hash) + c.charCodeAt(0)    */
/*    return hash >>> 0  // coerce to unsigned 32-bit                  */
/*                                                                     */
/*  Qdrant accepts an unsigned-integer or UUID point ID. Using a       */
/*  deterministic hash of `componentId` makes upserts idempotent —     */
/*  re-running the script overwrites the same point rather than        */
/*  creating duplicates.                                                */
/* ------------------------------------------------------------------ */

function djb2(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) + hash + input.charCodeAt(i);
  }
  return hash >>> 0;
}

/* ------------------------------------------------------------------ */
/*  Build the embedding input text from metadata                       */
/*                                                                     */
/*  Concatenates the most semantically-loaded fields into a single     */
/*  text blob that the embedding model can encode.                      */
/* ------------------------------------------------------------------ */

function buildEmbeddingInput(json: MetadataJson): string {
  const parts: string[] = [
    `Name: ${json.name}`,
    `Category: ${json.category}`,
    `Style: ${json.style.join(", ")}`,
    `Mood: ${json.mood.join(", ")}`,
    `Purpose: ${json.purpose.join(", ")}`,
  ];

  // Legacy single-description field (pre-Phase C) — read via cast.
  // The `descriptions` object replaces this; this function is fully
  // rewritten in WI4 (per phase-c-plan).
  const legacy = (json as MetadataJson & { description?: string }).description;
  if (typeof legacy === "string" && legacy.trim().length > 0) {
    parts.push(`Description: ${legacy.trim()}`);
  }

  return parts.join("\n");
}

/* ------------------------------------------------------------------ */
/*  Qdrant point shape                                                 */
/* ------------------------------------------------------------------ */

interface ComponentPoint {
  id: number;
  vector: number[];
  payload: {
    componentId: string;
    name: string;
    category: string;
    style: string[];
    mood: string[];
    purpose: string[];
  };
}

/* ------------------------------------------------------------------ */
/*  Batch upsert points to Qdrant                                      */
/* ------------------------------------------------------------------ */

async function batchUpsert(points: ComponentPoint[]): Promise<number> {
  const client = await getQdrantClient();

  let upserted = 0;

  for (let i = 0; i < points.length; i += UPSERT_BATCH_SIZE) {
    const batch = points.slice(i, i + UPSERT_BATCH_SIZE);
    const batchNum = Math.floor(i / UPSERT_BATCH_SIZE) + 1;

    await client.upsert(COLLECTION_NAME, { points: batch });
    upserted += batch.length;

    console.log(`  Batch ${batchNum}: ${batch.length} points upserted`);
  }

  return upserted;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  console.log(`Library root: ${LIBRARY_ROOT}`);
  console.log(`Target collection: ${COLLECTION_NAME}`);
  console.log();

  const requiredEnvVars = [
    "QDRANT_ENDPOINT_SSM_PATH",
    "QDRANT_API_KEY_SSM_PATH",
    "OPENAI_API_KEY_SSM_PATH",
  ];

  const missing = requiredEnvVars.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    console.error(
      `Error: missing required env vars: ${missing.join(", ")}. ` +
        "Each must point to an SSM parameter path " +
        "(e.g. /sitegen/dev/qdrant-endpoint).",
    );
    process.exit(1);
  }

  const metadataFiles = findMetadataFiles(LIBRARY_ROOT);

  if (metadataFiles.length === 0) {
    console.error("No metadata.json files found in", LIBRARY_ROOT);
    process.exit(1);
  }

  console.log(`Found ${metadataFiles.length} metadata.json files.`);
  console.log();

  // Idempotent collection bootstrap (1536-d cosine).
  await ensureCollection(COLLECTION_NAME);

  const points: ComponentPoint[] = [];
  let embedded = 0;

  // Sequential embedding — 33 calls, simpler rate-limit + reasoning model.
  for (const filePath of metadataFiles) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const json: MetadataJson = JSON.parse(raw);

    const text = buildEmbeddingInput(json);
    const vector = await getEmbedding(text);

    points.push({
      id: djb2(json.id),
      vector,
      payload: {
        componentId: json.id,
        name: json.name,
        category: json.category,
        style: json.style ?? [],
        mood: json.mood ?? [],
        purpose: json.purpose ?? [],
      },
    });

    embedded += 1;
    console.log(`[embed] ${json.id} (${embedded}/${metadataFiles.length})`);
  }

  console.log();
  console.log(`Upserting ${points.length} points to ${COLLECTION_NAME}...`);

  const upserted = await batchUpsert(points);

  console.log();
  console.log(
    `Summary: found=${metadataFiles.length} embedded=${embedded} upserted=${upserted}`,
  );
}

main().catch((err) => {
  console.error("seed-vectors failed:", err);
  process.exit(1);
});
