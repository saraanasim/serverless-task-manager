import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface S3BucketConstructProps {
  bucketName?: string;
  removalPolicy?: cdk.RemovalPolicy;
  autoDeleteObjects?: boolean;
}

export class S3BucketConstruct extends Construct {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: S3BucketConstructProps) {
    super(scope, id);

    this.bucket = new s3.Bucket(this, 'Bucket', {
      bucketName: props?.bucketName,
      publicReadAccess: false, // Secure by default
      removalPolicy: props?.removalPolicy || cdk.RemovalPolicy.DESTROY, // Clean up on destroy
      autoDeleteObjects: props?.autoDeleteObjects !== false, // Auto-delete objects on destroy
      encryption: s3.BucketEncryption.S3_MANAGED, // FREE: SSE-S3 encryption at no extra cost
      versioned: false, // FREE TIER OPTIMIZATION: Versioning increases storage costs
    });
  }
}