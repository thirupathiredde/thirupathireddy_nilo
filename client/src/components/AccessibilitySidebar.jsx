import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const FONTS = [
  { id: 'default', label: 'Default (Source Sans)' },
  { id: 'dyslexic', label: 'Open Dyslexic' },
  { id: 'mono', label: 'Monospace (JetBrains Mono)' },
];

const DENSITIES = [
  { id: 'dense', label: 'Dense', desc: 'Tighter spacing' },
  { id: 'comfortable', label: 'Comfortable', desc: 'Default' },
  { id: 'relaxed', label: 'Relaxed', desc: 'More spacing' },
];

export default function AccessibilitySidebar() {
  const { font, density, setFont, setDensity, sidebarOpen, setSidebarOpen } = useAccessibility();

  if (!sidebarOpen) return null;

  return (
    <aside
      className="fixed top-0 right-0 z-50 h-full w-72 bg-slate-900 text-slate-100 shadow-xl"
      style={{ gap: 'var(--content-gap)' }}
      role="dialog"
      aria-label="Accessibility settings"
    >
      <div className="flex items-center justify-between border-b border-slate-700 p-4">
        <h2 className="text-lg font-semibold">Accessibility</h2>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="rounded p-2 hover:bg-slate-700 focus:outline focus:ring-2 focus:ring-amber-400"
          aria-label="Close sidebar"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-6 p-4">
        <section>
          <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-400">Font</h3>
          <div className="flex flex-col gap-1">
            {FONTS.map((f) => (
              <label key={f.id} className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-slate-800">
                <input
                  type="radio"
                  name="font"
                  value={f.id}
                  checked={font === f.id}
                  onChange={() => setFont(f.id)}
                  className="h-4 w-4 accent-amber-500"
                />
                <span>{f.label}</span>
              </label>
            ))}
          </div>
        </section>
        <section>
          <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-400">Layout density</h3>
          <div className="flex flex-col gap-1">
            {DENSITIES.map((d) => (
              <label key={d.id} className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-slate-800">
                <input
                  type="radio"
                  name="density"
                  value={d.id}
                  checked={density === d.id}
                  onChange={() => setDensity(d.id)}
                  className="h-4 w-4 accent-amber-500"
                />
                <span>{d.label}</span>
                <span className="text-slate-500 text-sm">— {d.desc}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
