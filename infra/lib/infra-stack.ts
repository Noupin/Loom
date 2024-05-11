import { Stack, RemovalPolicy, StackProps } from "aws-cdk-lib";
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
  CodeDeployServerDeployAction,
  ManualApprovalAction,
  S3DeployAction,
  S3SourceAction,
} from "aws-cdk-lib/aws-codepipeline-actions";
import {
  ServerApplication,
  ServerDeploymentGroup,
} from "aws-cdk-lib/aws-codedeploy";
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
            behaviors: [{ isDefaultBehavior: true }],
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
            behaviors: [{ isDefaultBehavior: true }],
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
    const sourceArtifact = new Artifact();

    // Source stage for S3 to trigger the pipeline
    const sourceAction = new S3SourceAction({
      actionName: "S3Source",
      bucket: artifactBucket,
      bucketKey: "latest.zip", // This won't actually be used, but is needed to configure the action
      output: sourceArtifact,
    });
    pipeline.addStage({
      stageName: "Source",
      actions: [sourceAction],
    });

    const devArtifact = new Artifact("DevArtifact");
    // Deployment to Dev environment
    const deployToDevAction = new S3DeployAction({
      actionName: "DeployToDev",
      bucket: dev_hostingBucket,
      input: sourceArtifact,
      extract: true,
      runOrder: 1,
    });
    const buildProject = new PipelineProject(this, "CopyFilesProject", {
      buildSpec: BuildSpec.fromObject({
        version: "0.2",
        phases: {
          build: {
            commands: [
              "aws s3 cp s3://$CURRENT_BUCKET/ s3://$ARTIFACT_BUCKET/staging/ --recursive",
            ],
          },
        },
        artifacts: {
          "base-directory": "staging",
          files: "**/*",
        },
      }),
    });

    const buildAction = new CodeBuildAction({
      actionName: "CopyFilesForProd",
      project: buildProject,
      input: sourceArtifact,
      outputs: [devArtifact],
      environmentVariables: {
        CURRENT_BUCKET: { value: dev_hostingBucket.bucketName },
        ARTIFACT_BUCKET: { value: artifactBucket.bucketName },
      },
      runOrder: 2,
    });
    pipeline.addStage({
      stageName: "DeployToDev",
      actions: [deployToDevAction, buildAction],
    });

    // Manual approval
    const prodApprovalAction = new ManualApprovalAction({
      actionName: "ApproveProdDeployment",
    });
    pipeline.addStage({
      stageName: "ApproveProd",
      actions: [prodApprovalAction],
    });

    // Deployment to Prod environment
    const deployToProdAction = new S3DeployAction({
      actionName: "DeployToProd",
      bucket: hostingBucket,
      input: devArtifact, // Use the artifact resulting from Dev deployment
      extract: true,
    });
    pipeline.addStage({
      stageName: "DeployToProd",
      actions: [deployToProdAction],
    });

    // Grant permissions for pipeline to read from artifact bucket
    artifactBucket.grantRead(pipeline.role, "*");
  }
}
