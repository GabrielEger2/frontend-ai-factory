import * as path from "path";
import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { AgentLambda } from "../constructs/AgentLambda";
import {
  LAMBDA_DEFAULTS,
  ESBUILD_DEFAULTS,
} from "../constructs/lambda-defaults";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface PipelineStackProps extends StackProps {
  readonly projectsTableName: string;
  readonly projectsTableArn: string;
  readonly componentsTableName: string;
  readonly componentsTableArn: string;
  readonly pipelineBucketName: string;
  readonly pipelineBucketArn: string;
  readonly deployFunctionArn: string;
}

/* ------------------------------------------------------------------ */
/*  Stack                                                              */
/* ------------------------------------------------------------------ */

/**
 * PipelineStack — SQS queue, Step Functions state machine, and agent Lambdas.
 *
 * Creates the 7-step pipeline:
 *   Research -> Style (WaitForTaskToken) -> Content -> Humanizer -> Assembler -> QA -> Deploy
 *
 * Also creates the pipeline-starter Lambda that consumes SQS messages
 * and starts Step Function executions.
 */
export class PipelineStack extends Stack {
  /** The pipeline ingestion queue — exposed for ApiStack to send messages. */
  public readonly queue: sqs.Queue;

  /** The state machine ARN — exposed for ApiStack to send task tokens. */
  public readonly stateMachineArn: string;

  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    /* -------------------------------------------------------------- */
    /*  SQS: Dead Letter Queue + Main Queue                           */
    /* -------------------------------------------------------------- */

    const dlq = new sqs.Queue(this, "PipelineDlq", {
      queueName: "sitegen-pipeline-dlq",
      retentionPeriod: Duration.days(7),
    });

    this.queue = new sqs.Queue(this, "PipelineQueue", {
      queueName: "sitegen-pipeline",
      visibilityTimeout: Duration.seconds(600),
      deadLetterQueue: {
        queue: dlq,
        maxReceiveCount: 3,
      },
    });

    /* -------------------------------------------------------------- */
    /*  Import shared resources via ARN (stack isolation)              */
    /* -------------------------------------------------------------- */

    const projectsTable = dynamodb.Table.fromTableArn(
      this,
      "ProjectsTable",
      props.projectsTableArn,
    );

    const componentsTable = dynamodb.Table.fromTableArn(
      this,
      "ComponentsTable",
      props.componentsTableArn,
    );

    const pipelineBucket = s3.Bucket.fromBucketArn(
      this,
      "PipelineBucket",
      props.pipelineBucketArn,
    );

    const deployFn = lambda.Function.fromFunctionArn(
      this,
      "DeployFn",
      props.deployFunctionArn,
    );

    /* -------------------------------------------------------------- */
    /*  Content Agent Lambda                                          */
    /* -------------------------------------------------------------- */

    const claudeSsmPath = "/sitegen/dev/claude-api-key";

    const contentFn = new AgentLambda(this, "ContentAgent", {
      entry: path.join(__dirname, "../../agents/content/handler.ts"),
      agentName: "content",
      timeout: Duration.minutes(5),
      memorySize: 512,
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        COMPONENTS_TABLE_NAME: props.componentsTableName,
        CLAUDE_API_KEY_SSM_PATH: claudeSsmPath,
      },
    });

    // DynamoDB read+write on both tables
    projectsTable.grantReadWriteData(contentFn.fn);
    componentsTable.grantReadWriteData(contentFn.fn);

    // SSM read for Claude API key
    const claudeSsmArn = `arn:aws:ssm:${Stack.of(this).region}:${Stack.of(this).account}:parameter${claudeSsmPath}`;
    contentFn.fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ssm:GetParameter"],
        resources: [claudeSsmArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  Assembler Lambda                                              */
    /* -------------------------------------------------------------- */

    const assemblerFn = new AgentLambda(this, "AssemblerAgent", {
      entry: path.join(__dirname, "../../agents/assembler/handler.ts"),
      agentName: "assembler",
      timeout: Duration.minutes(5),
      memorySize: 1024,
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        PIPELINE_BUCKET_NAME: props.pipelineBucketName,
      },
    });

    // DynamoDB read+write on projects table
    projectsTable.grantReadWriteData(assemblerFn.fn);

    // S3 write on pipeline bucket
    pipelineBucket.grantWrite(assemblerFn.fn);

    /* -------------------------------------------------------------- */
    /*  Humanizer Agent Lambda                                        */
    /* -------------------------------------------------------------- */

    const humanizerFn = new AgentLambda(this, "HumanizerAgent", {
      entry: path.join(__dirname, "../../agents/humanizer/handler.ts"),
      agentName: "humanizer",
      timeout: Duration.minutes(5),
      memorySize: 512,
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        CLAUDE_API_KEY_SSM_PATH: claudeSsmPath,
      },
    });

    projectsTable.grantReadWriteData(humanizerFn.fn);
    humanizerFn.fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ssm:GetParameter"],
        resources: [claudeSsmArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  Research Agent Lambda                                         */
    /* -------------------------------------------------------------- */

    const researchFn = new AgentLambda(this, "ResearchAgent", {
      entry: path.join(__dirname, "../../agents/research/handler.ts"),
      agentName: "research",
      timeout: Duration.minutes(5),
      memorySize: 512,
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        CLAUDE_API_KEY_SSM_PATH: claudeSsmPath,
      },
    });

    projectsTable.grantReadWriteData(researchFn.fn);
    researchFn.fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ssm:GetParameter"],
        resources: [claudeSsmArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  Style Agent Lambda                                            */
    /* -------------------------------------------------------------- */

    const styleFn = new AgentLambda(this, "StyleAgent", {
      entry: path.join(__dirname, "../../agents/style/handler.ts"),
      agentName: "style",
      timeout: Duration.minutes(5),
      memorySize: 512,
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        CLAUDE_API_KEY_SSM_PATH: claudeSsmPath,
      },
    });

    projectsTable.grantReadWriteData(styleFn.fn);
    styleFn.fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ssm:GetParameter"],
        resources: [claudeSsmArn],
      }),
    );

    /* -------------------------------------------------------------- */
    /*  QA Agent Lambda                                               */
    /* -------------------------------------------------------------- */

    const qaFn = new AgentLambda(this, "QAAgent", {
      entry: path.join(__dirname, "../../agents/qa/handler.ts"),
      agentName: "qa",
      timeout: Duration.minutes(5),
      memorySize: 1024,
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
        PIPELINE_BUCKET_NAME: props.pipelineBucketName,
      },
    });

    projectsTable.grantReadWriteData(qaFn.fn);
    pipelineBucket.grantRead(qaFn.fn);

    /* -------------------------------------------------------------- */
    /*  Fail Handler Lambda                                           */
    /* -------------------------------------------------------------- */

    const failHandlerFn = new AgentLambda(this, "FailHandlerAgent", {
      entry: path.join(__dirname, "../../agents/fail-handler/handler.ts"),
      agentName: "fail-handler",
      timeout: Duration.seconds(30),
      memorySize: 256,
      environment: {
        PROJECTS_TABLE_NAME: props.projectsTableName,
      },
    });

    projectsTable.grantReadWriteData(failHandlerFn.fn);

    /* -------------------------------------------------------------- */
    /*  Step Functions State Machine                                   */
    /* -------------------------------------------------------------- */

    const terminalFail = new sfn.Fail(this, "PipelineFailed", {
      cause: "A pipeline step failed after retries",
      error: "PipelineError",
    });

    const qaTerminalFail = new sfn.Fail(this, "QAPipelineFailed", {
      cause: "QA checks failed — site has structural issues",
      error: "QAFailedError",
    });

    const failHandlerStep = new tasks.LambdaInvoke(this, "FailHandlerStep", {
      lambdaFunction: failHandlerFn.fn,
      outputPath: "$.Payload",
    }).next(terminalFail);

    const retryConfig: sfn.RetryProps = {
      maxAttempts: 2,
      backoffRate: 2,
      interval: Duration.seconds(5),
      errors: ["States.ALL"],
    };

    const researchStep = new tasks.LambdaInvoke(this, "ResearchStep", {
      lambdaFunction: researchFn.fn,
      outputPath: "$.Payload",
    });
    researchStep.addRetry(retryConfig);
    researchStep.addCatch(failHandlerStep, { resultPath: "$.error" });

    const styleStep = new tasks.LambdaInvoke(this, "StyleStep", {
      lambdaFunction: styleFn.fn,
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
      // IMPORTANT: Add new upstream fields here if PipelineState expands
      payload: sfn.TaskInput.fromObject({
        "projectId.$": "$.projectId",
        "status.$": "$.status",
        "companyName.$": "$.companyName",
        "segment.$": "$.segment",
        "description.$": "$.description",
        "researchOutput.$": "$.researchOutput",
        taskToken: sfn.JsonPath.taskToken,
      }),
    });
    styleStep.addRetry(retryConfig);
    styleStep.addCatch(failHandlerStep, { resultPath: "$.error" });

    const contentStep = new tasks.LambdaInvoke(this, "ContentStep", {
      lambdaFunction: contentFn.fn,
      outputPath: "$.Payload",
    });
    contentStep.addRetry(retryConfig);
    contentStep.addCatch(failHandlerStep, { resultPath: "$.error" });

    const humanizerStep = new tasks.LambdaInvoke(this, "HumanizerStep", {
      lambdaFunction: humanizerFn.fn,
      outputPath: "$.Payload",
    });
    humanizerStep.addRetry(retryConfig);
    humanizerStep.addCatch(failHandlerStep, { resultPath: "$.error" });

    const assemblerStep = new tasks.LambdaInvoke(this, "AssemblerStep", {
      lambdaFunction: assemblerFn.fn,
      outputPath: "$.Payload",
    });
    assemblerStep.addRetry(retryConfig);
    assemblerStep.addCatch(failHandlerStep, { resultPath: "$.error" });

    const qaStep = new tasks.LambdaInvoke(this, "QAStep", {
      lambdaFunction: qaFn.fn,
      outputPath: "$.Payload",
    });
    qaStep.addRetry({
      maxAttempts: 1,
      backoffRate: 1,
      interval: Duration.seconds(2),
      errors: ["States.ALL"],
    });
    qaStep.addCatch(qaTerminalFail, { resultPath: "$.error" });

    const deployStep = new tasks.LambdaInvoke(this, "DeployStep", {
      lambdaFunction: deployFn,
      outputPath: "$.Payload",
    });
    deployStep.addRetry(retryConfig);
    deployStep.addCatch(failHandlerStep, { resultPath: "$.error" });

    const succeedState = new sfn.Succeed(this, "PipelineSucceeded");

    const definition = researchStep
      .next(styleStep)
      .next(contentStep)
      .next(humanizerStep)
      .next(assemblerStep)
      .next(qaStep)
      .next(deployStep)
      .next(succeedState);

    const stateMachine = new sfn.StateMachine(this, "PipelineStateMachine", {
      stateMachineName: "sitegen-pipeline",
      definitionBody: sfn.DefinitionBody.fromChainable(definition),
      stateMachineType: sfn.StateMachineType.STANDARD,
      timeout: Duration.days(365),
    });

    this.stateMachineArn = stateMachine.stateMachineArn;

    /* -------------------------------------------------------------- */
    /*  Pipeline Starter Lambda (SQS consumer)                        */
    /* -------------------------------------------------------------- */

    const pipelineStarterFn = new NodejsFunction(this, "PipelineStarterFn", {
      ...LAMBDA_DEFAULTS,
      entry: path.join(__dirname, "../../agents/pipeline-starter/handler.ts"),
      handler: "handler",
      functionName: "sitegen-pipeline-starter",
      description:
        "SiteGen pipeline starter — consumes SQS, starts Step Functions",
      environment: {
        STATE_MACHINE_ARN: stateMachine.stateMachineArn,
        PROJECTS_TABLE_NAME: props.projectsTableName,
      },
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });

    // Grant startExecution on the state machine
    stateMachine.grantStartExecution(pipelineStarterFn);

    // DynamoDB read+write on projects table
    projectsTable.grantReadWriteData(pipelineStarterFn);

    // SQS event source with batchSize 1
    pipelineStarterFn.addEventSource(
      new SqsEventSource(this.queue, {
        batchSize: 1,
      }),
    );
  }
}
