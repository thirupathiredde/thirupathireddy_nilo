# NILO Setup Guide

Follow these steps to get your app running correctly.

## 1. Create database tables in Supabase

Your app needs two tables. Run this in Supabase:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → select your project
2. Open **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy and paste the entire contents of `server/src/db/schema.sql`
5. Click **Run**

You should see "Success. No rows returned."

## 2. Verify your Supabase API key

In Supabase Dashboard → **Settings** → **API**:

- **Project URL** should match `VITE_SUPABASE_URL` in `server/.env`
- **anon public** key should match `VITE_SUPABASE_ANON_KEY`

The anon key is usually a long JWT starting with `eyJ...`. If your key looks different and you get auth errors, copy the anon public key from the API settings.

## 3. (Optional) Add OpenAI key for AI features

For **Bionic Reading** and **AI Task Breakdown**:

1. Get an API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. Add to `server/.env`:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

Without this, those features will show errors when used.

## 4. Start the app

**Important:** Run from the **project root** (not from `server/` or `client/`).

```bash
cd /Users/thirupathireddyguthikonda/student_project
npm run dev
```

- **App:** http://localhost:5173 (or 5174 if 5173 is in use)
- **API:** http://localhost:3001

You must see **both** in the terminal:
- `NILO API running at http://localhost:3001`
- `Local: http://localhost:5173/`

If the API is not working (connection failed, refused to connect):
1. Stop any running servers (`Ctrl+C`)
2. Run `npm run dev:fresh` — this clears ports and starts fresh
3. Or manually: `lsof -ti:3001 | xargs kill -9` then `npm run dev`

**Do not** run `npm run dev` from inside the `server/` folder — that starts only the API, not the app.
