import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const schema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    project_id: { type: String, ref: 'Project', required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    category: { type: String, required: true },
    color: { type: String, default: null },
    is_active: { type: Boolean, default: true },
    display_order: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const ProjectIssueStatus = mongoose.model('ProjectIssueStatus', schema);
