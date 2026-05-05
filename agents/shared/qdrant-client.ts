import { QdrantClient } from "@qdrant/js-client-rest";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

/* ------------------------------------------------------------------ */
/*  SSM client (reused across Lambda invocations)                      */
/* ------------------------------------------------------------------ */

const ssmClient = new SSMClient({});

/* ------------------------------------------------------------------ */
/*  Module-level cached values                                         */
/* ------------------------------------------------------------------ */

let cachedClient: QdrantClient | undefined;
let cachedEndpoint: string | undefined;
let cachedApiKey: string | undefined;

/* ------------------------------------------------------------------ */
/*  SSM-cached Qdrant endpoint                                         */
/* ------------------------------------------------------------------ */

async function getQdrantEndpoint(): Promise<string> {
  if (cachedEndpoint) return cachedEndpoint;

  const ssmPath = process.env.QDRANT_ENDPOINT_SSM_PATH;
  if (!ssmPath) {
    throw new Error("QDRANT_ENDPOINT_SSM_PATH environment variable is not set");
  }

  const result = await ssmClient.send(
    new GetParameterCommand({ Name: ssmPath, WithDecryption: true }),
  );

  if (!result.Parameter?.Value) {
    throw new Error(`SSM parameter ${ssmPath} not found or has no value`);
  }

  cachedEndpoint = result.Parameter.Value;
  return cachedEndpoint;
}

/* ------------------------------------------------------------------ */
/*  SSM-cached Qdrant API key                                          */
/* ------------------------------------------------------------------ */

async function getQdrantApiKey(): Promise<string> {
  if (cachedApiKey) return cachedApiKey;

  const ssmPath = process.env.QDRANT_API_KEY_SSM_PATH;
  if (!ssmPath) {
    throw new Error("QDRANT_API_KEY_SSM_PATH environment variable is not set");
  }

  const result = await ssmClient.send(
    new GetParameterCommand({ Name: ssmPath, WithDecryption: true }),
  );

  if (!result.Parameter?.Value) {
    throw new Error(`SSM parameter ${ssmPath} not found or has no value`);
  }

  cachedApiKey = result.Parameter.Value;
  return cachedApiKey;
}

/* ------------------------------------------------------------------ */
/*  Lazy-init Qdrant client                                            */
/* ------------------------------------------------------------------ */

export async function getQdrantClient(): Promise<QdrantClient> {
  if (cachedClient) return cachedClient;

  const endpoint = await getQdrantEndpoint();
  const apiKey = await getQdrantApiKey();

  cachedClient = new QdrantClient({ url: endpoint, apiKey });
  return cachedClient;
}

/* ------------------------------------------------------------------ */
/*  Idempotent collection bootstrap                                    */
/*                                                                     */
/*  Uses 1536-dimensional vectors (text-embedding-3-small) with        */
/*  cosine distance. Safe to call on every script run — creates the    */
/*  collection only if it does not yet exist.                          */
/* ------------------------------------------------------------------ */

export async function ensureCollection(collectionName: string): Promise<void> {
  const client = await getQdrantClient();

  const existence = await client.collectionExists(collectionName);
  if (existence.exists) return;

  await client.createCollection(collectionName, {
    vectors: { size: 1536, distance: "Cosine" },
  });
}
