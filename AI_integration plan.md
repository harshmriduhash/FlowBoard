You are a senior AI SaaS engineer.

You are working inside the existing GitHub repository:
FlowBoard — a workflow / task / board management app built with React frontend and Node.js backend.

Your goal:
Transform FlowBoard into an AI-first, agentic workflow system with:
1. Conversational AI
2. Agentic AI (autonomous task actions)
3. Voice AI (STT + TTS)
4. Context-aware intelligence (memory, workflows, tasks)

DO NOT rewrite the entire app.
Incrementally extend the current architecture.

--------------------------------------------------
PHASE 1 — Conversational AI (Chat with FlowBoard)
--------------------------------------------------

Add an AI assistant that users can chat with to interact with their boards.

Capabilities:
- Answer questions like:
  - "What tasks are overdue?"
  - "Summarize this board"
  - "What is blocked right now?"
- Perform read-only actions first.

Backend:
- Create `/api/ai/chat`
- Input:
  {
    message: string,
    boardId: string,
    userId: string
  }

- Fetch relevant board + task data
- Construct a system prompt describing FlowBoard entities
- Send context + user message to LLM
- Return structured response:
  {
    answer: string,
    suggestedActions?: []
  }

Frontend:
- Add floating chat widget
- Stream AI responses
- Maintain short session memory per user

--------------------------------------------------
PHASE 2 — Agentic AI (Autonomous Actions)
--------------------------------------------------

Introduce AI agents that can TAKE actions (with guardrails).

Agents to implement:
1. Planner Agent
   - When a task is created → break it into subtasks
2. Stuck Task Agent
   - Detect tasks with no updates
   - Suggest next steps
3. Deadline Agent
   - Monitor overdue tasks
   - Trigger reminders or status updates

Implementation:
- Create `agents/` directory
- Each agent:
  - Has a trigger
  - Receives structured state
  - Uses LLM function calling
  - Can call internal APIs (createTask, updateTask)

Add a permissions layer:
- AI can only act on allowed scopes
- All actions are logged

--------------------------------------------------
PHASE 3 — Workflow Intelligence
--------------------------------------------------

Add AI-assisted workflows:
- AI suggests workflow stages when creating a board
- AI recommends task priority based on description + history

Endpoint:
- `/api/ai/suggest-workflow`
- `/api/ai/prioritize-task`

Use prompt templates (no hardcoded logic).

--------------------------------------------------
PHASE 4 — Voice AI
--------------------------------------------------

Add voice control to FlowBoard.

Features:
- Voice commands:
  - "Create a task called Fix login bug"
  - "Show blocked tasks"
- AI voice responses

Frontend:
- Mic button
- Record audio
- Send to backend

Backend:
- `/api/ai/voice`
  - Speech-to-text (Whisper-style)
  - Route text into chat agent
  - Text-to-speech for response

Return audio stream + text transcript.

--------------------------------------------------
PHASE 5 — Memory & Context
--------------------------------------------------

Add short-term + long-term memory:
- Short-term: session memory (Redis / in-memory)
- Long-term: vector store (tasks, boards, conversations)

Use RAG so AI answers are grounded in real data.

--------------------------------------------------
PHASE 6 — Non-Functional Requirements
--------------------------------------------------

- Rate limit AI endpoints
- Add cost logging
- Add feature flags to enable/disable AI
- Keep AI modular and optional

--------------------------------------------------
DELIVERABLES
--------------------------------------------------

1. New backend AI routes
2. Agent framework with at least 1 working agent
3. Chat UI component
4. Voice input/output integration
5. Clear folder structure
6. Comments explaining AI prompts and agent logic

DO NOT mock features.
Write real, production-ready code.
Prefer clarity over cleverness.
