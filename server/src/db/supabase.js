import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

let client = null;

export function getSupabase() {
  if (!client) {
    const { url, anonKey } = config.supabase;
    if (!url || !anonKey) {
      throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }
    client = createClient(url, anonKey);
  }
  return client;
}

export const TABLES = {
  MICRO_TASKS: 'micro_tasks',
  TASK_PROJECTS: 'task_projects',
};
