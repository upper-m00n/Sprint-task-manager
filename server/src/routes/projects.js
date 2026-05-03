import { Router } from 'express';
import { Issue } from '../models/Issue.js';
import { authenticate } from '../middleware/auth.js';
import { checkProjectAccess } from '../utils/permissions.js';
import { getUserProjects, getProjectDetails } from '../services/projectQueries.js';
import { issuesToOutList } from '../utils/issueSerialize.js';

const router = Router();

router.get('/accessible', authenticate, async (req, res) => {
  try {
    const list = await getUserProjects(req.user._id);
    return res.json(list);
  } catch (e) {
    return res.status(500).json({ detail: String(e.message) });
  }
});

router.get('/my-spaces', authenticate, async (req, res) => {
  try {
    const list = await getUserProjects(req.user._id);
    return res.json(list);
  } catch (e) {
    return res.status(500).json({ detail: String(e.message) });
  }
});

router.get('/:projectId', authenticate, async (req, res) => {
  try {
    const data = await getProjectDetails(req.params.projectId, req.user._id);
    return res.json(data);
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

router.get('/:projectId/issues', authenticate, async (req, res) => {
  try {
    const { projectId } = req.params;
    await checkProjectAccess(projectId, req.user);

    const filter = { project_id: projectId };
    if (req.query.status_id) filter.status_id = req.query.status_id;
    if (req.query.priority_id) filter.priority_id = req.query.priority_id;
    if (req.query.issue_type_id) filter.issue_type_id = req.query.issue_type_id;
    if (req.query.assignee_id) filter.assignee_id = req.query.assignee_id;

    let query = Issue.find(filter).sort({ created_at: 1 }).lean();
    const issues = await query.exec();

    let list = issues;
    if (req.query.search) {
      const s = req.query.search.toLowerCase();
      list = issues.filter(
        (i) =>
          (i.title && i.title.toLowerCase().includes(s)) ||
          (i.description && i.description.toLowerCase().includes(s))
      );
    }

    const out = await issuesToOutList(list);
    return res.json(out);
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

export default router;
