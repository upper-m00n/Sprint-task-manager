import { Project } from '../models/Project.js';
import { ProjectMember } from '../models/ProjectMember.js';
import { Issue } from '../models/Issue.js';

/**
 * Checks if a user has access to a project.
 * Automatically allows global admins.
 */
export async function checkProjectAccess(projectId, user) {
  const isGlobalAdmin = user.roleNames?.includes('admin');
  
  const project = await Project.findById(projectId).lean();
  if (!project) {
    const err = new Error('Project not found');
    err.status = 404;
    throw err;
  }

  if (isGlobalAdmin) return { role: 'manager', isGlobalAdmin: true };

  const membership = await ProjectMember.findOne({
    project_id: projectId,
    user_id: user._id,
  }).lean();

  if (!membership) {
    const err = new Error('You do not have access to this project');
    err.status = 403;
    throw err;
  }

  return membership;
}

export async function checkProjectMember(projectId, userId) {
  const m = await ProjectMember.findOne({ project_id: projectId, user_id: userId }).lean();
  return Boolean(m);
}

export const MANAGER_ROLES = new Set(['manager']);

/**
 * Middleware to require project access
 */
export async function requireProjectAccess(req, res, next) {
  try {
    const projectId = req.params.projectId || req.body.project_id;
    const membership = await checkProjectAccess(projectId, req.user);
    req.projectMembership = membership;
    next();
  } catch (e) {
    return res.status(e.status || 500).json({ detail: e.message });
  }
}

/**
 * Middleware to require project manager role (or global admin)
 */
export async function requireProjectManager(req, res, next) {
  try {
    const projectId = req.params.projectId || req.body.project_id;
    const membership = await checkProjectAccess(projectId, req.user);
    
    const isGlobalAdmin = req.user.roleNames?.includes('admin');
    const isManager = membership.role === 'manager';

    if (!isGlobalAdmin && !isManager) {
      return res.status(403).json({ detail: 'Only project managers or admins can perform this action' });
    }

    req.projectMembership = membership;
    next();
  } catch (e) {
    return res.status(e.status || 500).json({ detail: e.message });
  }
}

/**
 * Middleware to require issue access (assignee, reporter, manager, or admin)
 */
export async function requireIssueAccess(req, res, next) {
  try {
    const { issueId } = req.params;
    const issue = await Issue.findById(issueId).lean();
    if (!issue) {
      return res.status(404).json({ detail: 'Issue not found' });
    }

    const membership = await checkProjectAccess(issue.project_id, req.user);
    
    const isGlobalAdmin = req.user.roleNames?.includes('admin');
    const isManager = membership.role === 'manager';
    const isAssignee = issue.assignee_id && String(issue.assignee_id) === String(req.user._id);
    const isReporter = issue.reporter_id && String(issue.reporter_id) === String(req.user._id);

    if (!isGlobalAdmin && !isManager && !isAssignee && !isReporter) {
      return res.status(403).json({ 
        detail: 'Insufficient permissions. Only the assignee, reporter, project managers, or admins can modify this issue.' 
      });
    }

    req.issue = issue;
    req.projectMembership = membership;
    next();
  } catch (e) {
    return res.status(e.status || 500).json({ detail: e.message });
  }
}
