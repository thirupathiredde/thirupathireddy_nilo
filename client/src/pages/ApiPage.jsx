import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

const ENDPOINTS = [
  { method: 'GET', path: '/api/health', description: 'Health check' },
  {
    method: 'POST',
    path: '/api/simplify',
    description: 'Body: { text, summarizeFirst? }. Returns Bionic Reading result.',
  },
  {
    method: 'POST',
    path: '/api/subtasks',
    description: 'Body: { projectTitle }. Returns 5 actionable steps.',
  },
  { method: 'GET', path: '/api/projects', description: 'List projects and progress counts' },
  {
    method: 'POST',
    path: '/api/projects',
    description: 'Body: { title, steps? }. Create project and micro-tasks.',
  },
  { method: 'GET', path: '/api/projects/:id', description: 'Get project with micro_tasks' },
  {
    method: 'PATCH',
    path: '/api/tasks/:id/complete',
    description: 'Body: { completed? }. Toggle task completion.',
  },
];

export default function ApiPage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .health()
      .then((data) => setHealth(data))
      .catch(() => setHealth(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8" style={{ gap: 'var(--content-gap)' }}>
      <h1 className="text-2xl font-bold text-white">API & Bionic Reading</h1>

      {/* API Status */}
      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">API Status</h2>
        {loading ? (
          <p className="text-slate-400">Checking…</p>
        ) : health?.ok ? (
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full bg-emerald-500"
              aria-hidden
            />
            <span className="text-emerald-300">Connected — {health.service || 'nilo-api'}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-red-500" aria-hidden />
            <span className="text-red-300">Connection failed — API server not reachable</span>
          </div>
        )}
      </section>

      {/* Endpoints */}
      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">API Endpoints</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="pb-3 pr-4 font-medium text-slate-300">Method</th>
                <th className="pb-3 pr-4 font-medium text-slate-300">Path</th>
                <th className="pb-3 font-medium text-slate-300">Description</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((ep, i) => (
                <tr key={i} className="border-b border-slate-800">
                  <td className="py-2 pr-4">
                    <code
                      className={`rounded px-1.5 py-0.5 text-xs ${
                        ep.method === 'GET'
                          ? 'bg-emerald-900/50 text-emerald-300'
                          : ep.method === 'POST'
                            ? 'bg-amber-900/50 text-amber-300'
                            : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {ep.method}
                    </code>
                  </td>
                  <td className="py-2 pr-4 font-mono text-slate-200">{ep.path}</td>
                  <td className="py-2 text-slate-400">{ep.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bionic Reading */}
      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <h2 className="mb-2 text-lg font-semibold text-white">Bionic Reading</h2>
        <p className="mb-4 text-slate-400">
          Paste long text and convert it to Bionic Reading format — the first part of each word is
          bolded to aid focus and reading speed. Works with the <code className="text-amber-400">/api/simplify</code> endpoint.
        </p>
        <Link
          to="/simplify"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-900 hover:bg-amber-400"
        >
          Open Bionic Reading
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
