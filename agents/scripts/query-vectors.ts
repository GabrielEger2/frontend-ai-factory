/**
 * Demo: query the Qdrant `components` collection for the top-5 components
 * matching a free-form natural-language brief.
 *
 * Usage:
 *   ts-node scripts/query-vectors.ts "<brief>"
 *
 * Required env vars (point to SSM parameter names, not raw secrets):
 *   QDRANT_ENDPOINT_SSM_PATH   — e.g. /sitegen/dev/qdrant-endpoint
 *   QDRANT_API_KEY_SSM_PATH    — e.g. /sitegen/dev/qdrant-api-key
 *   OPENAI_API_KEY_SSM_PATH    — e.g. /sitegen/dev/openai-api-key
 *
 * Embeds the brief via OpenAI text-embedding-3-small (1536-d), runs a
 * cosine similarity search against the `components` collection, and prints
 * the top-5 hits as a markdown table.
 */

import { getEmbedding } from "../shared/embeddings";
import { getQdrantClient } from "../shared/qdrant-client";

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

  const queryVector = await getEmbedding(queryText);

  const client = await getQdrantClient();

  // The Qdrant SDK exposes options in snake_case (`with_payload`),
  // matching the underlying REST schema — verified against
  // @qdrant/js-client-rest qdrant-client.d.ts.
  const hits = await client.search("components", {
    vector: queryVector,
    limit: 5,
    with_payload: true,
  });

  /* -------------------------------------------------------------- */
  /*  Print markdown table                                          */
  /* -------------------------------------------------------------- */

  const escapedBrief = queryText.replace(/"/g, '\\"');

  console.log();
  console.log(`> Query: "${escapedBrief}"`);
  console.log();
  console.log("| Rank | ID | Name | Category | Score |");
  console.log("|---|---|---|---|---|");

  hits.forEach((hit, idx) => {
    const payload = (hit.payload ?? {}) as ComponentPayload;
    const id = payload.componentId ?? String(hit.id);
    const name = payload.name ?? "—";
    const category = payload.category ?? "—";
    const score = hit.score.toFixed(4);
    console.log(`| ${idx + 1} | ${id} | ${name} | ${category} | ${score} |`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
