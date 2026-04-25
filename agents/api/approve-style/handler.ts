import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { SFNClient, SendTaskSuccessCommand } from "@aws-sdk/client-sfn";

import type { PipelineState, ProjectItem } from "../../shared/types";
import { PipelineStateSchema, StyleOutputSchema } from "../../shared/types";
import { requireSellerId } from "../shared/seller-guard";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const sfn = new SFNClient({});

/**
 * POST /projects/{id}/approve-style — approves (and optionally edits) the
 * AI-generated style output, then resumes the Step Functions pipeline.
 *
 * Body: { styleOutput: StyleOutput }
 * Response 202: { message, projectId }
 * Response 400: missing params, invalid body, or missing task token
 * Response 404: project not found
 * Response 409: project is not awaiting style approval
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const tableName = process.env.PROJECTS_TABLE_NAME;
  const stateMachineArn = process.env.STATE_MACHINE_ARN;

  if (!tableName || !stateMachineArn) {
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

  if (!projectId) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing project id path parameter" }),
    };
  }

  // Parse and validate styleOutput from request body
  let styleOutput;
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    const body = JSON.parse(event.body);
    styleOutput = StyleOutputSchema.parse(body.styleOutput);
  } catch (err) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Invalid styleOutput",
        details: err instanceof Error ? err.message : String(err),
      }),
    };
  }

  try {
    // Fetch project from DynamoDB
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

    // Guard: project must be awaiting style approval
    if (item.status !== "awaiting_style_approval") {
      return {
        statusCode: 409,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `Project is not awaiting style approval (current status: ${item.status})`,
        }),
      };
    }

    // Read task token — must exist for awaiting_style_approval status
    const taskToken = item.styleApprovalTaskToken;
    if (!taskToken) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Missing styleApprovalTaskToken — project state is corrupted",
        }),
      };
    }

    // Reconstruct FULL PipelineState by spreading the parsed DDB item and
    // overriding the seller-edited styleOutput + advanced status.
    //
    // HARDENING: Using PipelineStateSchema.parse(item) instead of a manual
    // field list eliminates "stale field list" drift — any future field added
    // to PipelineStateSchema (intake fields, layout-gate fields, etc.) flows
    // through to downstream agents automatically. This is now THE template
    // approve-layout follows in Wave 4.
    const baseState = PipelineStateSchema.parse(item);
    const pipelineState: PipelineState = {
      ...baseState,
      styleOutput,
      status: "composing" as const,
    };

    // Step 8: DDB update FIRST — persist edited style and advance status
    // This must happen before SendTaskSuccess to avoid status display race
    await ddb.send(
      new UpdateCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: `PROJECT#${projectId}`,
        },
        UpdateExpression:
          "SET styleOutput = :so, #s = :status, updatedAt = :now REMOVE styleApprovalTaskToken",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: {
          ":so": styleOutput,
          ":status": "composing",
          ":now": new Date().toISOString(),
        },
      }),
    );

    // Step 9: Resume Step Functions pipeline with full state
    //
    // HARDENING: SendTaskSuccess is single-use — a second call with the same
    // token throws TaskTimedOut / TaskDoesNotExist / InvalidToken. Without this
    // catch, a duplicate approve click would surface as a 500 even though the
    // first call already advanced the pipeline correctly. Return 409 instead so
    // the dashboard can refetch and reflect the real state. This is now THE
    // template approve-layout follows in Wave 4.
    try {
      await sfn.send(
        new SendTaskSuccessCommand({
          taskToken,
          output: JSON.stringify(pipelineState),
        }),
      );
    } catch (err) {
      const errName =
        err instanceof Error
          ? err.name
          : typeof err === "object" && err !== null && "name" in err
            ? String((err as { name: unknown }).name)
            : "";
      if (
        errName === "TaskTimedOut" ||
        errName === "TaskDoesNotExist" ||
        errName === "InvalidToken"
      ) {
        return {
          statusCode: 409,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            error: "Style approval already processed",
            code: errName,
          }),
        };
      }
      throw err;
    }

    console.log(
      JSON.stringify({
        message: "Style approved",
        projectId,
      }),
    );

    return {
      statusCode: 202,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Style approved",
        projectId,
      }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to approve style",
        projectId,
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
