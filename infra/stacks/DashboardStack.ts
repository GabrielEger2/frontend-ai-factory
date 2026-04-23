import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";

export interface DashboardStackProps extends StackProps {
  readonly apiUrl: string;
}

export class DashboardStack extends Stack {
  constructor(scope: Construct, id: string, props: DashboardStackProps) {
    super(scope, id, props);
    // TODO: Add OpenNext construct in follow-up PR to deploy via @open-next/cdk.
    new CfnOutput(this, "ApiUrl", {
      value: props.apiUrl,
      description: "SiteGen API base URL for dashboard configuration",
    });
  }
}
