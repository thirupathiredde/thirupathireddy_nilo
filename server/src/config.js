import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  supabase: {
    url: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
};

export function validateConfig() {
  const errors = [];
  if (!config.supabase.url || !config.supabase.anonKey) {
    errors.push('Missing Supabase URL or anon key (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)');
  }
  if (!config.openai.apiKey) {
    errors.push('Missing OPENAI_API_KEY for AI features');
  }
  return errors;
}
