import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface CloudFrontDistributionConstructProps {
  originBucket: s3.Bucket;
  defaultRootObject?: string;
  comment?: string;
}

export class CloudFrontDistributionConstruct extends Construct {
  public readonly distribution: cloudfront.Distribution;
  public readonly originAccessIdentity: cloudfront.OriginAccessIdentity;

  constructor(scope: Construct, id: string, props: CloudFrontDistributionConstructProps) {
    super(scope, id);

    // Create Origin Access Identity
    this.originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OAI', {
      comment: props.comment || 'Access identity for S3 bucket',
    });

    // Grant OAI read access to bucket
    props.originBucket.grantRead(this.originAccessIdentity);

    // Create CloudFront distribution
    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      comment: props.comment,
      defaultBehavior: {
        origin: new origins.S3Origin(props.originBucket, {
          originAccessIdentity: this.originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED, // Reduces origin requests (free tier friendly)
      },
      defaultRootObject: props.defaultRootObject || 'index.html',
      // FREE TIER OPTIMIZATION: PRICE_CLASS_100 uses only US, Canada, Europe edge locations
      // This is the cheapest option and stays within free tier (1TB/month, 10M requests/month)
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });
  }
}