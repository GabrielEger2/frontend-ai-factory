import * as path from "path";
import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { AgentLambda } from "../constructs/AgentLambda";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface SiteDeployStackProps extends StackProps {
  readonly pipelineBucketName: string;
  readonly pipelineBucketArn: string;
  readonly projectsTableName: string;
  readonly projectsTableArn: string;
}

/* ------------------------------------------------------------------ */
/*  Stack                                                              */
/* ------------------------------------------------------------------ */

/**
 * SiteDeployStack — Vercel deployment Lambda.
 *
 * Reads assembled site zip from S3, fetches Vercel API token from SSM,
 * and deploys the site via Vercel API. Updates project status in DynamoDB.
 */
export class SiteDeployStack extends Stack {
  /** The AgentLambda construct — use deployFn.fn for IAM grants. */
  public readonly deployFn: AgentLambda;

  constructor(scope: Construct, id: string, props: SiteDeployStackProps) {
    super(scope, id, props);

    const ssmParameterPath = "/sitegen/dev/vercel-api-token";

    /* ---- Deploy Lambda ---- */

    this.deployFn = new AgentLambda(this, "DeployAgent", {
      entry: path.join(__dirname, "../../agents/deploy/handler.ts"),
      agentName: "deploy",
      timeout: Duration.minutes(10),
      memorySize: 512,
      environment: {
        PIPELINE_BUCKET_NAME: props.pipelineBucketName,
        PROJECTS_TABLE_NAME: props.projectsTableName,
        VERCEL_TOKEN_SSM_PATH: ssmParameterPath,
      },
    });

    /* ---- IAM: SSM read for Vercel token ---- */

    const ssmArn = `arn:aws:ssm:${Stack.of(this).region}:${Stack.of(this).account}:parameter${ssmParameterPath}`;

    this.deployFn.fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ssm:GetParameter"],
        resources: [ssmArn],
      }),
    );

    /* ---- IAM: S3 read on pipeline bucket ---- */

    const pipelineBucket = s3.Bucket.fromBucketArn(
      this,
      "PipelineBucket",
      props.pipelineBucketArn,
    );
    pipelineBucket.grantRead(this.deployFn.fn);

    /* ---- IAM: DynamoDB read+write on projects table ---- */

    const projectsTable = dynamodb.Table.fromTableArn(
      this,
      "ProjectsTable",
      props.projectsTableArn,
    );
    projectsTable.grantReadWriteData(this.deployFn.fn);
  }
}
