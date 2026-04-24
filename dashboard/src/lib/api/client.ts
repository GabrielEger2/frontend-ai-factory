/**
 * Server-side fetch wrapper for the SiteGen API.
 *
 * Reads NEXT_PUBLIC_API_URL for the base URL and API_KEY for
 * authentication. API_KEY is server-side only — never prefixed
 * with NEXT_PUBLIC_.
 */
export async function apiFetch(
  path: string,
  options?: RequestInit,
): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Missing API_KEY environment variable");
  }

  const sellerId = process.env.SELLER_ID;
  if (!sellerId) {
    throw new Error("Missing SELLER_ID environment variable");
  }

  const url = `${baseUrl}${path}`;

  return fetch(url, {
    ...options,
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
      "X-Seller-Id": sellerId,
      ...options?.headers,
    },
  });
}

/**
 * Public (non-seller) fetch wrapper for share-token endpoints.
 *
 * Injects only the API key — omits X-Seller-Id so the request hits
 * the public share/feedback Lambdas that skip requireSellerId. Used by
 * server actions that back the /share/[token] route.
 */
export async function apiFetchPublic(
  path: string,
  options?: RequestInit,
): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Missing API_KEY environment variable");
  }

  const url = `${baseUrl}${path}`;

  return fetch(url, {
    ...options,
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
}
