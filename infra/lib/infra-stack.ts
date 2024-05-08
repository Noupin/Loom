import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import * as codebuild from "@aws-cdk/aws-codebuild";

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket for website hosting
    const hostingBucket = new s3.Bucket(this, "HostingBucket", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // Typically RETAIN for production
    });

    // S3 Bucket for artifacts
    const artifactBucket = new s3.Bucket(this, "ArtifactBucket", {
      removalPolicy: cdk.RemovalPolicy.RETAIN, // RETAIN to avoid accidental data loss
    });

    // CloudFront distribution for the website
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "Distribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: hostingBucket,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    // CodeBuild project for building and deploying the infrastructure
    const buildProject = new codebuild.PipelineProject(this, "BuildProject", {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
      },
      buildSpec: codebuild.BuildSpec.fromSourceFilename("buildspec.yml"),
    });

    // Define the source action for CodePipeline
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: "GitHub_Source",
      owner: "your-github-username",
      repo: "your-repo-name",
      oauthToken: cdk.SecretValue.secretsManager("github-oauth-token"),
      output: sourceOutput,
    });

    // Define the build action for CodePipeline
    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: "Build_and_Deploy",
      project: buildProject,
      input: sourceOutput,
    });

    // Create the pipeline
    new codepipeline.Pipeline(this, "Pipeline", {
      pipelineName: "WebsiteDeploymentPipeline",
      stages: [
        {
          stageName: "Source",
          actions: [sourceAction],
        },
        {
          stageName: "Build",
          actions: [buildAction],
        },
      ],
    });
  }
}
