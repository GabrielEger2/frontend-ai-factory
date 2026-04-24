import type { APIGatewayProxyHandler } from "aws-lambda";

/**
 * POST /projects/{id}/versions/{v}/revert — load a version snapshot into workingDraft.
 *
 * Stub — real implementation lands in Wave 4 (plan item 13).
 */
export const handler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 501,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Not implemented" }),
  };
};
