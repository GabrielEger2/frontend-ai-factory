import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

/* ------------------------------------------------------------------ */
/*  SSM Client                                                         */
/* ------------------------------------------------------------------ */

const ssm = new SSMClient({});

/* ------------------------------------------------------------------ */
/*  SSM Cache — module-scope for Lambda container reuse                */
/* ------------------------------------------------------------------ */

let cachedPexelsKey: string | undefined;

/**
 * Fetch the Pexels API key from SSM (SecureString, decrypted).
 *
 * Module-level cache persists across invocations within the same
 * Lambda container for warm-start performance.
 *
 * Reads SSM path from PEXELS_API_KEY_SSM_PATH env var.
 */
export async function getPexelsApiKey(): Promise<string> {
  if (cachedPexelsKey) {
    return cachedPexelsKey;
  }

  const ssmPath = process.env.PEXELS_API_KEY_SSM_PATH;
  if (!ssmPath) {
    throw new Error("PEXELS_API_KEY_SSM_PATH environment variable is not set");
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

  cachedPexelsKey = result.Parameter.Value;
  return cachedPexelsKey;
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type PexelsOrientation = "landscape" | "portrait" | "square";

export interface PexelsSearchOptions {
  orientation?: PexelsOrientation;
  perPage?: number;
}

export interface PexelsPhotoResult {
  url: string;
  width: number;
  height: number;
  alt: string;
  photographerCredit: string;
}

export interface PexelsVideoResult {
  url: string;
  width: number;
  height: number;
  photographerCredit: string;
}

/* ------------------------------------------------------------------ */
/*  Pexels API — internal types                                        */
/* ------------------------------------------------------------------ */

interface PexelsPhotoApiItem {
  id: number;
  width: number;
  height: number;
  url: string;
  alt?: string;
  photographer?: string;
  photographer_url?: string;
  src?: {
    original?: string;
    large2x?: string;
    large?: string;
    medium?: string;
    small?: string;
    portrait?: string;
    landscape?: string;
    tiny?: string;
  };
}

interface PexelsPhotosApiResponse {
  photos?: PexelsPhotoApiItem[];
}

interface PexelsVideoFile {
  id: number;
  quality?: string;
  file_type?: string;
  width?: number;
  height?: number;
  link?: string;
}

interface PexelsVideoApiItem {
  id: number;
  width: number;
  height: number;
  url: string;
  user?: { name?: string; url?: string };
  video_files?: PexelsVideoFile[];
}

interface PexelsVideosApiResponse {
  videos?: PexelsVideoApiItem[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function buildCredit(
  name: string | undefined,
  url: string | undefined,
): string {
  if (name && url) return `${name} (${url})`;
  if (name) return name;
  if (url) return url;
  return "";
}

/**
 * Post-fetch min-resolution filter.
 *
 * - landscape: width >= 1200
 * - portrait/square: height >= 1200
 * - undefined orientation (auto): no filter
 */
function passesMinResolution(
  width: number,
  height: number,
  orientation: PexelsOrientation | undefined,
): boolean {
  if (orientation === undefined) return true;
  if (orientation === "landscape") return width >= 1200;
  return height >= 1200;
}

/* ------------------------------------------------------------------ */
/*  searchPexelsPhotos                                                 */
/* ------------------------------------------------------------------ */

/**
 * Search Pexels photos by free-text query.
 *
 * GET https://api.pexels.com/v1/search
 *
 * Returns [] on HTTP 429 or non-2xx (with a structured warn log) so
 * callers can degrade gracefully to placeholder fallback. Results are
 * filtered post-fetch by min resolution (>=1200px on the long side).
 */
export async function searchPexelsPhotos(
  query: string,
  opts: PexelsSearchOptions = {},
): Promise<PexelsPhotoResult[]> {
  const { orientation, perPage = 15 } = opts;

  const key = await getPexelsApiKey();

  const params = new URLSearchParams({
    query,
    per_page: String(perPage),
  });
  if (orientation) {
    params.set("orientation", orientation);
  }

  const url = `https://api.pexels.com/v1/search?${params.toString()}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: key,
      },
    });
  } catch (err) {
    console.warn(
      JSON.stringify({
        level: "warn",
        agent: "image",
        source: "pexels-client",
        api: "photos",
        reason: "fetch-error",
        query,
        orientation,
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return [];
  }

  if (response.status === 429) {
    console.warn(
      JSON.stringify({
        level: "warn",
        agent: "image",
        source: "pexels-client",
        api: "photos",
        reason: "rate-limited",
        status: 429,
        query,
        orientation,
      }),
    );
    return [];
  }

  if (!response.ok) {
    let body = "";
    try {
      body = await response.text();
    } catch {
      /* ignore */
    }
    console.warn(
      JSON.stringify({
        level: "warn",
        agent: "image",
        source: "pexels-client",
        api: "photos",
        reason: "non-2xx",
        status: response.status,
        query,
        orientation,
        body: body.slice(0, 200),
      }),
    );
    return [];
  }

  let data: PexelsPhotosApiResponse;
  try {
    data = (await response.json()) as PexelsPhotosApiResponse;
  } catch (err) {
    console.warn(
      JSON.stringify({
        level: "warn",
        agent: "image",
        source: "pexels-client",
        api: "photos",
        reason: "json-parse-error",
        query,
        orientation,
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return [];
  }

  const photos = data.photos ?? [];
  const results: PexelsPhotoResult[] = [];

  for (const item of photos) {
    if (!passesMinResolution(item.width, item.height, orientation)) {
      continue;
    }
    const src =
      item.src?.large2x ??
      item.src?.large ??
      item.src?.original ??
      item.src?.medium ??
      "";
    if (!src) continue;
    results.push({
      url: src,
      width: item.width,
      height: item.height,
      alt: item.alt ?? "",
      photographerCredit: buildCredit(item.photographer, item.photographer_url),
    });
  }

  return results;
}

/* ------------------------------------------------------------------ */
/*  searchPexelsVideos                                                 */
/* ------------------------------------------------------------------ */

/**
 * Search Pexels videos by free-text query.
 *
 * GET https://api.pexels.com/videos/search
 *
 * For each video, picks the highest-resolution video file from
 * `video_files[]` (sorted by width descending). Returns [] on 429
 * or non-2xx with a structured warn log.
 */
export async function searchPexelsVideos(
  query: string,
  opts: PexelsSearchOptions = {},
): Promise<PexelsVideoResult[]> {
  const { orientation, perPage = 15 } = opts;

  const key = await getPexelsApiKey();

  const params = new URLSearchParams({
    query,
    per_page: String(perPage),
  });
  if (orientation) {
    params.set("orientation", orientation);
  }

  const url = `https://api.pexels.com/videos/search?${params.toString()}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: key,
      },
    });
  } catch (err) {
    console.warn(
      JSON.stringify({
        level: "warn",
        agent: "image",
        source: "pexels-client",
        api: "videos",
        reason: "fetch-error",
        query,
        orientation,
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return [];
  }

  if (response.status === 429) {
    console.warn(
      JSON.stringify({
        level: "warn",
        agent: "image",
        source: "pexels-client",
        api: "videos",
        reason: "rate-limited",
        status: 429,
        query,
        orientation,
      }),
    );
    return [];
  }

  if (!response.ok) {
    let body = "";
    try {
      body = await response.text();
    } catch {
      /* ignore */
    }
    console.warn(
      JSON.stringify({
        level: "warn",
        agent: "image",
        source: "pexels-client",
        api: "videos",
        reason: "non-2xx",
        status: response.status,
        query,
        orientation,
        body: body.slice(0, 200),
      }),
    );
    return [];
  }

  let data: PexelsVideosApiResponse;
  try {
    data = (await response.json()) as PexelsVideosApiResponse;
  } catch (err) {
    console.warn(
      JSON.stringify({
        level: "warn",
        agent: "image",
        source: "pexels-client",
        api: "videos",
        reason: "json-parse-error",
        query,
        orientation,
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return [];
  }

  const videos = data.videos ?? [];
  const results: PexelsVideoResult[] = [];

  for (const item of videos) {
    if (!passesMinResolution(item.width, item.height, orientation)) {
      continue;
    }

    // Pick highest-resolution video file (by width).
    const files = item.video_files ?? [];
    if (files.length === 0) continue;

    let best: PexelsVideoFile | undefined;
    for (const f of files) {
      if (!f.link) continue;
      if (!best) {
        best = f;
        continue;
      }
      const bw = best.width ?? 0;
      const fw = f.width ?? 0;
      if (fw > bw) best = f;
    }

    if (!best?.link) continue;

    results.push({
      url: best.link,
      width: best.width ?? item.width,
      height: best.height ?? item.height,
      photographerCredit: buildCredit(item.user?.name, item.user?.url),
    });
  }

  return results;
}
