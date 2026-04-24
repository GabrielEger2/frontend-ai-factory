import type { APIGatewayProxyHandler } from "aws-lambda";

/**
 * POST /share/{token}/feedback — public feedback submission (token + TTL validated).
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
