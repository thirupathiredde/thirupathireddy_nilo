import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config, validateConfig } from './config.js';
import { errorHandler } from './errors.js';
import * as simplifyRoute from './routes/simplify.js';
import * as subtasksRoute from './routes/subtasks.js';
import * as tasksRoute from './routes/tasks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, '../../client/dist')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'nilo-api' });
});

app.post('/api/simplify', simplifyRoute.simplify);
app.post('/api/subtasks', subtasksRoute.generate);

app.get('/api/projects', tasksRoute.listProjects);
app.post('/api/projects', tasksRoute.createProject);
app.get('/api/projects/:id', tasksRoute.getProject);
app.patch('/api/tasks/:id/complete', tasksRoute.toggleTaskComplete);

// Catch-all route to serve index.html for client-side routing
// This must be placed after API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.use(errorHandler);

const errors = validateConfig();
if (errors.length && config.nodeEnv === 'development') {
  console.warn('Config warnings:', errors.join('; '));
}

const port = config.port;
app.listen(port, () => {
  console.log(`NILO API running at http://localhost:${port}`);
});
