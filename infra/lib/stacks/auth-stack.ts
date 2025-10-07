import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { EnvironmentConfig } from "../../config/environments";
import { UserPoolConstruct } from "../constructs/user-pool-construct";
import { UserPoolClientConstruct } from "../constructs/user-pool-client-construct";
import { IdentityPoolConstruct } from "../constructs/identity-pool-construct";
import { CognitoIamRolesConstruct } from "../constructs/cognito-iam-roles-construct";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";

export interface AuthStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
}

export class AuthStack extends cdk.Stack {
  // Public exports for other stacks to use
  public readonly userPool: cognito.IUserPool;
  public readonly userPoolClient: cognito.IUserPoolClient;
  public readonly identityPool: cognito.CfnIdentityPool;
  public readonly authenticatedRole: iam.IRole;

  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    const { config } = props;

    // Step 1: Create User Pool
    // This is the user directory for authentication
    const userPoolConstruct = new UserPoolConstruct(this, "UserPool", {
      userPoolName: config.auth.userPoolName || 
        `${config.naming.prefix}-UserPool-${config.naming.suffix}`,
      passwordPolicy: config.auth.passwordPolicy,
    });

    // Step 2: Create User Pool Client
    // This represents the frontend application
    const userPoolClientConstruct = new UserPoolClientConstruct(
      this,
      "UserPoolClient",
      {
        userPool: userPoolConstruct.userPool,
        clientName: `${config.naming.prefix}-WebClient-${config.naming.suffix}`,
      }
    );

    // Step 3: Create Identity Pool
    // This provides temporary AWS credentials for authenticated users
    const identityPoolConstruct = new IdentityPoolConstruct(
      this,
      "IdentityPool",
      {
        identityPoolName: config.auth.identityPoolName ||
          `${config.naming.prefix}_IdentityPool_${config.naming.suffix}`,
        userPool: userPoolConstruct.userPool,
        userPoolClient: userPoolClientConstruct.userPoolClient,
      }
    );

    // Step 4: Create IAM Roles and attach to Identity Pool
    // This defines what authenticated users can do in AWS
    const iamRolesConstruct = new CognitoIamRolesConstruct(
      this,
      "CognitoIamRoles",
      {
        identityPool: identityPoolConstruct.identityPool,
        identityPoolId: identityPoolConstruct.identityPool.ref,
      }
    );

    // Store references for other stacks to use
    this.userPool = userPoolConstruct.userPool;
    this.userPoolClient = userPoolClientConstruct.userPoolClient;
    this.identityPool = identityPoolConstruct.identityPool;
    this.authenticatedRole = iamRolesConstruct.authenticatedRole;

    // Apply tags to all resources in this stack
    Object.entries(config.tags).forEach(([key, value]) => {
      cdk.Tags.of(this).add(key, value);
    });

    // CloudFormation Outputs
    // These values are needed for frontend configuration
    
    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPoolConstruct.userPool.userPoolId,
      description: "Cognito User Pool ID",
      exportName: `${config.naming.prefix}-${config.naming.suffix}-UserPoolId`,
    });

    new cdk.CfnOutput(this, "UserPoolArn", {
      value: userPoolConstruct.userPool.userPoolArn,
      description: "Cognito User Pool ARN",
      exportName: `${config.naming.prefix}-${config.naming.suffix}-UserPoolArn`,
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClientConstruct.userPoolClient.userPoolClientId,
      description: "Cognito User Pool Client ID",
      exportName: `${config.naming.prefix}-${config.naming.suffix}-UserPoolClientId`,
    });

    new cdk.CfnOutput(this, "IdentityPoolId", {
      value: identityPoolConstruct.identityPool.ref,
      description: "Cognito Identity Pool ID",
      exportName: `${config.naming.prefix}-${config.naming.suffix}-IdentityPoolId`,
    });

    new cdk.CfnOutput(this, "Region", {
      value: config.region,
      description: "AWS Region",
      exportName: `${config.naming.prefix}-${config.naming.suffix}-Region`,
    });

    new cdk.CfnOutput(this, "AuthenticatedRoleArn", {
      value: iamRolesConstruct.authenticatedRole.roleArn,
      description: "IAM Role ARN for authenticated users",
      exportName: `${config.naming.prefix}-${config.naming.suffix}-AuthRoleArn`,
    });
  }
}