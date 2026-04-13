import * as path from "path";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  RestApi,
  Cors,
  ApiKey,
  UsagePlan,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
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
  readonly pipelineQueueUrl: string;
  readonly pipelineQueueArn: string;
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
 */
export class ApiStack extends Stack {
  /** The REST API — exposed for cross-stack wiring (e.g. dashboard config). */
  public readonly restApi: RestApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    /* -------------------------------------------------------------- */
    /*  REST API                                                       */
    /* -------------------------------------------------------------- */

    this.restApi = new RestApi(this, "SitegenApi", {
      restApiName: "sitegen-api",
      deployOptions: { stageName: "v1" },
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ["GET", "POST", "OPTIONS"],
      },
    });

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
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    // DynamoDB scan access on projects table
    listProjectsFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:Scan"],
        resources: [props.projectsTableArn],
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
  }
}
