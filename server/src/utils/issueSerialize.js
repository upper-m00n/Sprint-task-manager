import { ProjectIssueType } from '../models/ProjectIssueType.js';
import { ProjectIssueStatus } from '../models/ProjectIssueStatus.js';
import { ProjectIssuePriority } from '../models/ProjectIssuePriority.js';
import { User } from '../models/User.js';

function toDateOnly(d) {
  if (!d) return null;
  const x = d instanceof Date ? d : new Date(d);
  return x.toISOString().slice(0, 10);
}

export async function buildRefMapsForIssues(issues) {
  const typeIds = [...new Set(issues.map((i) => i.issue_type_id))];
  const statusIds = [...new Set(issues.map((i) => i.status_id))];
  const priorityIds = [...new Set(issues.map((i) => i.priority_id))];
  const userIds = new Set();
  for (const i of issues) {
    if (i.assignee_id) userIds.add(i.assignee_id);
    userIds.add(i.reporter_id);
  }

  const [types, statuses, priorities, users] = await Promise.all([
    ProjectIssueType.find({ _id: { $in: typeIds } }).lean(),
    ProjectIssueStatus.find({ _id: { $in: statusIds } }).lean(),
    ProjectIssuePriority.find({ _id: { $in: priorityIds } }).lean(),
    User.find({ _id: { $in: [...userIds] } }).lean(),
  ]);

  return {
    types: new Map(types.map((t) => [t._id, t])),
    statuses: new Map(statuses.map((s) => [s._id, s])),
    priorities: new Map(priorities.map((p) => [p._id, p])),
    users: new Map(users.map((u) => [u._id, u])),
  };
}

export function buildIssueOut(issue, maps) {
  const t = maps.types.get(issue.issue_type_id);
  const st = maps.statuses.get(issue.status_id);
  const pr = maps.priorities.get(issue.priority_id);
  const assignee = issue.assignee_id ? maps.users.get(issue.assignee_id) : null;
  const reporter = maps.users.get(issue.reporter_id);

  if (!t || !st || !pr || !reporter) {
    throw new Error('Missing related data for issue');
  }

  return {
    id: issue._id,
    project_id: issue.project_id,
    issue_number: issue.issue_number,
    title: issue.title,
    description: issue.description ?? null,
    issue_type: {
      id: t._id,
      name: t.name,
      icon: t.icon ?? null,
      color: t.color ?? null,
    },
    priority: {
      id: pr._id,
      name: pr.name,
      level: pr.level,
      color: pr.color ?? null,
    },
    status: {
      id: st._id,
      name: st.name,
      color: st.color ?? null,
    },
    assignee: assignee
      ? { id: assignee._id, name: assignee.name, email: assignee.email }
      : null,
    reporter: { id: reporter._id, name: reporter.name, email: reporter.email },
    start_date: toDateOnly(issue.start_date),
    due_date: toDateOnly(issue.due_date),
    extra_data: issue.extra_data ?? {},
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
}

export async function issuesToOutList(issues) {
  if (!issues.length) return [];
  const maps = await buildRefMapsForIssues(issues);
  return issues.map((i) => buildIssueOut(i, maps));
}
