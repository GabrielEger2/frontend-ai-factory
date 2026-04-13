import type { SQSHandler } from "aws-lambda";
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { ProjectBriefSchema } from "./types";

const sfn = new SFNClient({});

/**
 * Pipeline Starter — SQS-triggered Lambda that starts a Step Functions
 * execution for each incoming project brief.
 *
 * SQS message body must match ProjectBrief schema:
 *   { projectId, segment, companyName, description }
 */
export const handler: SQSHandler = async (event) => {
  const stateMachineArn = process.env.STATE_MACHINE_ARN;
  if (!stateMachineArn) {
    throw new Error("STATE_MACHINE_ARN environment variable is not set");
  }

  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const brief = ProjectBriefSchema.parse(body);

    console.log(
      JSON.stringify({
        message: "Starting pipeline execution",
        projectId: brief.projectId,
        segment: brief.segment,
      }),
    );

    await sfn.send(
      new StartExecutionCommand({
        stateMachineArn,
        name: brief.projectId,
        input: JSON.stringify({
          projectId: brief.projectId,
          segment: brief.segment,
          companyName: brief.companyName,
          description: brief.description,
          status: "queued",
        }),
      }),
    );

    console.log(
      JSON.stringify({
        message: "Pipeline execution started",
        projectId: brief.projectId,
      }),
    );
  }
};
