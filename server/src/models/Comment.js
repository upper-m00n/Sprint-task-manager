import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const schema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    issue_id: { type: String, ref: 'Issue', required: true, index: true },
    user_id: { type: String, ref: 'User', required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Comment = mongoose.model('Comment', schema);
