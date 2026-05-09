import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  TransactWriteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import {
  getVercelToken,
  pollVercelDeployment,
} from "../../shared/vercel-deploy";
import type {
  ComposerOutput,
  StyleOutput,
  WorkingDraft,
} from "../../shared/types";

interface CompleterEvent {
  projectId: string;
  deploymentId: string;
  previewUrl: string;
  nextVersionNumber: number;
  versionSk: string;
  versionedKey: string;
  currentKey: string;
  workingDraft: WorkingDraft;
  composerOutput: ComposerOutput | null;
  styleOutput: StyleOutput | null;
}

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

/**
 * Async background completer for the deploy pipeline. Invoked via
 * `InvocationType: "Event"` from the deploy-draft kickoff Lambda — never
 * called directly from API Gateway. Polls Vercel for up to ~7.5 minutes,
 * then on success writes the VERSION#<n> snapshot via TransactWrite and
 * flips status to `deployed`. On poll/Vercel failure, writes status
 * `deploy_failed` plus the error message into `deployError`.
 */
export const handler = async (event: CompleterEvent): Promise<void> => {
  const {
    projectId,
    deploymentId,
    previewUrl,
    nextVersionNumber,
    versionSk,
    versionedKey,
    workingDraft,
    composerOutput,
    styleOutput,
  } = event;

  const tableName = process.env.PROJECTS_TABLE_NAME;
  if (!tableName) {
    throw new Error("PROJECTS_TABLE_NAME environment variable is not set");
  }

  console.log(
    JSON.stringify({
      stage: "completer-start",
      projectId,
      deploymentId,
    }),
  );

  try {
    const vercelToken = await getVercelToken();
    await pollVercelDeployment(vercelToken, deploymentId);

    const now = new Date().toISOString();

    // Reconstruct versionBlueprint — same shape as the original
    // deploy-draft snapshot logic. Wraps the single workingDraft blueprint
    // back into the ComposerOutput envelope (layouts[] + selectedLayout).
    const versionBlueprint = {
      layouts: [workingDraft.blueprint],
      selectedLayout: 0,
      source: composerOutput?.source ?? "fallback",
      candidateCount: composerOutput?.candidateCount ?? null,
      avgScore: composerOutput?.avgScore ?? null,
    };

    // Reconstruct promotedStyleOutput — promotes workingDraft tokens
    // (palette/typography/density) back into the StyleOutput envelope so
    // downstream consumers (version list, revert, etc.) see the same shape.
    const promotedStyleOutput = {
      palette: workingDraft.palette,
      typography: workingDraft.typography,
      density: workingDraft.density,
      mood: styleOutput?.mood ?? [],
      style: styleOutput?.style ?? [],
      paletteMode: styleOutput?.paletteMode ?? "single",
      paletteModes: styleOutput?.paletteModes ?? {
        single: workingDraft.palette,
        dual: workingDraft.palette,
        monochromatic: workingDraft.palette,
      },
      paletteSource: styleOutput?.paletteSource ?? null,
      paletteSuggestions: styleOutput?.paletteSuggestions ?? null,
    };

    const versionItem = {
      pk: `PROJECT#${projectId}`,
      sk: versionSk,
      versionNumber: nextVersionNumber,
      createdAt: now,
      deployedAt: now,
      blueprint: versionBlueprint,
      contentSlots: workingDraft.contentSlots,
      palette: workingDraft.palette,
      typography: workingDraft.typography,
      density: workingDraft.density,
      assembledTarGzKey: versionedKey,
      vercelDeploymentId: deploymentId,
    };

    await ddb.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: tableName,
              Item: versionItem,
              ConditionExpression:
                "attribute_not_exists(pk) AND attribute_not_exists(sk)",
            },
          },
          {
            Update: {
              TableName: tableName,
              Key: {
                pk: `PROJECT#${projectId}`,
                sk: `PROJECT#${projectId}`,
              },
              UpdateExpression:
                "SET composerOutput = :co, humanizerOutput = :ho, styleOutput = :so, currentVersionNumber = :v, previewUrl = :url, #st = :status, updatedAt = :now REMOVE workingDraft",
              ExpressionAttributeNames: { "#st": "status" },
              ExpressionAttributeValues: {
                ":co": versionBlueprint,
                ":ho": workingDraft.contentSlots,
                ":so": promotedStyleOutput,
                ":v": nextVersionNumber,
                ":url": previewUrl,
                ":status": "deployed",
                ":now": now,
              },
            },
          },
        ],
      }),
    );

    console.log(
      JSON.stringify({
        stage: "completer-success",
        projectId,
        deploymentId,
        versionNumber: nextVersionNumber,
      }),
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    console.error(
      JSON.stringify({
        stage: "completer-failed",
        projectId,
        deploymentId,
        error: errorMessage,
      }),
    );

    await ddb.send(
      new UpdateCommand({
        TableName: tableName,
        Key: {
          pk: `PROJECT#${projectId}`,
          sk: `PROJECT#${projectId}`,
        },
        UpdateExpression:
          "SET #st = :failed, deployError = :err, updatedAt = :now",
        ExpressionAttributeNames: { "#st": "status" },
        ExpressionAttributeValues: {
          ":failed": "deploy_failed",
          ":err": errorMessage,
          ":now": new Date().toISOString(),
        },
      }),
    );
  }
};
