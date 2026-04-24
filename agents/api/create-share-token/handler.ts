import type { APIGatewayProxyHandler } from "aws-lambda";

/**
 * POST /projects/{id}/share — create a public share token for a project.
 *
 * Stub — real implementation lands in Wave 4 (plan item 14).
 */
export const handler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 501,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Not implemented" }),
  };
};
