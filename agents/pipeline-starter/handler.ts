import type { SQSHandler } from "aws-lambda";
import {
  ExecutionAlreadyExists,
  SFNClient,
  StartExecutionCommand,
} from "@aws-sdk/client-sfn";
import { ProjectBriefSchema } from "./types";

const sfn = new SFNClient({});

/**
 * Pipeline Starter — SQS-triggered Lambda that starts a Step Functions
 * execution for each incoming project brief.
 *
 * SQS message body must match ProjectBrief schema:
 *   { projectId, segment, companyName, description, sellerId }
 *
 * Idempotency: if SQS redelivers a message whose projectId already has
 * a running/completed SFN execution, the StartExecution call throws
 * ExecutionAlreadyExists. That is an expected no-op (we ACK the message
 * and move on). Any other error rethrows so SQS can retry normally.
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
        sellerId: brief.sellerId,
        segment: brief.segment,
      }),
    );

    try {
      await sfn.send(
        new StartExecutionCommand({
          stateMachineArn,
          name: brief.projectId,
          // IMPORTANT: every field referenced by a JsonPath in the SFN payload
          // blocks (e.g. styleStep, composerStep) MUST exist in this input
          // object — `?? null` defaults guarantee no JsonPath runtime error
          // when an optional intake field is unset. If you add a new optional
          // field downstream, extend this defaults block too.
          input: JSON.stringify({
            projectId: brief.projectId,
            sellerId: brief.sellerId,
            segment: brief.segment,
            companyName: brief.companyName,
            description: brief.description,
            brandColor: brief.brandColor ?? null,
            desiredSections: brief.desiredSections ?? null,
            brandToneKeywords: brief.brandToneKeywords ?? null,
            objectives: brief.objectives ?? null,
            businessHours: brief.businessHours ?? null,
            address: brief.address ?? null,
            phone: brief.phone ?? null,
            email: brief.email ?? null,
            socialLinks: brief.socialLinks ?? null,
            status: "queued",
          }),
        }),
      );
    } catch (err) {
      if (err instanceof ExecutionAlreadyExists) {
        console.log(
          JSON.stringify({
            message:
              "Pipeline execution already exists — ACKing SQS message (idempotent no-op)",
            projectId: brief.projectId,
            executionName: brief.projectId,
            sellerId: brief.sellerId,
          }),
        );
        continue;
      }
      // Any other error rethrows so SQS retry/DLQ logic engages.
      throw err;
    }

    console.log(
      JSON.stringify({
        message: "Pipeline execution started",
        projectId: brief.projectId,
        sellerId: brief.sellerId,
      }),
    );
  }
};
