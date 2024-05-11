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
import { PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
import { Artifact, Pipeline } from "aws-cdk-lib/aws-codepipeline";
import {
  CodeDeployServerDeployAction,
  ManualApprovalAction,
  S3SourceAction,
  S3Trigger,
} from "aws-cdk-lib/aws-codepipeline-actions";
import {
  ServerApplication,
  ServerDeploymentGroup,
} from "aws-cdk-lib/aws-codedeploy";
import { Function } from "aws-cdk-lib/aws-lambda";
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
    });
    dev_hostingBucket.grantRead(originAccessIdentity);

    // S3 Bucket for website hosting
    const hostingBucket = new Bucket(this, "LoomHostingBucket", {
      websiteIndexDocument: "index.html",
      removalPolicy: RemovalPolicy.RETAIN, // Typically RETAIN for production
      bucketName: "loom-hosting",
      publicReadAccess: false,
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

    // Get Lambda Role
    const existingLambdaRole = Role.fromRoleArn(
      this,
      "LambdaExistingRole",
      "arn:aws:iam::346316490277:role/TriggerPipelineWithLatestArtifactRole",
      {
        mutable: true, // This needs to be true to allow modifications
      }
    );
    // Define the Lambda function
    const pipelineTriggerLambda = Function.fromFunctionAttributes(
      this,
      "PipelineTriggerLambda",
      {
        functionArn:
          "arn:aws:lambda:us-east-1:346316490277:function:TriggerPipelineWithLatestArtifact",
        role: existingLambdaRole,
      }
    );
    artifactBucket.grantRead(pipelineTriggerLambda);

    // Create a new CodePipeline
    const pipeline = new Pipeline(this, "LoomPipeline", {
      pipelineName: "loom-pipeline",
      artifactBucket: artifactBucket,
    });
    // Define a source artifact
    const sourceArtifact = new Artifact();

    // Source stage - dummy stage in this case, since Lambda triggers the pipeline
    const sourceAction = new S3SourceAction({
      actionName: "S3Source",
      bucket: artifactBucket,
      bucketKey: "dummy-key", // This won't actually be used, but is needed to configure the action
      output: sourceArtifact,
      trigger: S3Trigger.NONE, // No automatic trigger
    });
    pipeline.addStage({
      stageName: "Source",
      actions: [sourceAction],
    });

    // Deployment to Dev environment
    const deployToDevAction = new CodeDeployServerDeployAction({
      actionName: "DeployToDev",
      input: sourceArtifact,
      deploymentGroup:
        ServerDeploymentGroup.fromServerDeploymentGroupAttributes(
          this,
          "DevDeploymentGroup",
          {
            application: ServerApplication.fromServerApplicationName(
              this,
              "dev_Loom",
              "DevApplication"
            ),
            deploymentGroupName: "DevDeploymentGroup",
          }
        ),
    });
    pipeline.addStage({
      stageName: "DeployToDev",
      actions: [deployToDevAction],
    });

    // Manual approval
    const approvalAction = new ManualApprovalAction({
      actionName: "ApproveProdDeployment",
    });
    pipeline.addStage({
      stageName: "ApproveProd",
      actions: [approvalAction],
    });

    // Deployment to Prod environment
    const deployToProdAction = new CodeDeployServerDeployAction({
      actionName: "DeployToProd",
      input: sourceArtifact,
      deploymentGroup:
        ServerDeploymentGroup.fromServerDeploymentGroupAttributes(
          this,
          "ProdDeploymentGroup",
          {
            application: ServerApplication.fromServerApplicationName(
              this,
              "Loom",
              "ProdApplication"
            ),
            deploymentGroupName: "ProdDeploymentGroup",
          }
        ),
    });
    pipeline.addStage({
      stageName: "DeployToProd",
      actions: [deployToProdAction],
    });

    // Grant permissions for pipeline to read from artifact bucket
    artifactBucket.grantRead(pipeline.role, "dummy-key*");

    // Add IAM policy to allow the Lambda to trigger the CodePipeline
    existingLambdaRole.addToPrincipalPolicy(
      new PolicyStatement({
        actions: ["codepipeline:StartPipelineExecution"],
        resources: [pipeline.pipelineArn], // Use the ARN of the pipeline
      })
    );
  }
}
