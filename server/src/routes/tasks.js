import { asyncHandler } from '../errors.js';
import { getSupabase } from '../db/supabase.js';
import { TABLES } from '../db/supabase.js';
import { AppError, NotFoundError, ValidationError } from '../errors.js';

const DB_SETUP_MSG =
  'Database tables not set up. Run the SQL in server/src/db/schema.sql in your Supabase SQL Editor (see SETUP.md).';

function handleSupabaseError(err) {
  if (err?.code === 'PGRST205' || err?.message?.includes('schema cache')) {
    throw new AppError(DB_SETUP_MSG, 503, 'DATABASE_SETUP_REQUIRED');
  }
  throw err;
}

/**
 * GET /api/projects
 * Returns list of task projects with micro-task counts.
 */
export const listProjects = asyncHandler(async (_req, res) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLES.TASK_PROJECTS)
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) handleSupabaseError(error);

  const projectIds = (data || []).map((p) => p.id);
  if (projectIds.length === 0) {
    return res.json({ projects: [], progress: {} });
  }

  const { data: tasks } = await supabase
    .from(TABLES.MICRO_TASKS)
    .select('project_id, completed')
    .in('project_id', projectIds);

  const progress = {};
  (tasks || []).forEach((t) => {
    if (!progress[t.project_id]) progress[t.project_id] = { total: 0, completed: 0 };
    progress[t.project_id].total += 1;
    if (t.completed) progress[t.project_id].completed += 1;
  });

  res.json({ projects: data || [], progress });
});

/**
 * POST /api/projects
 * Body: { title: string, steps?: string[] }
 * Creates project and micro_tasks from steps.
 */
export const createProject = asyncHandler(async (req, res) => {
  const { title, steps } = req.body ?? {};
  if (!title || typeof title !== 'string' || !title.trim()) {
    throw new ValidationError('Project title is required');
  }

  const supabase = getSupabase();
  const stepsArray = Array.isArray(steps) ? steps.slice(0, 20) : [];

  const { data: project, error: projectError } = await supabase
    .from(TABLES.TASK_PROJECTS)
    .insert({ title: title.trim(), steps_json: stepsArray })
    .select()
    .single();

  if (projectError) handleSupabaseError(projectError);
  if (!project) throw new NotFoundError('Project');

  if (stepsArray.length > 0) {
    const rows = stepsArray.map((s, i) => ({
      project_id: project.id,
      title: typeof s === 'string' ? s : String(s),
      step_index: i,
    }));
    const { error: insertError } = await supabase.from(TABLES.MICRO_TASKS).insert(rows);
    if (insertError) handleSupabaseError(insertError);
  }

  res.status(201).json(project);
});

/**
 * GET /api/projects/:id
 * Returns project with its micro_tasks.
 */
export const getProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const supabase = getSupabase();

  const { data: project, error: projectError } = await supabase
    .from(TABLES.TASK_PROJECTS)
    .select('*')
    .eq('id', id)
    .single();

  if (projectError) handleSupabaseError(projectError);
  if (!project) throw new NotFoundError('Project');

  const { data: microTasks, error: tasksError } = await supabase
    .from(TABLES.MICRO_TASKS)
    .select('*')
    .eq('project_id', id)
    .order('step_index');

  if (tasksError) handleSupabaseError(tasksError);
  res.json({ ...project, micro_tasks: microTasks || [] });
});

/**
 * PATCH /api/tasks/:id/complete
 * Toggles or sets completion for a micro_task.
 */
export const toggleTaskComplete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body ?? {};
  const supabase = getSupabase();

  const { data: task, error: fetchError } = await supabase
    .from(TABLES.MICRO_TASKS)
    .select('completed')
    .eq('id', id)
    .single();

  if (fetchError) handleSupabaseError(fetchError);
  if (!task) throw new NotFoundError('Task');

  const newCompleted = typeof completed === 'boolean' ? completed : !task.completed;
  const { data: updated, error } = await supabase
    .from(TABLES.MICRO_TASKS)
    .update({
      completed: newCompleted,
      completed_at: newCompleted ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) handleSupabaseError(error);
  res.json(updated);
});
