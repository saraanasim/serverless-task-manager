import { Amplify, type ResourcesConfig } from 'aws-amplify';
import config from './index';

// IMPORTANT: Replace these values with your actual CDK outputs
// Get these from: cd infra && cdk outputs --stack TaskApproval-Auth-Dev
const awsConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      // Replace with your actual User Pool ID from CDK output
      userPoolId: config.userPoolId,
      
      // Replace with your actual User Pool Client ID from CDK output
      userPoolClientId: config.userPoolClientId,
      
      // Replace with your actual Identity Pool ID from CDK output
      identityPoolId: config.identityPoolId,
      
      // Sign in configuration
      loginWith: {
        email: true,
      },
      
      // Sign up configuration
      signUpVerificationMethod: 'code', // Email verification with code
      
      // User attributes
      userAttributes: {
        email: {
          required: true,
        },
      },
      
      // Password format (must match your User Pool policy)
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: false,
      },
    },
  },
};

// Configure Amplify
Amplify.configure(awsConfig);

export default awsConfig;