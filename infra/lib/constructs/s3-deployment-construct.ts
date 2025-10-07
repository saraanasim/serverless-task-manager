import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { Construct } from "constructs";

export interface S3DeploymentConstructProps {
  sourcePath: string;
  destinationBucket: s3.Bucket;
  distribution?: cloudfront.Distribution;
  distributionPaths?: string[];
}

export class S3DeploymentConstruct extends Construct {
  public readonly deployment: s3deploy.BucketDeployment;

  constructor(scope: Construct, id: string, props: S3DeploymentConstructProps) {
    super(scope, id);

    this.deployment = new s3deploy.BucketDeployment(this, 'Deployment', {
      sources: [s3deploy.Source.asset(props.sourcePath)],
      destinationBucket: props.destinationBucket,
      distribution: props.distribution,
      // FREE TIER NOTE: First 1,000 invalidation paths/month are free
      // After that: $0.005 per path. Avoid frequent deployments in production.
      distributionPaths: props.distributionPaths || ['/*'],
    });
  }
}