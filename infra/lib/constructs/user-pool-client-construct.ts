import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Duration } from "aws-cdk-lib";

export interface UserPoolClientConstructProps {
  userPool: cognito.IUserPool;
  clientName?: string;
}

export class UserPoolClientConstruct extends Construct {
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(
    scope: Construct,
    id: string,
    props: UserPoolClientConstructProps
  ) {
    super(scope, id);

    // Create User Pool Client
    // This represents an application (frontend) that will use the User Pool
    this.userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool: props.userPool,
      userPoolClientName: props.clientName,

      // Authentication flows
      // SRP (Secure Remote Password) is the recommended secure auth flow
      // USER_PASSWORD_AUTH is simpler but less secure (good for learning)
      authFlows: {
        userPassword: true, // Username/password authentication
        userSrp: true, // Secure Remote Password (recommended)
        custom: false, // Custom authentication (not needed)
        adminUserPassword: false, // Admin authentication (not needed)
      },

      // OAuth configuration
      // Not needed for Phase 2 (no social login yet)
      // oAuth: {
      //   flows: {
      //     authorizationCodeGrant: false,
      //     implicitCodeGrant: false,
      //   },
      // },

      // Client secret
      // FALSE because this is a public client (JavaScript/React)
      // JavaScript cannot securely store secrets
      // EXAM TIP: Public clients (mobile/web) = no secret, Confidential clients (backend) = secret
      generateSecret: false,

      // Token validity periods
      // These control how long tokens are valid before refresh is needed
      idTokenValidity: Duration.hours(1), // ID token expires in 1 hour
      accessTokenValidity: Duration.hours(1), // Access token expires in 1 hour
      refreshTokenValidity: Duration.days(30), // Refresh token expires in 30 days

      // Prevent user existence errors
      // TRUE for security - don't reveal if user exists or not
      // This prevents enumeration attacks (testing if emails exist)
      preventUserExistenceErrors: true,

      // Enable token revocation
      // Allows tokens to be revoked before expiry
      enableTokenRevocation: true,

      // Read/write attributes
      // Users can read and write their own email
      readAttributes: new cognito.ClientAttributes().withStandardAttributes({
        email: true,
        emailVerified: true,
      }),
      writeAttributes: new cognito.ClientAttributes().withStandardAttributes({
        email: true,
      }),
    });
  }
}