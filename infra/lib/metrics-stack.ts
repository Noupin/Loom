import { Duration, Fn, Stack, StackProps } from "aws-cdk-lib";
import { Metric, Dashboard, GraphWidget } from "aws-cdk-lib/aws-cloudwatch";
import { Construct } from "constructs";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";

function createMetrics(distributionId: string, bucketName: string) {
  return {
    cloudFrontRequests: new Metric({
      namespace: "AWS/CloudFront",
      metricName: "Requests",
      dimensionsMap: { DistributionId: distributionId },
      statistic: "Sum",
      period: Duration.minutes(5),
    }),
    cloudFrontTotalErrorRate: new Metric({
      namespace: "AWS/CloudFront",
      metricName: "TotalErrorRate",
      dimensionsMap: { DistributionId: distributionId },
      statistic: "Average",
      period: Duration.minutes(5),
    }),
    cloudFront4xxErrorRate: new Metric({
      namespace: "AWS/CloudFront",
      metricName: "4xxErrorRate",
      dimensionsMap: { DistributionId: distributionId },
      statistic: "Average",
      period: Duration.minutes(5),
    }),
    cloudFront5xxErrorRate: new Metric({
      namespace: "AWS/CloudFront",
      metricName: "5xxErrorRate",
      dimensionsMap: { DistributionId: distributionId },
      statistic: "Average",
      period: Duration.minutes(5),
    }),
    s3AllRequests: new Metric({
      namespace: "AWS/S3",
      metricName: "AllRequests",
      dimensionsMap: { BucketName: bucketName, StorageType: "AllStorageTypes" },
      statistic: "Sum",
      period: Duration.minutes(5),
    }),
    s3Errors: new Metric({
      namespace: "AWS/S3",
      metricName: "4xxErrors",
      dimensionsMap: { BucketName: bucketName, StorageType: "AllStorageTypes" },
      statistic: "Sum",
      period: Duration.minutes(5),
    }),
  };
}

function addWidgetsToDashboard(
  dashboard: Dashboard,
  metrics: any,
  prefix: string
) {
  dashboard.addWidgets(
    new GraphWidget({
      title: `${prefix} CloudFront Requests`,
      left: [metrics.cloudFrontRequests],
    }),
    new GraphWidget({
      title: `${prefix} CloudFront Total Error Rate`,
      left: [metrics.cloudFrontTotalErrorRate],
    }),
    new GraphWidget({
      title: `${prefix} CloudFront 4xx Error Rate`,
      left: [metrics.cloudFront4xxErrorRate],
    }),
    new GraphWidget({
      title: `${prefix} CloudFront 5xx Error Rate`,
      left: [metrics.cloudFront5xxErrorRate],
    }),
    new GraphWidget({
      title: `${prefix} S3 All Requests`,
      left: [metrics.s3AllRequests],
    }),
    new GraphWidget({
      title: `${prefix} S3 4xx Errors`,
      left: [metrics.s3Errors],
    })
  );
}

export class LoomMetricsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Get the hosting buckets and OAI from the StorageStack
    const devHostingBucketName = Fn.importValue("LoomDevHostingBucketName");
    const hostingBucketName = Fn.importValue("LoomHostingBucketName");

    const devDistributionID = Fn.importValue("LoomDevDistributionId");
    const distributionID = Fn.importValue("LoomDistributionId");

    // Create log groups for dev and prod environments
    const devLogGroup = new LogGroup(this, "LoomDevLogGroup", {
      logGroupName: "/aws/cloudfront/loom/dev",
      retention: RetentionDays.INFINITE,
    });
    const prodLogGroup = new LogGroup(this, "LoomProdLogGroup", {
      logGroupName: "/aws/cloudfront/loom/prod",
      retention: RetentionDays.INFINITE,
    });

    // Create CloudWatch Dashboards
    const devDashboard = new Dashboard(this, "LoomDevMetricsDashboard", {
      dashboardName: "LoomDevMetricsDashboard",
    });

    const prodDashboard = new Dashboard(this, "LoomProdMetricsDashboard", {
      dashboardName: "LoomProdMetricsDashboard",
    });

    // Create metrics for dev and prod
    const devMetrics = createMetrics(devDistributionID, devHostingBucketName);
    const prodMetrics = createMetrics(distributionID, hostingBucketName);

    // Add widgets to the dev dashboard
    addWidgetsToDashboard(devDashboard, devMetrics, "Dev");

    // Add widgets to the prod dashboard
    addWidgetsToDashboard(prodDashboard, prodMetrics, "Prod");
  }
}
