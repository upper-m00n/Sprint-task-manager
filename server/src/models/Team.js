import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const memberSchema = new mongoose.Schema(
  {
    user_id: { type: String, ref: 'User', required: true },
    role: { type: String, enum: ['member', 'manager'], default: 'member' },
    joined_at: { type: Date, default: () => new Date() },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null, trim: true },
    created_by: { type: String, ref: 'User', required: true },
    members: { type: [memberSchema], default: [] },
    project_ids: [{ type: String, ref: 'Project' }],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

teamSchema.index({ created_by: 1 });

export const Team = mongoose.model('Team', teamSchema);
