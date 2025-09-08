# 📦 Infra (AWS CDK)

This package contains the **Infrastructure as Code (IaC)** definitions using AWS CDK.

## 🌐 Responsibilities
- S3 + CloudFront → Frontend hosting
- Cognito → Authentication
- API Gateway (REST) → Entry point for backend
- Lambda → Business logic
- DynamoDB → Task storage
- Step Functions + SNS → Approvals + Notifications

## 🛠 Commands
```bash
# Synthesize CloudFormation template
pnpm cdk synth

# Deploy to AWS
pnpm cdk deploy

# Destroy stack (⚠️ cleanup carefully)
pnpm cdk destroy
