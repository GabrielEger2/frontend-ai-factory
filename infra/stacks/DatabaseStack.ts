import { RemovalPolicy, Stack, StackProps, Duration } from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  ProjectionType,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
} from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface DatabaseStackProps extends StackProps {}

/* ------------------------------------------------------------------ */
/*  Stack                                                              */
/* ------------------------------------------------------------------ */

/**
 * DatabaseStack — DynamoDB tables and S3 pipeline bucket.
 *
 * Creates:
 *  - ProjectsTable  (pk + sk, PAY_PER_REQUEST, RETAIN)
 *  - ComponentsTable (pk only, PAY_PER_REQUEST, RETAIN)
 *  - PipelineBucket  (S3_MANAGED encryption, 7-day expiration, DESTROY)
 *
 * No cross-stack imports. Other stacks receive table/bucket references
 * as string props (names, ARNs) through MainStage.
 */
export class DatabaseStack extends Stack {
  /* ---- DynamoDB Tables ---- */

  /** Projects table — stores project briefs, pipeline state, agent outputs. */
  public readonly projectsTable: Table;

  /** Components table — stores component metadata seeded from library. */
  public readonly componentsTable: Table;

  /* ---- S3 Bucket ---- */

  /** Pipeline bucket — temporary storage for assembled site archives. */
  public readonly pipelineBucket: Bucket;

  constructor(scope: Construct, id: string, props?: DatabaseStackProps) {
    super(scope, id, props);

    /* -------------------------------------------------------------- */
    /*  ProjectsTable                                                  */
    /* -------------------------------------------------------------- */

    this.projectsTable = new Table(this, "ProjectsTable", {
      tableName: "sitegen-projects",
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    this.projectsTable.addGlobalSecondaryIndex({
      indexName: "sellerId-createdAt-index",
      partitionKey: { name: "sellerId", type: AttributeType.STRING },
      sortKey: { name: "createdAt", type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    /* -------------------------------------------------------------- */
    /*  ComponentsTable                                                */
    /* -------------------------------------------------------------- */

    this.componentsTable = new Table(this, "ComponentsTable", {
      tableName: "sitegen-components",
      partitionKey: { name: "pk", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    /* -------------------------------------------------------------- */
    /*  PipelineBucket                                                 */
    /* -------------------------------------------------------------- */

    this.pipelineBucket = new Bucket(this, "PipelineBucket", {
      bucketName: undefined, // CDK auto-generates a unique name
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [
        {
          expiration: Duration.days(7),
        },
      ],
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Convenience getters — string props for cross-stack wiring        */
  /* ---------------------------------------------------------------- */

  /** ProjectsTable name. */
  get projectsTableName(): string {
    return this.projectsTable.tableName;
  }

  /** ProjectsTable ARN. */
  get projectsTableArn(): string {
    return this.projectsTable.tableArn;
  }

  /** ProjectsTable sellerId-createdAt GSI name. */
  get projectsSellerIndexName(): string {
    return "sellerId-createdAt-index";
  }

  /** ProjectsTable sellerId-createdAt GSI ARN. */
  get projectsSellerIndexArn(): string {
    return `${this.projectsTable.tableArn}/index/sellerId-createdAt-index`;
  }

  /** ComponentsTable name. */
  get componentsTableName(): string {
    return this.componentsTable.tableName;
  }

  /** ComponentsTable ARN. */
  get componentsTableArn(): string {
    return this.componentsTable.tableArn;
  }

  /** PipelineBucket name. */
  get pipelineBucketName(): string {
    return this.pipelineBucket.bucketName;
  }

  /** PipelineBucket ARN. */
  get pipelineBucketArn(): string {
    return this.pipelineBucket.bucketArn;
  }
}
