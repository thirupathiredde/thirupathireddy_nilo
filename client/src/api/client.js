const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch (err) {
    const msg =
      err?.message === 'Failed to fetch' || err?.name === 'TypeError'
        ? 'Connection failed. Make sure the API server is running (npm run dev from project root).'
        : err?.message || 'Request failed';
    throw new Error(msg);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error?.message || res.statusText || 'Request failed');
    err.status = res.status;
    err.code = data?.error?.code;
    err.details = data?.error?.details;
    throw err;
  }
  return data;
}

export const api = {
  health: () => request('/api/health'),

  simplify: (text, summarizeFirst = false) =>
    request('/api/simplify', {
      method: 'POST',
      body: JSON.stringify({ text, summarizeFirst }),
    }),

  generateSubtasks: (projectTitle) =>
    request('/api/subtasks', {
      method: 'POST',
      body: JSON.stringify({ projectTitle }),
    }),

  listProjects: () => request('/api/projects'),
  getProject: (id) => request(`/api/projects/${id}`),
  createProject: (title, steps) =>
    request('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ title, steps }),
    }),
  toggleTaskComplete: (taskId, completed) =>
    request(`/api/tasks/${taskId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    }),
};
