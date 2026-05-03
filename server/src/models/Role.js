import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    name: { type: String, required: true, unique: true },
  }
);

export const Role = mongoose.model('Role', roleSchema);
