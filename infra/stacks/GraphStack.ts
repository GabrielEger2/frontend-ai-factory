import { Stack, StackProps, CfnOutput, RemovalPolicy } from "aws-cdk-lib";
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
 * Exposes SSM parameter paths for Neo4j credentials. The actual Aura instance
 * is managed externally (SaaS). Agent Lambdas read from these paths at runtime.
 *
 * Only the URI placeholder is CDK-managed. The password parameter must be
 * created out-of-band via `aws ssm put-parameter --type SecureString` —
 * CloudFormation does not support creating SecureString SSM parameters
 * (only String and StringList). See docs/neo4j-provisioning.md.
 *
 * No cross-stack imports. Other stacks receive SSM paths as string props
 * through MainStage.
 */
export class GraphStack extends Stack {
  /** SSM parameter path for the Neo4j connection URI (CDK-managed placeholder). */
  public readonly neo4jUriSsmPath: string;

  /** SSM parameter path for the Neo4j password (created manually via CLI). */
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

    new CfnOutput(this, "Neo4jUriSsmPath", { value: this.neo4jUriSsmPath });
    new CfnOutput(this, "Neo4jPasswordSsmPath", {
      value: this.neo4jPasswordSsmPath,
    });
  }
}
