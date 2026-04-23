import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export function requireSellerId(
  event: APIGatewayProxyEvent,
): string | APIGatewayProxyResult {
  const sellerId = event.headers["x-seller-id"];
  if (!sellerId) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing X-Seller-Id header" }),
    };
  }
  const allowed = (process.env.ALLOWED_SELLER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (allowed.length > 0 && !allowed.includes(sellerId)) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Unauthorized seller" }),
    };
  }
  return sellerId;
}
