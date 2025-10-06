# 🛠️ AWS Task Approval System - Implementation Guide

This document contains the exact steps taken to implement each phase of the project, along with verification procedures.

---

## ✅ Phase 0: Setup

### **Implementation Steps**

1. **Installed AWS CLI**
   - Downloaded and installed AWS CLI
   - Verified installation: `aws --version`

2. **Installed AWS CDK**
   - Ran: `npm install -g aws-cdk`
   - Verified installation: `cdk --version`

3. **Installed pnpm**
   - Ran: `npm install -g pnpm`
   - Verified installation: `pnpm --version`

4. **Created Monorepo Structure**
   - Created project root directory: `aws-task-approval-system/`
   - Created subdirectories:
     - `infra/` - CDK infrastructure code
     - `backend/` - Lambda functions
     - `frontend/` - React application

5. **Initialized Git Repository**
   - Ran: `git init`
   - Created `.gitignore` files for root and subprojects
   - Created `.gitattributes` file
   - Committed initial structure
   - Pushed to GitHub

6. **Configured AWS CLI**
   - Ran: `aws configure`
   - Entered AWS credentials (Access Key ID, Secret Access Key)
   - Set default region: `us-east-1`
   - Set default output format: `json`

7. **Bootstrapped CDK**
   - Ran: `cdk bootstrap aws://ACCOUNT-ID/us-east-1`
   - **What it does**: Creates a CloudFormation stack that CDK uses to store assets (Lambda code, Docker images, etc.)
   - **Why needed**: CDK requires an S3 bucket and roles to deploy infrastructure

### **Verification Steps**

✅ **Verify AWS CLI**
```bash
aws --version
aws sts get-caller-identity
```
Expected output: Your AWS account details

✅ **Verify CDK**
```bash
cdk --version
```
Expected output: CDK version number

✅ **Verify pnpm**
```bash
pnpm --version
```
Expected output: pnpm version number

✅ **Verify Project Structure**
```bash
ls -la
```
Expected: `infra/`, `backend/`, `frontend/` directories

✅ **Verify CDK Bootstrap**
```bash
aws cloudformation describe-stacks --stack-name CDKToolkit
```
Expected: Stack status "CREATE_COMPLETE"

---

## ✅ Phase 1: Frontend Hosting (S3 + CloudFront)

### **Implementation Steps**

#### **1. Created React Application**

- Navigated to `frontend/` directory
- Ran: `pnpm create vite@latest . --template react-ts`
- **What it does**: Creates a React app with TypeScript using Vite build tool
- **Why Vite**: Faster build times and modern development experience compared to Create React App
- Installed dependencies: `pnpm install`

#### **2. Built Frontend for Production**

- Ran: `pnpm build` in `frontend/` directory
- **What it does**: Compiles TypeScript, bundles React code, optimizes assets
- **Output**: Creates `frontend/dist/` directory with:
  - `index.html` - Main HTML file
  - `assets/` - Bundled JavaScript and CSS files
  - `vite.svg` - Static assets
- **Why needed**: CDK will deploy these built files to S3

#### **3. Created CDK Infrastructure Stack**

**File: `infra/lib/infra-stack.ts`**

**Step 3a: Created Origin Access Identity (OAI)**
- Added `OriginAccessIdentity` construct
- **What it is**: A special CloudFront user that can access S3
- **Why needed**: Allows CloudFront to read from a private S3 bucket
- **Security benefit**: Bucket stays private; only CloudFront can access it

**Step 3b: Created S3 Bucket**
- Created `websiteBucket` with properties:
  - `publicReadAccess: false` - Bucket is private (not publicly accessible)
  - `removalPolicy: DESTROY` - Bucket will be deleted when stack is destroyed
  - `autoDeleteObjects: true` - Objects are deleted before bucket deletion
- **Important**: Did NOT set `websiteIndexDocument` property
  - **Why**: This property creates an S3 website endpoint which doesn't work with OAI
  - **Correct approach**: Use S3 bucket endpoint (not website endpoint) for CloudFront

**Step 3c: Granted CloudFront Access to S3**
- Called `websiteBucket.grantRead(originAccessIdentity)`
- **What it does**: Creates an S3 bucket policy allowing OAI to read objects
- **IAM concept**: Resource-based policy (attached to bucket) allowing specific principal (OAI)

**Step 3d: Created CloudFront Distribution**
- Created `Distribution` construct with:
  - `origin`: S3Origin pointing to websiteBucket with OAI
  - `defaultRootObject: "index.html"` - Default page when accessing root URL
- **What CloudFront does**:
  - CDN (Content Delivery Network) that caches content globally
  - Serves content from edge locations closest to users
  - Reduces latency and improves performance
- **Why CloudFront**: Makes website fast worldwide, even though S3 bucket is in one region

**Step 3e: Created Bucket Deployment**
- Created `BucketDeployment` construct with:
  - `sources`: Points to `../frontend/dist` directory
  - `destinationBucket`: websiteBucket
  - `distribution`: CloudFront distribution
  - `distributionPaths: ['/*']` - Invalidates all cached files
- **What it does**:
  - Automatically uploads files from `frontend/dist/` to S3 bucket
  - Invalidates CloudFront cache so new content is served immediately
  - Runs during `cdk deploy` command
- **Why useful**: Combines build and deployment in one step

**Step 3f: Created Outputs**
- Added `BucketName` output - Shows S3 bucket name
- Added `CloudFrontURL` output - Shows CloudFront domain
- **Why useful**: Easy access to URLs for testing and debugging

#### **4. Deployed Infrastructure**

- Navigated to `infra/` directory
- Ran: `pnpm install` - Installed CDK dependencies
- Ran: `cdk deploy` - Deployed stack to AWS
- **What happens during deploy**:
  1. CDK synthesizes CloudFormation template
  2. Creates S3 bucket
  3. Creates CloudFront distribution
  4. Uploads website files from `frontend/dist/` to S3
  5. Invalidates CloudFront cache
- **Time taken**: 10-15 minutes (mostly CloudFront distribution creation)

#### **5. Waited for CloudFront Propagation**

- CloudFront distribution takes 10-15 minutes to fully deploy
- Status changes from "In Progress" to "Deployed"
- **Why it takes time**: CloudFront updates edge locations globally (400+ locations)

### **Key Concepts Learned**

#### **1. S3 Bucket Configuration**
- **Private bucket**: Not directly accessible from internet (secure by default)
- **Removal policies**: Controls what happens to resources during stack deletion
- **Auto-delete objects**: Ensures clean deletion (otherwise bucket deletion fails if not empty)

#### **2. CloudFront Origin Access Identity (OAI)**
- **Purpose**: Allows CloudFront to access private S3 bucket
- **Security model**: S3 bucket policy grants read permission only to OAI
- **Benefit**: Users access content through CloudFront, not directly from S3
- **Exam importance**: Understanding OAI is crucial for AWS Developer Associate

#### **3. S3 Bucket Endpoint vs Website Endpoint**
- **Bucket endpoint** (e.g., `bucket.s3.amazonaws.com`):
  - Used for private buckets with CloudFront
  - Works with OAI
  - More secure
- **Website endpoint** (e.g., `bucket.s3-website-region.amazonaws.com`):
  - Used for public static websites
  - Requires public bucket
  - Does NOT work with OAI
  - Created when `websiteIndexDocument` property is set
- **Our choice**: Bucket endpoint for security with CloudFront

#### **4. CloudFront Distribution**
- **CDN (Content Delivery Network)**: Caches content at edge locations worldwide
- **Edge locations**: Over 400 globally distributed servers
- **Benefits**:
  - Reduced latency (content served from nearest location)
  - Reduced load on origin (S3)
  - DDoS protection
  - HTTPS support
- **Cache invalidation**: Necessary when deploying updates to clear old cached content

#### **5. CDK Bucket Deployment**
- **Automation**: Combines multiple steps (build, upload, invalidate) into one
- **Under the hood**: Creates a Lambda function that runs during deployment
- **Trade-off**: Adds deployment time but simplifies process

#### **6. Infrastructure as Code (CDK)**
- **Declarative**: You describe what you want, CDK creates it
- **Type-safe**: TypeScript catches errors before deployment
- **Reusable**: Easy to recreate infrastructure or deploy to multiple environments
- **Version control**: Infrastructure changes tracked in Git

### **Verification Steps**

#### **✅ Verify Frontend Build**

```bash
cd frontend
ls -la dist/
```

**Expected output:**
- `index.html` file
- `assets/` directory
- `vite.svg` file

**What you're checking:** Production build was successful

#### **✅ Verify CDK Deployment**

```bash
cd infra
cdk outputs
```

**Expected output:**
```
InfraStack.BucketName = infrastack-websitebucket-xxxxx
InfraStack.CloudFrontURL = dxxxxx.cloudfront.net
```

**What you're checking:** Stack deployed successfully and resources were created

#### **✅ Verify S3 Bucket (AWS CLI)**

```bash
# List all S3 buckets
aws s3 ls

# List contents of your bucket (replace with actual bucket name)
aws s3 ls s3://infrastack-websitebucket-xxxxx/
```

**Expected output:**
- `index.html`
- `assets/` directory
- `vite.svg`

**What you're checking:** Files were uploaded to S3

#### **✅ Verify S3 Bucket (AWS Console)**

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Find bucket starting with `infrastack-websitebucket`
3. Click on bucket name
4. **Verify files exist**: `index.html`, `assets/`, `vite.svg`
5. Click **Permissions** tab
6. Click **Bucket Policy**
   - **Check**: Policy exists granting CloudFront OAI read access
   - **What to look for**: `"Principal": {"AWS": "arn:aws:iam::cloudfront:user/..."}"`
7. Check **Block public access** settings
   - **Expected**: All checkboxes should be ON (bucket is not public)

**What you're checking:** 
- Files deployed correctly
- Security configured properly (private bucket with OAI access)

#### **✅ Verify CloudFront Distribution (AWS Console)**

1. Go to [AWS CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Find your distribution
3. Click on Distribution ID
4. **General** tab:
   - **Status**: Should be "Deployed" (not "In Progress")
   - **Domain Name**: Should match CDK output
5. Click **Origins** tab:
   - **Origin Domain**: Should be `xxx.s3.amazonaws.com` (bucket endpoint, NOT website endpoint)
   - **Origin Type**: Should show "S3"
   - **Origin Access**: Should show "Origin Access Control" or "Legacy Access Identities"
6. Click **Behaviors** tab:
   - **Default behavior**: Should exist and point to S3 origin
   - **Viewer Protocol Policy**: Typically "Redirect HTTP to HTTPS"

**What you're checking:**
- CloudFront is fully deployed
- Correctly configured to use S3 bucket endpoint
- OAI is properly set up
- Security settings are correct

#### **✅ Verify Website Works**

**Test with CLI:**
```bash
# Test CloudFront URL (replace with your actual URL)
curl -I https://dxxxxx.cloudfront.net/
```

**Expected output:**
- `HTTP/2 200` or `HTTP 200 OK`
- Header: `content-type: text/html`
- Header: `x-cache: Miss from cloudfront` (first request) or `Hit from cloudfront` (subsequent requests)

**Test in Browser:**
1. Open CloudFront URL in browser
2. **Expected**: React Vite default page loads
3. **Expected**: React logo visible and spinning
4. **No errors**: No 403, 404, or other errors

**What you're checking:**
- Website is publicly accessible through CloudFront
- Content is being served correctly
- No permission errors

#### **✅ Verify CloudFront Caching**

```bash
# First request (should miss cache)
curl -I https://dxxxxx.cloudfront.net/

# Second request (should hit cache)
curl -I https://dxxxxx.cloudfront.net/
```

**Headers to check:**
- `X-Cache: Miss from cloudfront` (first request) → Content fetched from S3
- `X-Cache: Hit from cloudfront` (second request) → Content served from cache
- `X-Amz-Cf-Id: xxx` → CloudFront request ID

**What you're checking:** CloudFront is caching content properly

#### **✅ Common Issues and Solutions**

**Issue**: 403 Forbidden error
- **Possible causes:**
  - CloudFront can't access S3 bucket
  - OAI not configured correctly
  - Bucket policy missing or incorrect
  - Using S3 website endpoint instead of bucket endpoint
- **Solution:**
  - Verify OAI exists in CDK code
  - Verify `grantRead()` is called
  - Check bucket policy in S3 console
  - Ensure `websiteIndexDocument` is NOT set in bucket config

**Issue**: 404 Not Found
- **Possible causes:**
  - Files not deployed to S3
  - Wrong path in CloudFront
  - `defaultRootObject` not set
- **Solution:**
  - Check S3 bucket contents
  - Verify `frontend/dist/` has files before deployment
  - Redeploy with `cdk deploy`

**Issue**: Old content showing after update
- **Possible cause:** CloudFront cache not invalidated
- **Solution:**
  - Wait a few minutes (TTL expiry)
  - Verify `distributionPaths: ['/*']` is set in BucketDeployment
  - Manually invalidate cache in CloudFront console
  - Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

**Issue**: "Status: In Progress" for long time
- **Normal behavior:** CloudFront takes 10-15 minutes to deploy
- **What to do:** Wait patiently, check back later

### **Architecture Diagram**

```
User Browser
    ↓
CloudFront Distribution (CDN)
    ↓ (uses OAI)
S3 Bucket (private)
    ← (deployed from)
frontend/dist/ (local build)
```

### **Cost Analysis**

✅ **Phase 1 is FREE TIER eligible**

**S3 Free Tier:**
- 5GB storage
- 20,000 GET requests/month
- 2,000 PUT requests/month

**CloudFront Free Tier:**
- 1TB data transfer out/month
- 10,000,000 HTTP/HTTPS requests/month

**Expected cost for this phase:** $0 (well within free tier for learning)

**Why it's free:**
- Small website (few MB)
- Low traffic during development
- No premium features used

### **Cleanup for Phase 1**

**To destroy all resources:**
```bash
cd infra
cdk destroy
```

**What gets deleted:**
- CloudFront distribution
- S3 bucket and all objects
- IAM policies
- CloudFormation stack

**Verify cleanup:**
```bash
aws s3 ls
aws cloudfront list-distributions
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE
```

**Expected:** No resources from this project should appear

---

## ⏳ Phase 2: Authentication (Cognito)

### **Implementation Steps**

_To be completed_

### **Key Concepts to Learn**

- Cognito User Pools vs Identity Pools
- JWT tokens (ID token, Access token, Refresh token)
- User authentication flow
- Role-based access control
- IAM roles for authenticated users

### **Verification Steps**

_To be completed_

---

## ⏳ Phase 3: REST API (API Gateway + Lambda)

### **Implementation Steps**

_To be completed_

### **Key Concepts to Learn**

- API Gateway REST API vs HTTP API
- Lambda integration
- API Gateway authorizers
- Request/response mapping
- CORS configuration
- API throttling and usage plans

### **Verification Steps**

_To be completed_

---

## ⏳ Phase 4: Data Storage (DynamoDB + S3)

### **Implementation Steps**

_To be completed_

### **Key Concepts to Learn**

- DynamoDB tables and items
- Primary keys (partition key + sort key)
- Global Secondary Indexes (GSI)
- Local Secondary Indexes (LSI)
- DynamoDB Streams
- S3 pre-signed URLs
- Read/write capacity modes

### **Verification Steps**

_To be completed_

---

## ⏳ Phase 5: Queue Processing (SQS + Lambda)

### **Implementation Steps**

_To be completed_

### **Key Concepts to Learn**

- SQS Standard vs FIFO queues
- Message visibility timeout
- Dead Letter Queues (DLQ)
- Long polling vs short polling
- Lambda event source mapping
- Batch processing

### **Verification Steps**

_To be completed_

---

## ⏳ Phase 6: Event-Driven Architecture (EventBridge)

### **Implementation Steps**

_To be completed_

### **Key Concepts to Learn**

- Event buses (default vs custom)
- Event patterns and rules
- Event routing
- Scheduled events (cron/rate expressions)
- Event targets

### **Verification Steps**

_To be completed_

---

## ⏳ Phase 7: Workflow Automation (Step Functions + SNS)

### **Implementation Steps**

_To be completed_

### **Key Concepts to Learn**

- Step Functions state machines
- State types (Task, Choice, Wait, Parallel, etc.)
- Error handling and retries
- SNS topics and subscriptions
- Email notifications

### **Verification Steps**

_To be completed_

---

## ⏳ Phase 8: Secrets & Configuration Management

### **Implementation Steps**

_To be completed_

### **Key Concepts to Learn**

- Secrets Manager vs Parameter Store
- Secret rotation
- Lambda environment variables
- Secure secret access
- Cost comparison

### **Verification Steps**

_To be completed_

---

## ⏳ Phase 9: CI/CD (CodePipeline + CodeBuild)

### **Implementation Steps**

_To be completed_

### **Key Concepts to Learn**

- CodePipeline stages
- Source stage (GitHub integration)
- Build stage (CodeBuild)
- Deploy stage
- Deployment strategies
- Buildspec files

### **Verification Steps**

_To be completed_

---

## ⏳ Phase 10: Monitoring (CloudWatch + X-Ray)

### **Implementation Steps**

_To be completed_

### **Key Concepts to Learn**

- CloudWatch Logs and log groups
- CloudWatch Metrics (standard vs custom)
- CloudWatch Alarms
- X-Ray tracing
- Service map
- Performance insights

### **Verification Steps**

_To be completed_

---

## 🔧 General Troubleshooting Commands

### **Check All Resources**

```bash
# S3 buckets
aws s3 ls

# Lambda functions
aws lambda list-functions

# DynamoDB tables
aws dynamodb list-tables

# API Gateway APIs
aws apigateway get-rest-apis

# Cognito User Pools
aws cognito-idp list-user-pools --max-results 10

# CloudFormation stacks
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE

# CloudFront distributions
aws cloudfront list-distributions

# SQS queues
aws sqs list-queues

# SNS topics
aws sns list-topics

# Step Functions state machines
aws stepfunctions list-state-machines

# EventBridge rules
aws events list-rules
```

### **Check Costs**

```bash
# Current month costs
aws ce get-cost-and-usage \
  --time-period Start=2025-10-01,End=2025-10-31 \
  --granularity MONTHLY \
  --metrics BlendedCost

# Service-specific costs
aws ce get-cost-and-usage \
  --time-period Start=2025-10-01,End=2025-10-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE
```

### **Complete Cleanup**

```bash
# Destroy CDK stack
cd infra && cdk destroy

# Verify all resources deleted
aws s3 ls
aws lambda list-functions
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE
```
