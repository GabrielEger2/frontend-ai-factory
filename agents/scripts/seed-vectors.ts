/**
 * Embed every component metadata file with OpenAI text-embedding-3-small
 * (1536-d) along three description axes (descriptive / usage /
 * audienceFit) and upsert the resulting named-vector points into the
 * Qdrant `components` collection.
 *
 * Each component contributes one point carrying three named vectors —
 * 33 components × 3 axes = 99 OpenAI calls per full re-seed.
 *
 * The collection is recreated on every run (named-vector schema cannot
 * be applied in place over the legacy flat-vector collection); point
 * IDs are still deterministic djb2 hashes of `componentId`.
 *
 * Usage:
 *   QDRANT_ENDPOINT_SSM_PATH=/sitegen/dev/qdrant-endpoint \
 *   QDRANT_API_KEY_SSM_PATH=/sitegen/dev/qdrant-api-key \
 *   OPENAI_API_KEY_SSM_PATH=/sitegen/dev/openai-api-key \
 *     ts-node scripts/seed-vectors.ts --wipe
 *
 * Pass `--wipe` on first run to acknowledge the destructive recreate.
 * Components missing any of the three description axes are skipped
 * with a warning — run `describe:components --force` first to populate
 * `descriptions.{descriptive,usage,audienceFit}` in metadata.json.
 */

import * as fs from "fs";
import * as path from "path";
import { getEmbedding } from "../shared/embeddings";
import {
  getQdrantClient,
  recreateCollectionMultiVector,
} from "../shared/qdrant-client";

/* ------------------------------------------------------------------ */
/*  CLI flags                                                          */
/* ------------------------------------------------------------------ */

// `--wipe` is an explicit-intent flag for the runbook. The Phase C
// schema migration always recreates the collection (named-vector
// schema cannot be applied in place), so the script behaves the same
// regardless — but operators are expected to pass --wipe on the first
// run to acknowledge the destructive recreate.
const wipe = process.argv.includes("--wipe");

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
/*  Read a single description axis from metadata                       */
/*                                                                     */
/*  Returns the trimmed string for the requested axis, or `null` if    */
/*  the `descriptions` object is missing or the axis value is empty.   */
/*  Callers skip components for which any axis returns null.           */
/* ------------------------------------------------------------------ */

function readAxisText(
  json: MetadataJson,
  axis: "descriptive" | "usage" | "audienceFit",
): string | null {
  return json.descriptions?.[axis]?.trim() || null;
}

/* ------------------------------------------------------------------ */
/*  Qdrant point shape (named-vector — Phase C)                        */
/*                                                                     */
/*  Named-vector collections use a single `vector` field whose value   */
/*  is a record keyed by vector name (descriptive / usage /            */
/*  audienceFit). This matches the Qdrant REST API and the             */
/*  @qdrant/js-client-rest TypeScript types.                            */
/* ------------------------------------------------------------------ */

interface ComponentPoint {
  id: number;
  vector: {
    descriptive: number[];
    usage: number[];
    audienceFit: number[];
  };
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
  console.log("seed:vectors", { wipe });
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

  // Phase C: named-vector collection — always recreate. The helper
  // deletes-if-exists and creates with three named 1536-d cosine
  // vectors (descriptive / usage / audienceFit). The `--wipe` flag is
  // advisory — the schema migration cannot be applied in place, so the
  // script must recreate the collection on every run.
  await recreateCollectionMultiVector(COLLECTION_NAME);

  const points: ComponentPoint[] = [];
  let embedded = 0;
  let skipped = 0;

  // Sequential per-component — 33 components × 3 axes = 99 OpenAI
  // calls per full re-seed. Within each component the 3 axis
  // embeddings run in parallel via Promise.all.
  for (const filePath of metadataFiles) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const json: MetadataJson = JSON.parse(raw);

    const descriptiveText = readAxisText(json, "descriptive");
    const usageText = readAxisText(json, "usage");
    const audienceFitText = readAxisText(json, "audienceFit");

    const missingAxes: string[] = [];
    if (!descriptiveText) missingAxes.push("descriptive");
    if (!usageText) missingAxes.push("usage");
    if (!audienceFitText) missingAxes.push("audienceFit");

    if (missingAxes.length > 0) {
      console.warn(
        `[skip] ${json.id} — missing axis: ${missingAxes.join(", ")}. ` +
          "Run describe:components --force to populate descriptions.",
      );
      skipped += 1;
      continue;
    }

    const [descriptiveVec, usageVec, audienceFitVec] = await Promise.all([
      getEmbedding(descriptiveText as string),
      getEmbedding(usageText as string),
      getEmbedding(audienceFitText as string),
    ]);

    points.push({
      id: djb2(json.id),
      vector: {
        descriptive: descriptiveVec,
        usage: usageVec,
        audienceFit: audienceFitVec,
      },
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
    `Summary: found=${metadataFiles.length} embedded=${embedded} skipped=${skipped} upserted=${upserted}`,
  );
}

main().catch((err) => {
  console.error("seed-vectors failed:", err);
  process.exit(1);
});
