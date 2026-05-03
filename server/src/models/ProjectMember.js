import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const projectMemberSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    project_id: { type: String, ref: 'Project', required: true },
    user_id: { type: String, ref: 'User', required: true },
    role: { type: String, enum: ['member', 'manager'], required: true },
    joined_at: { type: Date, default: () => new Date() },
  }
);

projectMemberSchema.index({ project_id: 1, user_id: 1 }, { unique: true });

export const ProjectMember = mongoose.model('ProjectMember', projectMemberSchema);
