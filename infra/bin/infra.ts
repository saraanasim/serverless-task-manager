#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { FrontendStack } from '../lib/stacks/frontend-stack';
import { devConfig, prodConfig } from '../config/environments';

const app = new cdk.App();

// Get environment from context (default to dev)
const environment = app.node.tryGetContext('environment') || 'dev';
const config = environment === 'prod' ? prodConfig : devConfig;

// Create frontend stack
new FrontendStack(app, `${config.naming.prefix}-Frontend-${config.naming.suffix}`, {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: config.region 
  },
  config,
  tags: config.tags,
});