import type { APIGatewayProxyHandler } from "aws-lambda";

/**
 * POST /projects/{id}/init-draft — bootstrap workingDraft from frozen outputs.
 *
 * Stub — real implementation lands in plan item 35.
 */
export const handler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 501,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Not implemented" }),
  };
};
