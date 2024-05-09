import { Stack, RemovalPolicy, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { CloudFrontWebDistribution } from "aws-cdk-lib/aws-cloudfront";

export class LoomInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const domainName = "feryv.com";

    // S3 Bucket for dev website hosting
    const dev_hostingBucket = new Bucket(this, "Loom_dev_HostingBucket", {
      websiteIndexDocument: "index.html",
      removalPolicy: RemovalPolicy.RETAIN, // Typically RETAIN for production
      bucketName: "loom-dev-hosting",
    });

    // S3 Bucket for website hosting
    const hostingBucket = new Bucket(this, "LoomHostingBucket", {
      websiteIndexDocument: "index.html",
      removalPolicy: RemovalPolicy.RETAIN, // Typically RETAIN for production
      bucketName: "loom-hosting",
    });

    // S3 Bucket for artifacts
    const artifactBucket = new Bucket(this, "LoomArtifactBucket", {
      removalPolicy: RemovalPolicy.RETAIN, // RETAIN to avoid accidental data loss
      bucketName: "loom-artifacts",
    });

    // CloudFront distribution for the website
    const dev_distribution = new CloudFrontWebDistribution(
      this,
      "Loom_dev_Distribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: dev_hostingBucket,
            },
            behaviors: [{ isDefaultBehavior: true }],
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
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );
  }
}
