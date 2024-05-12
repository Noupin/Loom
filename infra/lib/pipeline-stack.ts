import { Fn, Stack, StackProps } from "aws-cdk-lib";
import { Distribution } from "aws-cdk-lib/aws-cloudfront";
import {
  BuildSpec,
  LinuxBuildImage,
  PipelineProject,
} from "aws-cdk-lib/aws-codebuild";
import { Artifact, Pipeline } from "aws-cdk-lib/aws-codepipeline";
import {
  CodeBuildAction,
  ManualApprovalAction,
  S3SourceAction,
  S3Trigger,
} from "aws-cdk-lib/aws-codepipeline-actions";
import { Rule } from "aws-cdk-lib/aws-events";
import { CodePipeline } from "aws-cdk-lib/aws-events-targets";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class LoomPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Get the hosting buckets and OAI from the StorageStack
    const artifactBucketName = Fn.importValue("LoomArtifactBucketName");
    const devHostingBucketName = Fn.importValue("LoomDevHostingBucketName");
    const hostingBucketName = Fn.importValue("LoomHostingBucketName");

    const artifactBucket = Bucket.fromBucketName(
      this,
      "ImportedArtifactBucket",
      artifactBucketName
    );
    const devHostingBucket = Bucket.fromBucketName(
      this,
      "ImportedDevHostingBucket",
      devHostingBucketName
    );
    const hostingBucket = Bucket.fromBucketName(
      this,
      "ImportedHostingBucket",
      hostingBucketName
    );

    const devDistributionID = Fn.importValue("LoomDevDistributionId");
    const distributionID = Fn.importValue("LoomDistributionId");

    // Create a new CodePipeline
    const pipeline = new Pipeline(this, "LoomPipeline", {
      pipelineName: "loom-pipeline",
      artifactBucket: artifactBucket,
    });
    // Define a source artifact
    const infraSourceArtifact = new Artifact("InfraSrc");

    const infraSourceAction = new S3SourceAction({
      actionName: "InfraS3Source",
      bucket: artifactBucket,
      bucketKey: "latest_infra.zip",
      output: infraSourceArtifact,
      trigger: S3Trigger.EVENTS,
    });
    pipeline.addStage({
      stageName: "Source",
      actions: [infraSourceAction],
    });

    // Build stage for deploying to infrastructure
    const infraBuildProject = new PipelineProject(
      this,
      "LoomDeployInfrastructure",
      {
        environment: {
          buildImage: LinuxBuildImage.STANDARD_5_0,
        },
        buildSpec: BuildSpec.fromObject({
          version: "0.2",
          phases: {
            install: {
              "runtime-versions": {
                nodejs: "20",
              },
            },
            build: {
              commands: [
                "npm install -g aws-cdk",
                "npm install",
                "npx cdk deploy LoomStorageStack --require-approval never",
                "npx cdk deploy LoomCloudfrontStack --require-approval never",
                "npx cdk deploy LoomPipelineStack --require-approval never",
              ],
            },
          },
        }),
      }
    );

    infraBuildProject.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["sts:AssumeRole"],
        resources: ["arn:aws:iam::*:role/cdk-*"],
      })
    );

    // Deploy Infrastructure
    const deployInfraAction = new CodeBuildAction({
      actionName: "DeployInfrastructure",
      project: infraBuildProject,
      input: infraSourceArtifact, // Use the S3 source artifact as input
    });
    pipeline.addStage({
      stageName: "DeployInfrastructure",
      actions: [deployInfraAction],
    });

    // Build stage for deploying to dev
    const devBuildProject = new PipelineProject(this, "LoomDevDeployProject", {
      environment: {
        buildImage: LinuxBuildImage.STANDARD_5_0,
      },
      buildSpec: BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            "runtime-versions": {
              nodejs: "20",
            },
          },
          build: {
            commands: [
              "aws s3 cp s3://$SOURCE_BUCKET/$SOURCE_KEY artifact.zip",
              "unzip -o artifact.zip",
              "aws s3 sync dist/ s3://$DEPLOY_BUCKET/",
              'aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"',
            ],
          },
        },
      }),
    });

    devBuildProject.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "s3:GetObject", // To download the artifact
          "s3:ListBucket", // To list objects in the artifact bucket
          "s3:PutObject", // To upload files to the deployment bucket
          "s3:DeleteObject", // To delete files from the deployment bucket
          "cloudfront:CreateInvalidation", // To create CloudFront invalidation
        ],
        resources: [
          artifactBucket.bucketArn, // Access to the artifact bucket
          `${artifactBucket.bucketArn}/*`, // Access to objects within the artifact bucket
          devHostingBucket.bucketArn, // Access to the deployment bucket
          `${devHostingBucket.bucketArn}/*`, // Access to objects within the deployment bucket
          Stack.of(this).formatArn({
            service: "cloudfront",
            resource: "distribution",
            region: "", // Empty region for global resources
            resourceName: devDistributionID,
          }), // Access to the CloudFront distribution
        ],
      })
    );

    // Deployment to Dev environment
    const deployToDevAction = new CodeBuildAction({
      actionName: "DeployWebsiteToDev",
      project: devBuildProject,
      input: infraSourceArtifact, // Use the S3 source artifact as input
      environmentVariables: {
        SOURCE_BUCKET: { value: artifactBucket.bucketName },
        SOURCE_KEY: { value: "latest_web.zip" },
        DEPLOY_BUCKET: { value: devHostingBucket.bucketName },
        DISTRIBUTION_ID: { value: devDistributionID },
      },
    });
    pipeline.addStage({
      stageName: "DeployToDev",
      actions: [deployToDevAction],
    });

    // Manual approval
    const prodApprovalAction = new ManualApprovalAction({
      actionName: "ApproveProdDeployment",
    });
    pipeline.addStage({
      stageName: "ApproveProd",
      actions: [prodApprovalAction],
    });

    // Build stage for deploying to dev
    const prodBuildProject = new PipelineProject(this, "LoomDeployProject", {
      environment: {
        buildImage: LinuxBuildImage.STANDARD_5_0,
      },
      buildSpec: BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            "runtime-versions": {
              nodejs: "20",
            },
          },
          build: {
            commands: [
              "aws s3 cp s3://$SOURCE_BUCKET/ s3://$DEPLOY_BUCKET/ --recursive",
              'aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"',
            ],
          },
        },
      }),
    });

    prodBuildProject.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "s3:GetObject", // To download the artifact
          "s3:ListBucket", // To list objects in the artifact bucket
          "s3:PutObject", // To upload files to the deployment bucket
          "s3:DeleteObject", // To delete files from the deployment bucket
          "cloudfront:CreateInvalidation", // To create CloudFront invalidation
        ],
        resources: [
          devHostingBucket.bucketArn, // Access to the artifact bucket
          `${devHostingBucket.bucketArn}/*`, // Access to objects within the artifact bucket
          hostingBucket.bucketArn, // Access to the deployment bucket
          `${hostingBucket.bucketArn}/*`, // Access to objects within the deployment bucket
          Stack.of(this).formatArn({
            service: "cloudfront",
            resource: "distribution",
            region: "", // Empty region for global resources
            resourceName: distributionID,
          }), // Access to the CloudFront distribution
        ],
      })
    );

    // Deployment to Prod environment
    const deployToProdAction = new CodeBuildAction({
      actionName: "DeployWebsiteToProd",
      project: prodBuildProject,
      input: infraSourceArtifact, // Use the S3 source artifact as input
      environmentVariables: {
        SOURCE_BUCKET: { value: devHostingBucket.bucketName },
        DEPLOY_BUCKET: { value: hostingBucket.bucketName },
        DISTRIBUTION_ID: { value: distributionID },
      },
    });
    pipeline.addStage({
      stageName: "DeployToProd",
      actions: [deployToProdAction],
    });

    // Grant permissions for pipeline to read from artifact bucket
    artifactBucket.grantRead(pipeline.role, "*");
  }
}
