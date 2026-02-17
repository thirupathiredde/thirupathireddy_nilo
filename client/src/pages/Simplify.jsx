import React, { useState } from 'react';
import { api } from '../api/client';

function BionicText({ bionicWords }) {
  if (!Array.isArray(bionicWords) || bionicWords.length === 0) return null;
  return (
    <div className="space-y-1 text-slate-200" style={{ gap: 'var(--content-gap)' }}>
      {bionicWords.map((w, i) => (
        <span key={i} className="bionic-word">
          <span className="bionic-bold font-bold text-amber-200">{w.bold}</span>
          <span>{w.rest}</span>
          {' '}
        </span>
      ))}
    </div>
  );
}

export default function Simplify() {
  const [text, setText] = useState('');
  const [summarizeFirst, setSummarizeFirst] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    if (!text.trim()) {
      setError('Enter some text to simplify.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.simplify(text.trim(), summarizeFirst);
      setResult(data);
    } catch (e) {
      setError(e.message || 'Failed to simplify text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" style={{ gap: 'var(--content-gap)' }}>
      <h1 className="text-2xl font-bold text-white">Bionic Reading</h1>
      <p className="text-slate-400">
        Paste long text below. We can summarize it and convert it to Bionic Reading format (first part of each word bolded) to help with focus and reading speed.
      </p>

      <label className="block">
        <span className="mb-1 block text-sm text-slate-400">Text to simplify</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste an article, assignment, or long paragraph…"
          rows={8}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline focus:ring-1 focus:ring-amber-500"
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={summarizeFirst}
          onChange={(e) => setSummarizeFirst(e.target.checked)}
          className="h-4 w-4 rounded accent-amber-500"
        />
        <span className="text-slate-300">Summarize first (for long text) then apply Bionic Reading</span>
      </label>

      <button
        type="button"
        onClick={submit}
        disabled={loading || !text.trim()}
        className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-900 hover:bg-amber-400 disabled:opacity-50"
      >
        {loading ? 'Processing…' : 'Simplify & Bionic Read'}
      </button>

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-red-200">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
          <h2 className="mb-2 text-lg font-semibold text-white">Result</h2>
          {result.summarized && (
            <p className="mb-2 text-sm text-amber-400">Text was summarized first.</p>
          )}
          <div className="prose prose-invert max-w-none">
            <BionicText bionicWords={result.bionicWords} />
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Length: {result.originalLength} → {result.bionicLength} chars
          </p>
        </div>
      )}
    </div>
  );
}
