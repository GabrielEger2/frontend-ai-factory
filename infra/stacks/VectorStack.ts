import { Stack, StackProps, CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface VectorStackProps extends StackProps {}

/* ------------------------------------------------------------------ */
/*  Stack                                                              */
/* ------------------------------------------------------------------ */

/**
 * VectorStack — Qdrant Cloud + OpenAI SSM parameter paths.
 *
 * Exposes SSM parameter paths for the Qdrant Cloud cluster endpoint, the
 * Qdrant API key, and the OpenAI API key (used for text-embedding-3-small).
 * The Qdrant cluster itself is managed externally (SaaS). Agent Lambdas and
 * offline seed scripts read from these paths at runtime.
 *
 * Only the endpoint placeholder is CDK-managed. The Qdrant API key
 * (`qdrant-api-key`) and OpenAI API key (`openai-api-key`) parameters MUST
 * be created out-of-band via `aws ssm put-parameter --type SecureString` —
 * CloudFormation does not support creating SecureString SSM parameters
 * (only String and StringList). See docs/qdrant-provisioning.md.
 *
 * No cross-stack imports. Other stacks receive SSM paths as string props
 * through MainStage.
 */
export class VectorStack extends Stack {
  /** SSM parameter path for the Qdrant Cloud cluster endpoint (CDK-managed placeholder). */
  public readonly qdrantEndpointSsmPath: string;

  /** SSM parameter path for the Qdrant API key (created manually via CLI). */
  public readonly qdrantApiKeySsmPath: string;

  /** SSM parameter path for the OpenAI API key (created manually via CLI). */
  public readonly openAiApiKeySsmPath: string;

  constructor(scope: Construct, id: string, props?: VectorStackProps) {
    super(scope, id, props);

    this.qdrantEndpointSsmPath = "/sitegen/dev/qdrant-endpoint";
    this.qdrantApiKeySsmPath = "/sitegen/dev/qdrant-api-key";
    this.openAiApiKeySsmPath = "/sitegen/dev/openai-api-key";

    const endpointParam = new ssm.StringParameter(this, "QdrantEndpointParam", {
      parameterName: this.qdrantEndpointSsmPath,
      stringValue: "REPLACE_AFTER_QDRANT_PROVISION",
      description:
        "Qdrant Cloud cluster endpoint — set manually after provisioning",
    });
    endpointParam.applyRemovalPolicy(RemovalPolicy.RETAIN);

    new CfnOutput(this, "QdrantEndpointSsmPath", {
      value: this.qdrantEndpointSsmPath,
    });
    new CfnOutput(this, "QdrantApiKeySsmPath", {
      value: this.qdrantApiKeySsmPath,
    });
    new CfnOutput(this, "OpenAiApiKeySsmPath", {
      value: this.openAiApiKeySsmPath,
    });
  }
}
