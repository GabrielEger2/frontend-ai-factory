import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

import type { ProjectItem } from "../../shared/types";
import { PipelineStateSchema } from "../../shared/types";
import type { ComposerAgentInput } from "../../composer/types";
import { requireSellerId } from "../shared/seller-guard";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const lambda = new LambdaClient({});

// Hardcoded by naming convention. The Composer Lambda's name is set in
// PipelineStack via AgentLambda; the IAM policy attached to this handler
// in ApiStack scopes lambda:InvokeFunction to this exact ARN.
const COMPOSER_FUNCTION_NAME = "sitegen-composer";

/**
 * POST /projects/{id}/regenerate-layout — regenerates the Composer blueprint
 * without releasing the SFN task token. Used when the seller wants a fresh
 * layout pass at the layout approval gate.
 *
 * Synchronously invokes the Composer Lambda with the original PipelineState
 * (minus `taskToken` — its absence triggers Composer's regenerate branch,
 * which writes only `composerOutput` to DDB and returns the new layout in
 * the Lambda response payload). The SFN execution remains paused on the
 * original task token captured during the initial Composer run; only an
 * eventual approve-layout call releases it.
 *
 * NOTE on timeouts: API Gateway has a 29s hard timeout; Composer Lambda has
 * a 5min timeout. Composer typically returns in 5-15s. If a regenerate run
 * exceeds 29s, API Gateway returns 504 to the client — the UI surfaces this
 * as "regeneration timed out, please try again". Async (write a flag, poll)
 * could replace sync invoke if 504s become common; deferred for simplicity.
 *
 * Body: optional empty `{}`.
 *
 * Response 202: { composerOutput }
 * Response 400: missing project id
 * Response 404: project not found (or not owned by this seller)
 * Response 409: project not awaiting layout approval
 * Response 502: Composer Lambda returned an error
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

  if (!projectId) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing project id path parameter" }),
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

    if (item.status !== "awaiting_layout_approval") {
      return {
        statusCode: 409,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `Project is not awaiting layout approval (current status: ${item.status})`,
        }),
      };
    }

    // Reconstruct the upstream PipelineState from DDB. This guarantees we
    // have researchOutput + styleOutput + the buyer-intake fields the
    // Composer needs.
    const baseState = PipelineStateSchema.parse(item);

    if (!baseState.researchOutput || !baseState.styleOutput) {
      return {
        statusCode: 409,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error:
            "Project is missing researchOutput or styleOutput required for regeneration",
        }),
      };
    }

    // Build ComposerAgentInput. CRITICAL: do NOT include `taskToken` — its
    // absence is what triggers Composer's regenerate branch (see
    // agents/composer/handler.ts L606-616). With a token, Composer would
    // re-write the awaiting_layout_approval status + token and try to
    // re-pause SFN; without it, Composer writes only `composerOutput` and
    // returns the new layout in its response.
    // Build ComposerAgentInput exactly matching ComposerAgentInputSchema's
    // `.pick({...}).extend({...})` field set (see agents/composer/types.ts).
    // sellerId is intentionally NOT picked by the schema, so omit it here.
    const composerInput: ComposerAgentInput = {
      projectId: baseState.projectId,
      status: baseState.status,
      companyName: baseState.companyName,
      segment: baseState.segment,
      description: baseState.description,
      researchOutput: baseState.researchOutput,
      styleOutput: baseState.styleOutput,
      desiredSections: baseState.desiredSections,
      brandToneKeywords: baseState.brandToneKeywords,
      objectives: baseState.objectives,
      pageType: baseState.pageType,
    };

    const invokeResponse = await lambda.send(
      new InvokeCommand({
        FunctionName: COMPOSER_FUNCTION_NAME,
        InvocationType: "RequestResponse",
        Payload: Buffer.from(JSON.stringify(composerInput)),
      }),
    );

    if (invokeResponse.FunctionError) {
      const errorPayload = invokeResponse.Payload
        ? Buffer.from(invokeResponse.Payload).toString("utf8")
        : "";
      console.error(
        JSON.stringify({
          message: "Composer Lambda returned a function error",
          projectId,
          functionError: invokeResponse.FunctionError,
          payload: errorPayload.substring(0, 500),
        }),
      );
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Layout regeneration failed",
          functionError: invokeResponse.FunctionError,
        }),
      };
    }

    if (!invokeResponse.Payload) {
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Composer Lambda returned no payload",
        }),
      };
    }

    const responseText = Buffer.from(invokeResponse.Payload).toString("utf8");
    let composerOutput: unknown;
    try {
      composerOutput = JSON.parse(responseText);
    } catch (err) {
      console.error(
        JSON.stringify({
          message: "Failed to parse Composer Lambda response as JSON",
          projectId,
          payloadSnippet: responseText.substring(0, 500),
          error: err instanceof Error ? err.message : String(err),
        }),
      );
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Composer returned malformed response",
        }),
      };
    }

    console.log(
      JSON.stringify({
        message: "Layout regenerated",
        projectId,
      }),
    );

    return {
      statusCode: 202,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ composerOutput }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to regenerate layout",
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
