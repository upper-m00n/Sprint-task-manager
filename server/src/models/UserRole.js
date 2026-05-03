import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const userRoleSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    user_id: { type: String, ref: 'User', required: true },
    role_id: { type: Number, ref: 'Role', required: true },
  }
);

userRoleSchema.index({ user_id: 1, role_id: 1 }, { unique: true });

export const UserRole = mongoose.model('UserRole', userRoleSchema);
