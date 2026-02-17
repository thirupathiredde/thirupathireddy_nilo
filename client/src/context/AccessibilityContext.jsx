import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AccessibilityContext = createContext(null);

const STORAGE_KEY = 'nilo-accessibility';

const defaultState = {
  font: 'default', // 'default' | 'dyslexic' | 'mono'
  density: 'comfortable', // 'dense' | 'comfortable' | 'relaxed'
  sidebarOpen: false,
};

export function AccessibilityProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...defaultState, ...JSON.parse(saved) };
    } catch (_) {}
    return defaultState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }, [state]);

  const applyToDocument = useCallback(({ font, density }) => {
    const root = document.documentElement;
    const body = document.body;
    ['font-default', 'font-dyslexic', 'font-mono'].forEach((c) => { root.classList.remove(c); body.classList.remove(c); });
    root.classList.add(`font-${font}`);
    body.classList.add(`font-${font}`);
    ['density-dense', 'density-comfortable', 'density-relaxed'].forEach((c) => { root.classList.remove(c); body.classList.remove(c); });
    root.classList.add(`density-${density}`);
    body.classList.add(`density-${density}`);
    root.style.setProperty('--font-sans', font === 'dyslexic' ? '"Open Dyslexic", system-ui, sans-serif' : '"Source Sans 3", system-ui, sans-serif');
    root.style.setProperty('--font-mono', '"JetBrains Mono", ui-monospace, monospace');
  }, []);

  useEffect(() => {
    applyToDocument(state);
  }, [state.font, state.density, applyToDocument]);

  const setFont = useCallback((font) => {
    setState((s) => ({ ...s, font: font || 'default' }));
  }, []);

  const setDensity = useCallback((density) => {
    setState((s) => ({ ...s, density: density || 'comfortable' }));
  }, []);

  const setSidebarOpen = useCallback((open) => {
    setState((s) => ({ ...s, sidebarOpen: open }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setState((s) => ({ ...s, sidebarOpen: !s.sidebarOpen }));
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        ...state,
        setFont,
        setDensity,
        setSidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
