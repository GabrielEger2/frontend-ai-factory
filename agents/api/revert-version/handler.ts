import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import type {
  ProjectItem,
  ProjectVersion,
  WorkingDraft,
} from "../../shared/types";
import { requireSellerId } from "../shared/seller-guard";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

/**
 * POST /projects/{id}/versions/{v}/revert — copy a VERSION# snapshot into
 * workingDraft so the seller can review/edit before redeploying.
 *
 * Does NOT touch frozen outputs or currentVersionNumber.
 *
 * Response 200: { reverted: true, versionNumber }
 * Response 404: project or version not found
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
  const vParam = event.pathParameters?.v;
  if (!projectId || !vParam) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing path parameters" }),
    };
  }

  const versionNumber = parseInt(vParam, 10);
  if (!Number.isFinite(versionNumber) || versionNumber <= 0) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid version number" }),
    };
  }

  try {
    // Ownership check
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

    const versionSk = `VERSION#${String(versionNumber).padStart(4, "0")}`;

    const versionResult = await ddb.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: versionSk,
        },
      }),
    );

    if (!versionResult.Item) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Version not found" }),
      };
    }

    const version = versionResult.Item as ProjectVersion;
    const now = new Date().toISOString();

    // Build workingDraft from version snapshot. Version stores a full
    // ComposerOutput — extract the selected ComposerLayout for the draft.
    const selectedLayout =
      version.blueprint.layouts[version.blueprint.selectedLayout];
    if (!selectedLayout) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Version snapshot is corrupted: selected layout missing",
        }),
      };
    }

    const workingDraft: WorkingDraft = {
      blueprint: selectedLayout,
      contentSlots: version.contentSlots,
      palette: version.palette,
      typography: version.typography,
      density: version.density as "low" | "medium" | "high",
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
        message: "Version reverted to workingDraft",
        projectId,
        versionNumber,
      }),
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reverted: true, versionNumber }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to revert version",
        projectId,
        versionNumber,
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
