import { Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { AGENT_LAMBDA_DEFAULTS, ESBUILD_DEFAULTS } from "./lambda-defaults";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface AgentLambdaProps {
  /** Absolute path to the handler.ts entry file. */
  readonly entry: string;

  /** Logical agent name (used for function naming and description). */
  readonly agentName: string;

  /** Environment variables forwarded to the Lambda function. */
  readonly environment: Record<string, string>;

  /** Override default timeout (default: 5 min). */
  readonly timeout?: Duration;

  /** Override default memory size in MB (default: 512). */
  readonly memorySize?: number;
}

/* ------------------------------------------------------------------ */
/*  Construct                                                          */
/* ------------------------------------------------------------------ */

/**
 * Reusable construct that creates a standardised agent Lambda function.
 *
 * Uses AGENT_LAMBDA_DEFAULTS (ARM64, Node 20, 512 MB, 5-min timeout)
 * merged with caller-supplied overrides.  IAM permissions are NOT wired
 * here — consuming stacks grant access via the exposed `fn` reference.
 */
export class AgentLambda extends Construct {
  /** The underlying NodejsFunction — use for IAM grants in stacks. */
  public readonly fn: NodejsFunction;

  constructor(scope: Construct, id: string, props: AgentLambdaProps) {
    super(scope, id);

    this.fn = new NodejsFunction(this, `${props.agentName}Fn`, {
      ...AGENT_LAMBDA_DEFAULTS,
      entry: props.entry,
      handler: "handler",
      functionName: `sitegen-${props.agentName}`,
      description: `SiteGen ${props.agentName} agent`,
      environment: props.environment,
      memorySize: props.memorySize ?? AGENT_LAMBDA_DEFAULTS.memorySize,
      timeout: props.timeout ?? AGENT_LAMBDA_DEFAULTS.timeout,
      bundling: {
        ...ESBUILD_DEFAULTS,
      },
    });
  }
}
