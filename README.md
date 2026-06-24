# VeloLanes
(Kanban Task Board)
(short for Velocity which is a key metric in Agile developer sprints)

A full-stack Kanban board built with React, TypeScript, and Supabase. Work hard and play harder!

## Features

- **Drag-and-drop** — move tasks between columns (To Do → In Progress → In Review → Done)
- **Task management** — create, edit, and delete tasks with title, description, priority, due date, and assignee
- **Inline editing** — click any field in the task detail panel to edit it in place
- **Comments** — add and delete comments on individual tasks
- **Activity log** — automatic history of status changes, assignments, and edits
- **Team members** — add team members in the sidebar and assign them to tasks
- **Overdue indicators** — tasks past their due date are highlighted in red
- **Search** — live filter tasks across all columns
- **Anonymous auth** — guests are automatically signed in via Supabase anonymous auth; no account required
- **Row Level Security** — each user's data is isolated via Supabase RLS policies

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript + Vite |
| Drag & Drop | @dnd-kit/core |
| Backend | Supabase (PostgreSQL + Auth) |
| Styling | Inline styles with CSS variables (dark-themed and fast-paced) |

## Local Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
git clone https://github.com/teresakatu/kanbanTaskBoard.git
cd kanbanTaskBoard
npm install
```

### 2. Configure environment

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Find these values in your Supabase dashboard under **Project Settings → API**.

### 3. Set up the database

Run the following SQL in the Supabase **SQL Editor**:

```sql
-- Tasks
create table tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  title       text not null,
  description text,
  status      text not null default 'todo',
  priority    text not null default 'normal',
  due_date    date,
  assignee_id uuid,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table tasks enable row level security;
create policy "Users manage own tasks" on tasks
  for all using (auth.uid() = user_id);

-- Team members
create table team_members (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  name       text not null,
  color      text not null default '#6366F1',
  created_at timestamptz default now()
);

alter table team_members enable row level security;
create policy "Users manage own team" on team_members
  for all using (auth.uid() = user_id);

-- Comments
create table comments (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid references tasks(id) on delete cascade not null,
  user_id    uuid references auth.users not null,
  content    text not null,
  created_at timestamptz default now()
);

alter table comments enable row level security;
create policy "Users manage own comments" on comments
  for all using (auth.uid() = user_id);

-- Activity log
create table task_activity (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid references tasks(id) on delete cascade not null,
  user_id    uuid references auth.users not null,
  action     text not null,
  created_at timestamptz default now()
);

alter table task_activity enable row level security;
create policy "Users manage own activity" on task_activity
  for all using (auth.uid() = user_id);
```

Also enable **anonymous sign-ins** in Supabase: **Authentication → Providers → Anonymous** → toggle on.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deployment

Deployed on Vercel. To deploy your own copy:

1. Import the GitHub repo at [vercel.com](https://vercel.com)
2. Add the two environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
3. Deploy

## Advanced Features

- **Task comments** — stored in a separate `comments` table with RLS; each task has a Comments tab in the detail panel
- **Activity log** — every create, status change, assignment, priority change, and due date update is recorded in `task_activity` and shown in the Activity tab
- **Team members + assignee** — add named, color-coded members in the sidebar; assign them to tasks; their avatar appears on the task card
- **Inline editing** — all task fields (title, description, status, priority, due date, assignee) are editable directly in the slide-over panel without a separate modal

## Design Decisions & Tradeoffs

- **Anonymous auth** keeps the experience frictionless (no sign-up) at the cost of data being tied to the browser session — clearing site data loses tasks
- **State lifted to `App.tsx`** for `useTeamMembers` so Sidebar and Board share one instance (avoids stale dropdown data)
- **Optimistic updates** on drag-and-drop and deletes for instant UI feedback, with rollback on error
- **Inline styles** instead of a CSS framework to keep the bundle small and avoid class-name conflicts
