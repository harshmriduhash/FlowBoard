# FlowBoard - AI-First Workflow Management

**Workflow state engine + ops dashboard powered by AI** for teams that need visibility, auditability, strict state control, and intelligent automation.

## ✨ What's New: AI Integration

FlowBoard is now an **AI-first workflow system** with:

🤖 **Conversational AI** - Chat with your workflows, ask questions, get insights  
🎤 **Voice AI** - Speak to FlowBoard and hear AI responses  
🧠 **Agentic AI** - Autonomous agents that monitor, suggest, and automate  
✨ **Workflow Intelligence** - AI-powered workflow and task suggestions  

## 🚀 Quick Start (Docker - Recommended)

```bash
# Clone and navigate
cd FlowBoard

# Configure AI (Required for AI features)
# Edit backend/.env and add your OpenAI API key:
# OPENAI_API_KEY=sk-your-key-here

# Start everything (MongoDB, Redis, Backend, Frontend)
docker-compose up --build

# Access:
# - Frontend: http://localhost:4173
# - Backend API: http://localhost:4000
# - Health check: http://localhost:4000/health
```

## 📋 Manual Setup

### Prerequisites
- Node.js 20+
- MongoDB (running on port 27017)
- Redis (running on port 6379)
- **OpenAI API Key** (for AI features)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Edit .env with your values
# Add your OpenAI API key to .env:
# OPENAI_API_KEY=sk-your-key-here
npm run dev  # Development mode
# OR
npm start    # Production mode
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env  # Set VITE_API_URL
npm run dev   # Development mode
# OR
npm run build && npm run preview  # Production build
```

## 🎯 Core Features

### Workflow Engine
✅ **Multi-tenant workspaces** - Complete isolation  
✅ **Role-based permissions** - Owner/Admin/Operator/Viewer  
✅ **State-based workflows** - Define states and allowed transitions  
✅ **Immutable audit logs** - Every change is tracked  
✅ **JWT authentication** - Access + refresh tokens  
✅ **Event-driven transitions** - Strict validation

### 🤖 AI Features (New!)

#### Conversational AI
✅ **AI Chat Widget** - Floating chat interface on all authenticated pages  
✅ **Context-Aware Responses** - AI understands your current workflow and tasks  
✅ **Natural Language Queries** - Ask "What tasks are overdue?" or "Summarize this board"  
✅ **Session Memory** - AI remembers your conversation context

#### Voice AI (Full Duplex)
✅ **Speech-to-Text** - Record voice commands using OpenAI Whisper  
✅ **Text-to-Speech** - AI responds with voice using OpenAI TTS  
✅ **Hands-Free Operation** - Manage workflows without typing

#### Agentic AI (Autonomous Agents)
✅ **Planner Agent** - Automatically breaks down complex tasks into subtasks  
✅ **Stuck Task Agent** - Monitors tasks with no updates and suggests next steps  
✅ **Deadline Agent** - Tracks items due soon and sends reminders  
✅ **Scheduled Scanning** - Agents run automatically via cron jobs

#### Workflow Intelligence
✅ **AI Workflow Suggestions** - Describe your workflow and AI generates states + transitions  
✅ **AI Task Prioritization** - AI analyzes task descriptions and sets priority (Low/Medium/High)  
✅ **Smart Recommendations** - AI suggests workflow improvements based on usage patterns  

## 🧩 Problem & Value

### What problem does FlowBoard solve?

- **Hidden backend processes** live in spreadsheets, Notion documents, and ad-hoc scripts, making it hard to see where work is stuck.
- **No auditability**: most teams can’t answer “who changed this state, when, and why?” for critical business operations.
- **Fragile state logic**: state transitions are encoded in application code; every change requires a deploy and risks regressions.
- **Poor accountability**: ownership and permissions around moving items through states are unclear or enforced manually.

### How does FlowBoard solve this?

- **Explicit workflows**: each process is modeled as a workflow with ordered states and allowed transitions stored in the database.
- **Strict state engine**: all transitions go through a backend workflow engine that validates transitions against the workflow graph and role permissions.
- **Immutable EventLog**: every item creation and transition writes an immutable audit log entry with who, what, and when.
- **Role-based control**: Owner/Admin/Operator/Viewer roles are enforced on every relevant endpoint so only authorized users can mutate state.
- **Multi-tenant isolation**: every query is scoped by `workspaceId`, ensuring clean separation between customer workspaces.

### Does it save time?

- **Yes.** Ops and engineering teams no longer maintain bespoke spreadsheets or one-off internal tools for each process.
- **Workflow changes** are applied via API/UI (editing workflow definitions) instead of full code changes and redeploys.
- **State visibility** (dashboard + workflow/item views) reduces the time spent asking “what’s the status?” across teams.

### Does it save money?

- **Fewer custom builds**: instead of building a new internal admin dashboard for each workflow, teams configure workflows in FlowBoard.
- **Reduced errors**: strict transitions and audit logs reduce costly ops mistakes and rework.
- **Better utilization**: operators can handle more work with less time spent on coordination and manual status tracking.

## 📖 Usage Flow

### Traditional Workflow
1. **Sign up** → Creates workspace + owner user
2. **Create workflow** → Define states (e.g., `Created → In Review → Approved → Completed`)
   - **NEW:** Use "✨ AI Suggest" to auto-generate workflow from description
3. **Define transitions** → Specify allowed state changes
4. **Create items** → Add items to workflows
   - **NEW:** Use "✨ AI Priority" to automatically set task priority
5. **Transition items** → Move through states (validated)
6. **View audit logs** → See complete history per item

### AI-Enhanced Workflow
1. **Chat with FlowBoard** → Click the AI widget (bottom-right on any page)
   - Ask: "What tasks are overdue?"
   - Ask: "Summarize my current board"
   - Ask: "What's blocked right now?"
2. **Voice Commands** → Click the microphone in chat
   - Say: "Create a task called Fix login bug"
   - Say: "Show blocked tasks"
   - **AI responds with voice**
3. **AI Breakdown** → Create a complex task, and the Planner Agent can break it into subtasks
4. **Automatic Monitoring** → Agents scan for stuck tasks and upcoming deadlines

## 🔐 API Endpoints

### Auth
- `POST /auth/signup` - Create account + workspace
- `POST /auth/login` - Get tokens
- `POST /auth/logout` - Invalidate refresh token
- `POST /auth/token/refresh` - Refresh access token

### Workflows
- `POST /workflows` - Create (Owner/Admin only)
- `GET /workflows` - List all in workspace

### Items
- `POST /items` - Create item (Owner/Admin/Operator)
- `GET /items?workflowId=X&state=Y` - List with filters
- `POST /items/:id/transition` - Change state (validated)
- `GET /items/:id/logs` - Get audit log

### AI Endpoints (New!)
- `POST /ai/chat` - Chat with AI about workflows and tasks
- `POST /ai/voice` - Voice input with transcription and voice response
- `POST /ai/suggest-workflow` - AI generates workflow structure from description
- `POST /ai/prioritize-task` - AI determines task priority from title/description
- `POST /ai/planner/breakdown` - Break down complex task into subtasks

## 🏗️ Tech Stack

**Backend:**
- Node.js + Express
- MongoDB (Mongoose)
- Redis (refresh tokens)
- JWT (bcryptjs)
- **OpenAI API** - GPT-4o-mini, Whisper (STT), TTS
- **node-cron** - Scheduled agent tasks
- **multer** - Audio file uploads

**Frontend:**
- React + TypeScript
- Vite
- TailwindCSS
- TanStack Query
- React Router
- **Web Audio API** - Voice recording and playback

**Infra:**
- Docker + Docker Compose

## 🧱 Architecture & System Design

### High-level architecture

- **Frontend**: React + TypeScript SPA built with Vite, talking to the backend via REST APIs.
  - **NEW:** AI Chat Widget with voice input/output capabilities
- **Backend**: Node.js + Express service exposing auth, workflow, item, log, and **AI endpoints**.
  - **NEW:** AI Service layer integrating with OpenAI APIs
  - **NEW:** Agent framework with scheduled cron jobs
- **Data layer**:
  - MongoDB for primary data models (`Workspace`, `User`, `Workflow`, `Item`, `EventLog`).
  - Redis for managing and invalidating refresh tokens.
  - **NEW:** In-memory session storage for AI conversation context
- **Auth**:
  - Email/password login with bcrypt hashing.
  - JWT access tokens (short-lived) + refresh tokens (stored in Redis with TTL).
  - Express middleware validates tokens, loads users, and enforces roles and workspace scoping.
- **AI Layer (New)**:
  - **OpenAI Integration**: GPT-4o-mini for conversational AI and task analysis
  - **Voice Processing**: Whisper for STT, TTS for voice responses
  - **Agent Scheduler**: Cron-based task scanning and notification system
- **Containerization**:
  - Docker images for backend and frontend.
  - `docker-compose.yml` orchestrates Mongo, Redis, backend, and frontend for local and simple-prod setups.

### Request & data flow

1. **Authentication**
   - User hits `POST /auth/signup` or `POST /auth/login`.
   - Backend verifies credentials, creates workspace/user (on signup), returns access + refresh tokens.
   - Frontend stores tokens client-side and sends access token in `Authorization: Bearer` header.
2. **Workflow & item operations**
   - Authenticated requests carry `workspaceId` and `role` inside the JWT payload.
   - Middleware verifies JWT, loads user, and injects `req.user` with `workspaceId` and `role`.
   - Workflow/item/log queries always filter by `workspaceId` so tenants are isolated.
3. **State transitions**
   - `POST /items/:id/transition` validates:
     - The item belongs to the same workspace as the user.
     - The requested `toState` is allowed from the current state according to the workflow's `allowedTransitions`.
     - The user's role is permitted to execute transitions.
   - If valid, the item's `currentState` is updated and an `EventLog` entry is appended.
4. **Audit & reporting**
   - `GET /items/:id/logs` returns the complete history of actions on an item ordered by timestamp.
   - Frontend surfaces this in the Item Detail page as an immutable audit trail.
5. **AI Interaction Flow (New)**
   - User sends message via chat widget or voice input
   - Backend receives request with workflow/task context
   - AI service fetches relevant data (workflows, items) from MongoDB
   - OpenAI API generates contextual response
   - Response is returned as text + optional audio (TTS)
   - Frontend displays message and plays audio if available
6. **Agent Operations (New)**
   - Cron scheduler triggers agents at defined intervals
   - Agents query MongoDB for relevant items (stuck tasks, deadlines)
   - AI analyzes each item and generates suggestions
   - Results are logged (future: notifications, auto-actions)

### Scalability & future evolution

- **Horizontal backend scaling**: the stateless Express API can be replicated behind a load balancer; JWT-based auth and Redis-based refresh storage support multiple instances.
- **Database scaling**:
  - MongoDB can be moved to a managed cluster (e.g., Atlas) with sharding or replica sets as data grows.
  - Redis can be upgraded to a managed or clustered deployment as refresh token volume increases.
- **AI Scalability**:
  - OpenAI API calls are stateless and scale with backend instances
  - Future: Add response caching for common queries
  - Future: Implement RAG with vector database (Pinecone, Weaviate) for better context
- **Feature evolution**:
  - Additional triggers (webhooks, integrations) can subscribe to workflow events emitted from the same transition logic.
  - Reporting/analytics can be built on top of `EventLog` with aggregation pipelines or a separate OLAP store.
  - **AI Evolution**: Function calling for automated actions, multi-agent collaboration, predictive analytics

## 📦 Deployment

### Production Build
```bash
# Backend
cd backend
npm install --production
npm start

# Frontend
cd frontend
npm run build
# Serve dist/ with nginx/serve/etc
```

### Environment Variables

**Backend (.env):**
```
PORT=4000
MONGO_URI=mongodb://mongo:27017/flowboard
REDIS_URL=redis://redis:6379
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<different-strong-random-secret>

# AI Configuration (Required for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Frontend (.env):**
```
VITE_API_URL=http://your-backend-url:4000
```

## 🎤 Demo Script for Investors

### Core Features Demo
1. **Show landing page** → "AI-first workflow state engine + ops dashboard"
2. **Sign up** → Creates workspace automatically
3. **Create workflow** → Use "✨ AI Suggest" with description "Bug tracking workflow"
   - Watch AI generate states and transitions automatically
4. **Create item** → "Fix login authentication bug"
   - Click "✨ AI Priority" to auto-set priority
5. **Transition item** → Move through states (show validation)
6. **View audit log** → Show immutable history

### AI Features Demo (The Wow Factor!)
7. **AI Chat** → Click the AI widget
   - Ask: "What tasks are high priority?"
   - Ask: "Summarize this workflow"
   - Show context-aware responses
8. **Voice AI** → Click microphone in chat
   - Say: "Show me overdue tasks"
   - **Listen to AI voice response** 🔊
9. **Agent Intelligence** → Show console logs of agents
   - Stuck Task Agent analyzing items
   - AI-generated suggestions for blocked tasks
10. **Value Proposition**:
    - "Traditional workflow tools are static. FlowBoard learns, suggests, and automates."
    - "Saves 10-20 hrs/week through AI automation"
    - "Prevents ops errors with intelligent monitoring"
    - "Makes backend processes visible AND intelligent"

## ✅ MVP Checklist

### Core Platform
- [x] Multi-tenant workspaces
- [x] JWT auth (access + refresh)
- [x] Role-based permissions
- [x] Workflow engine (states + transitions)
- [x] Item management
- [x] State transition validation
- [x] Immutable event logs
- [x] Dashboard UI
- [x] Workflow management UI
- [x] Item detail + transitions UI
- [x] Docker setup
- [x] Production-ready build

### AI Features (New!)
- [x] Conversational AI chat interface
- [x] Context-aware AI responses
- [x] Voice input (Speech-to-Text)
- [x] Voice output (Text-to-Speech)
- [x] AI workflow generation
- [x] AI task prioritization
- [x] Planner Agent (task breakdown)
- [x] Stuck Task Agent (monitoring)
- [x] Deadline Agent (reminders)
- [x] Agent scheduler (cron jobs)
- [x] OpenAI integration
- [x] Session memory (in-memory)

## 🚧 Out of Scope (Future Enhancements)

### Near-term (Phase 2)
- [ ] RAG implementation with vector database
- [ ] Streaming AI responses
- [ ] Multi-language support
- [ ] Email notifications for agent alerts
- [ ] AI function calling for automated actions

### Long-term
- [ ] Third-party integrations (Slack, Teams, etc.)
- [ ] Mobile app
- [ ] Advanced analytics dashboard
- [ ] Custom agent creation UI
- [ ] Collaborative agents (multi-agent systems)

## ✅ LAUNCH_CHECKLIST

- [x] Core backend APIs implemented and tested (auth, workflows, items, logs)
- [x] Frontend flows for signup, login, workflows, items, and logs are navigable end-to-end
- [x] Docker Compose starts Mongo, Redis, backend, and frontend successfully
- [x] `.env` configuration documented for backend and frontend
- [x] Health check (`/health`) returns `status: "ok"` in the target environment

## ✅ PRODUCTION_CHECKLIST

- [x] Strong, unique `JWT_SECRET` and `JWT_REFRESH_SECRET` configured
- [x] MongoDB and Redis running on secured instances or managed services
- [x] HTTPS termination configured at the load balancer / reverse proxy
- [x] CORS configured to only allow your frontend origin(s)
- [x] Basic logging and monitoring enabled (API logs, container logs)
- [x] Backup strategy in place for MongoDB

## ✅ EXECUTION_CHECKLIST

- [x] Define at least one real workflow with clear states and allowed transitions
- [x] Create representative items and run them through the full lifecycle
- [x] Validate that invalid transitions are rejected with clear errors
- [x] Confirm audit logs capture every transition with user and timestamp
- [x] Verify role behavior for Owner/Admin/Operator/Viewer in real scenarios

## ✅ MVP_LAUNCH_CHECKLIST

- [x] Landing page explains the product and value clearly
- [x] Signup/login flows work on all target browsers
- [x] Workflow list/detail and item detail pages render correctly on desktop and mobile
- [x] README and DEPLOYMENT docs are up to date and accurate
- [x] Demo script rehearsed and validated against a live environment

## ✅ READY_CHECKLIST

- [x] You can go from zero to a running environment using only this README and `docker-compose.yml`
- [x] A new user can sign up, create a workflow, create an item, transition it, and see logs without assistance
- [x] Critical errors surface as clear API responses and visible frontend messages
- [x] No hard-coded environment-specific values in the code; all configurable via env vars

## ✅ SAAS_READY_CHECKLIST

- [x] Single-tenant-by-workspace model with strict `workspaceId` scoping
- [x] Role-based authorization enforced on all mutating endpoints
- [x] Clean separation between frontend (SPA) and backend (API) for flexible deployment
- [x] Dockerized services for repeatable infrastructure
- [x] Clear pricing concept (Free, Pro, Team) documented for future billing integration

## 🚧 Out of Scope (Future)

- AI features
- Email notifications
- Third-party integrations
- Mobile app
- Advanced analytics

## 💰 Revenue Readiness

**Current Status:** ❌ **NOT READY FOR REVENUE**

FlowBoard is a **fully functional MVP** but lacks billing infrastructure to accept payments.

### What's Missing:
- ❌ Payment processing (Stripe integration)
- ❌ Subscription management (plan tracking, billing cycles)
- ❌ Plan enforcement (Free/Pro/Team limits)
- ❌ Legal pages (Terms of Service, Privacy Policy)

### Path to Revenue:
- **Time Required:** ~10-15 hours of focused work
- **What's Needed:** Stripe integration + plan enforcement middleware + billing UI
- **Cost:** Stripe fees (2.9% + $0.30 per transaction)

📄 **See [REVENUE_READINESS.md](./REVENUE_READINESS.md) for detailed assessment and implementation plan.**

### Options:
1. **Launch Free Beta** → Get users, validate product-market fit, add billing later
2. **Add Billing Now** → Implement Stripe + plan enforcement (~10-15 hours)
3. **Manual Billing** → Accept payments manually, upgrade via admin (works for first 10-20 customers)

---

## 🎯 Launch Readiness Summary

### ✅ Product Status: **AI-POWERED MVP COMPLETE**

**What Works:**
- ✅ Core workflow engine with strict state validation
- ✅ Multi-tenant architecture with role-based permissions
- ✅ **AI chat interface with voice capabilities**
- ✅ **AI-powered workflow and task suggestions**
- ✅ **Autonomous agents monitoring and assisting**
- ✅ Production-ready Docker deployment
- ✅ Complete audit trail and logging

**What's Needed for Revenue:**
- ❌ Payment processing (Stripe)
- ❌ Plan enforcement
- ❌ Legal pages

**Bottom Line:** 

FlowBoard is a **fully functional, AI-powered workflow platform** that demonstrates significant value through intelligent automation. The core product works beautifully. Add 10-15 hours of billing work to start generating revenue, or launch as a free beta to validate AI-enhanced product-market fit first.

**Built to ship today. AI-powered. Ready for investors. Ready for users. Revenue-ready with billing integration.**
