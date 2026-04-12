#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { MainStage } from "../stages/MainStage";

const app = new cdk.App();

new MainStage(app, "SitegenDev", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

app.synth();
