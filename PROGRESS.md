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
- [ ] Create `lib/constructs/frontend-hosting-construct.ts` for reusable S3+CloudFront logic
- [ ] Create `lib/stacks/frontend-stack.ts` for frontend deployment unit
- [ ] Update `bin/infra.ts` to use new structure
- [ ] Backup old `lib/infra-stack.ts` as `.backup`
- [ ] Deploy and verify new structure works
- [ ] **LEARNING**: Understand stacks vs constructs, configuration management

---

## ⏳ Phase 2: Authentication (Cognito)
- [ ] Create `lib/constructs/auth-construct.ts` for reusable Cognito logic
- [ ] Create `lib/stacks/auth-stack.ts` for authentication deployment unit
- [ ] Create Cognito User Pool with proper configuration
- [ ] Create Cognito Identity Pool for AWS resource access
- [ ] Setup IAM roles for authenticated users
- [ ] Setup signup/login in React (Amplify/Auth SDK)
- [ ] Add role-based access (Admin/User groups)
- [ ] Update `bin/infra.ts` to include auth stack
- [ ] **COST CHECK**: Cognito 50K MAU free tier ✅
- [ ] **LEARNING**: User Pools vs Identity Pools, JWT tokens, IAM roles

---

## ⏳ Phase 3: REST API (API Gateway + Lambda)
- [ ] Create `lib/constructs/lambda-construct.ts` for standardized Lambda functions
- [ ] Create `lib/constructs/api-construct.ts` for standardized API Gateway
- [ ] Create `lib/stacks/api-stack.ts` for API deployment unit
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
- [ ] **LEARNING**: API Gateway integration, Lambda configuration, request/response mapping

---

## ⏳ Phase 4: Data Storage (DynamoDB + S3)
- [ ] Create `lib/constructs/database-construct.ts` for standardized DynamoDB tables
- [ ] Create `lib/constructs/storage-construct.ts` for standardized S3 buckets
- [ ] Create `lib/stacks/storage-stack.ts` for storage deployment unit
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
- [ ] **LEARNING**: DynamoDB design patterns, GSI/LSI, S3 pre-signed URLs

---

## ⏳ Phase 5: Queue Processing (SQS + Lambda)
- [ ] Create `lib/constructs/queue-construct.ts` for standardized SQS queues
- [ ] Create `lib/stacks/queue-stack.ts` for queue deployment unit
- [ ] Create SQS Standard queue
- [ ] Create SQS FIFO queue
- [ ] Add Dead Letter Queues
- [ ] Configure long polling
- [ ] Lambda triggered by SQS messages
- [ ] Message visibility timeout configuration
- [ ] Update `bin/infra.ts` to include queue stack with dependencies
- [ ] **COST CHECK**: SQS 1M requests free tier ✅
- [ ] **LEARNING**: SQS Standard vs FIFO, DLQ patterns, Lambda event source mapping

---

## ⏳ Phase 6: Event-Driven Architecture (EventBridge)
- [ ] Create `lib/constructs/eventbridge-construct.ts` for standardized event routing
- [ ] Create `lib/stacks/events-stack.ts` for event-driven deployment unit
- [ ] Create EventBridge custom event bus
- [ ] Scheduled rule for daily reports (cron)
- [ ] Cross-service event routing
- [ ] Lambda triggered by events
- [ ] Update `bin/infra.ts` to include events stack with dependencies
- [ ] **COST CHECK**: EventBridge 1M events free tier ✅
- [ ] **LEARNING**: Event-driven architecture, event patterns, scheduled events

---

## ⏳ Phase 7: Workflow Automation (Step Functions + SNS)
- [ ] Create `lib/constructs/stepfunctions-construct.ts` for standardized workflows
- [ ] Create `lib/constructs/notification-construct.ts` for standardized SNS topics
- [ ] Create `lib/stacks/workflow-stack.ts` for workflow deployment unit
- [ ] Step Function for approvals
- [ ] SNS notification on approval/rejection
- [ ] Add error handling in Step Functions
- [ ] Update `bin/infra.ts` to include workflow stack with dependencies
- [ ] **COST CHECK**: Step Functions 4K transitions + SNS 1M requests free tier ✅
- [ ] **LEARNING**: Step Functions state machines, SNS topics, workflow patterns

---

## ⏳ Phase 8: Secrets & Configuration Management
- [ ] Create `lib/constructs/secrets-construct.ts` for standardized secret management
- [ ] Create `lib/stacks/secrets-stack.ts` for secrets deployment unit
- [ ] Store database credentials in Secrets Manager
- [ ] Store app config in Systems Manager Parameter Store
- [ ] Lambda retrieval of secrets
- [ ] Update `bin/infra.ts` to include secrets stack with dependencies
- [ ] **COST CHECK**: Secrets Manager 30-day trial, Parameter Store 10K params free ✅
- [ ] **LEARNING**: Secrets Manager vs Parameter Store, secret rotation, secure access patterns

---

## ⏳ Phase 9: CI/CD (CodePipeline + CodeBuild)
- [ ] Create `lib/constructs/pipeline-construct.ts` for standardized CI/CD pipelines
- [ ] Create `lib/stacks/cicd-stack.ts` for CI/CD deployment unit
- [ ] Create GitHub → CodePipeline integration
- [ ] React build + deploy automation
- [ ] Backend CDK deploy automation
- [ ] Add deployment scripts in `scripts/` directory
- [ ] Update `bin/infra.ts` to include CI/CD stack with dependencies
- [ ] **COST CHECK**: CodeBuild 100 minutes + CodePipeline 1 pipeline free tier ✅
- [ ] **LEARNING**: CI/CD patterns, deployment strategies, build automation

---

## ⏳ Phase 10: Monitoring (CloudWatch + X-Ray)
- [ ] Create `lib/constructs/monitoring-construct.ts` for standardized monitoring
- [ ] Create `lib/stacks/monitoring-stack.ts` for monitoring deployment unit
- [ ] Enable CloudWatch Logs
- [ ] Add custom metrics
- [ ] Create CloudWatch alarms
- [ ] Enable X-Ray tracing
- [ ] Update `bin/infra.ts` to include monitoring stack with dependencies
- [ ] **COST CHECK**: CloudWatch 10 metrics + X-Ray 100K traces free tier ✅
- [ ] **LEARNING**: CloudWatch metrics, alarms, X-Ray tracing, service maps

---

## ⏳ Phase 11: Advanced Lambda Features
- [ ] Create `lib/constructs/advanced-lambda-construct.ts` for advanced Lambda patterns
- [ ] Create `lib/stacks/advanced-lambda-stack.ts` for advanced Lambda deployment unit
- [ ] Lambda versions and aliases
- [ ] Blue/green deployments
- [ ] Lambda provisioned concurrency
- [ ] Update `bin/infra.ts` to include advanced Lambda stack with dependencies
- [ ] **COST CHECK**: Additional Lambda usage may exceed free tier ⚠️
- [ ] **LEARNING**: Lambda versioning, aliases, blue/green deployments, concurrency patterns

---

## ⏳ Phase 12: Container Services (ECS/Fargate/ECR)
- [ ] Create `lib/constructs/container-construct.ts` for standardized container services
- [ ] Create `lib/stacks/container-stack.ts` for container deployment unit
- [ ] Containerize a Lambda function
- [ ] Store image in ECR
- [ ] Deploy container-based Lambda
- [ ] Update `bin/infra.ts` to include container stack with dependencies
- [ ] **COST CHECK**: ECR 500MB storage free, ECS/Fargate has charges ⚠️
- [ ] **LEARNING**: Container patterns, ECR, ECS vs Fargate, container-based Lambda

---

## ⏳ Phase 13: Multi-Region Deployment (Advanced)
- [ ] Create `lib/constructs/multiregion-construct.ts` for standardized multi-region patterns
- [ ] Create `lib/stacks/multiregion-stack.ts` for multi-region deployment unit
- [ ] Deploy to two regions
- [ ] Route 53 latency-based routing
- [ ] Update `bin/infra.ts` to include multi-region stack with dependencies
- [ ] **COST CHECK**: Route 53 $0.50/zone + data transfer charges ⚠️
- [ ] **LEARNING**: Multi-region patterns, Route 53 routing, cross-region replication

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