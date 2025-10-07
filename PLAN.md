# 🚀 AWS Task Approval System - Complete Implementation Plan

## 📋 Application Overview

**What we're building:** A serverless task approval system where users can:
1. Sign up and login
2. Submit tasks for approval
3. Managers can approve/reject tasks
4. Receive notifications on status changes
5. View task history

## 🏗️ Architecture Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│                    CloudFront + S3                       │
│                   (React Frontend)                       │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────┐
│              Cognito (Authentication)                    │
│         User Pool + Identity Pool + IAM Roles            │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────┐
│           API Gateway (REST API + Authorizer)            │
└──────────────────────────┬──────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ↓               ↓               ↓
     ┌─────────┐     ┌─────────┐    ┌─────────┐
     │ Lambda  │     │ Lambda  │    │ Lambda  │
     │ Create  │     │  List   │    │ Approve │
     └────┬────┘     └────┬────┘    └────┬────┘
          │               │              │
          └───────────────┼──────────────┘
                          ↓
              ┌───────────────────────┐
              │  DynamoDB (Tasks)     │
              └───────────────────────┘
                          │
                          ↓
              ┌───────────────────────┐
              │    SNS (Notifications)│
              └───────────────────────┘
```

## 📦 Complete Phase Breakdown

Each phase is divided into:
- **🏗️ Infrastructure**: CDK constructs and stacks
- **⚙️ Backend**: Lambda function implementation
- **🎨 Frontend**: React components and integration
- **🔗 Integration**: Connecting everything together

---

## ✅ Phase 0: Setup

### Prerequisites
- [x] AWS CLI installed
- [x] AWS CDK installed
- [x] pnpm installed
- [x] Monorepo structure created
- [x] GitHub repo initialized
- [x] AWS CLI configured
- [x] CDK bootstrap completed

---

## ✅ Phase 1: Frontend Hosting (S3 + CloudFront)

### 🏗️ Infrastructure
- [x] Create React app (Vite + TS)
- [x] Create S3 bucket
- [x] Create CloudFront distribution
- [x] Deploy frontend to S3

### 🎨 Frontend
- [x] Basic React app structure
- [x] Build configuration

### ✅ Result
- Static website hosted on CloudFront

---

## ✅ Phase 1.5: Infrastructure Refactoring

### 🏗️ Infrastructure
- [x] Create `config/environments.ts`
- [x] Create `s3-bucket-construct.ts`
- [x] Create `cloudfront-distribution-construct.ts`
- [x] Create `s3-deployment-construct.ts`
- [x] Create `frontend-stack.ts`
- [x] Update `bin/infra.ts`

### ✅ Result
- Modular, reusable CDK structure following SRP

---

## ⏳ Phase 2: Authentication (Cognito)

### 🏗️ Infrastructure (CDK)
- [ ] Create `lib/constructs/user-pool-construct.ts`
  - Cognito User Pool configuration
  - Email verification
  - Password policy
- [ ] Create `lib/constructs/identity-pool-construct.ts`
  - Cognito Identity Pool
  - Link to User Pool
  - User Pool Client
- [ ] Create `lib/constructs/iam-role-construct.ts`
  - IAM role for authenticated users
  - Basic Cognito permissions
- [ ] Create `lib/stacks/auth-stack.ts`
  - Compose above constructs
  - Create role attachment
  - Outputs (User Pool ID, Client ID, Identity Pool ID)
- [ ] Update `config/environments.ts`
  - Add auth configuration
- [ ] Update `bin/infra.ts`
  - Add auth stack
- [ ] Deploy infrastructure

### 🎨 Frontend (React)
- [ ] Install Amplify libraries
  - `npm install aws-amplify @aws-amplify/ui-react`
- [ ] Create `src/config/aws-config.ts`
  - Configure Amplify with Cognito details
- [ ] Create `src/components/Auth/SignUp.tsx`
  - Sign up form
  - Email validation
  - Password validation
- [ ] Create `src/components/Auth/SignIn.tsx`
  - Login form
  - Error handling
- [ ] Create `src/components/Auth/AuthProvider.tsx`
  - Auth context
  - Current user state
  - Sign in/out methods
- [ ] Update `src/App.tsx`
  - Add AuthProvider
  - Conditional rendering (logged in vs logged out)
- [ ] Create `src/components/Layout/ProtectedRoute.tsx`
  - Route guard for authenticated pages

### 🔗 Integration & Testing
- [ ] Get Cognito outputs from CDK
- [ ] Update frontend config with real values
- [ ] Test sign up flow
- [ ] Test email verification
- [ ] Test login flow
- [ ] Test logout
- [ ] Verify JWT tokens in browser (localStorage/sessionStorage)

### ✅ Result
- Users can sign up, verify email, login, and logout
- JWT tokens stored in browser
- Protected routes work

---

## ⏳ Phase 3: REST API & Backend Logic (API Gateway + Lambda + DynamoDB)

### 🏗️ Infrastructure (CDK)

#### 3.1: Database Setup
- [ ] Create `lib/constructs/dynamodb-table-construct.ts`
  - On-demand billing
  - Partition key: taskId
  - Sort key: createdAt
- [ ] Create `lib/constructs/dynamodb-gsi-construct.ts`
  - GSI for querying by user
  - GSI for querying by status
- [ ] Create `lib/stacks/storage-stack.ts`
  - Compose DynamoDB constructs
  - Outputs (Table name, ARN)

#### 3.2: Lambda Functions
- [ ] Create `lib/constructs/lambda-function-construct.ts`
  - Standardized Lambda configuration
  - ARM64 architecture
  - Environment variables support
  - DLQ configuration
- [ ] Create `lib/constructs/lambda-layer-construct.ts`
  - Shared dependencies layer
- [ ] Create `lib/stacks/api-stack.ts` (Part 1: Lambda setup)
  - Lambda functions for CRUD operations
  - Environment variables (table name, etc.)

#### 3.3: API Gateway
- [ ] Create `lib/constructs/api-gateway-construct.ts`
  - REST API configuration
  - CORS setup
- [ ] Create `lib/constructs/api-authorizer-construct.ts`
  - Cognito authorizer
- [ ] Update `lib/stacks/api-stack.ts` (Part 2: API setup)
  - Create API Gateway
  - Connect Lambda integrations
  - Add Cognito authorizer
  - Define routes
  - Outputs (API URL)
- [ ] Update `bin/infra.ts`
  - Add storage and API stacks
  - Pass dependencies

### ⚙️ Backend (Lambda Functions)

Create in `backend/functions/`:

#### Shared Code
- [ ] Create `backend/functions/shared/types.ts`
  - TypeScript interfaces for Task, User, etc.
- [ ] Create `backend/functions/shared/responses.ts`
  - Standard API response format
  - Error response helper
- [ ] Create `backend/functions/shared/dynamodb.ts`
  - DynamoDB client setup
  - Common query patterns

#### Lambda Functions
- [ ] Create `backend/functions/tasks/create.ts`
  - POST /tasks
  - Validate input
  - Generate taskId
  - Save to DynamoDB
  - Return created task
- [ ] Create `backend/functions/tasks/list.ts`
  - GET /tasks
  - Query user's tasks from DynamoDB
  - Return task list
- [ ] Create `backend/functions/tasks/get.ts`
  - GET /tasks/{id}
  - Get single task
  - Check user permissions
- [ ] Create `backend/functions/tasks/approve.ts`
  - PUT /tasks/{id}/approve
  - Check user is manager
  - Update task status
  - Return updated task
- [ ] Create `backend/functions/tasks/reject.ts`
  - PUT /tasks/{id}/reject
  - Check user is manager
  - Update task status
  - Return updated task

### 🎨 Frontend (React)

Create in `frontend/src/`:

#### API Configuration
- [ ] Create `src/services/api-client.ts`
  - Axios or Fetch wrapper
  - Add JWT token to headers
  - Error handling
- [ ] Create `src/services/tasks-api.ts`
  - createTask()
  - listTasks()
  - getTask()
  - approveTask()
  - rejectTask()

#### Components
- [ ] Create `src/components/Tasks/TaskForm.tsx`
  - Form to create new task
  - Title, description fields
  - Submit button
- [ ] Create `src/components/Tasks/TaskList.tsx`
  - Display list of tasks
  - Filter by status
  - Click to view details
- [ ] Create `src/components/Tasks/TaskDetail.tsx`
  - Show task details
  - Approve/Reject buttons (for managers)
  - Status badge
- [ ] Create `src/components/Tasks/TaskCard.tsx`
  - Single task display
  - Status indicator
- [ ] Create `src/pages/Dashboard.tsx`
  - Main page after login
  - Shows task list
  - Create task button
- [ ] Create `src/pages/TaskDetailPage.tsx`
  - Full task view
  - Actions

#### State Management
- [ ] Create `src/hooks/useTasks.ts`
  - Fetch tasks
  - Create task
  - Update task status
- [ ] Create `src/context/TaskContext.tsx` (optional)
  - Global task state

### 🔗 Integration & Testing
- [ ] Get API URL from CDK outputs
- [ ] Update frontend config with API URL
- [ ] Test creating a task
- [ ] Test listing tasks
- [ ] Test viewing task details
- [ ] Test approving a task (as manager)
- [ ] Test rejecting a task (as manager)
- [ ] Verify data in DynamoDB console
- [ ] Check Lambda logs in CloudWatch

### ✅ Result
- Complete CRUD operations working
- Users can create tasks
- Managers can approve/reject
- All data persisted in DynamoDB

---

## ⏳ Phase 4: User Roles & Permissions

### 🏗️ Infrastructure (CDK)
- [ ] Update `lib/constructs/user-pool-construct.ts`
  - Add user groups (Admin, Manager, User)
- [ ] Update `lib/stacks/auth-stack.ts`
  - Create Cognito groups
  - Define group IAM policies
- [ ] Redeploy infrastructure

### ⚙️ Backend (Lambda Functions)
- [ ] Update `backend/functions/shared/auth.ts`
  - Extract user groups from JWT token
  - Authorization helper functions
- [ ] Update `backend/functions/tasks/approve.ts`
  - Check if user is in Manager/Admin group
  - Return 403 if not authorized
- [ ] Update `backend/functions/tasks/reject.ts`
  - Check if user is in Manager/Admin group
  - Return 403 if not authorized

### 🎨 Frontend (React)
- [ ] Create `src/hooks/useAuth.ts`
  - Get current user
  - Get user groups/roles
  - Check permissions
- [ ] Update `src/components/Tasks/TaskDetail.tsx`
  - Show approve/reject only for managers
  - Conditional rendering based on role
- [ ] Create `src/components/Admin/UserManagement.tsx` (optional)
  - Admin UI to assign roles

### 🔗 Integration & Testing
- [ ] Manually add user to Manager group in Cognito
- [ ] Login as manager
- [ ] Verify approve/reject buttons show
- [ ] Login as regular user
- [ ] Verify approve/reject buttons hidden
- [ ] Test API returns 403 for unauthorized access

### ✅ Result
- Role-based access control working
- Only managers can approve/reject
- UI adapts based on user role

---

## ⏳ Phase 5: Notifications (SNS)

### 🏗️ Infrastructure (CDK)
- [ ] Create `lib/constructs/sns-topic-construct.ts`
  - SNS topic for notifications
- [ ] Create `lib/constructs/sns-subscription-construct.ts`
  - Email subscriptions
- [ ] Update `lib/stacks/api-stack.ts`
  - Add SNS topic
  - Grant Lambda publish permissions
- [ ] Redeploy infrastructure

### ⚙️ Backend (Lambda Functions)
- [ ] Create `backend/functions/shared/notifications.ts`
  - SNS client setup
  - Send notification helper
- [ ] Update `backend/functions/tasks/create.ts`
  - Send notification on task creation
- [ ] Update `backend/functions/tasks/approve.ts`
  - Send notification on approval
- [ ] Update `backend/functions/tasks/reject.ts`
  - Send notification on rejection

### 🎨 Frontend (React)
- [ ] Create `src/components/Settings/NotificationSettings.tsx`
  - User can enter email for notifications
  - Subscribe to SNS topic
- [ ] Update `src/pages/Dashboard.tsx`
  - Add link to notification settings

### 🔗 Integration & Testing
- [ ] Subscribe email to SNS topic
- [ ] Confirm subscription via email
- [ ] Create a task
- [ ] Verify email notification received
- [ ] Approve a task
- [ ] Verify email notification received

### ✅ Result
- Email notifications on task events
- Users receive updates on their tasks

---

## ⏳ Phase 6: File Attachments (S3)

### 🏗️ Infrastructure (CDK)
- [ ] Create new S3 bucket construct for file storage
- [ ] Update `lib/stacks/storage-stack.ts`
  - Add file storage bucket
  - Grant Lambda permissions
- [ ] Update Lambda IAM policies
  - Allow S3 GetObject/PutObject
- [ ] Redeploy infrastructure

### ⚙️ Backend (Lambda Functions)
- [ ] Create `backend/functions/shared/s3.ts`
  - S3 client setup
  - Generate pre-signed URLs
- [ ] Create `backend/functions/files/get-upload-url.ts`
  - POST /files/upload-url
  - Generate pre-signed URL for upload
  - Return URL
- [ ] Create `backend/functions/files/get-download-url.ts`
  - GET /files/{fileId}/download-url
  - Generate pre-signed URL for download
  - Return URL
- [ ] Update `backend/functions/tasks/create.ts`
  - Accept file attachments
  - Store file references in DynamoDB

### 🎨 Frontend (React)
- [ ] Create `src/components/Files/FileUpload.tsx`
  - File input
  - Upload to pre-signed URL
  - Progress indicator
- [ ] Create `src/components/Files/FileList.tsx`
  - Display attached files
  - Download links
- [ ] Update `src/components/Tasks/TaskForm.tsx`
  - Add file upload component
- [ ] Update `src/components/Tasks/TaskDetail.tsx`
  - Show attached files
  - Download buttons

### 🔗 Integration & Testing
- [ ] Upload a file when creating task
- [ ] Verify file in S3 console
- [ ] Download file from task detail page
- [ ] Verify correct file downloads

### ✅ Result
- Users can attach files to tasks
- Files stored securely in S3
- Pre-signed URLs for secure access

---

## ⏳ Phase 7: Queue Processing (SQS)

### 🏗️ Infrastructure (CDK)
- [ ] Create `lib/constructs/sqs-queue-construct.ts`
  - Standard queue for async processing
  - Dead Letter Queue
- [ ] Update `lib/stacks/api-stack.ts`
  - Add SQS queue
  - Connect Lambda to SQS trigger
  - Grant permissions
- [ ] Redeploy infrastructure

### ⚙️ Backend (Lambda Functions)
- [ ] Create `backend/functions/queue/process-approval.ts`
  - Triggered by SQS messages
  - Process approval workflow
  - Send notifications
- [ ] Update `backend/functions/tasks/approve.ts`
  - Send message to SQS instead of direct processing
  - Return immediately
- [ ] Update `backend/functions/tasks/reject.ts`
  - Send message to SQS instead of direct processing
  - Return immediately

### 🔗 Integration & Testing
- [ ] Approve a task
- [ ] Verify message sent to SQS
- [ ] Verify Lambda processes message
- [ ] Verify notification sent
- [ ] Check DLQ for any failures

### ✅ Result
- Async processing of approvals
- Improved API response times
- Reliable message processing with DLQ

---

## ⏳ Phase 8: Advanced Features

### Step Functions Workflow
- [ ] Create approval workflow state machine
- [ ] Multi-step approval process
- [ ] Automatic escalation

### CloudWatch Monitoring
- [ ] Custom metrics dashboard
- [ ] Alarms for errors
- [ ] Log insights queries

### CI/CD Pipeline
- [ ] CodePipeline for frontend
- [ ] Automatic deployment on Git push
- [ ] Build and test stages

---

## 🎯 Integration Checklist

At each phase, ensure:
- [ ] Infrastructure deployed successfully
- [ ] Backend functions tested individually
- [ ] Frontend updated with new API endpoints
- [ ] End-to-end flow works
- [ ] Documentation updated in IMPLEMENTATION.md
- [ ] Free tier usage monitored

---

## 📚 Key Learning Focus

### Infrastructure (CDK)
- Single Responsibility Principle
- Composition patterns
- Environment management

### Backend (Lambda)
- Serverless patterns
- Error handling
- Authorization

### Frontend (React)
- Authentication flow
- API integration
- State management

### Integration
- How AWS services connect
- Security (IAM, Cognito)
- Asynchronous patterns

---

## 🚨 Cost Management

**Stay within free tier:**
- Monitor usage daily
- Run `cdk destroy` when not developing
- Check billing dashboard weekly

**Free tier safe phases:** 1-7
**Cost warning phases:** 8+ (Step Functions, advanced monitoring)
