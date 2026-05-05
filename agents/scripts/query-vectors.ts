/**
 * Demo: query the Qdrant `components` collection per skeleton slot.
 *
 * Usage:
 *   ts-node scripts/query-vectors.ts "<brief>"
 *
 * Required env vars (point to SSM parameter names, not raw secrets):
 *   QDRANT_ENDPOINT_SSM_PATH   — e.g. /sitegen/dev/qdrant-endpoint
 *   QDRANT_API_KEY_SSM_PATH    — e.g. /sitegen/dev/qdrant-api-key
 *   OPENAI_API_KEY_SSM_PATH    — e.g. /sitegen/dev/openai-api-key
 *
 * For each slot in DEFAULT_SKELETON, embeds a per-slot query string via
 * OpenAI text-embedding-3-small (1536-d), runs a category-filtered cosine
 * similarity search against the `components` collection, and prints the
 * top-3 hits per slot as a markdown table. Mirrors the per-slot loop the
 * Composer handler runs in production.
 */

import { getEmbedding } from "../shared/embeddings";
import { getQdrantClient } from "../shared/qdrant-client";
import { DEFAULT_SKELETON } from "../composer/defaultSkeleton";

/* ------------------------------------------------------------------ */
/*  Resolve query brief                                                */
/* ------------------------------------------------------------------ */

const brief = process.argv[2];

if (!brief) {
  console.error('Usage: ts-node scripts/query-vectors.ts "<brief>"');
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/*  Verify required env vars                                           */
/* ------------------------------------------------------------------ */

const REQUIRED_ENV_VARS = [
  "QDRANT_ENDPOINT_SSM_PATH",
  "QDRANT_API_KEY_SSM_PATH",
  "OPENAI_API_KEY_SSM_PATH",
] as const;

for (const name of REQUIRED_ENV_VARS) {
  if (!process.env[name]) {
    console.error(`Error: ${name} environment variable is not set`);
    process.exit(1);
  }
}

/* ------------------------------------------------------------------ */
/*  Payload shape (mirrors what seed-vectors.ts writes)                */
/* ------------------------------------------------------------------ */

interface ComponentPayload {
  componentId?: string;
  name?: string;
  category?: string;
  style?: string[];
  mood?: string[];
  purpose?: string[];
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  // brief is non-undefined here (we exit above when it is missing) but TS
  // narrowing across module-level checks is unreliable, so re-assert.
  const queryText: string = brief as string;

  const client = await getQdrantClient();

  const escapedBrief = queryText.replace(/"/g, '\\"');
  console.log();
  console.log(`> Query: "${escapedBrief}"`);

  for (const slot of DEFAULT_SKELETON) {
    const slotQuery = `${slot.category} for ${queryText}; needs: ${slot.purpose}`;
    const slotVector = await getEmbedding(slotQuery);

    // The Qdrant SDK exposes options in snake_case (`with_payload`),
    // matching the underlying REST schema — verified against
    // @qdrant/js-client-rest qdrant-client.d.ts.
    const hits = await client.search("components", {
      vector: slotVector,
      limit: 3,
      with_payload: true,
      filter: {
        must: [{ key: "category", match: { value: slot.category } }],
      },
    });

    console.log();
    console.log(`## Slot: ${slot.category} (needs: ${slot.purpose})`);
    console.log();
    console.log("| Rank | ID | Name | Score |");
    console.log("|---|---|---|---|");

    hits.forEach((hit, idx) => {
      const payload = (hit.payload ?? {}) as ComponentPayload;
      const id = payload.componentId ?? String(hit.id);
      const name = payload.name ?? "—";
      const score = hit.score.toFixed(4);
      console.log(`| ${idx + 1} | ${id} | ${name} | ${score} |`);
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
