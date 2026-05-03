import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const issueSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    project_id: { type: String, ref: 'Project', required: true, index: true },
    issue_number: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: null },
    issue_type_id: { type: String, required: true },
    priority_id: { type: String, required: true },
    status_id: { type: String, required: true },
    assignee_id: { type: String, default: null },
    reporter_id: { type: String, required: true },
    start_date: { type: Date, default: null },
    due_date: { type: Date, default: null },
    extra_data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

issueSchema.index({ project_id: 1, issue_number: 1 }, { unique: true });
issueSchema.index({ project_id: 1, status_id: 1 });
issueSchema.index({ assignee_id: 1 });
issueSchema.index({ reporter_id: 1 });

export const Issue = mongoose.model('Issue', issueSchema);
