import type { APIGatewayProxyHandler } from "aws-lambda";

/**
 * GET /projects/{id}/feedback — list client feedback items for a project.
 *
 * Stub — real implementation lands in Wave 4 (plan item 15).
 */
export const handler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 501,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Not implemented" }),
  };
};
