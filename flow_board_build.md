# FlowBoard — Build-Today SaaS MVP Specification

> **Goal:** Build a **real, serious, backend-heavy SaaS MVP in ONE DAY**.
> Not a demo. Not a toy. Something you can deploy, show, and sell.

---

## 1. What FlowBoard Is (Lock This First)

**FlowBoard** is a **workflow state engine + ops dashboard** for teams that run business processes and want:
- visibility
- auditability
- strict state control

Think:
> *Temporal / internal admin panels / ops dashboards — without custom code per workflow.*

This is **NOT**:
- a kanban clone
- a task manager
- a project management app

---

## 2. Problem It Solves

### Who Has This Problem?
- Startups (5–200 people)
- Ops teams
- Founders
- Engineering managers

### Current Reality
- Processes live in Google Sheets / Notion
- Backend logic is invisible
- No audit trail
- No clear ownership
- Changing logic = code deploy

### Pain
- No idea *where work is stuck*
- Ops mistakes
- Zero accountability
- Manual status updates

---

## 3. Core Value

FlowBoard gives:
- **State-based workflows**
- **Event-driven transitions**
- **Immutable audit logs**
- **Role-based control**
- **Backend-first correctness**

**Value**:
- Saves 10–20 hrs/week
- Prevents ops errors
- Makes backend processes visible

---

## 4. Tech Stack (Do NOT Change)

### Backend
- Node.js
- Express.js
- MongoDB
- Redis (events + cache)
- JWT Auth

### Frontend
- React + Vite
- TailwindCSS
- TanStack Query
- React Router

### Infra
- Docker
- Single-region deploy
- No load balancer
- No auto-scaling (for now)

---

## 5. Auth & Multi-Tenancy (MANDATORY)

### Authentication
- Email + password
- Password hashing
- JWT access + refresh tokens
- Logout invalidates refresh token

### Multi-Tenant Rules
- Every user belongs to ONE workspace
- Every DB query is workspace-scoped
- No cross-workspace access possible

---

## 6. User Roles & Permissions

### Roles
1. Owner
2. Admin
3. Operator
4. Viewer

### Permissions Matrix
- Owner: everything
- Admin: manage workflows + items
- Operator: move items, update data
- Viewer: read-only

---

## 7. Core Data Models (MongoDB)

### Workspace
- _id
- name
- ownerId
- createdAt

### User
- _id
- email
- passwordHash
- role
- workspaceId
- createdAt

### Workflow
- _id
- name
- description
- states[] (ordered)
- allowedTransitions{}
- workspaceId
- createdBy

### Item (Workflow Instance)
- _id
- workflowId
- currentState
- data (JSON)
- assignedTo
- priority
- workspaceId
- createdAt
- updatedAt

### EventLog (IMMUTABLE)
- _id
- itemId
- action
- fromState
- toState
- performedBy
- timestamp

---

## 8. Workflow Engine (CORE LOGIC)

### Rules
- Items must follow defined state transitions
- Invalid transitions FAIL HARD
- Every transition:
  - validates permission
  - emits event
  - writes audit log

### Example Workflow
```
Created → In Review → Approved → Completed
```

---

## 9. Backend APIs (MINIMUM SET)

### Auth
- POST /auth/signup
- POST /auth/login
- POST /auth/logout

### Workflows
- POST /workflows
- GET /workflows

### Items
- POST /items
- GET /items?filters
- POST /items/:id/transition

### Logs
- GET /items/:id/logs

---

## 10. Frontend Pages (REQUIRED)

### Public
- Landing page
- Pricing page

### Auth
- Login
- Signup

### App
- Dashboard (metrics)
- Workflow list
- Workflow detail (state columns)
- Item detail (history + actions)

---

## 11. UI Requirements

- Responsive
- PWA-ready
- Toast notifications
- Pagination
- Search + filters
- Modals
- Multi-step forms
- Loading states

---

## 12. SaaS Monetization (MVP-Level)

### Plans (Hardcoded for MVP)
- Free: 1 workflow, 50 items
- Pro: unlimited workflows ($29/mo)
- Team: SLA + exports ($99/mo)

> Billing can be mocked with a flag

---

## 13. Build Order (TODAY)

### Hour 1–3
- Auth
- Workspace isolation
- Core models

### Hour 4–6
- Workflow engine
- Item transitions
- Event logs

### Hour 7–9
- Dashboard UI
- Workflow UI
- Item detail

### Hour 10
- Dockerize
- Deploy

---

## 14. Explicitly Out of Scope

- AI
- Notifications
- Integrations
- Mobile app

---

## 15. FINAL AI INSTRUCTION (PASTE INTO CURSOR)

> Build FlowBoard as a **production-grade, backend-first SaaS MVP**.
>
> Focus on:
> - correctness
> - auditability
> - permissions
> - clean state transitions
>
> This must be deployable today.

---

**If this MVP works, it is 100% sellable.**

