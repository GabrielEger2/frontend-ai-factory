import type { APIGatewayProxyHandler } from "aws-lambda";

/**
 * POST /projects/{id}/deploy — assemble + Vercel deploy from workingDraft.
 *
 * Stub — real implementation lands in Wave 4 (plan item 11).
 */
export const handler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 501,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Not implemented" }),
  };
};
