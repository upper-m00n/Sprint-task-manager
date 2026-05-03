import { Router } from 'express';
import { Issue } from '../models/Issue.js';
import { IssueActivityLog } from '../models/IssueActivityLog.js';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { getUserProjects } from '../services/projectQueries.js';
import { issuesToOutList } from '../utils/issueSerialize.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const spaces = await getUserProjects(req.user._id);

    const issues = await Issue.find({ assignee_id: req.user._id })
      .sort({ updated_at: -1 })
      .limit(20)
      .lean();
    const tasks = await issuesToOutList(issues);

    const projectIds = spaces.map((s) => s.id);
    let activity_stream = [];
    if (projectIds.length) {
      const projectIssues = await Issue.find({ project_id: { $in: projectIds } })
        .select('_id')
        .lean();
      const iids = projectIssues.map((i) => i._id);
      const logs = await IssueActivityLog.find({ issue_id: { $in: iids } })
        .sort({ created_at: -1 })
        .limit(50)
        .lean();
      const changerIds = [...new Set(logs.map((l) => l.changed_by))];
      const changers = await User.find({ _id: { $in: changerIds } }).lean();
      const names = new Map(changers.map((u) => [u._id, u.name]));
      activity_stream = logs.map((log) => ({
        id: log._id,
        issue_id: log.issue_id,
        action: log.action,
        old_value: log.old_value ?? null,
        new_value: log.new_value ?? null,
        changed_by: log.changed_by,
        changed_by_name: names.get(log.changed_by) ?? '',
        created_at: log.created_at,
      }));
    }

    return res.json({ spaces, tasks, activity_stream });
  } catch (e) {
    return res.status(500).json({ detail: String(e.message) });
  }
});

export default router;
