export interface EnvironmentConfig {
    environment: string;
    region: string;
    account?: string;
    
    // Frontend hosting configuration
    frontend: {
      bucketName?: string;
      buildPath: string;
    };
    
    // Resource naming
    naming: {
      prefix: string;
      suffix: string;
    };
    
    // Tags for all resources
    tags: Record<string, string>;
  }
  
  export const devConfig: EnvironmentConfig = {
    environment: 'dev',
    region: 'us-east-1',
    
    frontend: {
      // bucketName: undefined, // Let CDK auto-generate
      buildPath: '../frontend/dist',
    },
    
    naming: {
      prefix: 'TaskApproval',
      suffix: 'Dev',
    },
    
    tags: {
      Environment: 'dev',
      Project: 'TaskApproval',
      ManagedBy: 'CDK',
    },
  };
  
  export const prodConfig: EnvironmentConfig = {
    environment: 'prod',
    region: 'us-east-1',
    
    frontend: {
      buildPath: '../frontend/dist',
    },
    
    naming: {
      prefix: 'TaskApproval',
      suffix: 'Prod',
    },
    
    tags: {
      Environment: 'prod',
      Project: 'TaskApproval',
      ManagedBy: 'CDK',
    },
  };