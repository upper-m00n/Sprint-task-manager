import { Router } from 'express';
import { Issue } from '../models/Issue.js';
import { ProjectIssueType } from '../models/ProjectIssueType.js';
import { ProjectIssueStatus } from '../models/ProjectIssueStatus.js';
import { ProjectIssuePriority } from '../models/ProjectIssuePriority.js';
import { IssueActivityLog } from '../models/IssueActivityLog.js';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { checkProjectAccess, checkProjectMember, requireIssueAccess } from '../utils/permissions.js';
import { MANAGER_ROLES } from '../utils/permissions.js';
import { issuesToOutList } from '../utils/issueSerialize.js';

const router = Router();

async function logActivity(issueId, userId, action, oldValue, newValue) {
  await IssueActivityLog.create({
    issue_id: issueId,
    changed_by: userId,
    action,
    old_value: oldValue ?? null,
    new_value: newValue ?? null,
  });
}

router.post('/', authenticate, async (req, res) => {
  try {
    const body = req.body;
    const pid = String(body.project_id);

    await checkProjectAccess(pid, req.user);

    const issueType = await ProjectIssueType.findOne({
      _id: body.issue_type_id,
      project_id: pid,
      is_active: true,
    }).lean();
    if (!issueType) {
      return res.status(400).json({
        detail: 'Invalid issue type for this project or issue type is inactive',
      });
    }

    const issueStatus = await ProjectIssueStatus.findOne({
      _id: body.status_id,
      project_id: pid,
      is_active: true,
    }).lean();
    if (!issueStatus) {
      return res.status(400).json({
        detail: 'Invalid issue status for this project or status is inactive',
      });
    }

    const issuePriority = await ProjectIssuePriority.findOne({
      _id: body.priority_id,
      project_id: pid,
      is_active: true,
    }).lean();
    if (!issuePriority) {
      return res.status(400).json({
        detail: 'Invalid issue priority for this project or priority is inactive',
      });
    }

    if (body.assignee_id) {
      const ok = await checkProjectMember(pid, String(body.assignee_id));
      if (!ok) {
        return res.status(400).json({ detail: 'Assignee must be a member of the project' });
      }
    }

    if (body.start_date && body.due_date) {
      const s = new Date(body.start_date);
      const d = new Date(body.due_date);
      if (s > d) {
        return res.status(400).json({ detail: 'Start date cannot be after due date' });
      }
    }

    const last = await Issue.findOne({ project_id: pid }).sort({ issue_number: -1 }).lean();
    const nextNum = (last?.issue_number ?? 0) + 1;

    const doc = await Issue.create({
      project_id: pid,
      issue_number: nextNum,
      title: body.title,
      description: body.description ?? null,
      issue_type_id: String(body.issue_type_id),
      priority_id: String(body.priority_id),
      status_id: String(body.status_id),
      assignee_id: body.assignee_id ? String(body.assignee_id) : null,
      reporter_id: String(req.user._id),
      start_date: body.start_date ? new Date(body.start_date) : null,
      due_date: body.due_date ? new Date(body.due_date) : null,
      extra_data: body.extra_data ?? {},
    });

    await logActivity(doc._id, req.user._id, 'Created', null, doc.title);

    const [out] = await issuesToOutList([doc.toObject()]);
    return res.status(201).json(out);
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

router.patch('/:issueId', authenticate, requireIssueAccess, async (req, res) => {
  try {
    const { issueId } = req.params;
    const issue = req.issue;

    const u = req.body;
    const pid = issue.project_id;

    if (u.status_id !== undefined) {
      const st = await ProjectIssueStatus.findOne({
        _id: u.status_id,
        project_id: pid,
        is_active: true,
      }).lean();
      if (!st) {
        return res.status(400).json({
          detail: 'Invalid issue status for this project or status is inactive',
        });
      }
      const oldSt = await ProjectIssueStatus.findById(issue.status_id).lean();
      await logActivity(
        issueId,
        req.user._id,
        'Status Changed',
        oldSt?.name ?? null,
        st.name
      );
      await Issue.updateOne({ _id: issueId }, { status_id: String(u.status_id) });
      issue.status_id = String(u.status_id);
    }

    if (u.priority_id !== undefined) {
      const pr = await ProjectIssuePriority.findOne({
        _id: u.priority_id,
        project_id: pid,
        is_active: true,
      }).lean();
      if (!pr) {
        return res.status(400).json({
          detail: 'Invalid issue priority for this project or priority is inactive',
        });
      }
      const oldPr = await ProjectIssuePriority.findById(issue.priority_id).lean();
      await logActivity(
        issueId,
        req.user._id,
        'Priority Changed',
        oldPr?.name ?? null,
        pr.name
      );
      await Issue.updateOne({ _id: issueId }, { priority_id: String(u.priority_id) });
      issue.priority_id = String(u.priority_id);
    }

    if (u.issue_type_id !== undefined) {
      const it = await ProjectIssueType.findOne({
        _id: u.issue_type_id,
        project_id: pid,
        is_active: true,
      }).lean();
      if (!it) {
        return res.status(400).json({
          detail: 'Invalid issue type for this project or issue type is inactive',
        });
      }
      await Issue.updateOne({ _id: issueId }, { issue_type_id: String(u.issue_type_id) });
      issue.issue_type_id = String(u.issue_type_id);
    }

    if (u.assignee_id !== undefined) {
      if (u.assignee_id !== null) {
        const ok = await checkProjectMember(pid, String(u.assignee_id));
        if (!ok) {
          return res.status(400).json({ detail: 'Assignee must be a member of the project' });
        }
      }
      let newAssignee = null;
      if (u.assignee_id) {
        newAssignee = await User.findById(u.assignee_id).lean();
      }
      let oldAssignee = null;
      if (issue.assignee_id) {
        oldAssignee = await User.findById(issue.assignee_id).lean();
      }
      await logActivity(
        issueId,
        req.user._id,
        'Assigned',
        oldAssignee?.name ?? 'Unassigned',
        newAssignee?.name ?? 'Unassigned'
      );
      const aid = u.assignee_id === null ? null : String(u.assignee_id);
      await Issue.updateOne({ _id: issueId }, { assignee_id: aid });
      issue.assignee_id = aid;
    }

    const simple = {};
    if (u.title !== undefined) simple.title = u.title;
    if (u.description !== undefined) simple.description = u.description;
    if (u.start_date !== undefined) {
      simple.start_date = u.start_date ? new Date(u.start_date) : null;
    }
    if (u.due_date !== undefined) {
      simple.due_date = u.due_date ? new Date(u.due_date) : null;
    }
    if (Object.keys(simple).length) {
      await Issue.updateOne({ _id: issueId }, simple);
      Object.assign(issue, simple);
    }

    const fresh = await Issue.findById(issueId).lean();
    if (fresh.start_date && fresh.due_date && fresh.start_date > fresh.due_date) {
      return res.status(400).json({ detail: 'Start date cannot be after due date' });
    }

    const [out] = await issuesToOutList([fresh]);
    return res.json(out);
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

router.patch('/:issueId/complete', authenticate, requireIssueAccess, async (req, res) => {
  try {
    const { issueId } = req.params;
    const issue = req.issue;

    let doneStatus = await ProjectIssueStatus.findOne({
      project_id: issue.project_id,
      is_active: true,
      category: 'done',
    })
      .sort({ display_order: 1 })
      .lean();

    if (!doneStatus) {
      const all = await ProjectIssueStatus.find({
        project_id: issue.project_id,
        is_active: true,
      })
        .sort({ display_order: 1 })
        .lean();
      doneStatus =
        all.find((s) => s.name && s.name.toLowerCase().includes('done')) || all[0] || null;
    }

    if (!doneStatus) {
      return res.status(400).json({ detail: "This project has no 'Done' status configured." });
    }

    await Issue.updateOne({ _id: issueId }, { status_id: doneStatus._id });
    const fresh = await Issue.findById(issueId).lean();
    const [out] = await issuesToOutList([fresh]);
    return res.json(out);
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

export default router;
