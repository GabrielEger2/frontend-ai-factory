import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { FailHandlerInputSchema } from "./types";

/* ------------------------------------------------------------------ */
/*  Client (reused across Lambda invocations)                          */
/* ------------------------------------------------------------------ */

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

/* ------------------------------------------------------------------ */
/*  Handler                                                            */
/* ------------------------------------------------------------------ */

/**
 * Fail-handler Lambda.
 *
 * Invoked by Step Functions on pipeline failure (addCatch path).
 * Writes status="failed" + failureReason to the Projects table so
 * the dashboard can display the error. Must NOT throw — a throw here
 * would prevent the terminal sfn.Fail state from being reached.
 */
export const handler = async (
  event: unknown,
): Promise<{ projectId: string; status: "failed" }> => {
  console.log(
    JSON.stringify({
      agent: "fail-handler",
      event,
    }),
  );

  // 1. Validate input
  const input = FailHandlerInputSchema.parse(event);

  // 2. Build failure reason from Step Functions error object
  const errorType = input.error?.Error ?? "UnknownError";
  const errorCause = input.error?.Cause ?? "No cause provided";
  const failureReason = `${errorType}: ${errorCause}`;

  // 3. Attempt to write failed status to DynamoDB
  const tableName = process.env.PROJECTS_TABLE_NAME;

  if (tableName) {
    try {
      await ddb.send(
        new UpdateCommand({
          TableName: tableName,
          Key: {
            pk: `PROJECT#${input.projectId}`,
            sk: `PROJECT#${input.projectId}`,
          },
          UpdateExpression:
            "SET #s = :status, failureReason = :reason, updatedAt = :now",
          ExpressionAttributeNames: { "#s": "status" },
          ExpressionAttributeValues: {
            ":status": "failed",
            ":reason": failureReason,
            ":now": new Date().toISOString(),
          },
        }),
      );

      console.log(
        JSON.stringify({
          agent: "fail-handler",
          projectId: input.projectId,
          message: "Project marked as failed",
          failureReason,
        }),
      );
    } catch (err) {
      // Log but do NOT throw — sfn.Fail must still be reached
      console.error(
        JSON.stringify({
          agent: "fail-handler",
          projectId: input.projectId,
          message: "Failed to update DynamoDB",
          error: err instanceof Error ? err.message : String(err),
        }),
      );
    }
  } else {
    console.error(
      JSON.stringify({
        agent: "fail-handler",
        projectId: input.projectId,
        message: "PROJECTS_TABLE_NAME env var not set, skipping DDB update",
      }),
    );
  }

  // 4. Return minimal result for Step Functions
  return {
    projectId: input.projectId,
    status: "failed",
  };
};
