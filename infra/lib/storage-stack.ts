import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { ReadWriteType, Trail } from "aws-cdk-lib/aws-cloudtrail";
import { Role } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class LoomStorageStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Get the GitHub Actions role
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
    const dev_hostingBucket = new Bucket(this, "LoomDevHostingBucket", {
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

    const trail = new Trail(this, "ArtifactBucketTrail", {
      bucket: artifactBucket,
      sendToCloudWatchLogs: true,
    });
    // Make sure the trail monitors the bucket
    trail.addS3EventSelector([{ bucket: artifactBucket }], {
      readWriteType: ReadWriteType.WRITE_ONLY,
    });

    // Export the references
    new CfnOutput(this, "ArtifactBucketOutput", {
      value: artifactBucket.bucketName,
      exportName: "LoomArtifactBucketName", // Unique export name
    });

    new CfnOutput(this, "DevHostingBucketOutput", {
      value: dev_hostingBucket.bucketName,
      exportName: "LoomDevHostingBucketName",
    });

    new CfnOutput(this, "HostingBucketOutput", {
      value: hostingBucket.bucketName,
      exportName: "LoomHostingBucketName",
    });

    new CfnOutput(this, "OAIOutput", {
      value: originAccessIdentity.originAccessIdentityId,
      exportName: "LoomOAIID",
    });
  }
}
