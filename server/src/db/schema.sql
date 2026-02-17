-- NILO Supabase/PostgreSQL schema for micro-task progress
-- Run this in Supabase SQL Editor to create tables.

-- Projects (assignment/project title and generated steps metadata)
CREATE TABLE IF NOT EXISTS task_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  steps_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Micro-tasks: individual tiny steps with completion status
CREATE TABLE IF NOT EXISTS micro_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES task_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  step_index INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, step_index)
);

-- Index for listing tasks by project
CREATE INDEX IF NOT EXISTS idx_micro_tasks_project_id ON micro_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_micro_tasks_completed ON micro_tasks(project_id, completed);

-- Optional: enable RLS and policies (adjust for your auth)
-- ALTER TABLE task_projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE micro_tasks ENABLE ROW LEVEL SECURITY;
