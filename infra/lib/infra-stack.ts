import { Stack, RemovalPolicy, StackProps, Aws, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
  SSLMethod,
  SecurityPolicyProtocol,
  ViewerCertificate,
} from "aws-cdk-lib/aws-cloudfront";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Effect, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
import { Artifact, Pipeline } from "aws-cdk-lib/aws-codepipeline";
import {
  CodeBuildAction,
  ManualApprovalAction,
  S3SourceAction,
} from "aws-cdk-lib/aws-codepipeline-actions";
import {
  BuildSpec,
  LinuxBuildImage,
  PipelineProject,
} from "aws-cdk-lib/aws-codebuild";

export class LoomInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const domainName = StringParameter.valueForStringParameter(
      this,
      "baseDomainName"
    );
    // TODO: Use domainName in the distributions
    // TODO: Setup specific roles for local user and others
    // TODO: Split into multiple stacks

    // Getting the certificate and roles needed
    const certificate = Certificate.fromCertificateArn(
      this,
      "LoomSSLCertificate",
      "arn:aws:acm:us-east-1:346316490277:certificate/64fad0d6-2c4a-4705-92ed-c90a48107393"
    );
    const githubActionsRole = Role.fromRoleArn(
      this,
      "GitHubActionsRole",
      "arn:aws:iam::346316490277:role/GitHubActionsRole"
    );

    // Create an OAI for the CloudFront distribution
    const originAccessIdentity = new OriginAccessIdentity(this, "LoomOAI", {
      comment: "OAI for my distribution",
    });

    // S3 Bucket for dev website hosting
    const dev_hostingBucket = new Bucket(this, "Loom_dev_HostingBucket", {
      websiteIndexDocument: "index.html",
      removalPolicy: RemovalPolicy.RETAIN, // Typically RETAIN for production
      bucketName: "loom-dev-hosting",
      publicReadAccess: false,
      versioned: true,
    });
    dev_hostingBucket.grantRead(originAccessIdentity);

    // S3 Bucket for website hosting
    const hostingBucket = new Bucket(this, "LoomHostingBucket", {
      websiteIndexDocument: "index.html",
      removalPolicy: RemovalPolicy.RETAIN, // Typically RETAIN for production
      bucketName: "loom-hosting",
      publicReadAccess: false,
      versioned: true,
    });
    hostingBucket.grantRead(originAccessIdentity);

    // S3 Bucket for artifacts
    const artifactBucket = new Bucket(this, "LoomArtifactBucket", {
      removalPolicy: RemovalPolicy.RETAIN, // RETAIN to avoid accidental data loss
      bucketName: "loom-artifacts",
      publicReadAccess: false,
      versioned: true,
    });
    artifactBucket.grantReadWrite(githubActionsRole);

    const distributionBehavior = {
      isDefaultBehavior: true,
      defaultTtl: Duration.seconds(1),
      maxTtl: Duration.seconds(1),
    };

    // CloudFront distribution for the website
    const dev_distribution = new CloudFrontWebDistribution(
      this,
      "Loom_dev_Distribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: dev_hostingBucket,
              originAccessIdentity: originAccessIdentity,
            },
            behaviors: [distributionBehavior],
          },
        ],
        viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate, {
          aliases: ["dev.loom.feryv.com"],
          securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2019,
          sslMethod: SSLMethod.SNI,
        }),
        errorConfigurations: [
          {
            errorCode: 403,
            responseCode: 200,
            responsePagePath: "/index.html",
          },
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: "/index.html",
          },
        ],
      }
    );

    const distribution = new CloudFrontWebDistribution(
      this,
      "LoomDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: hostingBucket,
              originAccessIdentity: originAccessIdentity,
            },
            behaviors: [distributionBehavior],
          },
        ],
        viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate, {
          aliases: ["loom.feryv.com"],
          securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2019,
          sslMethod: SSLMethod.SNI,
        }),
        errorConfigurations: [
          {
            errorCode: 403,
            responseCode: 200,
            responsePagePath: "/index.html",
          },
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: "/index.html",
          },
        ],
      }
    );

    // Create a new CodePipeline
    const pipeline = new Pipeline(this, "LoomPipeline", {
      pipelineName: "loom-pipeline",
      artifactBucket: artifactBucket,
    });
    // Define a source artifact
    const infraSourceArtifact = new Artifact("InfraSourceArtifact");

    const infraSourceAction = new S3SourceAction({
      actionName: "InfraS3Source",
      bucket: artifactBucket,
      bucketKey: "latest_infra.zip",
      output: infraSourceArtifact,
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
                "npx cdk deploy --require-approval never",
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
    const devBuildProject = new PipelineProject(
      this,
      "Loom_dev_DeployProject",
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
                "aws s3 cp s3://$SOURCE_BUCKET/$SOURCE_KEY artifact.zip",
                "unzip -o artifact.zip",
                "aws s3 sync dist/ s3://$DEPLOY_BUCKET/",
              ],
            },
          },
        }),
      }
    );

    devBuildProject.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "s3:GetObject", // To download the artifact
          "s3:ListBucket", // To list objects in the artifact bucket
          "s3:PutObject", // To upload files to the deployment bucket
          "s3:DeleteObject", // To delete files from the deployment bucket
        ],
        resources: [
          artifactBucket.bucketArn, // Access to the artifact bucket
          `${artifactBucket.bucketArn}/*`, // Access to objects within the artifact bucket
          dev_hostingBucket.bucketArn, // Access to the deployment bucket
          `${dev_hostingBucket.bucketArn}/*`, // Access to objects within the deployment bucket
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
        DEPLOY_BUCKET: { value: dev_hostingBucket.bucketName },
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
    const prodBuildProject = new PipelineProject(this, "Loom_DeployProject", {
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
        ],
        resources: [
          dev_hostingBucket.bucketArn, // Access to the artifact bucket
          `${dev_hostingBucket.bucketArn}/*`, // Access to objects within the artifact bucket
          hostingBucket.bucketArn, // Access to the deployment bucket
          `${hostingBucket.bucketArn}/*`, // Access to objects within the deployment bucket
        ],
      })
    );

    // Deployment to Prod environment
    const deployToProdAction = new CodeBuildAction({
      actionName: "DeployWebsiteToProd",
      project: prodBuildProject,
      input: infraSourceArtifact, // Use the S3 source artifact as input
      environmentVariables: {
        SOURCE_BUCKET: { value: dev_hostingBucket.bucketName },
        DEPLOY_BUCKET: { value: hostingBucket.bucketName },
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
