import { Construct } from "constructs";
import { DatabaseStack } from "../stacks/DatabaseStack";
import { SiteDeployStack } from "../stacks/SiteDeployStack";
import { GraphStack } from "../stacks/GraphStack";
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
 *   2. SiteDeployStack    — needs pipeline bucket + projects table
 *   3. GraphStack         — no upstream deps (lightweight SSM paths)
 *   4. PipelineStack      — needs both tables, bucket, deploy fn ARN, and Neo4j SSM paths
 *   5. ApiStack           — needs projects table and pipeline queue
 *   6. DashboardStack     — needs ApiStack's apiUrl for runtime configuration
 *
 * All cross-stack communication uses string props (names, ARNs, URLs).
 * No construct objects cross stack boundaries.
 */
/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/**
 * SSM path holding the Vercel API token. Shared between SiteDeployStack
 * (pipeline deploy Lambda) and ApiStack (deploy-draft Lambda). Kept as a
 * module-level constant so both consumers reference the exact same path.
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
    /*  2. SiteDeployStack — Vercel deploy Lambda                       */
    /* ---------------------------------------------------------------- */

    const siteDeploy = new SiteDeployStack(this, "SiteDeployStack", {
      pipelineBucketName: database.pipelineBucketName,
      pipelineBucketArn: database.pipelineBucketArn,
      projectsTableName: database.projectsTableName,
      projectsTableArn: database.projectsTableArn,
    });

    /* ---------------------------------------------------------------- */
    /*  3. GraphStack — Neo4j Aura SSM parameter paths                  */
    /* ---------------------------------------------------------------- */

    const graph = new GraphStack(this, "GraphStack");

    /* ---------------------------------------------------------------- */
    /*  4. PipelineStack — SQS, Step Functions, agent Lambdas           */
    /* ---------------------------------------------------------------- */

    const pipeline = new PipelineStack(this, "PipelineStack", {
      projectsTableName: database.projectsTableName,
      projectsTableArn: database.projectsTableArn,
      componentsTableName: database.componentsTableName,
      componentsTableArn: database.componentsTableArn,
      pipelineBucketName: database.pipelineBucketName,
      pipelineBucketArn: database.pipelineBucketArn,
      deployFunctionArn: siteDeploy.deployFn.fn.functionArn,
      neo4jUriSsmPath: graph.neo4jUriSsmPath,
      neo4jPasswordSsmPath: graph.neo4jPasswordSsmPath,
      neo4jUsernameSsmPath: graph.neo4jUsernameSsmPath,
      neo4jDatabaseSsmPath: graph.neo4jDatabaseSsmPath,
    });

    /* ---------------------------------------------------------------- */
    /*  5. ApiStack — REST API with Lambda integrations                  */
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
    /*  6. DashboardStack — seller dashboard (OpenNext, stub)            */
    /* ---------------------------------------------------------------- */

    new DashboardStack(this, "DashboardStack", {
      apiUrl: api.apiUrl,
    });
  }
}
