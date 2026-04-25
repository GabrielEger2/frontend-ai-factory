import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

/* ------------------------------------------------------------------ */
/*  SSM Client                                                         */
/* ------------------------------------------------------------------ */

const ssm = new SSMClient({});

/* ------------------------------------------------------------------ */
/*  SSM Cache — module-scope for Lambda container reuse                */
/* ------------------------------------------------------------------ */

let cachedVercelToken: string | undefined;

/**
 * Fetch the Vercel API token from SSM (SecureString, decrypted).
 *
 * Module-level cache persists across invocations within the same
 * Lambda container for warm-start performance.
 *
 * Reads SSM path from VERCEL_TOKEN_SSM_PATH env var.
 */
export async function getVercelToken(): Promise<string> {
  if (cachedVercelToken) {
    return cachedVercelToken;
  }

  const ssmPath = process.env.VERCEL_TOKEN_SSM_PATH;
  if (!ssmPath) {
    throw new Error("VERCEL_TOKEN_SSM_PATH environment variable is not set");
  }

  const result = await ssm.send(
    new GetParameterCommand({
      Name: ssmPath,
      WithDecryption: true,
    }),
  );

  if (!result.Parameter?.Value) {
    throw new Error(`SSM parameter ${ssmPath} has no value`);
  }

  cachedVercelToken = result.Parameter.Value;
  return cachedVercelToken;
}

/* ------------------------------------------------------------------ */
/*  Vercel Polling Constants                                           */
/* ------------------------------------------------------------------ */

export const POLL_INTERVAL_MS = 5_000;
export const POLL_MAX_ATTEMPTS = 90;
export const POLL_WARNING_ATTEMPT = 60;

/* ------------------------------------------------------------------ */
/*  Tar Extraction                                                     */
/* ------------------------------------------------------------------ */

export interface TarEntry {
  path: string;
  content: Buffer;
}

/**
 * Parse a tar buffer into an array of file entries.
 *
 * Reads POSIX ustar headers: 100 bytes for name, size at offset 124
 * (12 bytes octal), type flag at offset 156. Skips non-regular files.
 */
export function extractTar(tarBuffer: Buffer): TarEntry[] {
  const entries: TarEntry[] = [];
  let offset = 0;

  while (offset + 512 <= tarBuffer.length) {
    const header = tarBuffer.subarray(offset, offset + 512);

    // Check for end-of-archive (two zero blocks)
    if (header.every((b) => b === 0)) {
      break;
    }

    // Extract file name (first 100 bytes, null-terminated)
    const nameEnd = header.indexOf(0, 0);
    const name = header
      .subarray(0, nameEnd > 0 && nameEnd < 100 ? nameEnd : 100)
      .toString("utf-8");

    // Extract size (offset 124, 12 bytes octal, null-terminated)
    const sizeStr = header.subarray(124, 136).toString("utf-8").trim();
    const size = parseInt(sizeStr, 8) || 0;

    // Type flag at offset 156: '0' or '\0' = regular file
    const typeFlag = header[156];
    const isRegularFile = typeFlag === 0x30 || typeFlag === 0x00;

    offset += 512; // Move past header

    if (isRegularFile && size > 0 && name.length > 0) {
      const content = Buffer.from(tarBuffer.subarray(offset, offset + size));
      entries.push({ path: name, content });
    }

    // Advance past content (padded to 512-byte boundary)
    offset += Math.ceil(size / 512) * 512;
  }

  return entries;
}

/* ------------------------------------------------------------------ */
/*  Vercel API Types                                                   */
/* ------------------------------------------------------------------ */

export interface VercelFile {
  file: string;
  data: string; // base64 encoded
  encoding: "base64";
}

export interface VercelDeployResponse {
  id: string;
  url: string;
  readyState: string;
}

/* ------------------------------------------------------------------ */
/*  Vercel API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Deploy files to Vercel via the Deployments API.
 *
 * POST https://api.vercel.com/v13/deployments
 * Each file is sent as { file: path, data: base64Content }.
 */
export async function deployToVercel(
  token: string,
  projectId: string,
  files: VercelFile[],
): Promise<VercelDeployResponse> {
  const response = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `sitegen-${projectId}`,
      files,
      projectSettings: {
        framework: "nextjs",
      },
    }),
  });

  if (response.status === 429) {
    throw new Error(
      "Vercel API rate limit exceeded (429). Step Functions will retry.",
    );
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Vercel API error ${response.status}: ${errorBody}`);
  }

  return (await response.json()) as VercelDeployResponse;
}

/* ------------------------------------------------------------------ */
/*  Vercel Readiness Polling                                           */
/* ------------------------------------------------------------------ */

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Poll the Vercel Deployments API until the deployment reaches
 * readyState "READY" or "ERROR". Throws on error or timeout.
 */
export async function pollVercelDeployment(
  token: string,
  deploymentId: string,
): Promise<void> {
  for (let attempt = 1; attempt <= POLL_MAX_ATTEMPTS; attempt++) {
    await sleep(POLL_INTERVAL_MS);

    const response = await fetch(
      `https://api.vercel.com/v13/deployments/${deploymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Vercel poll API error ${response.status}: ${errorBody}`);
    }

    const data = (await response.json()) as { readyState: string };

    console.log(
      JSON.stringify({
        message: "Vercel poll",
        deploymentId,
        attempt,
        readyState: data.readyState,
      }),
    );

    if (data.readyState === "READY") {
      return;
    }

    if (data.readyState === "ERROR") {
      throw new Error(`Vercel deployment ${deploymentId} reached ERROR state`);
    }

    if (attempt === POLL_WARNING_ATTEMPT) {
      console.warn(
        JSON.stringify({
          message: "Vercel poll approaching timeout",
          deploymentId,
          attempt,
          maxAttempts: POLL_MAX_ATTEMPTS,
        }),
      );
    }
  }

  throw new Error(
    `Vercel deployment ${deploymentId} did not reach READY after ${POLL_MAX_ATTEMPTS} attempts`,
  );
}
