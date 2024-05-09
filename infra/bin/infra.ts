#!/usr/bin/env node
import "source-map-support/register";
import { LoomInfraStack } from "../lib/infra-stack";
import { App } from "aws-cdk-lib";

const app = new App();
new LoomInfraStack(app, "LoomInfraStack", {
  description: "The infrastructure needed for the Loom application",
});
