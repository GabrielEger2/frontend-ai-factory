import * as path from "path";
import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  RestApi,
  Cors,
  ApiKey,
  UsagePlan,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as iam from "aws-cdk-lib/aws-iam";
import {
  LAMBDA_DEFAULTS,
  ESBUILD_DEFAULTS,
} from "../constructs/lambda-defaults";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface ApiStackProps extends StackProps {
  readonly projectsTableName: string;
  readonly projectsTableArn: string;
  readonly projectsSellerIndexName: string;
  readonly projectsSellerIndexArn: string;
  readonly allowedSellerIds: string;
  readonly pipelineQueueUrl: string;
  readonly pipelineQueueArn: string;
  readonly pipelineBucketName: string;
  readonly pipelineBucketArn: string;
  readonly stateMachineArn: string;
  readonly shareTokensTableName: string;
  readonly shareTokensTableArn: string;
  readonly vercelTokenSsmPath: string;
}

/* ------------------------------------------------------------------ */
/*  Stack                                                              */
/* ------------------------------------------------------------------ */

/**
 * API Gateway REST API with API key auth and Lambda-backed routes.
 *
 * Endpoints:
 *   POST /projects  — create project, enqueue to pipeline
 *   GET  /projects  — list project summaries
 *   GET  /projects/{id} — read project status
 *   POST /projects/{id}/approve-style — approve style and resume pipeline
 */
export class ApiStack extends Stack {
  /** The REST API — exposed for cross-stack wiring (e.g. dashboard config). */
  public readonly restApi: RestApi;

  /** The REST API base URL — exposed for cross-stack wiring (e.g. DashboardStack). */
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    /* -------------------------------------------------------------- */
    /*  REST API                                                       */
    /* -------------------------------------------------------------- */

    this.restApi = new RestApi(this, "SitegenApi", {
      restApiName: "sitegen-api",
      deployOptions: {
        stageName: "v1",
        methodOptions: {
          // Per-route throttle on the public feedback endpoint — mitigates
          // abuse of the unauthenticated (token-validated) POST.
          "/share/{token}/feedback/POST": {
            throttlingRateLimit: 2,
            throttlingBurstLimit: 5,
          },
        },
      },
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      },
    });

    this.apiUrl = this.restApi.url;

    /* -------------------------------------------------------------- */
    /*  API Key + Usage Plan                                           */
    /* -------------------------------------------------------------- */

    const apiKey = new ApiKey(this, "SitegenApiKey", {
      apiKeyName: "sitegen-api-key",
    });

    const usagePlan = new UsagePlan(this, "SitegenUsagePlan", {
      name: "sitegen-usage-plan",
      throttle: {
        rateLimit: 10,
        burstLimit: 5,
      },
      apiStages: [{ api: this.restApi, stage: this.restApi.deploymentStage }],
    });

    usagePlan.addApiKey(apiKey);

    /* -------------------------------------------------------------- */
    /*  POST /projects Lambda                                          */
    /* -------------------------------------------------------------- */

    const postProjectsFn = new NodejsFunction(this, "PostProjectsFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(__dirname, "../../agents/api/post-projects/handler.ts"),
      handler: "handler",
      functionName: "sitegen-post-projects",
      description:
        "SiteGen POST /projects — create project, enqueue to pipeline",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        PIPELINE_QUEUE_URL: props.pipelineQueueUrl,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    // DynamoDB write access on projects table
    postProjectsFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:PutItem", "dynamodb:UpdateItem"],
        resources: [props.projectsTableArn],
      }),
    );

    // SQS sendMessage access on pipeline queue
    postProjectsFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["sqs:SendMessage"],
        resources: [props.pipelineQueueArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  GET /projects/{id} Lambda                                      */
    /* -------------------------------------------------------------- */

    const getProjectFn = new NodejsFunction(this, "GetProjectFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(__dirname, "../../agents/api/get-project/handler.ts"),
      handler: "handler",
      functionName: "sitegen-get-project",
      description: "SiteGen GET /projects/{id} — read project status",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    // DynamoDB read access on projects table
    getProjectFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem", "dynamodb:Query"],
        resources: [props.projectsTableArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  GET /projects Lambda                                           */
    /* -------------------------------------------------------------- */

    const listProjectsFn = new NodejsFunction(this, "ListProjectsFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(__dirname, "../../agents/api/list-projects/handler.ts"),
      handler: "handler",
      functionName: "sitegen-list-projects",
      description: "SiteGen GET /projects — list project summaries",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        PROJECTS_SELLER_INDEX_NAME: props.projectsSellerIndexName,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    // DynamoDB query access on sellerId-createdAt GSI
    listProjectsFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:Query"],
        resources: [props.projectsSellerIndexArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  POST /projects/{id}/steps/{stepName}/retry Lambda               */
    /* -------------------------------------------------------------- */

    const retryStepFn = new NodejsFunction(this, "RetryStepFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(__dirname, "../../agents/api/retry-step/handler.ts"),
      handler: "handler",
      functionName: "sitegen-retry-step",
      description:
        "SiteGen POST /projects/{id}/steps/{stepName}/retry — retry a pipeline step",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    // DynamoDB read access on projects table
    retryStepFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem"],
        resources: [props.projectsTableArn],
      }),
    );

    // Lambda invoke access on sitegen-* agent functions
    retryStepFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["lambda:InvokeFunction"],
        resources: [
          `arn:aws:lambda:${Stack.of(this).region}:${Stack.of(this).account}:function:sitegen-*`,
        ],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  GET /projects/{id}/files Lambda                                 */
    /* -------------------------------------------------------------- */

    const getFilesFn = new NodejsFunction(this, "GetFilesFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(__dirname, "../../agents/api/get-files/handler.ts"),
      handler: "handler",
      functionName: "sitegen-get-files",
      description:
        "SiteGen GET /projects/{id}/files — read assembled site archive",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        PIPELINE_BUCKET_NAME: props.pipelineBucketName,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    // DynamoDB read access on projects table
    getFilesFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem"],
        resources: [props.projectsTableArn],
      }),
    );

    // S3 read access on pipeline bucket
    getFilesFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [`${props.pipelineBucketArn}/*`],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  PUT /projects/{id}/files Lambda                                 */
    /* -------------------------------------------------------------- */

    const putFilesFn = new NodejsFunction(this, "PutFilesFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(__dirname, "../../agents/api/put-files/handler.ts"),
      handler: "handler",
      functionName: "sitegen-put-files",
      description:
        "SiteGen PUT /projects/{id}/files — save modified site archive to S3",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        PIPELINE_BUCKET_NAME: props.pipelineBucketName,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    // DynamoDB read access on projects table
    putFilesFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem"],
        resources: [props.projectsTableArn],
      }),
    );

    // S3 read + write access on pipeline bucket
    putFilesFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject", "s3:PutObject"],
        resources: [`${props.pipelineBucketArn}/*`],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  POST /projects/{id}/approve-style Lambda                       */
    /* -------------------------------------------------------------- */

    const approveStyleFn = new NodejsFunction(this, "ApproveStyleFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(__dirname, "../../agents/api/approve-style/handler.ts"),
      handler: "handler",
      functionName: "sitegen-approve-style",
      description: "SiteGen POST /projects/{id}/approve-style",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        STATE_MACHINE_ARN: props.stateMachineArn,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    // DynamoDB read+write access on projects table
    approveStyleFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem", "dynamodb:UpdateItem"],
        resources: [props.projectsTableArn],
      }),
    );

    // Step Functions task token operations
    approveStyleFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["states:SendTaskSuccess", "states:SendTaskFailure"],
        resources: [props.stateMachineArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  PATCH /projects/{id}/draft Lambda                              */
    /* -------------------------------------------------------------- */

    const patchDraftFn = new NodejsFunction(this, "PatchDraftFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(__dirname, "../../agents/api/patch-draft/handler.ts"),
      handler: "handler",
      functionName: "sitegen-patch-draft",
      description:
        "SiteGen PATCH /projects/{id}/draft — patch workingDraft on project",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    patchDraftFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem", "dynamodb:UpdateItem"],
        resources: [props.projectsTableArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  POST /projects/{id}/init-draft Lambda                          */
    /* -------------------------------------------------------------- */

    const initializeDraftFn = new NodejsFunction(this, "InitializeDraftFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(
        __dirname,
        "../../agents/api/initialize-draft/handler.ts",
      ),
      handler: "handler",
      functionName: "sitegen-initialize-draft",
      description:
        "SiteGen POST /projects/{id}/init-draft — bootstrap workingDraft from frozen outputs",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    initializeDraftFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem", "dynamodb:UpdateItem"],
        resources: [props.projectsTableArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  POST /projects/{id}/deploy Lambda                              */
    /* -------------------------------------------------------------- */

    // NOTE: deploy-draft does in-Lambda assembly + tar/gzip + Vercel deploy +
    // polling + DDB writes. Matches the AgentLambda shape in SiteDeployStack
    // (10 min timeout, 1024 MB memory). Do NOT spread LAMBDA_DEFAULTS.
    const deployDraftFn = new NodejsFunction(this, "DeployDraftFn", {
      runtime: Runtime.NODEJS_20_X,
      architecture: Architecture.ARM_64,
      timeout: Duration.minutes(10),
      memorySize: 1024,
      entry: path.join(__dirname, "../../agents/api/deploy-draft/handler.ts"),
      handler: "handler",
      functionName: "sitegen-deploy-draft",
      description:
        "SiteGen POST /projects/{id}/deploy — assemble, upload, Vercel deploy, VERSION# snapshot",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        PIPELINE_BUCKET_NAME: props.pipelineBucketName,
        VERCEL_TOKEN_SSM_PATH: props.vercelTokenSsmPath,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    deployDraftFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
        ],
        resources: [props.projectsTableArn],
      }),
    );

    deployDraftFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject", "s3:PutObject"],
        resources: [`${props.pipelineBucketArn}/*`],
      }),
    );

    deployDraftFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ssm:GetParameter"],
        resources: [
          `arn:aws:ssm:${Stack.of(this).region}:${Stack.of(this).account}:parameter${props.vercelTokenSsmPath}`,
        ],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  GET /projects/{id}/versions Lambda                             */
    /* -------------------------------------------------------------- */

    const listVersionsFn = new NodejsFunction(this, "ListVersionsFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(__dirname, "../../agents/api/list-versions/handler.ts"),
      handler: "handler",
      functionName: "sitegen-list-versions",
      description:
        "SiteGen GET /projects/{id}/versions — list version snapshots",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    listVersionsFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem", "dynamodb:Query"],
        resources: [props.projectsTableArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  GET /projects/{id}/versions/{v} Lambda                         */
    /* -------------------------------------------------------------- */

    const getVersionFn = new NodejsFunction(this, "GetVersionFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(__dirname, "../../agents/api/get-version/handler.ts"),
      handler: "handler",
      functionName: "sitegen-get-version",
      description:
        "SiteGen GET /projects/{id}/versions/{v} — fetch version snapshot",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    getVersionFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem"],
        resources: [props.projectsTableArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  POST /projects/{id}/versions/{v}/revert Lambda                 */
    /* -------------------------------------------------------------- */

    const revertVersionFn = new NodejsFunction(this, "RevertVersionFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(__dirname, "../../agents/api/revert-version/handler.ts"),
      handler: "handler",
      functionName: "sitegen-revert-version",
      description:
        "SiteGen POST /projects/{id}/versions/{v}/revert — load snapshot into workingDraft",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    revertVersionFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem", "dynamodb:UpdateItem"],
        resources: [props.projectsTableArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  POST /projects/{id}/share Lambda                               */
    /* -------------------------------------------------------------- */

    const createShareTokenFn = new NodejsFunction(this, "CreateShareTokenFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(
        __dirname,
        "../../agents/api/create-share-token/handler.ts",
      ),
      handler: "handler",
      functionName: "sitegen-create-share-token",
      description:
        "SiteGen POST /projects/{id}/share — create a public share token",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        SHARE_TOKENS_TABLE_NAME: props.shareTokensTableName,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    createShareTokenFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem", "dynamodb:PutItem"],
        resources: [props.projectsTableArn, props.shareTokensTableArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  GET /projects/{id}/shares Lambda                               */
    /* -------------------------------------------------------------- */

    const listShareTokensFn = new NodejsFunction(this, "ListShareTokensFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(
        __dirname,
        "../../agents/api/list-share-tokens/handler.ts",
      ),
      handler: "handler",
      functionName: "sitegen-list-share-tokens",
      description:
        "SiteGen GET /projects/{id}/shares — list share tokens for a project",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    listShareTokensFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem", "dynamodb:Query"],
        resources: [props.projectsTableArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  DELETE /projects/{id}/share/{tokenId} Lambda                   */
    /* -------------------------------------------------------------- */

    const revokeShareTokenFn = new NodejsFunction(this, "RevokeShareTokenFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(
        __dirname,
        "../../agents/api/revoke-share-token/handler.ts",
      ),
      handler: "handler",
      functionName: "sitegen-revoke-share-token",
      description:
        "SiteGen DELETE /projects/{id}/share/{tokenId} — revoke share token",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        SHARE_TOKENS_TABLE_NAME: props.shareTokensTableName,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    revokeShareTokenFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem", "dynamodb:UpdateItem"],
        resources: [props.projectsTableArn, props.shareTokensTableArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  GET /projects/{id}/feedback Lambda                             */
    /* -------------------------------------------------------------- */

    const listFeedbackFn = new NodejsFunction(this, "ListFeedbackFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(__dirname, "../../agents/api/list-feedback/handler.ts"),
      handler: "handler",
      functionName: "sitegen-list-feedback",
      description:
        "SiteGen GET /projects/{id}/feedback — list client feedback items",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        ALLOWED_SELLER_IDS: props.allowedSellerIds,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    listFeedbackFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem", "dynamodb:Query"],
        resources: [props.projectsTableArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  GET /share/{token} Lambda (PUBLIC — no ALLOWED_SELLER_IDS)     */
    /* -------------------------------------------------------------- */

    const getShareFn = new NodejsFunction(this, "GetShareFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(__dirname, "../../agents/api/get-share/handler.ts"),
      handler: "handler",
      functionName: "sitegen-get-share",
      description:
        "SiteGen GET /share/{token} — public share-link read (token + TTL validated)",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        SHARE_TOKENS_TABLE_NAME: props.shareTokensTableName,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    getShareFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem"],
        resources: [props.projectsTableArn, props.shareTokensTableArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  POST /share/{token}/feedback Lambda (PUBLIC)                   */
    /* -------------------------------------------------------------- */

    const postFeedbackFn = new NodejsFunction(this, "PostFeedbackFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(__dirname, "../../agents/api/post-feedback/handler.ts"),
      handler: "handler",
      functionName: "sitegen-post-feedback",
      description:
        "SiteGen POST /share/{token}/feedback — public feedback submission",
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        SHARE_TOKENS_TABLE_NAME: props.shareTokensTableName,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    postFeedbackFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:PutItem"],
        resources: [props.projectsTableArn],
      }),
    );

    postFeedbackFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:GetItem"],
        resources: [props.shareTokensTableArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  Routes                                                         */
    /* -------------------------------------------------------------- */

    const projects = this.restApi.root.addResource("projects");
    projects.addMethod("POST", new LambdaIntegration(postProjectsFn), {
      apiKeyRequired: true,
    });
    projects.addMethod("GET", new LambdaIntegration(listProjectsFn), {
      apiKeyRequired: true,
    });

    const projectById = projects.addResource("{id}");
    projectById.addMethod("GET", new LambdaIntegration(getProjectFn), {
      apiKeyRequired: true,
    });

    // POST /projects/{id}/approve-style
    const approveStyleResource = projectById.addResource("approve-style");
    approveStyleResource.addMethod(
      "POST",
      new LambdaIntegration(approveStyleFn),
      { apiKeyRequired: true },
    );

    // POST /projects/{id}/steps/{stepName}/retry
    const steps = projectById.addResource("steps");
    const stepByName = steps.addResource("{stepName}");
    const retryResource = stepByName.addResource("retry");
    retryResource.addMethod("POST", new LambdaIntegration(retryStepFn), {
      apiKeyRequired: true,
    });

    // GET + PUT /projects/{id}/files
    const filesResource = projectById.addResource("files");
    filesResource.addMethod("GET", new LambdaIntegration(getFilesFn), {
      apiKeyRequired: true,
    });
    filesResource.addMethod("PUT", new LambdaIntegration(putFilesFn), {
      apiKeyRequired: true,
    });

    // PATCH /projects/{id}/draft
    const draftResource = projectById.addResource("draft");
    draftResource.addMethod("PATCH", new LambdaIntegration(patchDraftFn), {
      apiKeyRequired: true,
    });

    // POST /projects/{id}/init-draft
    const initDraftResource = projectById.addResource("init-draft");
    initDraftResource.addMethod(
      "POST",
      new LambdaIntegration(initializeDraftFn),
      { apiKeyRequired: true },
    );

    // POST /projects/{id}/deploy
    const deployResource = projectById.addResource("deploy");
    deployResource.addMethod("POST", new LambdaIntegration(deployDraftFn), {
      apiKeyRequired: true,
    });

    // GET /projects/{id}/versions  and  GET /projects/{id}/versions/{v}
    const versionsResource = projectById.addResource("versions");
    versionsResource.addMethod("GET", new LambdaIntegration(listVersionsFn), {
      apiKeyRequired: true,
    });
    const versionById = versionsResource.addResource("{v}");
    versionById.addMethod("GET", new LambdaIntegration(getVersionFn), {
      apiKeyRequired: true,
    });

    // POST /projects/{id}/versions/{v}/revert
    const revertResource = versionById.addResource("revert");
    revertResource.addMethod("POST", new LambdaIntegration(revertVersionFn), {
      apiKeyRequired: true,
    });

    // POST /projects/{id}/share  and  DELETE /projects/{id}/share/{tokenId}
    const shareMutResource = projectById.addResource("share");
    shareMutResource.addMethod(
      "POST",
      new LambdaIntegration(createShareTokenFn),
      { apiKeyRequired: true },
    );
    const shareById = shareMutResource.addResource("{tokenId}");
    shareById.addMethod("DELETE", new LambdaIntegration(revokeShareTokenFn), {
      apiKeyRequired: true,
    });

    // GET /projects/{id}/shares
    const sharesResource = projectById.addResource("shares");
    sharesResource.addMethod("GET", new LambdaIntegration(listShareTokensFn), {
      apiKeyRequired: true,
    });

    // GET /projects/{id}/feedback
    const feedbackResource = projectById.addResource("feedback");
    feedbackResource.addMethod("GET", new LambdaIntegration(listFeedbackFn), {
      apiKeyRequired: true,
    });

    // Public share routes — token-validated, no X-Seller-Id required.
    // apiKeyRequired still true so random internet traffic is blocked.
    const shareResource = this.restApi.root.addResource("share");
    const shareByToken = shareResource.addResource("{token}");
    shareByToken.addMethod("GET", new LambdaIntegration(getShareFn), {
      apiKeyRequired: true,
    });
    const shareFeedback = shareByToken.addResource("feedback");
    shareFeedback.addMethod("POST", new LambdaIntegration(postFeedbackFn), {
      apiKeyRequired: true,
    });
  }
}
