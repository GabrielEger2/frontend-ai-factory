import neo4j, { Driver } from "neo4j-driver";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

/* ------------------------------------------------------------------ */
/*  SSM client (reused across Lambda invocations)                      */
/* ------------------------------------------------------------------ */

const ssmClient = new SSMClient({});

/* ------------------------------------------------------------------ */
/*  Module-level cached values                                         */
/* ------------------------------------------------------------------ */

let cachedDriver: Driver | undefined;
let cachedUri: string | undefined;
let cachedPassword: string | undefined;

/* ------------------------------------------------------------------ */
/*  SSM-cached Neo4j URI                                               */
/* ------------------------------------------------------------------ */

async function getNeo4jUri(): Promise<string> {
  if (cachedUri) return cachedUri;

  const ssmPath = process.env.NEO4J_URI_SSM_PATH;
  if (!ssmPath) {
    throw new Error("NEO4J_URI_SSM_PATH environment variable is not set");
  }

  const result = await ssmClient.send(
    new GetParameterCommand({ Name: ssmPath, WithDecryption: true }),
  );

  if (!result.Parameter?.Value) {
    throw new Error(`SSM parameter ${ssmPath} not found or has no value`);
  }

  cachedUri = result.Parameter.Value;
  return cachedUri;
}

/* ------------------------------------------------------------------ */
/*  SSM-cached Neo4j password                                          */
/* ------------------------------------------------------------------ */

async function getNeo4jPassword(): Promise<string> {
  if (cachedPassword) return cachedPassword;

  const ssmPath = process.env.NEO4J_PASSWORD_SSM_PATH;
  if (!ssmPath) {
    throw new Error("NEO4J_PASSWORD_SSM_PATH environment variable is not set");
  }

  const result = await ssmClient.send(
    new GetParameterCommand({ Name: ssmPath, WithDecryption: true }),
  );

  if (!result.Parameter?.Value) {
    throw new Error(`SSM parameter ${ssmPath} not found or has no value`);
  }

  cachedPassword = result.Parameter.Value;
  return cachedPassword;
}

/* ------------------------------------------------------------------ */
/*  Lazy-init Neo4j driver                                             */
/* ------------------------------------------------------------------ */

export async function getDriver(): Promise<Driver> {
  if (cachedDriver) return cachedDriver;

  const uri = await getNeo4jUri();
  const password = await getNeo4jPassword();

  cachedDriver = neo4j.driver(uri, neo4j.auth.basic("neo4j", password));
  await cachedDriver.verifyConnectivity();

  return cachedDriver;
}

/* ------------------------------------------------------------------ */
/*  Graceful shutdown                                                   */
/* ------------------------------------------------------------------ */

export async function closeDriver(): Promise<void> {
  if (cachedDriver) {
    await cachedDriver.close();
    cachedDriver = undefined;
  }
}
