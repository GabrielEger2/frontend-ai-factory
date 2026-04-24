import type { APIGatewayProxyHandler } from "aws-lambda";

/**
 * PATCH /projects/{id}/draft — patch workingDraft on the project item.
 *
 * Stub — real implementation lands in Wave 4 (plan item 10).
 */
export const handler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 501,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Not implemented" }),
  };
};
