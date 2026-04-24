import type { APIGatewayProxyHandler } from "aws-lambda";

/**
 * GET /projects/{id}/versions/{v} — fetch a single version snapshot.
 *
 * Stub — real implementation lands in Wave 4 (plan item 12).
 */
export const handler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 501,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Not implemented" }),
  };
};
