import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { DatabaseStack } from "../stacks/DatabaseStack";
import { SiteDeployStack } from "../stacks/SiteDeployStack";
import { PipelineStack } from "../stacks/PipelineStack";
import { ApiStack } from "../stacks/ApiStack";

/* ------------------------------------------------------------------ */
/*  Stage                                                              */
/* ------------------------------------------------------------------ */

/**
 * MainStage — orchestrates all CDK stacks with dependency-ordered wiring.
 *
 * Instantiation order:
 *   1. DatabaseStack      — no upstream deps
 *   2. SiteDeployStack    — needs pipeline bucket + projects table
 *   3. PipelineStack      — needs both tables, bucket, and deploy fn ARN
 *   4. ApiStack           — needs projects table and pipeline queue
 *
 * All cross-stack communication uses string props (names, ARNs, URLs).
 * No construct objects cross stack boundaries.
 */
export class MainStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    /* ---------------------------------------------------------------- */
    /*  1. DatabaseStack — tables and pipeline bucket                    */
    /* ---------------------------------------------------------------- */

    const database = new DatabaseStack(this, "DatabaseStack");

    /* ---------------------------------------------------------------- */
    /*  2. SiteDeployStack — Vercel deploy Lambda                       */
    /* ---------------------------------------------------------------- */

    const siteDeploy = new SiteDeployStack(this, "SiteDeployStack", {
      pipelineBucketName: database.pipelineBucketName,
      pipelineBucketArn: database.pipelineBucketArn,
      projectsTableName: database.projectsTableName,
      projectsTableArn: database.projectsTableArn,
    });

    /* ---------------------------------------------------------------- */
    /*  3. PipelineStack — SQS, Step Functions, agent Lambdas           */
    /* ---------------------------------------------------------------- */

    const pipeline = new PipelineStack(this, "PipelineStack", {
      projectsTableName: database.projectsTableName,
      projectsTableArn: database.projectsTableArn,
      componentsTableName: database.componentsTableName,
      componentsTableArn: database.componentsTableArn,
      pipelineBucketName: database.pipelineBucketName,
      pipelineBucketArn: database.pipelineBucketArn,
      deployFunctionArn: siteDeploy.deployFn.fn.functionArn,
    });

    /* ---------------------------------------------------------------- */
    /*  4. ApiStack — REST API with Lambda integrations                  */
    /* ---------------------------------------------------------------- */

    new ApiStack(this, "ApiStack", {
      projectsTableName: database.projectsTableName,
      projectsTableArn: database.projectsTableArn,
      pipelineQueueUrl: pipeline.queue.queueUrl,
      pipelineQueueArn: pipeline.queue.queueArn,
    });
  }
}
