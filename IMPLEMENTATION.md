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

## ✅ Phase 1.5: Infrastructure Structure Refactoring

### **What Was Done**

Refactored the monolithic CDK stack into a modular structure following industry standards and Single Responsibility Principle.

### **Implementation Steps**

#### **1. Created Environment Configuration**

**File Created: `infra/config/environments.ts`**

- **What**: Created centralized configuration for different environments (dev/prod)
- **Why**: Avoid hardcoding values, easy to deploy to multiple environments
- **How**: 
  - Defined `EnvironmentConfig` TypeScript interface
  - Created `devConfig` with dev settings
  - Created `prodConfig` with prod settings
- **Contains**:
  - Region configuration
  - Frontend build path
  - Naming conventions (prefix + suffix)
  - Resource tags

#### **2. Created S3 Bucket Construct**

**File Created: `infra/lib/constructs/s3-bucket-construct.ts`**

- **What**: Reusable construct that creates S3 buckets
- **Why**: Can be reused for website hosting, file storage, logs, etc.
- **How**: Single-purpose class that only handles S3 bucket creation
- **Free tier optimizations**:
  - `versioned: false` - No versioning to avoid extra storage costs
  - `encryption: S3_MANAGED` - Free SSE-S3 encryption
  - `removalPolicy: DESTROY` - Easy cleanup
  - `autoDeleteObjects: true` - Automatic cleanup on destroy

#### **3. Created CloudFront Distribution Construct**

**File Created: `infra/lib/constructs/cloudfront-distribution-construct.ts`**

- **What**: Reusable construct that creates CloudFront distributions
- **Why**: Can be reused with different origins (S3, ALB, custom origins)
- **How**: Single-purpose class that handles CloudFront + OAI setup
- **Free tier optimizations**:
  - `priceClass: PRICE_CLASS_100` - Uses only US, Canada, Europe (cheapest option)
  - `cachePolicy: CACHING_OPTIMIZED` - Reduces origin requests
  - Includes Origin Access Identity (OAI) creation and configuration

#### **4. Created S3 Deployment Construct**

**File Created: `infra/lib/constructs/s3-deployment-construct.ts`**

- **What**: Reusable construct that deploys files to S3
- **Why**: Can be reused to deploy any files to any bucket
- **How**: Single-purpose class that handles file deployment and CloudFront invalidation
- **Free tier note**: First 1,000 CloudFront invalidation paths/month are free

#### **5. Created Frontend Stack**

**File Created: `infra/lib/stacks/frontend-stack.ts`**

- **What**: Stack that composes the three constructs above
- **Why**: Separation of concerns - stack orchestrates, constructs implement
- **How**: 
  1. Creates S3 bucket using `S3BucketConstruct`
  2. Creates CloudFront distribution using `CloudFrontDistributionConstruct`
  3. Deploys files using `S3DeploymentConstruct`
- **Benefits**:
  - Environment-aware (uses config)
  - Properly tagged
  - Clean outputs
  - Exports for other stacks

#### **6. Updated App Entry Point**

**File Updated: `infra/bin/infra.ts`**

- **What**: Updated to use new `FrontendStack` instead of monolithic `InfraStack`
- **Why**: Clean separation between app orchestration and stack implementation
- **How**:
  - Imports environment config
  - Selects dev/prod based on context
  - Creates stack with appropriate naming
- **Stack naming**: `TaskApproval-Frontend-Dev` (follows naming convention)

#### **7. Backed Up Old Stack**

**File Renamed: `infra/lib/infra-stack.ts` → `infra/lib/infra-stack.ts.backup`**

- **What**: Kept old monolithic stack as reference
- **Why**: Prevents conflicts, allows rollback if needed

### **Key Concepts Learned**

#### **Single Responsibility Principle**
- Each construct does ONE thing:
  - `S3BucketConstruct` → Creates S3 bucket
  - `CloudFrontDistributionConstruct` → Creates CloudFront + OAI
  - `S3DeploymentConstruct` → Deploys files
- **Benefits**: Easier to understand, test, reuse, and maintain

#### **Composition Over Inheritance**
- Stack composes multiple focused constructs
- Constructs can be mixed and matched
- No tight coupling between components

#### **Configuration Management**
- Centralized environment settings
- Type-safe configuration (TypeScript interfaces)
- Easy to add new environments (staging, qa, etc.)

#### **Construct Library Pattern**
- Reusable building blocks
- Consistent configuration across uses
- Industry-standard CDK organization

### **Architecture Comparison**

**Before (Monolithic):**
```
infra-stack.ts (one big file)
└── All S3, CloudFront, deployment logic mixed together
```

**After (Modular):**
```
config/environments.ts (configuration)
lib/constructs/ (reusable building blocks)
  ├── s3-bucket-construct.ts
  ├── cloudfront-distribution-construct.ts
  └── s3-deployment-construct.ts
lib/stacks/ (deployment units)
  └── frontend-stack.ts (composes constructs)
bin/infra.ts (app orchestration)
```

### **Verification Steps**

#### **✅ No Infrastructure Changes**

This was a refactoring, so infrastructure should be identical:

```bash
cd infra
cdk diff
```

**Expected**: No changes or only cosmetic differences (stack names, comments)

#### **✅ Build Succeeds**

```bash
cd infra
pnpm build
```

**Expected**: TypeScript compiles without errors

#### **✅ Deployment Works**

```bash
cd infra
cdk deploy
```

**Expected**:
- Stack name changes to `TaskApproval-Frontend-Dev`
- All resources remain functionally the same
- Website continues to work

#### **✅ Website Still Works**

```bash
cdk outputs
# Test CloudFront URL in browser
```

**Expected**: React app loads correctly (same as before refactoring)

### **Free Tier Impact**

✅ **Phase 1.5 has NO additional costs**

- Refactoring is code organization only
- Same AWS resources as Phase 1
- Same S3 and CloudFront usage
- **Cost**: $0 (same as Phase 1)

### **Benefits Achieved**

1. **Better Organization**: Clear file structure with single-purpose files
2. **Reusability**: Constructs can be used in future phases
3. **Maintainability**: Changes are localized to specific constructs
4. **Scalability**: Easy to add new constructs and stacks
5. **Industry Standard**: Follows AWS CDK best practices

### **Cleanup**

Same as Phase 1:

```bash
cd infra
cdk destroy
```

All resources deleted regardless of structure (monolithic or modular).

---

## ✅ Phase 2: Authentication (Cognito)

### **What Was Done**

Implemented a complete user authentication system using AWS Cognito, including user registration, email verification, sign in/out, and protected routes in the frontend.

### **Implementation Steps**

#### **Part 1: Infrastructure (CDK)**

##### **1. Updated Environment Configuration**

**File Updated: `infra/config/environments.ts`**

- **What**: Added authentication configuration to existing environment config
- **Why**: Centralized auth settings for different environments (dev/prod)
- **Added**:
  - Password policy configuration
  - User Pool and Identity Pool naming
  - Dev config: Easier password policy for testing (no special characters required)
  - Prod config: Stronger password policy with special characters

##### **2. Created User Pool Construct**

**File Created: `infra/lib/constructs/user-pool-construct.ts`**

- **What**: Reusable construct for creating Cognito User Pools
- **Why**: User Pool is the user directory (authentication)
- **Configuration**:
  - Sign-in with email (not username)
  - Self sign-up enabled
  - Email verification required
  - Password policy from config
  - Account recovery via email only
  - MFA disabled (FREE TIER optimization)
  - Advanced security disabled (FREE TIER optimization)
- **FREE TIER**: 50,000 MAU (Monthly Active Users)

##### **3. Created User Pool Client Construct**

**File Created: `infra/lib/constructs/user-pool-client-construct.ts`**

- **What**: Reusable construct for creating User Pool Clients
- **Why**: Represents the frontend application connecting to User Pool
- **Configuration**:
  - Auth flows: USER_PASSWORD_AUTH and USER_SRP_AUTH
  - No client secret (public client for JavaScript)
  - Token validity: 1 hour for ID/Access, 30 days for Refresh
  - Prevent user existence errors (security)
  - Enable token revocation
- **Learning**: Public clients (web/mobile) don't use secrets; confidential clients (backend) do

##### **4. Created Identity Pool Construct**

**File Created: `infra/lib/constructs/identity-pool-construct.ts`**

- **What**: Reusable construct for creating Cognito Identity Pools
- **Why**: Provides temporary AWS credentials via STS
- **Configuration**:
  - Unauthenticated access disabled
  - Links to User Pool and Client
  - Uses L1 construct (CfnIdentityPool) as L2 doesn't exist
- **EXAM TIP**: Identity Pools are critical for giving authenticated users AWS service access

##### **5. Created IAM Roles Construct**

**File Created: `infra/lib/constructs/cognito-iam-roles-construct.ts`**

- **What**: Creates IAM role for authenticated users
- **Why**: Defines what authenticated users can do in AWS
- **Configuration**:
  - Trust policy: Only cognito-identity.amazonaws.com can assume
  - Condition: Only authenticated users from specific Identity Pool
  - Permissions: Get credentials, basic CloudWatch logs
  - Role attachment to Identity Pool
- **EXAM TIP**: Understanding IAM role assumption with Cognito is heavily tested

##### **6. Created Auth Stack**

**File Created: `infra/lib/stacks/auth-stack.ts`**

- **What**: Stack that composes all auth constructs together
- **Why**: Separation of concerns - stack orchestrates, constructs implement
- **How**:
  1. Creates User Pool
  2. Creates User Pool Client
  3. Creates Identity Pool
  4. Creates IAM Roles and attaches to Identity Pool
  5. Applies tags
  6. Creates CloudFormation outputs
- **Outputs Created**:
  - UserPoolId (for frontend config)
  - UserPoolClientId (for frontend config)
  - IdentityPoolId (for frontend config)
  - Region (for frontend config)
  - UserPoolArn (for reference)
  - AuthenticatedRoleArn (for reference)

##### **7. Updated App Entry Point**

**File Updated: `infra/bin/infra.ts`**

- **What**: Added auth stack to CDK app
- **Why**: Register stack for deployment
- **Stack naming**: `TaskApproval-Auth-Dev`

##### **8. Deployed Infrastructure**

**Commands:**
```bash
cd infra
pnpm build
cdk diff TaskApproval-Auth-Dev
cdk deploy TaskApproval-Auth-Dev
cdk outputs --stack TaskApproval-Auth-Dev
```

**Deployment time**: ~2-3 minutes (much faster than CloudFront)

**Resources created**:
- 1 Cognito User Pool
- 1 User Pool Client
- 1 Identity Pool
- 1 IAM Role
- 1 Identity Pool Role Attachment

#### **Part 2: Frontend Integration**

##### **9. Installed Dependencies**

**Commands:**
```bash
cd frontend
pnpm add aws-amplify
pnpm add react-router-dom
pnpm add -D @types/react-router-dom
```

**Libraries**:
- `aws-amplify` - AWS SDK for frontend (Cognito, API Gateway, etc.)
- `react-router-dom` - Client-side routing for React

##### **10. Created AWS Configuration**

**File Created: `frontend/src/config/aws-config.ts`**

- **What**: Configures AWS Amplify with Cognito details
- **Why**: Tells Amplify how to connect to our User Pool and Identity Pool
- **Configuration**:
  - User Pool ID (from CDK output)
  - User Pool Client ID (from CDK output)
  - Identity Pool ID (from CDK output)
  - Region (from CDK output)
  - Sign-in method: email
  - Verification method: code
  - Password policy (matches backend)
- **Important**: Replaced placeholder values with actual CDK outputs

##### **11. Created Auth Context Provider**

**File Created: `frontend/src/contexts/AuthContext.tsx`**

- **What**: React Context for managing authentication state globally
- **Why**: Makes auth state and methods available throughout the app
- **Provides**:
  - `user` - Current authenticated user
  - `loading` - Loading state during auth operations
  - `error` - Error messages
  - `signUpUser()` - Register new user
  - `confirmSignUpUser()` - Verify email with code
  - `signInUser()` - Login existing user
  - `signOutUser()` - Logout current user
  - `resendConfirmationCode()` - Resend verification email
  - `isAuthenticated` - Boolean flag for auth status
- **Learning**: React Context API for global state management

##### **12. Created Sign Up Component**

**File Created: `frontend/src/components/Auth/SignUp.tsx`**

- **What**: User registration form
- **Features**:
  - Email and password input fields
  - Confirm password validation
  - Password strength validation (matches Cognito policy)
  - Email format validation
  - Loading state during submission
  - Error message display
  - Link to Sign In page
  - Redirect to verification page on success
- **Validation**:
  - All fields required
  - Valid email format
  - Password min 8 characters
  - Password with uppercase, lowercase, number
  - Passwords must match

##### **13. Created Confirm Sign Up Component**

**File Created: `frontend/src/components/Auth/ConfirmSignUp.tsx`**

- **What**: Email verification form with code input
- **Features**:
  - Email input (pre-filled from sign up)
  - 6-digit verification code input
  - Resend code functionality
  - Success message display
  - Redirect to sign in after verification
  - Link back to sign in page
- **Flow**: User receives email → enters code → verified → redirected to sign in

##### **14. Created Sign In Component**

**File Created: `frontend/src/components/Auth/SignIn.tsx`**

- **What**: User login form
- **Features**:
  - Email and password input fields
  - Loading state during sign in
  - Error message display with specific messages
  - Link to Sign Up page
  - Redirect to dashboard on success
  - Auto-redirect to verification if email not confirmed
- **Error Handling**:
  - UserNotConfirmedException → Redirect to verification
  - NotAuthorizedException → Wrong password
  - UserNotFoundException → User doesn't exist

##### **15. Created Protected Route Component**

**File Created: `frontend/src/components/Auth/ProtectedRoute.tsx`**

- **What**: Route guard wrapper component
- **Why**: Ensures only authenticated users can access certain pages
- **Logic**:
  - Show loading spinner while checking auth
  - Redirect to sign in if not authenticated
  - Render children if authenticated
- **Usage**: Wraps protected pages like Dashboard

##### **16. Created Dashboard Component**

**File Created: `frontend/src/pages/Dashboard.tsx`**

- **What**: Main page after successful login
- **Features**:
  - Welcome message with user email
  - Sign Out button
  - User information display
  - Authentication success confirmation
  - Next steps information
  - JWT token viewer (development tool)
- **Purpose**: Placeholder for future task management features (Phase 3)

##### **17. Updated App Component**

**File Updated: `frontend/src/App.tsx`**

- **What**: Main app component with routing
- **Changes**:
  - Imported AWS config (initializes Amplify)
  - Wrapped app in AuthProvider
  - Set up React Router
  - Defined routes (public and protected)
- **Routes**:
  - `/signup` - Public (Sign up page)
  - `/signin` - Public (Sign in page)
  - `/confirm-signup` - Public (Verification page)
  - `/dashboard` - Protected (Dashboard)
  - `/` - Redirects to dashboard

##### **18. Built and Deployed Frontend**

**Commands:**
```bash
cd frontend
pnpm build

cd ../infra
cdk deploy TaskApproval-Frontend-Dev
```

**What happens**:
1. Frontend builds with new auth code
2. CDK uploads new build to S3
3. CloudFront cache invalidated
4. New version available after 2-5 minutes

### **Key Concepts Learned**

#### **1. Cognito User Pools vs Identity Pools**

**User Pool (Authentication)**:
- User directory service
- Handles sign up, sign in, password reset
- Issues JWT tokens after authentication
- Like an identity provider (IDP)

**Identity Pool (Authorization)**:
- Provides temporary AWS credentials
- Uses STS (Security Token Service)
- Links authenticated users to IAM roles
- Allows access to AWS services (S3, DynamoDB, etc.)

**Relationship**: User Pool authenticates → Identity Pool authorizes

**EXAM TIP**: This distinction is CRITICAL for AWS Developer Associate exam

#### **2. JWT Tokens**

**Three Types**:

1. **ID Token**:
   - Contains user identity information (email, username, etc.)
   - Used to get user profile
   - Short-lived (1 hour in our config)

2. **Access Token**:
   - Used to access resources (API Gateway, etc.)
   - Contains scopes and groups
   - Short-lived (1 hour in our config)

3. **Refresh Token**:
   - Used to get new ID and Access tokens
   - Long-lived (30 days in our config)
   - Cannot be used directly for authentication

**Storage**: Amplify automatically stores tokens in localStorage

**EXAM TIP**: Know what each token is used for and their typical lifetimes

#### **3. Authentication Flow**

**Sign Up Flow**:
1. User enters email and password
2. Frontend calls `signUp()` with user details
3. Cognito creates user in UNCONFIRMED state
4. Cognito sends verification email with code
5. User enters code from email
6. Frontend calls `confirmSignUp()` with code
7. Cognito changes user to CONFIRMED state
8. User can now sign in

**Sign In Flow**:
1. User enters email and password
2. Frontend calls `signIn()` with credentials
3. Cognito validates credentials
4. If valid, Cognito returns JWT tokens
5. Amplify stores tokens in localStorage
6. User is authenticated and redirected to dashboard

**Sign Out Flow**:
1. User clicks sign out
2. Frontend calls `signOut()`
3. Amplify clears tokens from localStorage
4. User is unauthenticated and redirected to sign in

#### **4. IAM Role Assumption with Cognito**

**Trust Policy**:
- Defines WHO can assume the role
- In our case: `cognito-identity.amazonaws.com` service
- With condition: Only authenticated users from our Identity Pool

**Permission Policy**:
- Defines WHAT the role can do
- Currently: Get credentials, write logs
- Will add more permissions in later phases

**Assumption Process**:
1. User authenticates with User Pool → gets JWT tokens
2. Frontend exchanges JWT for temporary AWS credentials via Identity Pool
3. Identity Pool assumes the IAM role we defined
4. Temporary credentials returned (access key, secret key, session token)
5. Valid for 1 hour (default)
6. Can now access AWS services directly

**EXAM TIP**: Understanding STS AssumeRoleWithWebIdentity is important

#### **5. Public vs Confidential Clients**

**Public Clients** (Our case):
- JavaScript/mobile apps running on user devices
- Cannot securely store secrets
- `generateSecret: false` in User Pool Client
- Use SRP or USER_PASSWORD_AUTH flows

**Confidential Clients**:
- Backend servers
- Can securely store secrets
- `generateSecret: true`
- Use client credentials with secret

**Security Implication**: Public clients rely on other security measures (CORS, token expiry)

#### **6. Password Policies**

**Dev Environment** (Easier testing):
- Min 8 characters
- Uppercase, lowercase, number required
- Special characters NOT required

**Prod Environment** (Stronger security):
- Min 12 characters
- Uppercase, lowercase, number, special characters required

**Why Different**: Balance between security and development convenience

#### **7. React Context API**

**Purpose**: Share state across components without prop drilling

**Pattern**:
1. Create context with `createContext()`
2. Create provider component that wraps app
3. Use `useState` and `useEffect` in provider
4. Create custom hook (`useAuth`) for easy access
5. Components access context via hook

**Benefits**: Clean code, easy testing, centralized logic

#### **8. Protected Routes Pattern**

**Pattern**:
1. Check if user is authenticated
2. If loading, show spinner
3. If not authenticated, redirect to sign in
4. If authenticated, render children

**Security Note**: This is client-side protection only. Backend API must also validate tokens (Phase 3).

### **Architecture Diagram**

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                         │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         React App (Amplify)                    │    │
│  │  - Sign Up / Sign In / Sign Out                │    │
│  │  - AuthContext (state management)              │    │
│  │  - Protected Routes                            │    │
│  └───────────────────┬────────────────────────────┘    │
│                      │                                   │
└──────────────────────┼───────────────────────────────────┘
                       │
                       ↓ (Authentication)
         ┌─────────────────────────────┐
         │   Cognito User Pool         │
         │   - User Directory          │
         │   - Password Policies       │
         │   - Email Verification      │
         └──────────┬──────────────────┘
                    │
                    ↓ (Issues JWT Tokens)
                    │
         ┌──────────┴──────────────────┐
         │                              │
         ↓                              ↓
┌─────────────────┐          ┌─────────────────────┐
│   ID Token      │          │   Access Token      │
│   (User Info)   │          │   (API Access)      │
└─────────────────┘          └─────────────────────┘
         │                              │
         └──────────┬───────────────────┘
                    │
                    ↓ (Exchange for AWS Credentials)
         ┌─────────────────────────────┐
         │   Cognito Identity Pool     │
         │   - Temporary Credentials   │
         │   - STS AssumeRole          │
         └──────────┬──────────────────┘
                    │
                    ↓ (Assumes IAM Role)
         ┌─────────────────────────────┐
         │   IAM Role                  │
         │   - Get Credentials         │
         │   - CloudWatch Logs         │
         │   - (More in Phase 3+)      │
         └─────────────────────────────┘
```

### **Verification Steps**

#### **✅ Infrastructure Verification**

**1. Verify Cognito Resources Created**

```bash
# List User Pools
aws cognito-idp list-user-pools --max-results 10

# Expected: See TaskApproval-UserPool-Dev

# List Identity Pools
aws cognito-identity list-identity-pools --max-results 10

# Expected: See TaskApproval_IdentityPool_Dev
```

**2. Verify User Pool Configuration**

```bash
# Describe User Pool (replace with actual ID from outputs)
aws cognito-idp describe-user-pool --user-pool-id us-east-1_xxxxxxxxx
```

**Check**:
- SignIn aliases: email enabled
- Auto-verified attributes: email
- MFA: OFF
- Password policy matches config

**3. Verify IAM Role Created**

```bash
# List IAM roles (filter for TaskApproval)
aws iam list-roles | grep TaskApproval
```

**Expected**: See authenticated role created

**4. Verify CloudFormation Stack**

```bash
# Describe auth stack
aws cloudformation describe-stacks --stack-name TaskApproval-Auth-Dev
```

**Expected**: Stack status CREATE_COMPLETE

**5. Get CDK Outputs**

```bash
cd infra
cdk outputs --stack TaskApproval-Auth-Dev
```

**Expected Outputs**:
- UserPoolId: `us-east-1_xxxxxxxxx`
- UserPoolClientId: `xxxxxxxxxxxxxxxxxxxx`
- IdentityPoolId: `us-east-1:xxxx-xxxx-xxxx`
- Region: `us-east-1`

#### **✅ Frontend Verification**

**1. Test Sign Up Flow**

Steps:
1. Open CloudFront URL in browser
2. Navigate to `/signup`
3. Enter test email and password
4. Click "Sign Up"
5. **Expected**: Redirected to verification page
6. Check email for verification code
7. Enter 6-digit code
8. Click "Verify Email"
9. **Expected**: "Email verified successfully!" message
10. **Expected**: Redirected to sign in page

**Common Issues**:
- Email not received → Check spam folder
- Invalid code → Check expiry (codes expire after 24 hours)
- Code already used → Request new code with "Resend"

**2. Test Sign In Flow**

Steps:
1. On sign in page
2. Enter verified email and password
3. Click "Sign In"
4. **Expected**: Redirected to dashboard
5. **Expected**: Welcome message with your email
6. **Expected**: User ID displayed

**Common Errors**:
- "User not confirmed" → Email not verified, redirect to verification
- "Incorrect email or password" → Wrong credentials
- "User not found" → User doesn't exist, sign up first

**3. Test Protected Route**

Steps:
1. While signed in, note the dashboard URL
2. Click "Sign Out"
3. **Expected**: Redirected to sign in page
4. Manually navigate to `/dashboard` in URL bar
5. **Expected**: Automatically redirected back to `/signin`
6. Sign in again
7. **Expected**: Access to dashboard granted

**What this tests**: Route protection is working correctly

**4. Verify JWT Tokens**

Steps:
1. Sign in successfully
2. Press F12 to open DevTools
3. Go to **Application** tab
4. Click **Local Storage** in sidebar
5. Click on your CloudFront domain
6. **Expected**: See multiple entries starting with `CognitoIdentityServiceProvider`
7. Look for keys containing:
   - `idToken` - ID token
   - `accessToken` - Access token
   - `refreshToken` - Refresh token

**Alternative Method**:
1. On dashboard, click "View Tokens in Console" button
2. Check browser console
3. **Expected**: Object with all Cognito tokens logged

**Decode Token**:
1. Copy ID token value
2. Go to https://jwt.io
3. Paste token in "Encoded" section
4. **Expected**: See decoded payload with:
   - `sub` - User ID
   - `email` - User email
   - `cognito:username` - Username
   - `iat` - Issued at timestamp
   - `exp` - Expiry timestamp

**5. Verify User in Cognito Console**

Steps:
1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito/)
2. Click on "User pools"
3. Find and click your User Pool (TaskApproval-UserPool-Dev)
4. Click "Users" tab
5. **Expected**: See your test user listed
6. **Expected**: Status = "CONFIRMED"
7. Click on username
8. **Expected**: See user attributes (email, etc.)
9. **Expected**: See "Enabled" status

**6. Test Sign Out Flow**

Steps:
1. While signed in to dashboard
2. Click "Sign Out" button
3. **Expected**: Redirected to sign in page
4. Press F12 → Application → Local Storage
5. **Expected**: Cognito tokens removed from storage
6. Try to access `/dashboard` manually
7. **Expected**: Redirected to sign in (not authenticated)

**7. Test Multiple Users**

Steps:
1. Sign up with second email address
2. Verify second user
3. Check Cognito Console
4. **Expected**: Two users in User Pool
5. Sign in with first user
6. Sign out
7. Sign in with second user
8. **Expected**: Dashboard shows second user's email

#### **✅ AWS Console Verification**

**Cognito User Pool Console**:
- User count shows registered users
- Email verification settings correct
- Password policy matches config
- Self sign-up enabled

**IAM Console**:
- Authenticated role exists
- Trust policy allows cognito-identity
- Permission policy has basic permissions

**CloudWatch Logs**:
- May see Cognito-related log groups
- Can check for authentication events

### **Testing Results Summary**

✅ **Infrastructure**:
- User Pool created successfully
- User Pool Client created
- Identity Pool created
- IAM Role created and attached
- All CloudFormation outputs available

✅ **Authentication Flows**:
- Sign up working
- Email verification working
- Sign in working
- Sign out working
- Protected routes working

✅ **JWT Tokens**:
- Tokens issued correctly
- Stored in localStorage
- Decoded successfully
- Contain correct user information

✅ **User Management**:
- Users visible in Cognito Console
- User status correct (CONFIRMED)
- Multiple users supported

### **Common Issues and Solutions**

**Issue: "User pool client does not exist"**
- **Cause**: Frontend config not updated with real values
- **Solution**: 
  1. Run `cd infra && cdk outputs --stack TaskApproval-Auth-Dev`
  2. Copy actual values to `frontend/src/config/aws-config.ts`
  3. Rebuild frontend: `cd frontend && pnpm build`
  4. Redeploy: `cd infra && cdk deploy TaskApproval-Frontend-Dev`

**Issue: Email not received**
- **Cause**: Cognito default email sender limitations
- **Solution**:
  1. Check spam folder
  2. Wait a few minutes (can be delayed)
  3. Use "Resend Code" button
  4. For production: Configure SES (Simple Email Service)

**Issue: "User already exists" when signing up**
- **Cause**: Email already registered
- **Solution**:
  1. Use different email
  2. Or delete user from Cognito Console
  3. Or sign in with existing credentials

**Issue: Password doesn't meet requirements**
- **Cause**: Password policy not met
- **Solution**:
  - Dev: Min 8 chars, uppercase, lowercase, number
  - Prod: Min 12 chars, uppercase, lowercase, number, special char
  - Example dev password: `TestPass123`
  - Example prod password: `TestPass123!@#`

**Issue: "User is not confirmed"**
- **Cause**: Email not verified
- **Solution**:
  1. Go to `/confirm-signup`
  2. Enter email and verification code
  3. If no code, click "Resend Code"
  4. Or verify in Cognito Console (admin action)

**Issue: Can still access dashboard after sign out**
- **Cause**: Browser cache or context not updating
- **Solution**:
  1. Hard refresh (Ctrl+Shift+R)
  2. Clear local storage
  3. Check AuthContext is wrapping entire app

**Issue: Blank page after deployment**
- **Cause**: Build errors or CloudFront cache
- **Solution**:
  1. Check browser console for errors
  2. Wait 2-5 minutes for CloudFront invalidation
  3. Hard refresh browser
  4. Verify build completed: `cd frontend && ls dist/`

**Issue: TypeScript errors during build**
- **Cause**: Missing dependencies or type definitions
- **Solution**:
  1. Run `cd frontend && pnpm install`
  2. Check all imports are correct
  3. Ensure `aws-amplify` and `react-router-dom` installed
  4. Run `pnpm build` to check for errors

### **Cost Analysis**

✅ **Phase 2 is 100% FREE TIER eligible**

**Cognito User Pool**:
- **Free Tier**: 50,000 MAU (Monthly Active Users)
- **Our Usage**: 1-5 test users
- **Cost**: $0.00

**Cognito Identity Pool**:
- **Free Tier**: Unlimited
- **Cost**: $0.00

**IAM Roles**:
- **Free Tier**: Unlimited
- **Cost**: $0.00

**Email Delivery**:
- **Free Tier**: Cognito default email (limited to 1 email per second)
- **Cost**: $0.00
- **Note**: For production volume, use SES (also has free tier)

**CloudWatch Logs** (from IAM role permissions):
- **Free Tier**: 5GB storage, 10 custom metrics
- **Our Usage**: Minimal logs
- **Cost**: $0.00

**JWT Token Storage**:
- **Location**: Browser localStorage
- **Cost**: $0.00 (client-side only)

**Total Phase 2 Cost**: **$0.00**

**Cumulative Cost (Phases 0-2)**: **$0.00**

### **Security Best Practices Implemented**

1. **Private by Default**:
   - User Pool not publicly accessible
   - Email verification required
   - No anonymous access to Identity Pool

2. **Password Policies**:
   - Minimum length enforced
   - Complexity requirements (uppercase, lowercase, numbers)
   - Different policies for dev vs prod

3. **Token Management**:
   - Short-lived access tokens (1 hour)
   - Refresh tokens for seamless experience
   - Tokens revocable

4. **Error Messages**:
   - "Prevent user existence errors" enabled
   - Generic error messages don't reveal if user exists
   - Prevents email enumeration attacks

5. **IAM Least Privilege**:
   - Role has minimal permissions
   - Only what's needed for current phase
   - Will expand in later phases

6. **Protected Routes**:
   - Client-side route protection
   - Server-side validation in Phase 3 (API Gateway)

7. **HTTPS Only**:
   - CloudFront enforces HTTPS
   - Tokens transmitted securely

### **Benefits Achieved**

1. ✅ **User Authentication**: Users can sign up and sign in
2. ✅ **Email Verification**: Email ownership confirmed
3. ✅ **Secure Token Storage**: JWT tokens managed by Amplify
4. ✅ **Protected Routes**: Dashboard only for authenticated users
5. ✅ **User Management**: Users visible in Cognito Console
6. ✅ **AWS Credentials**: Foundation for accessing AWS services (Phase 3+)
7. ✅ **Industry Standard**: Using AWS Cognito (used by many companies)
8. ✅ **Scalable**: Can handle 50,000 users on free tier
9. ✅ **Type Safe**: TypeScript for all code
10. ✅ **Reusable**: Constructs can be used in future projects

### **What's Next: Phase 3 Preview**

With authentication complete, we can now build:

**Phase 3: REST API + Lambda + DynamoDB**
- Create API Gateway with Cognito authorizer
- Build Lambda functions for CRUD operations
- Store tasks in DynamoDB
- Connect frontend to backend API
- Only authenticated users can access API

**Why Phase 2 Matters**:
- API Gateway will validate JWT tokens from Cognito
- Lambda functions will receive user identity
- DynamoDB will store data per user
- IAM role will allow users to call API

### **Cleanup for Phase 2**

**To destroy auth resources**:
```bash
cd infra
cdk destroy TaskApproval-Auth-Dev
```

**What gets deleted**:
- Cognito User Pool (and all users)
- User Pool Client
- Identity Pool
- IAM Role
- CloudFormation stack

**Note**: Keep resources for Phase 3 as API Gateway will need Cognito authorizer

**Verify cleanup**:
```bash
aws cognito-idp list-user-pools --max-results 10
aws cognito-identity list-identity-pools --max-results 10
aws iam list-roles | grep TaskApproval
```

**Expected**: No Phase 2 resources should appear

---

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
