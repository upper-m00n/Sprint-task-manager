import { Router } from 'express';
import { ProjectMember } from '../models/ProjectMember.js';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { checkProjectAccess, requireProjectManager } from '../utils/permissions.js';
import { getRoleNamesForUser } from '../utils/roles.js';

const router = Router();

router.get('/projects/:projectId/members', authenticate, async (req, res) => {
  try {
    await checkProjectAccess(req.params.projectId, req.user);
    const rows = await ProjectMember.find({ project_id: req.params.projectId })
      .sort({ joined_at: 1 })
      .lean();
    const userIds = rows.map((r) => r.user_id);
    const users = await User.find({ _id: { $in: userIds } }).lean();
    const umap = new Map(users.map((u) => [u._id, u]));
    return res.json(
      rows.map((m) => ({
        user_id: m.user_id,
        name: umap.get(m.user_id)?.name ?? '',
        email: umap.get(m.user_id)?.email ?? '',
        role: m.role,
        joined_at: m.joined_at,
      }))
    );
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

router.post('/projects/:projectId/members', authenticate, requireProjectManager, async (req, res) => {
  try {

    const { user_id, role } = req.body;
    const user = await User.findById(user_id).lean();
    if (!user) {
      return res.status(404).json({ detail: 'User not found' });
    }

    const existing = await ProjectMember.findOne({
      project_id: req.params.projectId,
      user_id: String(user_id),
    }).lean();
    if (existing) {
      return res.status(409).json({ detail: 'User is already a member of this project' });
    }

    const doc = await ProjectMember.create({
      project_id: req.params.projectId,
      user_id: String(user_id),
      role,
    });

    return res.status(201).json({
      user_id: doc.user_id,
      name: user.name,
      email: user.email,
      role: doc.role,
      joined_at: doc.joined_at,
    });
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

router.delete('/projects/:projectId/members/:userId', authenticate, requireProjectManager, async (req, res) => {
  try {

    const member = await ProjectMember.findOne({
      project_id: req.params.projectId,
      user_id: req.params.userId,
    }).lean();

    if (!member) {
      return res.status(404).json({ detail: 'User is not a member of this project' });
    }

    if (member.role === 'manager') {
      const managerCount = await ProjectMember.countDocuments({
        project_id: req.params.projectId,
        role: 'manager',
      });
      if (managerCount <= 1) {
        return res.status(400).json({ detail: 'Cannot remove the last manager from a project' });
      }
    }

    await ProjectMember.deleteOne({
      project_id: req.params.projectId,
      user_id: req.params.userId,
    });
    return res.status(204).send();
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

router.patch('/projects/:projectId/members/:userId', authenticate, requireProjectManager, async (req, res) => {
  try {

    const newRole = req.body.role;
    const member = await ProjectMember.findOne({
      project_id: req.params.projectId,
      user_id: req.params.userId,
    }).lean();

    if (!member) {
      return res.status(404).json({ detail: 'User is not a member of this project' });
    }

    if (member.role === 'manager' && newRole !== 'manager') {
      const managerCount = await ProjectMember.countDocuments({
        project_id: req.params.projectId,
        role: 'manager',
      });
      if (managerCount <= 1) {
        return res.status(400).json({ detail: 'Cannot demote the last manager in a project' });
      }
    }

    await ProjectMember.updateOne(
      { project_id: req.params.projectId, user_id: req.params.userId },
      { role: newRole }
    );

    const user = await User.findById(req.params.userId).lean();
    const updated = await ProjectMember.findOne({
      project_id: req.params.projectId,
      user_id: req.params.userId,
    }).lean();

    return res.json({
      user_id: updated.user_id,
      name: user?.name ?? '',
      email: user?.email ?? '',
      role: updated.role,
      joined_at: updated.joined_at,
    });
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

export default router;
