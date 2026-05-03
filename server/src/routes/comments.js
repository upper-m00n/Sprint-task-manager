import { Router } from 'express';
import { Comment } from '../models/Comment.js';
import { Issue } from '../models/Issue.js';
import { IssueActivityLog } from '../models/IssueActivityLog.js';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { checkProjectAccess } from '../utils/permissions.js';
import { userIsAdmin } from '../utils/roles.js';

const router = Router();

function mapComment(c, user) {
  return {
    id: c._id,
    issue_id: c.issue_id,
    content: c.content,
    author: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    created_at: c.created_at,
    updated_at: c.updated_at,
  };
}

router.get('/issues/:issueId/comments', authenticate, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId).lean();
    if (!issue) {
      return res.status(404).json({ detail: 'Issue not found' });
    }
    await checkProjectAccess(issue.project_id, req.user);

    const comments = await Comment.find({ issue_id: req.params.issueId })
      .sort({ created_at: 1 })
      .lean();
    const userIds = [...new Set(comments.map((c) => c.user_id))];
    const users = await User.find({ _id: { $in: userIds } }).lean();
    const umap = new Map(users.map((u) => [u._id, u]));
    return res.json(comments.map((c) => mapComment(c, umap.get(c.user_id))));
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

router.post('/issues/:issueId/comments', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const issue = await Issue.findById(req.params.issueId).lean();
    if (!issue) {
      return res.status(404).json({ detail: 'Issue not found' });
    }
    await checkProjectAccess(issue.project_id, req.user);

    const comment = await Comment.create({
      issue_id: req.params.issueId,
      user_id: req.user._id,
      content,
    });
    await IssueActivityLog.create({
      issue_id: req.params.issueId,
      changed_by: req.user._id,
      action: 'Commented',
      old_value: null,
      new_value: content.slice(0, 200),
    });
    const user = await User.findById(req.user._id).lean();
    return res.status(201).json(mapComment(comment.toObject(), user));
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

async function handleDeleteComment(commentId, currentUser, res) {
  const comment = await Comment.findById(commentId).lean();
  if (!comment) {
    return res.status(404).json({ detail: 'Comment not found' });
  }
  const issue = await Issue.findById(comment.issue_id).lean();
  if (issue) {
    await checkProjectAccess(issue.project_id, currentUser);
  }
  const isAuthor = String(comment.user_id) === String(currentUser._id);
  const isAdmin = await userIsAdmin(currentUser._id);
  if (!isAuthor && !isAdmin) {
    return res.status(403).json({
      detail: 'Only the comment author or an admin can delete this comment',
    });
  }
  await Comment.deleteOne({ _id: commentId });
  return res.status(204).send();
}

router.delete('/comments/:commentId', authenticate, async (req, res) => {
  try {
    return await handleDeleteComment(req.params.commentId, req.user, res);
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

router.delete('/issues/:issueId/comments/:commentId', authenticate, async (req, res) => {
  try {
    const { issueId, commentId } = req.params;
    const comment = await Comment.findById(commentId).lean();
    if (comment && String(comment.issue_id) !== String(issueId)) {
      return res.status(404).json({ detail: 'Comment not found' });
    }
    return await handleDeleteComment(commentId, req.user, res);
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ detail: e.message });
  }
});

export default router;
