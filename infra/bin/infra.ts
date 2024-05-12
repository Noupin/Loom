#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { LoomStorageStack } from "../lib/storage-stack";
import { LoomCloudfrontStack } from "../lib/cloudfront-stack";
import { LoomPipelineStack } from "../lib/pipeline-stack";

const app = new App();
new LoomStorageStack(app, "LoomStorageStack", {
  description: "The storage stack for the Loom website",
});
new LoomCloudfrontStack(app, "LoomCloudfrontStack", {
  description: "The hosting stack for the Loom website",
});
new LoomPipelineStack(app, "LoomPipelineStack", {
  description: "The pipeline stack for the Loom website",
});
