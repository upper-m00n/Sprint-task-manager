import { UserRole } from '../models/UserRole.js';
import { Role } from '../models/Role.js';
import { ProjectMember } from '../models/ProjectMember.js';

export async function getRoleNamesForUser(userId) {
  const urs = await UserRole.find({ user_id: userId }).lean();
  if (!urs.length) return [];
  const ids = urs.map((u) => u.role_id);
  const roles = await Role.find({ _id: { $in: ids } }).lean();
  return roles.map((r) => r.name);
}

export async function userIsAdmin(userId) {
  const names = await getRoleNamesForUser(userId);
  return names.includes('admin');
}

export async function getProjectRole(userId, projectId) {
  const membership = await ProjectMember.findOne({
    project_id: projectId,
    user_id: userId,
  }).lean();
  return membership?.role ?? null;
}
