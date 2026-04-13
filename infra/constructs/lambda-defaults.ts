import { Duration } from "aws-cdk-lib";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import type { BundlingOptions } from "aws-cdk-lib/aws-lambda-nodejs";

/* ------------------------------------------------------------------ */
/*  Standard Lambda defaults — API handlers, lightweight functions     */
/* ------------------------------------------------------------------ */

export const LAMBDA_DEFAULTS = {
  runtime: Runtime.NODEJS_20_X,
  architecture: Architecture.ARM_64,
  memorySize: 256,
  timeout: Duration.seconds(30),
} as const;

/* ------------------------------------------------------------------ */
/*  Agent Lambda defaults — AI agent handlers with longer timeouts     */
/* ------------------------------------------------------------------ */

export const AGENT_LAMBDA_DEFAULTS = {
  runtime: Runtime.NODEJS_20_X,
  architecture: Architecture.ARM_64,
  memorySize: 512,
  timeout: Duration.minutes(5),
} as const;

/* ------------------------------------------------------------------ */
/*  esbuild defaults for NodejsFunction bundling                       */
/* ------------------------------------------------------------------ */

export const ESBUILD_DEFAULTS: BundlingOptions = {
  minify: true,
  sourceMap: false,
  target: "node20",
  externalModules: ["@aws-sdk/*"],
};
