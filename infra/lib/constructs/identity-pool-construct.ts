import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";

export interface IdentityPoolConstructProps {
  identityPoolName?: string;
  userPool: cognito.IUserPool;
  userPoolClient: cognito.IUserPoolClient;
}

export class IdentityPoolConstruct extends Construct {
  public readonly identityPool: cognito.CfnIdentityPool;

  constructor(
    scope: Construct,
    id: string,
    props: IdentityPoolConstructProps
  ) {
    super(scope, id);

    // Create Cognito Identity Pool
    // Identity Pools provide temporary AWS credentials via STS (Security Token Service)
    // This allows authenticated users to access AWS services (S3, DynamoDB, etc.)
    
    // IMPORTANT: Using L1 construct (CfnIdentityPool) because L2 construct doesn't exist yet
    // L1 constructs map directly to CloudFormation resources
    // EXAM TIP: Identity Pools are CRITICAL for giving users temporary AWS credentials
    
    this.identityPool = new cognito.CfnIdentityPool(this, "IdentityPool", {
      identityPoolName: props.identityPoolName,

      // Allow unauthenticated access
      // FALSE means users MUST be authenticated to get credentials
      // TRUE would allow guest access (not needed for our app)
      allowUnauthenticatedIdentities: false,

      // Allow classic flow
      // TRUE for backward compatibility
      allowClassicFlow: true,

      // Cognito Identity Providers
      // Links this Identity Pool to our User Pool
      cognitoIdentityProviders: [
        {
          clientId: props.userPoolClient.userPoolClientId,
          providerName: props.userPool.userPoolProviderName,
          
          // Server-side token check
          // FALSE because we trust the User Pool tokens
          serverSideTokenCheck: false,
        },
      ],
    });
  }
}