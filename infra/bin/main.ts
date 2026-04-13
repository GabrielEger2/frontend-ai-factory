#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { MainStage } from "../stages/MainStage";

const app = new cdk.App();

new MainStage(app, "SitegenDev");

app.synth();
