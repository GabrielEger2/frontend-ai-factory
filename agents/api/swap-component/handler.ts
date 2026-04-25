import type { APIGatewayProxyHandler } from "aws-lambda";
import {
  ConditionalCheckFailedException,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { z, ZodError } from "zod";

import type { ComposerOutput, ProjectItem } from "../../shared/types";
import { requireSellerId } from "../shared/seller-guard";

// Bundled manifest. The manifest.json file is generated at build time by
// `npm run build:manifest` (in components/) and is bundled into this Lambda
// by esbuild thanks to `resolveJsonModule: true` in agents/tsconfig.json.
// Relative path is required because agents/tsconfig.json does not configure
// the `@components/library` path alias.
import manifestRaw from "../../../components/library/manifest.json";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

interface ManifestEntry {
  id: string;
  category: string;
}

const manifest = manifestRaw as ManifestEntry[];

// Build a fast lookup of id → category once at module load.
const CATEGORY_BY_ID: Record<string, string> = {};
for (const entry of manifest) {
  if (entry.id && entry.category) {
    CATEGORY_BY_ID[entry.id] = entry.category;
  }
}

const SwapBodySchema = z.object({
  targetComponentId: z.string().min(1),
  newComponentId: z.string().min(1),
});

/**
 * POST /projects/{id}/swap-component — replaces a single component in the
 * Composer-selected layout while the project is paused at the layout
 * approval gate. Each swap is its own request; the SFN task token stays
 * with the project (NOT released here) so the seller can swap multiple
 * components before approving.
 *
 * Body: { targetComponentId: string, newComponentId: string }
 *
 * Response 200: { composerOutput }
 * Response 400: bad body or component IDs not found / wrong category
 * Response 404: project not found (or not owned by this seller)
 * Response 409: not awaiting layout approval, or layout was concurrently
 *               modified (optimistic concurrency on `updatedAt`)
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

  // Parse + validate body
  let body: z.infer<typeof SwapBodySchema>;
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }
    body = SwapBodySchema.parse(JSON.parse(event.body));
  } catch (err) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Invalid request body",
        details:
          err instanceof ZodError
            ? err.issues
            : err instanceof Error
              ? err.message
              : String(err),
      }),
    };
  }

  const { targetComponentId, newComponentId } = body;

  // Manifest validation: both IDs must exist; categories must match.
  const targetCategory = CATEGORY_BY_ID[targetComponentId];
  const newCategory = CATEGORY_BY_ID[newComponentId];

  if (!targetCategory) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: `Unknown targetComponentId: ${targetComponentId}`,
      }),
    };
  }
  if (!newCategory) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: `Unknown newComponentId: ${newComponentId}`,
      }),
    };
  }
  if (targetCategory !== newCategory) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: `Category mismatch: ${targetComponentId} is "${targetCategory}", ${newComponentId} is "${newCategory}"`,
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

    // Tenancy check: 404 (not 403) to avoid project-id enumeration
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

    if (!item.composerOutput) {
      return {
        statusCode: 409,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Project has no composerOutput to mutate",
        }),
      };
    }

    const prevUpdatedAt = item.updatedAt;
    if (!prevUpdatedAt) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Project is missing updatedAt — cannot perform safe swap",
        }),
      };
    }

    // Deep-clone composerOutput so the mutation is local until DDB write.
    const newComposerOutput: ComposerOutput = JSON.parse(
      JSON.stringify(item.composerOutput),
    );
    const selectedLayout =
      newComposerOutput.layouts[newComposerOutput.selectedLayout];
    if (!selectedLayout) {
      return {
        statusCode: 409,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `selectedLayout index ${newComposerOutput.selectedLayout} is out of range`,
        }),
      };
    }

    const idx = selectedLayout.components.indexOf(targetComponentId);
    if (idx === -1) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `targetComponentId ${targetComponentId} is not present in the selected layout`,
        }),
      };
    }

    selectedLayout.components[idx] = newComponentId;

    // The replaced component may have had a variant selection; that variant
    // belongs to the old component and is no longer meaningful for the new
    // one. Remove the old key if present. (The seller can pick a fresh
    // variant via the visual editor after layout approval.)
    if (
      selectedLayout.variantSelections &&
      Object.prototype.hasOwnProperty.call(
        selectedLayout.variantSelections,
        targetComponentId,
      )
    ) {
      delete selectedLayout.variantSelections[targetComponentId];
    }

    // Optimistic concurrency: the swap is only valid if no one else has
    // touched this project since we GetItem'd it. Two concurrent swap calls
    // would otherwise race; ConditionalCheckFailedException tells the client
    // to refetch and retry.
    try {
      await ddb.send(
        new UpdateCommand({
          TableName: tableName,
          Key: {
            pk: `PROJECT#${projectId}`,
            sk: `PROJECT#${projectId}`,
          },
          UpdateExpression: "SET composerOutput = :co, updatedAt = :now",
          ConditionExpression: "updatedAt = :prevUpdatedAt",
          ExpressionAttributeValues: {
            ":co": newComposerOutput,
            ":now": new Date().toISOString(),
            ":prevUpdatedAt": prevUpdatedAt,
          },
        }),
      );
    } catch (err) {
      if (err instanceof ConditionalCheckFailedException) {
        return {
          statusCode: 409,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            error: "Layout was modified by another request, please refetch",
          }),
        };
      }
      throw err;
    }

    console.log(
      JSON.stringify({
        message: "Component swapped",
        projectId,
        targetComponentId,
        newComponentId,
      }),
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ composerOutput: newComposerOutput }),
    };
  } catch (err) {
    console.error(
      JSON.stringify({
        message: "Failed to swap component",
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
