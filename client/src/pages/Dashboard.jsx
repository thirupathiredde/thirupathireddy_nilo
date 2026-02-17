import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import FocusMeter from '../components/FocusMeter';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.listProjects();
        if (!cancelled) {
          setProjects(data.projects || []);
          setProgress(data.progress || {});
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load projects');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const totalTasks = Object.values(progress).reduce((acc, p) => acc + (p.total || 0), 0);
  const totalCompleted = Object.values(progress).reduce((acc, p) => acc + (p.completed || 0), 0);

  return (
    <div className="space-y-6" style={{ gap: 'var(--content-gap)' }}>
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      <section aria-label="Focus meter">
        <FocusMeter
          completed={totalCompleted}
          total={totalTasks || 1}
          label="Overall focus progress"
        />
      </section>

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-400">Loading projects…</p>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900/30 p-8 text-center">
          <p className="text-slate-400">No projects yet.</p>
          <Link
            to="/breakdown"
            className="mt-3 inline-block rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-900 hover:bg-amber-400"
          >
            Create from Task Breakdown
          </Link>
        </div>
      ) : (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">Your projects</h2>
          <ul className="grid gap-3 sm:grid-cols-2" style={{ gap: 'var(--content-gap)' }}>
            {projects.map((p) => {
              const pProgress = progress[p.id] || { total: 0, completed: 0 };
              return (
                <li key={p.id}>
                  <Link
                    to={`/breakdown?project=${p.id}`}
                    className="block rounded-xl border border-slate-700 bg-slate-900/50 p-4 transition hover:border-amber-500/50 hover:bg-slate-800/50"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-medium text-white">{p.title}</span>
                      <span className="text-sm text-amber-400">
                        {pProgress.completed}/{pProgress.total}
                      </span>
                    </div>
                    <FocusMeter
                      completed={pProgress.completed}
                      total={pProgress.total || 1}
                      label=""
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
