import React from 'react';

/**
 * Visualizes progress on tiny tasks (micro-tasks) for the dashboard.
 */
export default function FocusMeter({ completed = 0, total = 0, label = 'Focus progress' }) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const segments = Math.min(total || 5, 10);
  const filled = total > 0 ? Math.round((completed / total) * segments) : 0;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4" style={{ gap: 'var(--content-gap)' }}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="text-lg font-bold text-amber-400">
          {completed}/{total}
          <span className="ml-1 text-sm font-normal text-slate-400">tasks</span>
        </span>
      </div>
      <div className="flex gap-1" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        {Array.from({ length: segments }, (_, i) => (
          <div
            key={i}
            className="h-3 flex-1 rounded-full transition-colors"
            style={{
              backgroundColor: i < filled ? 'rgb(251 191 36)' : 'rgb(51 65 85)',
            }}
          />
        ))}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-amber-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
