# 🚀 AWS Serverless Task Approval System (REST Edition) — Progress Tracker

This file tracks implementation progress for the **AWS Developer Associate practice project**.  
Each phase corresponds to an AWS service integration. Check off as you complete steps.

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

## ⏳ Phase 1: Frontend Hosting (S3 + CloudFront)
- [x] Create React app (Vite + TS)
- [ ] Deploy to S3 bucket
- [ ] Configure CloudFront distribution
- [ ] Test hosting via CloudFront URL

---

## ⏳ Phase 2: Authentication (Cognito)
- [ ] Create Cognito User Pool
- [ ] Setup signup/login in React (Amplify/Auth SDK)
- [ ] Add role-based access (Admin/User groups)
- [ ] Secure API with Cognito Authorizer

---

## ⏳ Phase 3: REST API (API Gateway + Lambda)
- [ ] Create API Gateway REST API
- [ ] Define endpoints (POST/GET/PUT/DELETE tasks)
- [ ] Connect Lambdas
- [ ] Secure with Cognito Authorizer

---

## ⏳ Phase 4: Data Storage (DynamoDB + S3)
- [ ] DynamoDB table for tasks
- [ ] Lambda → DynamoDB integration
- [ ] Generate signed S3 URLs
- [ ] File uploads from React

---

## ⏳ Phase 5: Workflow Automation (Step Functions + SNS)
- [ ] Step Function for approvals
- [ ] SNS notification on approval/rejection

---

## ⏳ Phase 6: CI/CD (CodePipeline + CodeBuild)
- [ ] GitHub → CodePipeline integration
- [ ] React build + deploy
- [ ] Backend CDK deploy

---

## ⏳ Phase 7: Monitoring (CloudWatch + X-Ray)
- [ ] Enable CloudWatch Logs
- [ ] Add custom metrics
- [ ] Enable X-Ray tracing

---

## ⏳ Phase 8: Multi-Region Deployment (Advanced)
- [ ] Deploy to two regions
- [ ] Route 53 latency-based routing

---

## 🧹 Cleanup Checklist
- [ ] Delete S3 buckets
- [ ] Delete CloudFront distributions
- [ ] Delete Cognito pools
- [ ] Delete API Gateway + Lambdas
- [ ] Delete DynamoDB tables
- [ ] Delete Step Functions + SNS topics
- [ ] Delete CodePipeline + CodeBuild
- [ ] Delete CloudWatch log groups
- [ ] Delete Route 53 hosted zones
AKIA453I52GSQNU2T2EZ
9ktX3Rgeehw4Mb57hMN6VhC6fVQe3i/RMQ0TH011