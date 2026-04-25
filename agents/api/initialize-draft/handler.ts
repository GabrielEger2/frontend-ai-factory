import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import type { ProjectItem, WorkingDraft } from "../../shared/types";
import { requireSellerId } from "../shared/seller-guard";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

/**
 * POST /projects/{id}/init-draft — ensure the project has a workingDraft.
 *
 * Idempotent: if workingDraft already exists, returns it as-is. Otherwise
 * constructs one from the frozen pipeline outputs (composerOutput,
 * humanizerOutput, styleOutput) and persists it before returning.
 *
 * Response 200: { workingDraft }
 * Response 400: project missing required frozen outputs
 * Response 404: project not found or ownership mismatch
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
    const projectResult = await ddb.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: `PROJECT#${projectId}`,
        },
      }),
    );

    if (!projectResult.Item) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    const project = projectResult.Item as ProjectItem;
    if (project.sellerId !== sellerId) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Project not found" }),
      };
    }

    // Idempotent: if a draft already exists, return it unchanged.
    if (project.workingDraft) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workingDraft: project.workingDraft }),
      };
    }

    // Build workingDraft from frozen outputs
    const composerOutput = project.composerOutput;
    const humanizerOutput = project.humanizerOutput;
    const styleOutput = project.styleOutput;

    if (!composerOutput || !humanizerOutput || !styleOutput) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error:
            "Project is missing one or more pipeline outputs required to initialize the draft",
        }),
      };
    }

    const selectedLayout =
      composerOutput.layouts[composerOutput.selectedLayout];
    if (!selectedLayout) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Composer output selected layout is out of range",
        }),
      };
    }

    const now = new Date().toISOString();
    const workingDraft: WorkingDraft = {
      blueprint: selectedLayout,
      contentSlots: humanizerOutput,
      palette: styleOutput.palette,
      typography: styleOutput.typography,
      density: styleOutput.density,
      updatedAt: now,
    };

    await ddb.send(
      new UpdateCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: `PROJECT#${projectId}`,
        },
        UpdateExpression: "SET workingDraft = :wd, updatedAt = :now",
        ExpressionAttributeValues: {
          ":wd": workingDraft,
          ":now": now,
        },
      }),
    );

    console.log(
      JSON.stringify({
        message: "workingDraft initialized from frozen outputs",
        projectId,
        sellerId,
      }),
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workingDraft }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to initialize workingDraft",
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
