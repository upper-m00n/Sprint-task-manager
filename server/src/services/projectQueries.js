import { Project } from '../models/Project.js';
import { ProjectMember } from '../models/ProjectMember.js';
import { Issue } from '../models/Issue.js';
import { ProjectIssueStatus } from '../models/ProjectIssueStatus.js';
import { ProjectIssuePriority } from '../models/ProjectIssuePriority.js';
import { IssueActivityLog } from '../models/IssueActivityLog.js';
import { User } from '../models/User.js';

export async function getUserProjects(userId) {
  const memberships = await ProjectMember.find({ user_id: userId }).lean();
  const roleByProject = new Map(memberships.map((m) => [m.project_id, m.role]));
  const projectIds = [...roleByProject.keys()];
  if (!projectIds.length) return [];

  const projects = await Project.find({ _id: { $in: projectIds } })
    .sort({ created_at: -1 })
    .lean();

  return projects.map((p) => ({
    id: p._id,
    name: p.name,
    key: p.key,
    description: p.description ?? null,
    status: p.status,
    created_by: p.created_by,
    created_at: p.created_at,
    updated_at: p.updated_at,
    role: roleByProject.get(p._id),
  }));
}

export async function getProjectDetails(projectId, userId) {
  const membership = await ProjectMember.findOne({
    project_id: projectId,
    user_id: userId,
  }).lean();
  if (!membership) {
    const err = new Error('Project not found or access denied');
    err.status = 404;
    throw err;
  }

  const project = await Project.findById(projectId).lean();
  if (!project) {
    const err = new Error('Project not found');
    err.status = 404;
    throw err;
  }

  const creator = await User.findById(project.created_by).lean();
  const creatorName = creator?.name ?? 'Unknown';

  const totalIssues = await Issue.countDocuments({ project_id: projectId });

  const statusAgg = await Issue.aggregate([
    { $match: { project_id: projectId } },
    { $group: { _id: '$status_id', count: { $sum: 1 } } },
  ]);
  const statusIds = statusAgg.map((s) => s._id);
  const statusDocs = await ProjectIssueStatus.find({ _id: { $in: statusIds } }).lean();
  const statusName = new Map(statusDocs.map((s) => [s._id, s.name]));
  const issuesByStatus = {};
  for (const row of statusAgg) {
    issuesByStatus[statusName.get(row._id) || row._id] = row.count;
  }

  const priorityAgg = await Issue.aggregate([
    { $match: { project_id: projectId } },
    { $group: { _id: '$priority_id', count: { $sum: 1 } } },
  ]);
  const priorityIds = priorityAgg.map((s) => s._id);
  const priorityDocs = await ProjectIssuePriority.find({ _id: { $in: priorityIds } }).lean();
  const priorityName = new Map(priorityDocs.map((s) => [s._id, s.name]));
  const issuesByPriority = {};
  for (const row of priorityAgg) {
    issuesByPriority[priorityName.get(row._id) || row._id] = row.count;
  }

  const memberRows = await ProjectMember.find({ project_id: projectId })
    .sort({ joined_at: 1 })
    .lean();
  const memberUserIds = memberRows.map((m) => m.user_id);
  const memberUsers = await User.find({ _id: { $in: memberUserIds } }).lean();
  const userById = new Map(memberUsers.map((u) => [u._id, u]));

  const members = memberRows.map((m) => {
    const u = userById.get(m.user_id);
    return {
      user_id: m.user_id,
      name: u?.name ?? '',
      email: u?.email ?? '',
      role: m.role,
      joined_at: m.joined_at,
    };
  });

  const issueIdsInProject = await Issue.find({ project_id: projectId }).select('_id').lean();
  const iids = issueIdsInProject.map((i) => i._id);
  const logs = await IssueActivityLog.find({ issue_id: { $in: iids } })
    .sort({ created_at: -1 })
    .limit(20)
    .lean();
  const changerIds = [...new Set(logs.map((l) => l.changed_by))];
  const changers = await User.find({ _id: { $in: changerIds } }).lean();
  const changerName = new Map(changers.map((u) => [u._id, u.name]));

  const recentActivity = logs.map((log) => ({
    id: log._id,
    issue_id: log.issue_id,
    action: log.action,
    old_value: log.old_value ?? null,
    new_value: log.new_value ?? null,
    changed_by: log.changed_by,
    changed_by_name: changerName.get(log.changed_by) ?? '',
    created_at: log.created_at,
  }));

  return {
    id: project._id,
    name: project.name,
    key: project.key,
    description: project.description ?? null,
    status: project.status,
    created_by: project.created_by,
    creator_name: creatorName,
    created_at: project.created_at,
    updated_at: project.updated_at,
    stats: {
      total_issues: totalIssues,
      issues_by_status: issuesByStatus,
      issues_by_priority: issuesByPriority,
    },
    members,
    recent_activity: recentActivity,
    currentUserRole: membership.role,
  };
}
