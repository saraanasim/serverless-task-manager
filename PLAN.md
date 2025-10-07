# 🚀 AWS Serverless Task Approval System (REST Edition) — Progress Tracker

This file tracks implementation progress for the **AWS Developer Associate practice project**.  
Each phase corresponds to an AWS service integration. Check off as you complete steps.

## ⚠️ **COST MANAGEMENT & FREE TIER GUIDANCE**

### 🆓 **FREE TIER SERVICES (Safe to Use)**
- **S3**: 5GB storage, 20,000 GET requests, 2,000 PUT requests/month
- **CloudFront**: 1TB data transfer, 10,000,000 HTTP requests/month
- **Lambda**: 1M requests, 400,000 GB-seconds compute/month
- **API Gateway**: 1M API calls/month
- **DynamoDB**: 25GB storage, 25 RCU, 25 WCU/month
- **Cognito**: 50,000 MAU (Monthly Active Users)
- **SNS**: 1M requests/month
- **Step Functions**: 4,000 state transitions/month
- **CloudWatch**: 10 custom metrics, 5GB log ingestion/month
- **X-Ray**: 100,000 traces/month
- **CodeBuild**: 100 build minutes/month
- **CodePipeline**: 1 active pipeline/month
- **SQS**: 1M requests/month
- **EventBridge**: 1M events/month
- **Secrets Manager**: 30 days free trial, then $0.40/secret/month
- **Systems Manager Parameter Store**: 10,000 parameters (Standard tier)

### 💰 **POTENTIAL COST RISKS**
- **Route 53**: $0.50/hosted zone/month + $0.40/query
- **Multi-region**: Doubles most costs
- **High traffic**: Exceeding free tier limits
- **Data transfer**: Outbound data charges after free tier

### 🧹 **CLEANUP REMINDERS**
- **After each phase**: Run `cdk destroy` to avoid charges
- **Daily**: Check AWS Billing Dashboard
- **Weekly**: Review CloudWatch costs
- **Before sleep**: Destroy non-essential resources

---

## ✅ Phase 0: Setup
- [x] AWS CLI installed
- [x] AWS CDK installed
- [x] pnpm installed
- [x] Monorepo structure created (`infra`, `backend`, `frontend`)
- [x] GitHub repo initialized & pushed
- [x] .gitignore files added (root + subprojects)
- [x] .gitattributes added
- [x] AWS CLI configured (`aws configure`)
- [x] CDK bootstrap completed

---

## ✅ Phase 1: Frontend Hosting (S3 + CloudFront)
- [x] Create React app (Vite + TS)
- [x] Deploy to S3 bucket
- [x] Configure CloudFront distribution
- [x] Test hosting via CloudFront URL
- [x] **COST CHECK**: S3 + CloudFront within free tier ✅

### **Phase 1.5: Infrastructure Structure Refactoring**
- [ ] Create `config/environments.ts` for environment management
- [ ] Create `lib/constructs/s3-bucket-construct.ts` for reusable S3 bucket
- [ ] Create `lib/constructs/cloudfront-distribution-construct.ts` for reusable CloudFront
- [ ] Create `lib/constructs/s3-deployment-construct.ts` for reusable S3 deployment
- [ ] Create `lib/stacks/frontend-stack.ts` for frontend deployment unit (uses above constructs)
- [ ] Update `bin/infra.ts` to use new structure
- [ ] Backup old `lib/infra-stack.ts` as `.backup`
- [ ] Deploy and verify new structure works
- [ ] **LEARNING**: Single Responsibility Principle, stacks vs constructs, configuration management

---

## ⏳ Phase 2: Authentication (Cognito)
- [ ] Create `lib/constructs/user-pool-construct.ts` for reusable Cognito User Pool
- [ ] Create `lib/constructs/identity-pool-construct.ts` for reusable Cognito Identity Pool
- [ ] Create `lib/constructs/iam-role-construct.ts` for reusable IAM roles
- [ ] Create `lib/stacks/auth-stack.ts` for authentication deployment unit (uses above constructs)
- [ ] Create Cognito User Pool with proper configuration
- [ ] Create Cognito Identity Pool for AWS resource access
- [ ] Setup IAM roles for authenticated users
- [ ] Setup signup/login in React (Amplify/Auth SDK)
- [ ] Add role-based access (Admin/User groups)
- [ ] Update `bin/infra.ts` to include auth stack
- [ ] **COST CHECK**: Cognito 50K MAU free tier ✅
- [ ] **LEARNING**: User Pools vs Identity Pools, JWT tokens, IAM roles, federated identity

---

## ⏳ Phase 3: REST API (API Gateway + Lambda)
- [ ] Create `lib/constructs/lambda-function-construct.ts` for reusable Lambda functions
- [ ] Create `lib/constructs/lambda-layer-construct.ts` for reusable Lambda layers
- [ ] Create `lib/constructs/sqs-queue-construct.ts` for reusable SQS queues (DLQ)
- [ ] Create `lib/constructs/api-gateway-construct.ts` for reusable REST API
- [ ] Create `lib/constructs/api-authorizer-construct.ts` for reusable Cognito authorizer
- [ ] Create `lib/stacks/api-stack.ts` for API deployment unit (uses above constructs)
- [ ] Create Lambda functions for task operations (CRUD)
- [ ] Create API Gateway REST API with proper configuration
- [ ] Define endpoints (POST/GET/PUT/DELETE tasks)
- [ ] Connect Lambdas with environment variables
- [ ] Add Lambda layers for shared code
- [ ] Configure Lambda concurrency limits
- [ ] Add Dead Letter Queues (DLQ)
- [ ] Secure with Cognito Authorizer
- [ ] Update `bin/infra.ts` to include API stack with dependencies
- [ ] **COST CHECK**: API Gateway 1M calls + Lambda 1M requests free tier ✅
- [ ] **LEARNING**: Lambda patterns, API Gateway integration, request/response mapping, DLQ strategy

---

## ⏳ Phase 4: Data Storage (DynamoDB + S3)
- [ ] Create `lib/constructs/dynamodb-table-construct.ts` for reusable DynamoDB tables
- [ ] Create `lib/constructs/dynamodb-gsi-construct.ts` for reusable Global Secondary Indexes
- [ ] Create `lib/constructs/dynamodb-stream-construct.ts` for reusable DynamoDB Streams
- [ ] Create `lib/constructs/s3-bucket-construct.ts` for reusable S3 buckets (file storage)
- [ ] Create `lib/stacks/storage-stack.ts` for storage deployment unit (uses above constructs)
- [ ] Create DynamoDB table for tasks (on-demand billing)
- [ ] Add Global Secondary Index (GSI)
- [ ] Add Local Secondary Index (LSI)
- [ ] Enable DynamoDB Streams
- [ ] Create S3 bucket for file storage
- [ ] Lambda → DynamoDB integration
- [ ] Generate signed S3 URLs
- [ ] File uploads from React
- [ ] Update `bin/infra.ts` to include storage stack with dependencies
- [ ] **COST CHECK**: DynamoDB 25GB + S3 5GB free tier ✅
- [ ] **LEARNING**: DynamoDB single-table design, GSI/LSI patterns, S3 pre-signed URLs, DynamoDB Streams

---

## ⏳ Phase 5: Queue Processing (SQS + Lambda)
- [ ] Create `lib/constructs/sqs-queue-construct.ts` for reusable SQS queues
- [ ] Create `lib/constructs/lambda-event-source-construct.ts` for reusable event source mappings
- [ ] Create `lib/stacks/queue-stack.ts` for queue deployment unit (uses above constructs)
- [ ] Create SQS Standard queue
- [ ] Create SQS FIFO queue
- [ ] Add Dead Letter Queues
- [ ] Configure long polling
- [ ] Lambda triggered by SQS messages
- [ ] Message visibility timeout configuration
- [ ] Update `bin/infra.ts` to include queue stack with dependencies
- [ ] **COST CHECK**: SQS 1M requests free tier ✅
- [ ] **LEARNING**: SQS Standard vs FIFO, DLQ patterns, Lambda event source mapping, batch processing

---

## ⏳ Phase 6: Event-Driven Architecture (EventBridge)
- [ ] Create `lib/constructs/event-bus-construct.ts` for reusable EventBridge buses
- [ ] Create `lib/constructs/event-rule-construct.ts` for reusable EventBridge rules
- [ ] Create `lib/constructs/event-target-construct.ts` for reusable event targets
- [ ] Create `lib/stacks/events-stack.ts` for event-driven deployment unit (uses above constructs)
- [ ] Create EventBridge custom event bus
- [ ] Scheduled rule for daily reports (cron)
- [ ] Cross-service event routing
- [ ] Lambda triggered by events
- [ ] Update `bin/infra.ts` to include events stack with dependencies
- [ ] **COST CHECK**: EventBridge 1M events free tier ✅
- [ ] **LEARNING**: Event-driven architecture, event patterns, scheduled events, rule targets

---

## ⏳ Phase 7: Workflow Automation (Step Functions + SNS)
- [ ] Create `lib/constructs/state-machine-construct.ts` for reusable Step Functions
- [ ] Create `lib/constructs/sns-topic-construct.ts` for reusable SNS topics
- [ ] Create `lib/constructs/sns-subscription-construct.ts` for reusable SNS subscriptions
- [ ] Create `lib/stacks/workflow-stack.ts` for workflow deployment unit (uses above constructs)
- [ ] Step Function for approvals
- [ ] SNS notification on approval/rejection
- [ ] Add error handling in Step Functions
- [ ] Update `bin/infra.ts` to include workflow stack with dependencies
- [ ] **COST CHECK**: Step Functions 4K transitions + SNS 1M requests free tier ✅
- [ ] **LEARNING**: Step Functions state types, SNS topics, workflow error handling, retry strategies

---

## ⏳ Phase 8: Secrets & Configuration Management
- [ ] Create `lib/constructs/secrets-manager-construct.ts` for reusable Secrets Manager secrets
- [ ] Create `lib/constructs/parameter-store-construct.ts` for reusable Parameter Store parameters
- [ ] Create `lib/stacks/secrets-stack.ts` for secrets deployment unit (uses above constructs)
- [ ] Store database credentials in Secrets Manager
- [ ] Store app config in Systems Manager Parameter Store
- [ ] Lambda retrieval of secrets
- [ ] Update `bin/infra.ts` to include secrets stack with dependencies
- [ ] **COST CHECK**: Secrets Manager 30-day trial, Parameter Store 10K params free ✅
- [ ] **LEARNING**: Secrets Manager vs Parameter Store, secret rotation, secure access patterns, cost comparison

---

## ⏳ Phase 9: CI/CD (CodePipeline + CodeBuild)
- [ ] Create `lib/constructs/codepipeline-construct.ts` for reusable CodePipeline pipelines
- [ ] Create `lib/constructs/codebuild-project-construct.ts` for reusable CodeBuild projects
- [ ] Create `lib/constructs/github-source-construct.ts` for reusable GitHub source integration
- [ ] Create `lib/stacks/cicd-stack.ts` for CI/CD deployment unit (uses above constructs)
- [ ] Create GitHub → CodePipeline integration
- [ ] React build + deploy automation
- [ ] Backend CDK deploy automation
- [ ] Add deployment scripts in `scripts/` directory
- [ ] Update `bin/infra.ts` to include CI/CD stack with dependencies
- [ ] **COST CHECK**: CodeBuild 100 minutes + CodePipeline 1 pipeline free tier ✅
- [ ] **LEARNING**: CI/CD patterns, deployment strategies, build automation, pipeline stages

---

## ⏳ Phase 10: Monitoring (CloudWatch + X-Ray)
- [ ] Create `lib/constructs/log-group-construct.ts` for reusable CloudWatch Log Groups
- [ ] Create `lib/constructs/metric-construct.ts` for reusable CloudWatch Metrics
- [ ] Create `lib/constructs/alarm-construct.ts` for reusable CloudWatch Alarms
- [ ] Create `lib/constructs/xray-construct.ts` for reusable X-Ray tracing
- [ ] Create `lib/stacks/monitoring-stack.ts` for monitoring deployment unit (uses above constructs)
- [ ] Enable CloudWatch Logs
- [ ] Add custom metrics
- [ ] Create CloudWatch alarms
- [ ] Enable X-Ray tracing
- [ ] Update `bin/infra.ts` to include monitoring stack with dependencies
- [ ] **COST CHECK**: CloudWatch 10 metrics + X-Ray 100K traces free tier ✅
- [ ] **LEARNING**: CloudWatch metrics/logs/alarms, X-Ray tracing, service maps, log insights

---

## ⏳ Phase 11: Advanced Lambda Features
- [ ] Create `lib/constructs/lambda-version-construct.ts` for reusable Lambda versions
- [ ] Create `lib/constructs/lambda-alias-construct.ts` for reusable Lambda aliases
- [ ] Create `lib/constructs/lambda-provisioned-concurrency-construct.ts` for reusable provisioned concurrency
- [ ] Create `lib/stacks/advanced-lambda-stack.ts` for advanced Lambda deployment unit (uses above constructs)
- [ ] Lambda versions and aliases
- [ ] Blue/green deployments
- [ ] Lambda provisioned concurrency
- [ ] Update `bin/infra.ts` to include advanced Lambda stack with dependencies
- [ ] **COST CHECK**: Additional Lambda usage may exceed free tier ⚠️
- [ ] **LEARNING**: Lambda versioning, aliases, traffic shifting, concurrency management

---

## ⏳ Phase 12: Container Services (ECS/Fargate/ECR)
- [ ] Create `lib/constructs/ecr-repository-construct.ts` for reusable ECR repositories
- [ ] Create `lib/constructs/container-image-construct.ts` for reusable container images
- [ ] Create `lib/constructs/container-lambda-construct.ts` for reusable container-based Lambdas
- [ ] Create `lib/stacks/container-stack.ts` for container deployment unit (uses above constructs)
- [ ] Containerize a Lambda function
- [ ] Store image in ECR
- [ ] Deploy container-based Lambda
- [ ] Update `bin/infra.ts` to include container stack with dependencies
- [ ] **COST CHECK**: ECR 500MB storage free, ECS/Fargate has charges ⚠️
- [ ] **LEARNING**: Container patterns, ECR lifecycle policies, container-based Lambda, image optimization

---

## ⏳ Phase 13: Multi-Region Deployment (Advanced)
- [ ] Create `lib/constructs/route53-hosted-zone-construct.ts` for reusable Route 53 hosted zones
- [ ] Create `lib/constructs/route53-record-construct.ts` for reusable Route 53 records
- [ ] Create `lib/constructs/cross-region-replication-construct.ts` for reusable S3 replication
- [ ] Create `lib/stacks/multiregion-stack.ts` for multi-region deployment unit (uses above constructs)
- [ ] Deploy to two regions
- [ ] Route 53 latency-based routing
- [ ] Update `bin/infra.ts` to include multi-region stack with dependencies
- [ ] **COST CHECK**: Route 53 $0.50/zone + data transfer charges ⚠️
- [ ] **LEARNING**: Multi-region patterns, Route 53 routing policies, cross-region replication, failover strategies

---

## 🧹 **COMPREHENSIVE CLEUP CHECKLIST**

### **Immediate Cleanup (After Each Phase)**
- [ ] Run `cdk destroy` to remove all resources
- [ ] Check AWS Billing Dashboard for unexpected charges
- [ ] Verify all resources are deleted in AWS Console

### **Service-Specific Cleanup**
- [ ] **S3**: Delete all buckets and objects
- [ ] **CloudFront**: Delete distributions
- [ ] **Cognito**: Delete user pools
- [ ] **API Gateway**: Delete APIs
- [ ] **Lambda**: Delete functions and layers
- [ ] **DynamoDB**: Delete tables
- [ ] **SQS**: Delete queues
- [ ] **EventBridge**: Delete rules and event buses
- [ ] **Step Functions**: Delete state machines
- [ ] **SNS**: Delete topics
- [ ] **Secrets Manager**: Delete secrets
- [ ] **Systems Manager**: Delete parameters
- [ ] **CodePipeline**: Delete pipelines
- [ ] **CodeBuild**: Delete projects
- [ ] **CloudWatch**: Delete log groups and alarms
- [ ] **X-Ray**: Delete traces
- [ ] **Route 53**: Delete hosted zones
- [ ] **ECR**: Delete repositories
- [ ] **ECS**: Delete clusters and services

### **Final Cleanup Commands**
```bash
# Destroy CDK stack
cd infra && cdk destroy

# Check for remaining resources
aws s3 ls
aws lambda list-functions
aws dynamodb list-tables
aws sqs list-queues
aws sns list-topics
aws stepfunctions list-state-machines
aws events list-rules
aws cognito-idp list-user-pools
aws apigateway get-rest-apis
aws logs describe-log-groups
```

---

## 📚 **CERTIFICATION FOCUS AREAS**

### **High Priority (Heavily Tested)**
1. **Lambda**: Versions, aliases, layers, DLQ, concurrency, environment variables
2. **SQS**: Standard vs FIFO, DLQ, long polling, visibility timeout
3. **DynamoDB**: GSI, LSI, streams, capacity modes, on-demand vs provisioned
4. **API Gateway**: Throttling, usage plans, stages, request/response transformations
5. **IAM**: Policies, roles, policy evaluation logic
6. **Elastic Beanstalk**: Deployment strategies (study theory - not practical)

### **Medium Priority**
7. **CloudFormation**: Templates, stacks, parameters, outputs
8. **CodePipeline/CodeBuild/CodeDeploy**: CI/CD workflows
9. **ECS/Fargate/ECR**: Container services
10. **EventBridge**: Event-driven architecture
11. **Secrets Manager/Parameter Store**: Configuration management

### **Lower Priority**
12. **X-Ray**: Basic tracing concepts
13. **CloudWatch**: Logs, metrics, alarms
14. **Multi-region**: Less frequently tested

---

## 🎯 **STUDY STRATEGY**

### **Phase 1-10**: Hands-on Learning (Free Tier Safe)
- Build and experiment with each service
- Focus on practical implementation
- Take notes on service interactions

### **Phase 11-13**: Theory + Limited Practice
- Study Elastic Beanstalk, ECS theory
- Practice with cost monitoring
- Use AWS Free Tier calculator

### **Final Preparation**
- AWS practice exams
- Review service limits and quotas
- Understand pricing models
- Practice troubleshooting scenarios

---

## 🚨 **COST ALERTS**

**STOP IMMEDIATELY IF YOU SEE:**
- Route 53 charges
- Data transfer charges > $1
- Lambda charges > $5
- Any service charges > $10

**MONITOR DAILY:**
- AWS Billing Dashboard
- CloudWatch costs
- Service usage vs free tier limits