import {
  Stack,
  StackProps,
  CfnOutput,
  RemovalPolicy,
  CfnDeletionPolicy,
} from "aws-cdk-lib";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface GraphStackProps extends StackProps {}

/* ------------------------------------------------------------------ */
/*  Stack                                                              */
/* ------------------------------------------------------------------ */

/**
 * GraphStack — Neo4j Aura connection parameters.
 *
 * Lightweight stack that exposes SSM parameter paths for Neo4j credentials.
 * The actual Neo4j Aura instance is managed externally (SaaS).
 * Agent Lambdas use these paths to retrieve credentials at runtime.
 *
 * No cross-stack imports. Other stacks receive SSM paths as string props
 * through MainStage.
 */
export class GraphStack extends Stack {
  /** SSM parameter path for the Neo4j connection URI. */
  public readonly neo4jUriSsmPath: string;

  /** SSM parameter path for the Neo4j password. */
  public readonly neo4jPasswordSsmPath: string;

  constructor(scope: Construct, id: string, props?: GraphStackProps) {
    super(scope, id, props);

    this.neo4jUriSsmPath = "/sitegen/dev/neo4j-uri";
    this.neo4jPasswordSsmPath = "/sitegen/dev/neo4j-password";

    const uriParam = new ssm.StringParameter(this, "Neo4jUriParam", {
      parameterName: this.neo4jUriSsmPath,
      stringValue: "REPLACE_AFTER_AURA_PROVISION",
      description:
        "Neo4j Aura connection URI — set manually after provisioning",
    });
    uriParam.applyRemovalPolicy(RemovalPolicy.RETAIN);

    const passwordParam = new ssm.CfnParameter(this, "Neo4jPasswordParam", {
      name: this.neo4jPasswordSsmPath,
      type: "SecureString",
      value: "REPLACE_AFTER_AURA_PROVISION",
      description: "Neo4j Aura password — set manually after provisioning",
    });
    passwordParam.cfnOptions.deletionPolicy = CfnDeletionPolicy.RETAIN;
    passwordParam.cfnOptions.updateReplacePolicy = CfnDeletionPolicy.RETAIN;

    new CfnOutput(this, "Neo4jUriSsmPath", { value: this.neo4jUriSsmPath });
    new CfnOutput(this, "Neo4jPasswordSsmPath", {
      value: this.neo4jPasswordSsmPath,
    });
  }
}
