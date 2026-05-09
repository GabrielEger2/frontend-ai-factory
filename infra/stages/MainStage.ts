import { Construct } from "constructs";
import { DatabaseStack } from "../stacks/DatabaseStack";
import { VectorStack } from "../stacks/VectorStack";
import { PipelineStack } from "../stacks/PipelineStack";
import { ApiStack } from "../stacks/ApiStack";
import { DashboardStack } from "../stacks/DashboardStack";

/* ------------------------------------------------------------------ */
/*  Stage                                                              */
/* ------------------------------------------------------------------ */

/**
 * MainStage — orchestrates all CDK stacks with dependency-ordered wiring.
 *
 * Instantiation order:
 *   1. DatabaseStack      — no upstream deps
 *   2. VectorStack        — no upstream deps (lightweight SSM paths)
 *   3. PipelineStack      — needs both tables, bucket, and Qdrant/OpenAI SSM paths
 *   4. ApiStack           — needs projects table and pipeline queue
 *   5. DashboardStack     — needs ApiStack's apiUrl for runtime configuration
 *
 * All cross-stack communication uses string props (names, ARNs, URLs).
 * No construct objects cross stack boundaries.
 */
/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/**
 * SSM path holding the Vercel API token. Consumed by the deploy-draft
 * Lambda in ApiStack — the only deploy path under the draft-approval flow.
 */
const VERCEL_TOKEN_SSM_PATH = "/sitegen/dev/vercel-api-token";

export class MainStage extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    /* ---------------------------------------------------------------- */
    /*  1. DatabaseStack — tables and pipeline bucket                    */
    /* ---------------------------------------------------------------- */

    const database = new DatabaseStack(this, "DatabaseStack");

    /* ---------------------------------------------------------------- */
    /*  2. VectorStack — Qdrant Cloud + OpenAI SSM parameter paths      */
    /* ---------------------------------------------------------------- */

    const vector = new VectorStack(this, "VectorStack");

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
      qdrantEndpointSsmPath: vector.qdrantEndpointSsmPath,
      qdrantApiKeySsmPath: vector.qdrantApiKeySsmPath,
      openAiApiKeySsmPath: vector.openAiApiKeySsmPath,
      imageCacheTableName: database.imageCacheTableName,
      imageCacheTableArn: database.imageCacheTableArn,
      pexelsApiKeySsmPath: "/sitegen/dev/pexels-api-key",
    });

    /* ---------------------------------------------------------------- */
    /*  4. ApiStack — REST API with Lambda integrations                  */
    /* ---------------------------------------------------------------- */

    const api = new ApiStack(this, "ApiStack", {
      projectsTableName: database.projectsTableName,
      projectsTableArn: database.projectsTableArn,
      projectsSellerIndexName: database.projectsSellerIndexName,
      projectsSellerIndexArn: database.projectsSellerIndexArn,
      allowedSellerIds: this.node.tryGetContext("allowedSellerIds") ?? "",
      pipelineQueueUrl: pipeline.queue.queueUrl,
      pipelineQueueArn: pipeline.queue.queueArn,
      pipelineBucketName: database.pipelineBucketName,
      pipelineBucketArn: database.pipelineBucketArn,
      stateMachineArn: pipeline.stateMachineArn,
      shareTokensTableName: database.shareTokensTableName,
      shareTokensTableArn: database.shareTokensTableArn,
      vercelTokenSsmPath: VERCEL_TOKEN_SSM_PATH,
    });

    /* ---------------------------------------------------------------- */
    /*  5. DashboardStack — seller dashboard (OpenNext, stub)            */
    /* ---------------------------------------------------------------- */

    new DashboardStack(this, "DashboardStack", {
      apiUrl: api.apiUrl,
    });
  }
}
