import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import FocusMeter from '../components/FocusMeter';

export default function TaskBreakdown() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');

  const [projectTitle, setProjectTitle] = useState('');
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await api.getProject(projectId);
        if (!cancelled) {
          setProject(data);
          setProjectTitle(data.title || '');
          setSteps((data.micro_tasks || []).map((t) => ({ ...t, title: t.title })));
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load project');
      }
    })();
    return () => { cancelled = true; };
  }, [projectId]);

  const generateSteps = async () => {
    if (!projectTitle.trim()) {
      setError('Enter a project or assignment title.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await api.generateSubtasks(projectTitle.trim());
      setSteps((data.steps || []).map((title, i) => ({ id: `gen-${i}`, title, step_index: i, completed: false })));
    } catch (e) {
      setError(e.message || 'Failed to generate steps');
    } finally {
      setLoading(false);
    }
  };

  const saveAsProject = async () => {
    if (!projectTitle.trim()) {
      setError('Enter a project title.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const created = await api.createProject(
        projectTitle.trim(),
        steps.map((s) => s.title)
      );
      window.history.replaceState(null, '', `/breakdown?project=${created.id}`);
      const full = await api.getProject(created.id);
      setProject(full);
      setSteps(full.micro_tasks || []);
    } catch (e) {
      setError(e.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = async (task) => {
    if (!task.id || task.id.startsWith('gen-') || task.id.startsWith('new-')) return;
    try {
      await api.toggleTaskComplete(task.id, !task.completed);
      setSteps((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
      );
      if (project) {
        const updated = await api.getProject(project.id);
        setProject(updated);
        setSteps(updated.micro_tasks || []);
      }
    } catch (e) {
      setError(e.message || 'Failed to update task');
    }
  };

  const completed = steps.filter((s) => s.completed).length;
  const total = steps.length;

  return (
    <div className="space-y-6" style={{ gap: 'var(--content-gap)' }}>
      <h1 className="text-2xl font-bold text-white">Task Breakdown</h1>
      <p className="text-slate-400">
        Enter an assignment or project title; AI will generate 5 tiny, actionable steps. Save to track progress on your dashboard.
      </p>

      <div className="flex flex-wrap items-end gap-3" style={{ gap: 'var(--content-gap)' }}>
        <label className="flex-1 min-w-[200px]">
          <span className="mb-1 block text-sm text-slate-400">Project / assignment title</span>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="e.g. Write history essay on Industrial Revolution"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline focus:ring-1 focus:ring-amber-500"
            disabled={!!projectId}
          />
        </label>
        {!projectId && (
          <>
            <button
              type="button"
              onClick={generateSteps}
              disabled={loading || !projectTitle.trim()}
              className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-900 hover:bg-amber-400 disabled:opacity-50"
            >
              {loading ? 'Generating…' : 'Generate 5 steps'}
            </button>
            {steps.length > 0 && (
              <button
                type="button"
                onClick={saveAsProject}
                disabled={saving}
                className="rounded-lg border border-amber-500 px-4 py-2 font-medium text-amber-400 hover:bg-amber-500/10 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save project'}
              </button>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-red-200">
          {error}
        </div>
      )}

      {projectId && (
        <Link to="/breakdown" className="text-sm text-amber-400 hover:underline">
          ← New breakdown
        </Link>
      )}

      {steps.length > 0 && (
        <>
          <FocusMeter completed={completed} total={total} label="This project" />
          <ul className="space-y-2" style={{ gap: 'var(--content-gap)' }}>
            {steps.map((task, i) => (
              <li
                key={task.id || i}
                className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/50 p-3"
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task)}
                  disabled={task.id?.startsWith?.('gen-') || task.id?.startsWith?.('new-')}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 border-slate-500 transition hover:border-amber-500 disabled:opacity-50"
                  aria-pressed={task.completed}
                  aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.completed && (
                    <span className="text-amber-400">✓</span>
                  )}
                </button>
                <span className={task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}>
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
