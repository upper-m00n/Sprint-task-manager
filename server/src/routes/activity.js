import { Router } from 'express';
import { Issue } from '../models/Issue.js';
import { IssueActivityLog } from '../models/IssueActivityLog.js';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { checkProjectAccess } from '../utils/permissions.js';

const router = Router();

router.get('/issues/:issueId/activity', authenticate, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId).lean();
    if (!issue) {
      return res.status(404).json({ detail: 'Issue not found' });
    }
    await checkProjectAccess(issue.project_id, req.user);

    const logs = await IssueActivityLog.find({ issue_id: req.params.issueId })
      .sort({ created_at: -1 })
      .lean();
    const userIds = [...new Set(logs.map((l) => l.changed_by))];
    const users = await User.find({ _id: { $in: userIds } }).lean();
    const names = new Map(users.map((u) => [u._id, u.name]));

    return res.json(
      logs.map((log) => ({
        id: log._id,
        issue_id: log.issue_id,
        action: log.action,
        old_value: log.old_value ?? null,
        new_value: log.new_value ?? null,
        changed_by: log.changed_by,
        changed_by_name: names.get(log.changed_by) ?? '',
        created_at: log.created_at,
      }))
    );
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

export default router;
