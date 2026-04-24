import type { APIGatewayProxyHandler } from "aws-lambda";

/**
 * GET /share/{token} — public share-link read (token + TTL validated).
 *
 * Stub — real implementation lands in Wave 4 (plan item 16).
 */
export const handler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 501,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Not implemented" }),
  };
};
