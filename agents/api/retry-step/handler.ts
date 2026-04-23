import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

import type { PipelineState, ProjectItem } from "../../shared/types";
import { requireSellerId } from "../shared/seller-guard";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const lambda = new LambdaClient({});

const ALLOWED_STEPS = ["content", "humanizer", "assembler", "qa", "deploy"];

const ACTIVE_STATUSES = [
  "content",
  "humanizing",
  "assembling",
  "qa",
  "deploying",
];

/**
 * POST /projects/{id}/steps/{stepName}/retry — retries a single pipeline step
 * by asynchronously invoking the corresponding agent Lambda.
 *
 * Path parameters: id (project ID), stepName (pipeline step)
 * Response 202: { message, projectId, stepName }
 * Response 400: missing params or invalid stepName
 * Response 404: project not found
 * Response 409: pipeline is currently running
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const tableName = process.env.PROJECTS_TABLE_NAME;

  if (!tableName) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server configuration error" }),
    };
  }

  const sellerIdOrErr = requireSellerId(event);
  if (typeof sellerIdOrErr !== "string") return sellerIdOrErr;
  const sellerId = sellerIdOrErr;

  const projectId = event.pathParameters?.id;
  const stepName = event.pathParameters?.stepName;

  if (!projectId || !stepName) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Missing project id or stepName path parameter",
      }),
    };
  }

  if (!ALLOWED_STEPS.includes(stepName)) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: `Invalid step name. Allowed: ${ALLOWED_STEPS.join(", ")}`,
      }),
    };
  }

  try {
    const result = await ddb.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: `PROJECT#${projectId}`,
        },
      }),
    );

    if (!result.Item) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    const item = result.Item as ProjectItem;

    if (item.sellerId !== sellerId) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    if (ACTIVE_STATUSES.includes(item.status)) {
      return {
        statusCode: 409,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Pipeline is currently running" }),
      };
    }

    const pipelineState: PipelineState = {
      projectId: item.projectId,
      status: item.status,
      companyName: item.companyName,
      segment: item.segment,
      description: item.description,
      sellerId: item.sellerId,
      researchOutput: item.researchOutput,
      styleOutput: item.styleOutput,
      contentOutput: item.contentOutput,
      humanizerOutput: item.humanizerOutput,
      assemblerOutput: item.assemblerOutput,
      qaOutput: item.qaOutput,
      previewUrl: item.previewUrl,
    };

    // Merge optional inputOverride from request body
    if (event.body) {
      try {
        const body = JSON.parse(event.body);
        if (body.inputOverride && typeof body.inputOverride === "object") {
          Object.assign(pipelineState, body.inputOverride);
        }
      } catch {
        // Ignore malformed body — inputOverride is optional
      }
    }

    await lambda.send(
      new InvokeCommand({
        FunctionName: `sitegen-${stepName}`,
        InvocationType: "Event",
        Payload: Buffer.from(JSON.stringify(pipelineState)),
      }),
    );

    console.log(
      JSON.stringify({
        message: "Step retry initiated",
        projectId,
        stepName,
      }),
    );

    return {
      statusCode: 202,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Step retry initiated",
        projectId,
        stepName,
      }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to retry step",
        projectId,
        stepName,
        error: err instanceof Error ? err.message : String(err),
      }),
    );

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
