import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const projectSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, default: null },
    status: { type: String, default: 'active' },
    created_by: { type: String, ref: 'User', required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Project = mongoose.model('Project', projectSchema);
