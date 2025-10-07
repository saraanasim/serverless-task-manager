import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";

export interface CognitoIamRolesConstructProps {
  identityPool: cognito.CfnIdentityPool;
  identityPoolId: string;
}

export class CognitoIamRolesConstruct extends Construct {
  public readonly authenticatedRole: iam.Role;

  constructor(
    scope: Construct,
    id: string,
    props: CognitoIamRolesConstructProps
  ) {
    super(scope, id);

    // Create IAM role for authenticated users
    // This role is assumed by users after they authenticate via Cognito
    // EXAM TIP: Understand the trust policy and how Cognito assumes roles
    
    this.authenticatedRole = new iam.Role(this, "AuthenticatedRole", {
      // Role description
      description: "IAM role for authenticated Cognito users",

      // Trust policy - who can assume this role
      // Only cognito-identity.amazonaws.com service can assume this role
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          // Condition: Only authenticated users from this specific Identity Pool
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": props.identityPoolId,
          },
          // Condition: Only for authenticated logins (not guest)
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity" // Action allowed
      ),

      // Role name (optional - CDK will auto-generate if not specified)
      // roleName: 'TaskApproval-Cognito-AuthenticatedRole',
    });

    // Add basic permissions for authenticated users
    // Start with minimal permissions (Principle of Least Privilege)
    // We'll add more permissions in later phases as needed
    
    // Permission 1: Get credentials from Identity Pool
    // Required for Amplify to get temporary AWS credentials
    this.authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "cognito-identity:GetCredentialsForIdentity",
          "cognito-identity:GetId",
        ],
        resources: ["*"], // These actions don't support resource-level permissions
      })
    );

    // Permission 2: CloudWatch Logs (for debugging)
    // Useful for Lambda functions invoked by users
    // FREE TIER: 5GB log storage, 10 custom metrics
    this.authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        resources: ["*"], // Will be restricted in later phases
      })
    );

    // Note: More permissions will be added in Phase 3 for API Gateway
    // Note: More permissions will be added in Phase 4 for DynamoDB and S3

    // Attach the role to the Identity Pool
    // This tells Cognito to use this role for authenticated users
    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      "IdentityPoolRoleAttachment",
      {
        identityPoolId: props.identityPoolId,
        roles: {
          authenticated: this.authenticatedRole.roleArn,
          // Note: No unauthenticated role because allowUnauthenticatedIdentities = false
        },
      }
    );
  }
}