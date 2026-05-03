import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { connectDb } from './db.js';
import { Role } from './models/Role.js';

import authRoutes from './routes/auth.js';
import projectsRoutes from './routes/projects.js';
import projectConfigRoutes from './routes/projectConfig.js';
import issuesRoutes from './routes/issues.js';
import forYouRoutes from './routes/forYou.js';
import adminRoutes from './routes/admin.js';
import usersRoutes from './routes/users.js';
import commentsRoutes from './routes/comments.js';
import membersRoutes from './routes/members.js';
import activityRoutes from './routes/activity.js';
import teamsRoutes from './routes/teams.js';
import { authenticate } from './middleware/auth.js';
import { requireProjectManager } from './utils/permissions.js';
import { assignTeamToProject } from './controllers/teamController.js';

async function ensureRoles() {
  await Role.findOneAndUpdate(
    { _id: 1 },
    { $setOnInsert: { _id: 1, name: 'admin' } },
    { upsert: true }
  );
  await Role.findOneAndUpdate(
    { _id: 2 },
    { $setOnInsert: { _id: 2, name: 'user' } },
    { upsert: true }
  );
}

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const v1 = config.apiV1;

app.get('/', (_req, res) => {
  res.json({ message: `Welcome to ${config.projectName} API` });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy' });
});

app.use(`${v1}/auth`, authRoutes);
app.use(`${v1}/projects`, projectsRoutes);
app.use(`${v1}/project-config`, projectConfigRoutes);
app.use(`${v1}/issues`, issuesRoutes);
app.use(`${v1}/for-you`, forYouRoutes);
app.use(`${v1}/admin`, adminRoutes);
app.use(`${v1}/users`, usersRoutes);
app.use(`${v1}`, commentsRoutes);
app.use(`${v1}`, membersRoutes);
app.use(`${v1}`, activityRoutes);
app.use(`${v1}/teams`, teamsRoutes);
app.post(`${v1}/projects/:projectId/assign-team`, authenticate, requireProjectManager, assignTeamToProject);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ detail: err.message || 'Internal server error' });
});

try {
  await connectDb();
  await ensureRoles();
} catch (err) {
  console.error('Failed to start API (MongoDB):', err.message);
  console.error('Check MONGODB_URI and that mongod is running, then try again.');
  process.exit(1);
}

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}${v1}`);
});
