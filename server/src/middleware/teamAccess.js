import { Team } from '../models/Team.js';

/**
 * Resolves the calling user's role within a team.
 * Attaches `req.teamMembership` (the member entry) to the request.
 */
export async function resolveTeamRole(req, res, next) {
  try {
    const team = await Team.findById(req.params.id).lean();
    if (!team) return res.status(404).json({ detail: 'Team not found' });

    const membership = team.members.find((m) => m.user_id === req.user._id);
    req.team = team;
    req.teamMembership = membership ?? null;
    next();
  } catch (e) {
    return res.status(500).json({ detail: e.message });
  }
}

/**
 * Allows only team managers or global admins to proceed.
 */
export async function requireTeamManager(req, res, next) {
  const isAdmin = req.roleNames?.includes('admin');
  const isManager = req.teamMembership?.role === 'manager';

  if (!isAdmin && !isManager) {
    return res.status(403).json({
      detail: 'Only team managers or admins can perform this action',
    });
  }

  next();
}
