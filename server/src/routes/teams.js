import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { resolveTeamRole, requireTeamManager } from '../middleware/teamAccess.js';
import {
  createTeam,
  listTeams,
  getTeam,
  addMember,
  removeMember,
  updateMemberRole,
  assignTeamToProject,
} from '../controllers/teamController.js';

const router = Router();

// ─── Team CRUD ────────────────────────────────────────────────────────────────
router.post('/', authenticate, createTeam);
router.get('/', authenticate, listTeams);
router.get('/:id', authenticate, resolveTeamRole, getTeam);

// ─── Member management (manager/admin only) ───────────────────────────────────
router.post('/:id/members', authenticate, resolveTeamRole, requireTeamManager, addMember);
router.delete('/:id/members/:userId', authenticate, resolveTeamRole, requireTeamManager, removeMember);
router.patch('/:id/role', authenticate, resolveTeamRole, requireTeamManager, updateMemberRole);

export default router;
