import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { S3BucketConstruct } from "../constructs/s3-bucket-construct";
import { S3DeploymentConstruct } from "../constructs/s3-deployment-construct";
import { EnvironmentConfig } from "../../config/environments";
import { CloudFrontDistributionConstruct } from "../constructs/cloudfront-distribution-construct";

export interface FrontendStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
}

export class FrontendStack extends cdk.Stack {
  public readonly bucket: cdk.aws_s3.IBucket;
  public readonly distribution: cdk.aws_cloudfront.IDistribution;

  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    // Create S3 bucket
    const bucketConstruct = new S3BucketConstruct(this, 'WebsiteBucket', {
      bucketName: props.config.frontend.bucketName,
    });

    // Create CloudFront distribution
    const cloudfrontConstruct = new CloudFrontDistributionConstruct(this, 'WebsiteDistribution', {
      originBucket: bucketConstruct.bucket,
      comment: `${props.config.naming.prefix} Frontend - ${props.config.environment}`,
    });

    // Deploy website files
    new S3DeploymentConstruct(this, 'DeployWebsite', {
      sourcePath: props.config.frontend.buildPath,
      destinationBucket: bucketConstruct.bucket,
      distribution: cloudfrontConstruct.distribution,
    });

    // Store references
    this.bucket = bucketConstruct.bucket;
    this.distribution = cloudfrontConstruct.distribution;

    // Apply tags to all resources in this stack
    Object.entries(props.config.tags).forEach(([key, value]) => {
      cdk.Tags.of(this).add(key, value);
    });

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      description: 'The name of the S3 bucket hosting the frontend',
      exportName: `${props.config.naming.prefix}-${props.config.naming.suffix}-BucketName`,
    });

    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: cloudfrontConstruct.distribution.distributionDomainName,
      description: 'The CloudFront distribution domain for the frontend',
      exportName: `${props.config.naming.prefix}-${props.config.naming.suffix}-CloudFrontURL`,
    });

    new cdk.CfnOutput(this, 'CloudFrontDistributionId', {
      value: cloudfrontConstruct.distribution.distributionId,
      description: 'The CloudFront distribution ID',
      exportName: `${props.config.naming.prefix}-${props.config.naming.suffix}-DistributionId`,
    });
  }
}