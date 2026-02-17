# NILO — Neuro-Inclusive Learning Orchestrator

An AI-powered assistive web app for students with ADHD and Dyslexia to manage complex coursework through micro-tasks, Bionic Reading, and an accessibility-first UI.

## Features

- **Dashboard** — Focus meter visualizing progress on tiny tasks across all projects.
- **Task Breakdown** — Enter an assignment title; AI generates 5 small, actionable steps. Save as a project and tick off steps; progress syncs to the dashboard.
- **Bionic Reading** — Paste long text; optionally summarize via LLM, then view it in Bionic Reading format (first part of each word bolded) to aid focus and reading speed.
- **Accessibility Sidebar** — Toggle font (Default, Open Dyslexic, Monospace) and layout density (Dense, Comfortable, Relaxed). Settings persist in `localStorage`.

## Tech Stack

| Layer    | Stack |
|----------|--------|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend  | Node.js, Express |
| Database | PostgreSQL via Supabase |
| AI       | OpenAI API (GPT-4o-mini) for summarization and subtask generation |

## Project Structure

```
nilo/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/            # API client
│   │   ├── components/     # AccessibilitySidebar, FocusMeter
│   │   ├── context/        # AccessibilityContext
│   │   ├── pages/          # Dashboard, TaskBreakdown, Simplify
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── db/             # Supabase client, schema.sql
│   │   ├── routes/         # simplify, subtasks, tasks
│   │   ├── services/       # ai.js (simplify, generateSubtasks)
│   │   ├── config.js
│   │   ├── errors.js       # AppError, errorHandler, asyncHandler
│   │   └── index.js
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Setup

### 1. Clone and install

```bash
cd student_project
npm run install:all
```

Or manually:

```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` in the project root and fill in:

- **Supabase** — Create a project at [supabase.com](https://supabase.com). In Settings → API: copy Project URL and anon key. Use the same URL and anon key for both frontend and backend (or set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and optionally `SUPABASE_SERVICE_ROLE_KEY` for server-only operations).
- **OpenAI** — Create an API key at [platform.openai.com](https://platform.openai.com) and set `OPENAI_API_KEY`.
- **API URL** — Set `VITE_API_URL=http://localhost:3001` so the client can call the backend (or leave unset if using Vite proxy).

### 3. Database

In the Supabase dashboard, open the SQL Editor and run the contents of `server/src/db/schema.sql` to create `task_projects` and `micro_tasks` tables.

### 4. Run

From the project root:

```bash
npm run dev
```

This starts:

- **API** — [http://localhost:3001](http://localhost:3001)
- **Client** — [http://localhost:5173](http://localhost:5173) (proxies `/api` to the server)

Or run separately:

```bash
npm run dev:server   # backend only
npm run dev:client   # frontend only
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/simplify` | Body: `{ text, summarizeFirst? }`. Returns Bionic Reading result (e.g. `bionicWords`, `bionicText`). |
| POST | `/api/subtasks` | Body: `{ projectTitle }`. Returns `{ steps: string[], projectTitle }` (5 steps). |
| GET | `/api/projects` | List projects and progress counts |
| POST | `/api/projects` | Body: `{ title, steps? }`. Create project and micro-tasks. |
| GET | `/api/projects/:id` | Get project with `micro_tasks` |
| PATCH | `/api/tasks/:id/complete` | Body: `{ completed? }`. Toggle or set task completion. |

## Error Handling

- Backend uses custom errors (`AppError`, `ValidationError`, `NotFoundError`, `ExternalServiceError`) and a global `errorHandler` that returns JSON `{ error: { code, message, details? } }` with appropriate status codes.
- Routes are wrapped with `asyncHandler` so promise rejections are passed to the error handler.
- Frontend `api` client throws on non-OK responses with `message`, `status`, and `code` for UI feedback.

## License

MIT.
