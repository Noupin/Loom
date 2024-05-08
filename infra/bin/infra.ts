#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { InfraStack } from "../lib/infra-stack";

const app = new cdk.App();
new InfraStack(app, "InfraStack", {
  /* If you need to set environment-specific settings */
  env: { account: "123456789012", region: "us-east-1" },
});
