import { Team } from '../models/Team.js';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { ProjectMember } from '../models/ProjectMember.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTeam(team, users = []) {
  const userMap = new Map(users.map((u) => [u._id, u]));
  return {
    id: team._id,
    name: team.name,
    description: team.description,
    created_by: team.created_by,
    created_at: team.created_at,
    updated_at: team.updated_at,
    project_count: team.project_ids?.length ?? 0,
    members: (team.members || []).map((m) => {
      const u = userMap.get(m.user_id);
      return {
        user_id: m.user_id,
        name: u?.name ?? '',
        email: u?.email ?? '',
        role: m.role,
        joined_at: m.joined_at,
      };
    }),
  };
}

// ─── Controllers ──────────────────────────────────────────────────────────────

/** POST /teams */
export async function createTeam(req, res) {
  try {
    const { name, description } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ detail: 'Team name is required' });
    }

    const team = await Team.create({
      name: name.trim(),
      description: description?.trim() ?? null,
      created_by: req.user._id,
      members: [{ user_id: req.user._id, role: 'manager' }],
      project_ids: [],
    });

    const creator = await User.findById(req.user._id).lean();
    return res.status(201).json(formatTeam(team.toObject(), [creator]));
  } catch (e) {
    return res.status(500).json({ detail: e.message });
  }
}

/** GET /teams */
export async function listTeams(req, res) {
  try {
    const isAdmin = req.roleNames?.includes('admin');

    const filter = isAdmin ? {} : { 'members.user_id': req.user._id };
    const teams = await Team.find(filter).sort({ created_at: -1 }).lean();

    if (!teams.length) return res.json([]);

    const allUserIds = [...new Set(teams.flatMap((t) => t.members.map((m) => m.user_id)))];
    const users = await User.find({ _id: { $in: allUserIds } }).lean();

    return res.json(teams.map((t) => formatTeam(t, users)));
  } catch (e) {
    return res.status(500).json({ detail: e.message });
  }
}

/** GET /teams/:id */
export async function getTeam(req, res) {
  try {
    const team = await Team.findById(req.params.id).lean();
    if (!team) return res.status(404).json({ detail: 'Team not found' });

    const isAdmin = req.roleNames?.includes('admin');
    const isMember = team.members.some((m) => m.user_id === req.user._id);
    if (!isAdmin && !isMember) {
      return res.status(403).json({ detail: 'You do not have access to this team' });
    }

    const userIds = team.members.map((m) => m.user_id);
    const users = await User.find({ _id: { $in: userIds } }).lean();

    // Attach project details
    const projects = await Project.find({ _id: { $in: team.project_ids } }).lean();

    return res.json({
      ...formatTeam(team, users),
      projects: projects.map((p) => ({ id: p._id, name: p.name, key: p.key, status: p.status })),
    });
  } catch (e) {
    return res.status(500).json({ detail: e.message });
  }
}

/** POST /teams/:id/members */
export async function addMember(req, res) {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ detail: 'Team not found' });

    const { user_id, role = 'member' } = req.body;
    if (!user_id) return res.status(400).json({ detail: 'user_id is required' });

    const targetUser = await User.findById(user_id).lean();
    if (!targetUser) return res.status(404).json({ detail: 'User not found' });

    const alreadyMember = team.members.some((m) => m.user_id === String(user_id));
    if (alreadyMember) return res.status(409).json({ detail: 'User is already a member of this team' });

    team.members.push({ user_id: String(user_id), role });
    await team.save();

    return res.status(201).json({
      user_id: targetUser._id,
      name: targetUser.name,
      email: targetUser.email,
      role,
    });
  } catch (e) {
    return res.status(500).json({ detail: e.message });
  }
}

/** DELETE /teams/:id/members/:userId */
export async function removeMember(req, res) {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ detail: 'Team not found' });

    const targetUserId = req.params.userId;
    const memberIndex = team.members.findIndex((m) => m.user_id === targetUserId);
    if (memberIndex === -1) return res.status(404).json({ detail: 'User is not a member of this team' });

    // Prevent removing the last manager
    const isManager = team.members[memberIndex].role === 'manager';
    if (isManager) {
      const managerCount = team.members.filter((m) => m.role === 'manager').length;
      if (managerCount <= 1) {
        return res.status(400).json({ detail: 'Cannot remove the last manager from a team' });
      }
    }

    team.members.splice(memberIndex, 1);
    await team.save();
    return res.status(204).send();
  } catch (e) {
    return res.status(500).json({ detail: e.message });
  }
}

/** PATCH /teams/:id/role */
export async function updateMemberRole(req, res) {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ detail: 'Team not found' });

    const { user_id, role } = req.body;
    if (!user_id || !role) return res.status(400).json({ detail: 'user_id and role are required' });
    if (!['member', 'manager'].includes(role)) {
      return res.status(400).json({ detail: 'Role must be member or manager' });
    }

    const member = team.members.find((m) => m.user_id === String(user_id));
    if (!member) return res.status(404).json({ detail: 'User is not a member of this team' });

    // Prevent demoting the last manager
    if (member.role === 'manager' && role === 'member') {
      const managerCount = team.members.filter((m) => m.role === 'manager').length;
      if (managerCount <= 1) {
        return res.status(400).json({ detail: 'Cannot demote the last manager in a team' });
      }
    }

    member.role = role;
    await team.save();
    return res.json({ user_id, role });
  } catch (e) {
    return res.status(500).json({ detail: e.message });
  }
}

/** POST /projects/:projectId/assign-team */
export async function assignTeamToProject(req, res) {
  try {
    const { projectId } = req.params;
    const { team_id } = req.body;
    if (!team_id) return res.status(400).json({ detail: 'team_id is required' });

    const [project, team] = await Promise.all([
      Project.findById(projectId).lean(),
      Team.findById(team_id).lean(),
    ]);

    if (!project) return res.status(404).json({ detail: 'Project not found' });
    if (!team) return res.status(404).json({ detail: 'Team not found' });

    // Get existing project members to avoid duplicates
    const existing = await ProjectMember.find({ project_id: projectId }).lean();
    const existingIds = new Set(existing.map((m) => m.user_id));

    const toInsert = team.members
      .filter((m) => !existingIds.has(m.user_id))
      .map((m) => ({
        project_id: projectId,
        user_id: m.user_id,
        role: m.role === 'manager' ? 'manager' : 'member',
      }));

    if (toInsert.length) {
      await ProjectMember.insertMany(toInsert);
    }

    // Link the team to the project (if not already)
    await Team.updateOne(
      { _id: team_id, project_ids: { $ne: projectId } },
      { $addToSet: { project_ids: projectId } }
    );

    return res.json({
      message: `Added ${toInsert.length} new member(s) to project`,
      added: toInsert.length,
    });
  } catch (e) {
    return res.status(500).json({ detail: e.message });
  }
}
