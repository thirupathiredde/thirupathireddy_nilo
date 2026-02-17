import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import AccessibilitySidebar from './components/AccessibilitySidebar';
import { useAccessibility } from './context/AccessibilityContext';
import Dashboard from './pages/Dashboard';
import TaskBreakdown from './pages/TaskBreakdown';
import Simplify from './pages/Simplify';
import ApiPage from './pages/ApiPage';

export default function App() {
  const { toggleSidebar } = useAccessibility();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <NavLink to="/" className="text-xl font-bold tracking-tight text-amber-400">
            NILO
          </NavLink>
          <nav className="flex items-center gap-1" style={{ gap: 'var(--content-gap)' }}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-700 text-amber-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/breakdown"
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-700 text-amber-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
              }
            >
              Task Breakdown
            </NavLink>
            <NavLink
              to="/api"
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-700 text-amber-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
              }
            >
              API & Bionic
            </NavLink>
            <NavLink
              to="/simplify"
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-700 text-amber-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
              }
            >
              Bionic Reading
            </NavLink>
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded p-2 text-slate-400 hover:bg-slate-800 hover:text-amber-400 focus:outline focus:ring-2 focus:ring-amber-400"
              aria-label="Toggle accessibility settings"
              title="Accessibility"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6" style={{ paddingBlock: 'var(--content-gap)' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/breakdown" element={<TaskBreakdown />} />
          <Route path="/api" element={<ApiPage />} />
          <Route path="/simplify" element={<Simplify />} />
        </Routes>
      </main>

      <AccessibilitySidebar />
    </div>
  );
}
