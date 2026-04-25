import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { SFNClient, SendTaskSuccessCommand } from "@aws-sdk/client-sfn";

import type { PipelineState, ProjectItem } from "../../shared/types";
import { PipelineStateSchema } from "../../shared/types";
import { requireSellerId } from "../shared/seller-guard";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const sfn = new SFNClient({});

/**
 * POST /projects/{id}/approve-layout — approves the AI-generated layout
 * blueprint (after any number of swap-component / regenerate-layout calls)
 * and resumes the Step Functions pipeline at the Content + SEO stage.
 *
 * Body: optional empty `{}`. Layout edits already live in DDB via prior
 * swap-component calls; this handler does NOT accept a layout payload.
 *
 * Response 202: { message, projectId }
 * Response 400: missing params or missing task token
 * Response 404: project not found (or not owned by this seller)
 * Response 409: project not awaiting layout approval, or already processed
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

    // Tenancy check: 404 (not 403) to avoid project-id enumeration
    if (item.sellerId !== sellerId) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    // Guard: project must be awaiting layout approval
    if (item.status !== "awaiting_layout_approval") {
      return {
        statusCode: 409,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `Project is not awaiting layout approval (current status: ${item.status})`,
        }),
      };
    }

    // Read task token — must exist for awaiting_layout_approval status
    const taskToken = item.layoutApprovalTaskToken;
    if (!taskToken) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Missing layoutApprovalTaskToken — project state is corrupted",
        }),
      };
    }

    // Reconstruct FULL PipelineState by spreading the parsed DDB item and
    // advancing status to `content` for downstream Content + SEO agents.
    //
    // HARDENING: Using PipelineStateSchema.parse(item) instead of a manual
    // field list eliminates "stale field list" drift — any future field
    // added to PipelineStateSchema flows through to downstream agents
    // automatically. This is the same pattern used by approve-style.
    //
    // Layout edits made via swap-component already live on `item.composerOutput`,
    // so the spread carries them forward without an explicit body payload.
    const baseState = PipelineStateSchema.parse(item);
    const pipelineState: PipelineState = {
      ...baseState,
      status: "content" as const,
    };

    // DDB update FIRST — advance status and remove the consumed task token.
    // This must happen before SendTaskSuccess to avoid a status display race
    // where the dashboard polls between SendTaskSuccess and the DDB write.
    await ddb.send(
      new UpdateCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: `PROJECT#${projectId}`,
        },
        UpdateExpression:
          "SET #s = :status, updatedAt = :now REMOVE layoutApprovalTaskToken",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: {
          ":status": "content",
          ":now": new Date().toISOString(),
        },
      }),
    );

    // Resume Step Functions pipeline with the full reconstructed state.
    //
    // HARDENING: SendTaskSuccess is single-use — a second call with the same
    // token throws TaskTimedOut / TaskDoesNotExist / InvalidToken. Without
    // this catch, a duplicate approve click would surface as a 500 even
    // though the first call already advanced the pipeline correctly. Return
    // 409 instead so the dashboard can refetch and reflect the real state.
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
            error: "Layout approval already processed",
            code: errName,
          }),
        };
      }
      throw err;
    }

    console.log(
      JSON.stringify({
        message: "Layout approved",
        projectId,
      }),
    );

    return {
      statusCode: 202,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Layout approved",
        projectId,
      }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to approve layout",
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
