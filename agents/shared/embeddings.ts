import OpenAI from "openai";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

/* ------------------------------------------------------------------ */
/*  SSM client (reused across Lambda invocations)                      */
/* ------------------------------------------------------------------ */

const ssmClient = new SSMClient({});

/* ------------------------------------------------------------------ */
/*  Module-level cached values                                         */
/* ------------------------------------------------------------------ */

let cachedOpenAiKey: string | undefined;
let cachedOpenAiClient: OpenAI | undefined;

/* ------------------------------------------------------------------ */
/*  SSM-cached OpenAI API key                                          */
/* ------------------------------------------------------------------ */

async function getOpenAiKey(): Promise<string> {
  if (cachedOpenAiKey) return cachedOpenAiKey;

  const ssmPath = process.env.OPENAI_API_KEY_SSM_PATH;
  if (!ssmPath) {
    throw new Error("OPENAI_API_KEY_SSM_PATH environment variable is not set");
  }

  const result = await ssmClient.send(
    new GetParameterCommand({ Name: ssmPath, WithDecryption: true }),
  );

  if (!result.Parameter?.Value) {
    throw new Error(`SSM parameter ${ssmPath} not found or has no value`);
  }

  cachedOpenAiKey = result.Parameter.Value;
  return cachedOpenAiKey;
}

/* ------------------------------------------------------------------ */
/*  Lazy-init OpenAI client                                            */
/* ------------------------------------------------------------------ */

export async function getEmbeddingClient(): Promise<OpenAI> {
  if (cachedOpenAiClient) return cachedOpenAiClient;

  const apiKey = await getOpenAiKey();
  cachedOpenAiClient = new OpenAI({ apiKey });

  return cachedOpenAiClient;
}

/* ------------------------------------------------------------------ */
/*  Embedding helper — single call to text-embedding-3-small (1536-d)  */
/* ------------------------------------------------------------------ */

export async function getEmbedding(text: string): Promise<number[]> {
  const client = await getEmbeddingClient();

  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}
