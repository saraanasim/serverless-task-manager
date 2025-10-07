import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Duration, RemovalPolicy } from "aws-cdk-lib";

export interface UserPoolConstructProps {
  userPoolName?: string;
  passwordPolicy: {
    minLength: number;
    requireLowercase: boolean;
    requireUppercase: boolean;
    requireDigits: boolean;
    requireSymbols: boolean;
  };
}

export class UserPoolConstruct extends Construct {
  public readonly userPool: cognito.UserPool;

  constructor(scope: Construct, id: string, props: UserPoolConstructProps) {
    super(scope, id);

    // Create Cognito User Pool
    // FREE TIER: 50,000 MAU (Monthly Active Users)
    this.userPool = new cognito.UserPool(this, "UserPool", {
      userPoolName: props.userPoolName,

      // Sign-in configuration
      // Users will sign in with their email address
      signInAliases: {
        email: true,
        username: false,
        phone: false,
      },

      // Self sign-up configuration
      // Allow users to register themselves
      selfSignUpEnabled: true,

      // User attributes
      // Email is required and will be used for sign-in
      standardAttributes: {
        email: {
          required: true,
          mutable: true, // Users can change their email
        },
      },

      // Email verification
      // Users must verify their email before they can sign in
      // FREE TIER: Email delivery is free (using Cognito's default email)
      autoVerify: {
        email: true,
      },

      // User invitation (for admin-created users)
      userInvitation: {
        emailSubject: "Welcome to Task Approval System",
        emailBody:
          "Hello {username}, your temporary password is {####}. Please sign in and change your password.",
      },

      // Password policy
      // Matches the configuration from environments.ts
      passwordPolicy: {
        minLength: props.passwordPolicy.minLength,
        requireLowercase: props.passwordPolicy.requireLowercase,
        requireUppercase: props.passwordPolicy.requireUppercase,
        requireDigits: props.passwordPolicy.requireDigits,
        requireSymbols: props.passwordPolicy.requireSymbols,
        tempPasswordValidity: Duration.days(7), // Temporary passwords expire in 7 days
      },

      // Account recovery
      // Users can recover their account via email only
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,

      // MFA (Multi-Factor Authentication)
      // OFF for FREE TIER optimization and simplicity
      // Enabling MFA costs money after 50 users with MFA
      mfa: cognito.Mfa.OFF,

      // Advanced security
      // OFF for FREE TIER optimization
      // Advanced security features cost extra
      advancedSecurityMode: cognito.AdvancedSecurityMode.OFF,

      // Removal policy
      // DESTROY allows easy cleanup during learning
      // IMPORTANT: Change to RETAIN in production to prevent accidental deletion
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}