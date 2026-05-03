import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const schema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    issue_id: { type: String, ref: 'Issue', required: true, index: true },
    changed_by: { type: String, ref: 'User', required: true },
    action: { type: String, required: true },
    old_value: { type: String, default: null },
    new_value: { type: String, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const IssueActivityLog = mongoose.model('IssueActivityLog', schema);
