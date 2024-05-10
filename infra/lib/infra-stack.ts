import { Stack, RemovalPolicy, StackProps, Fn } from "aws-cdk-lib";
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
import { Role } from "aws-cdk-lib/aws-iam";

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
  }
}
