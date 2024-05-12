import { CfnOutput, Fn, Stack, StackProps } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  HttpVersion,
  LambdaEdgeEventType,
  OriginAccessIdentity,
  PriceClass,
  SecurityPolicyProtocol,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Version } from "aws-cdk-lib/aws-lambda";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class LoomCloudfrontStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Getting the SSL Certificate
    const certificate = Certificate.fromCertificateArn(
      this,
      "LoomSSLCertificate",
      "arn:aws:acm:us-east-1:346316490277:certificate/64fad0d6-2c4a-4705-92ed-c90a48107393"
    );

    // Get the hosting buckets and OAI from the StorageStack
    const devHostingBucketName = Fn.importValue("LoomDevHostingBucketName");
    const hostingBucketName = Fn.importValue("LoomHostingBucketName");
    const originAccessIdentityID = Fn.importValue("LoomOAIId");

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
    const originAccessIdentity =
      OriginAccessIdentity.fromOriginAccessIdentityId(
        this,
        "ImportedOAI",
        originAccessIdentityID
      );

    const lambdaFunctionVersion = Version.fromVersionArn(
      this,
      "ImportedBasicAuthLambdaFunction",
      "arn:aws:lambda:us-east-1:346316490277:function:BasicAuthEdge:9"
    );

    // CloudFront distribution for the website
    const devDistribution = new Distribution(this, "LoomDevDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new S3Origin(devHostingBucket, {
          originAccessIdentity, // Use your OAI for secure access
        }),
        edgeLambdas: [
          {
            functionVersion: lambdaFunctionVersion,
            eventType: LambdaEdgeEventType.VIEWER_REQUEST,
          },
        ],
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
      },
      certificate, // Assuming you have your ACM certificate defined (fromCertificateArn or otherwise)
      domainNames: ["dev.loom.feryv.com"],
      errorResponses: [
        // Custom error responses for 403 and 404
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
      priceClass: PriceClass.PRICE_CLASS_100, // Adjust for your region needs
      httpVersion: HttpVersion.HTTP2, // Use HTTP/2 for better performance
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
    });

    const distribution = new Distribution(this, "LoomDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new S3Origin(hostingBucket, {
          originAccessIdentity,
        }),
        // If your distributionBehavior configures allowed methods or viewer protocol policy, include those settings here:
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS, // Assuming you only allow GET, HEAD, OPTIONS for static sites
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
      },
      certificate,
      domainNames: ["loom.feryv.com"],
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
      priceClass: PriceClass.PRICE_CLASS_100, // Set appropriate price class
      httpVersion: HttpVersion.HTTP2,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
    });

    // Export the references
    new CfnOutput(this, "DevDistributionIdOutput", {
      value: devDistribution.distributionId,
      exportName: "LoomDevDistributionId",
    });

    new CfnOutput(this, "DistributionIdOutput", {
      value: distribution.distributionId,
      exportName: "LoomDistributionId",
    });
  }
}
