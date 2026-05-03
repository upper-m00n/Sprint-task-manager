import { Router } from 'express';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { Project } from '../models/Project.js';
import { ProjectMember } from '../models/ProjectMember.js';
import { ProjectIssueType } from '../models/ProjectIssueType.js';
import { ProjectIssueStatus } from '../models/ProjectIssueStatus.js';
import { ProjectIssuePriority } from '../models/ProjectIssuePriority.js';
import { Issue } from '../models/Issue.js';
import { User } from '../models/User.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { verifyPassword } from '../utils/password.js';
import { createAccessToken } from '../utils/jwt.js';
import { getRoleNamesForUser } from '../utils/roles.js';

const router = Router();
const upload = multer();

router.get('/projects', authenticate, requireAdmin, async (_req, res) => {
  try {
    const projects = await Project.find().sort({ created_at: -1 }).lean();
    if (!projects.length) return res.json([]);

    const pids = projects.map((p) => p._id);

    const memberRows = await ProjectMember.find({ project_id: { $in: pids } })
      .sort({ joined_at: 1 })
      .lean();
    const memberUserIds = [...new Set(memberRows.map((m) => m.user_id))];
    const memberUsers = await User.find({ _id: { $in: memberUserIds } }).lean();
    const userById = new Map(memberUsers.map((u) => [u._id, u]));

    const membersByProject = new Map();
    for (const m of memberRows) {
      const u = userById.get(m.user_id);
      const list = membersByProject.get(m.project_id) || [];
      list.push({
        user_id: m.user_id,
        name: u?.name ?? '',
        email: u?.email ?? '',
        role: m.role,
        joined_at: m.joined_at,
      });
      membersByProject.set(m.project_id, list);
    }

    const memberCountBy = new Map();
    for (const m of memberRows) {
      memberCountBy.set(m.project_id, (memberCountBy.get(m.project_id) || 0) + 1);
    }

    const issueAgg = await Issue.aggregate([
      { $match: { project_id: { $in: pids } } },
      { $group: { _id: '$project_id', count: { $sum: 1 } } },
    ]);
    const issueCountBy = new Map(issueAgg.map((x) => [x._id, x.count]));

    const statusAgg = await Issue.aggregate([
      { $match: { project_id: { $in: pids } } },
      { $group: { _id: { project_id: '$project_id', status_id: '$status_id' }, count: { $sum: 1 } } },
    ]);
    const statusIds = [...new Set(statusAgg.map((s) => s._id.status_id))];
    const statusDocs = await ProjectIssueStatus.find({ _id: { $in: statusIds } }).lean();
    const statusName = new Map(statusDocs.map((s) => [s._id, s.name]));
    const statusByProject = new Map();
    for (const row of statusAgg) {
      const pid = row._id.project_id;
      const name = statusName.get(row._id.status_id) || row._id.status_id;
      const cur = statusByProject.get(pid) || {};
      cur[name] = row.count;
      statusByProject.set(pid, cur);
    }

    const priorityAgg = await Issue.aggregate([
      { $match: { project_id: { $in: pids } } },
      { $group: { _id: { project_id: '$project_id', priority_id: '$priority_id' }, count: { $sum: 1 } } },
    ]);
    const priorityIds = [...new Set(priorityAgg.map((s) => s._id.priority_id))];
    const priorityDocs = await ProjectIssuePriority.find({ _id: { $in: priorityIds } }).lean();
    const priorityName = new Map(priorityDocs.map((s) => [s._id, s.name]));
    const priorityByProject = new Map();
    for (const row of priorityAgg) {
      const pid = row._id.project_id;
      const name = priorityName.get(row._id.priority_id) || row._id.priority_id;
      const cur = priorityByProject.get(pid) || {};
      cur[name] = row.count;
      priorityByProject.set(pid, cur);
    }

    const result = projects.map((p) => {
      const total = issueCountBy.get(p._id) || 0;
      return {
        id: p._id,
        name: p.name,
        key: p.key,
        description: p.description ?? null,
        status: p.status,
        created_at: p.created_at,
        updated_at: p.updated_at,
        created_by: p.created_by,
        member_count: memberCountBy.get(p._id) || 0,
        total_issues: total,
        members: membersByProject.get(p._id) || [],
        stats: {
          total_issues: total,
          issues_by_status: statusByProject.get(p._id) || {},
          issues_by_priority: priorityByProject.get(p._id) || {},
        },
      };
    });

    return res.json(result);
  } catch (e) {
    return res.status(500).json({ detail: String(e.message) });
  }
});

router.post('/projects', authenticate, requireAdmin, async (req, res) => {
  try {
    const body = req.body;
    const hasManager = body.members?.some((m) => m.role === 'manager');
    if (!hasManager) {
      return res.status(400).json({
        detail: 'At least one Project Manager must be assigned',
      });
    }

    const keyUpper = String(body.key).toUpperCase();
    const existing = await Project.findOne({ key: keyUpper }).lean();
    if (existing) {
      return res.status(400).json({ detail: `Project with key '${body.key}' already exists` });
    }

    const creatorId = req.user._id;
    const projectId = randomUUID();

    const types = (body.issue_types || []).map((it, idx) => ({
      _id: randomUUID(),
      project_id: projectId,
      name: it.name,
      icon: it.icon ?? null,
      color: it.color ?? null,
      description: it.description ?? null,
      display_order: idx,
      is_active: true,
    }));

    const statuses = (body.issue_statuses || []).map((s, idx) => ({
      _id: randomUUID(),
      project_id: projectId,
      name: s.name,
      category: s.category || 'todo',
      color: s.color ?? null,
      description: s.description ?? null,
      display_order: idx,
      is_active: true,
    }));

    const priorities = (body.issue_priorities || []).map((p, idx) => ({
      _id: randomUUID(),
      project_id: projectId,
      name: p.name,
      level: p.level != null ? p.level : 1,
      color: p.color ?? null,
      description: p.description ?? null,
      display_order: idx,
      is_active: true,
    }));

    await Project.create({
      _id: projectId,
      name: body.name,
      key: keyUpper,
      description: body.description ?? null,
      created_by: creatorId,
      status: 'active',
    });

    if (types.length) await ProjectIssueType.insertMany(types);
    if (statuses.length) await ProjectIssueStatus.insertMany(statuses);
    if (priorities.length) await ProjectIssuePriority.insertMany(priorities);

    const added = new Set([String(creatorId)]);
    await ProjectMember.create({
      project_id: projectId,
      user_id: String(creatorId),
      role: 'manager',
    });

    for (const m of body.members || []) {
      const uid = String(m.user_id);
      if (!added.has(uid)) {
        await ProjectMember.create({
          project_id: projectId,
          user_id: uid,
          role: m.role,
        });
        added.add(uid);
      }
    }

    const newProject = await Project.findById(projectId).lean();
    return res.status(201).json({
      id: newProject._id,
      name: newProject.name,
      key: newProject.key,
      description: newProject.description ?? null,
      status: newProject.status,
      created_by: newProject.created_by,
      created_at: newProject.created_at,
      updated_at: newProject.updated_at,
    });
  } catch (e) {
    return res.status(500).json({ detail: String(e.message) });
  }
});

router.post('/login', upload.none(), async (req, res) => {
  try {
    const email = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({ email }).lean();
    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ detail: 'Incorrect email or password' });
    }
    const roleNames = await getRoleNamesForUser(user._id);
    if (!roleNames.includes('admin')) {
      return res.status(403).json({ detail: 'User does not have admin privileges' });
    }
    const token = createAccessToken(user._id);
    return res.json({ access_token: token, token_type: 'bearer' });
  } catch (e) {
    return res.status(500).json({ detail: String(e.message) });
  }
});

export default router;
