import { Router } from 'express';
import { ProjectIssueType } from '../models/ProjectIssueType.js';
import { ProjectIssueStatus } from '../models/ProjectIssueStatus.js';
import { ProjectIssuePriority } from '../models/ProjectIssuePriority.js';
import { ProjectMember } from '../models/ProjectMember.js';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { checkProjectAccess } from '../utils/permissions.js';

const router = Router();

function mapType(t) {
  return {
    id: t._id,
    project_id: t.project_id,
    name: t.name,
    description: t.description ?? null,
    icon: t.icon ?? null,
    color: t.color ?? null,
    is_active: t.is_active,
    display_order: t.display_order,
    created_at: t.created_at,
    updated_at: t.updated_at,
  };
}

function mapStatus(s) {
  return {
    id: s._id,
    project_id: s.project_id,
    name: s.name,
    description: s.description ?? null,
    category: s.category,
    color: s.color ?? null,
    is_active: s.is_active,
    display_order: s.display_order,
    created_at: s.created_at,
    updated_at: s.updated_at,
  };
}

function mapPriority(p) {
  return {
    id: p._id,
    project_id: p.project_id,
    name: p.name,
    description: p.description ?? null,
    level: p.level,
    color: p.color ?? null,
    is_active: p.is_active,
    display_order: p.display_order,
    created_at: p.created_at,
    updated_at: p.updated_at,
  };
}

router.get('/:projectId/issue-types', authenticate, async (req, res) => {
  try {
    await checkProjectAccess(req.params.projectId, req.user);
    const rows = await ProjectIssueType.find({
      project_id: req.params.projectId,
      is_active: true,
    })
      .sort({ display_order: 1, name: 1 })
      .lean();
    return res.json(rows.map(mapType));
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

router.get('/:projectId/statuses', authenticate, async (req, res) => {
  try {
    await checkProjectAccess(req.params.projectId, req.user);
    const rows = await ProjectIssueStatus.find({
      project_id: req.params.projectId,
      is_active: true,
    })
      .sort({ display_order: 1, name: 1 })
      .lean();
    return res.json(rows.map(mapStatus));
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

router.get('/:projectId/priorities', authenticate, async (req, res) => {
  try {
    await checkProjectAccess(req.params.projectId, req.user);
    const rows = await ProjectIssuePriority.find({
      project_id: req.params.projectId,
      is_active: true,
    })
      .sort({ level: 1, display_order: 1 })
      .lean();
    return res.json(rows.map(mapPriority));
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

router.get('/:projectId/assignable-users', authenticate, async (req, res) => {
  try {
    await checkProjectAccess(req.params.projectId, req.user);
    const members = await ProjectMember.find({ project_id: req.params.projectId }).lean();
    const userIds = members.map((m) => m.user_id);
    const users = await User.find({ _id: { $in: userIds } }).lean();
    return res.json(
      users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
      }))
    );
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

export default router;
