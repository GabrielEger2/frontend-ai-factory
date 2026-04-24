import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

function getHeader(
  event: APIGatewayProxyEvent,
  name: string,
): string | undefined {
  const target = name.toLowerCase();
  for (const [key, value] of Object.entries(event.headers ?? {})) {
    if (key.toLowerCase() === target && value != null) return value;
  }
  return undefined;
}

export function requireSellerId(
  event: APIGatewayProxyEvent,
): string | APIGatewayProxyResult {
  const sellerId = getHeader(event, "x-seller-id");
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
