import mongoose from 'mongoose';

const roles = ['owner', 'admin', 'operator', 'viewer'];

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: roles, required: true, default: 'viewer' },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

export const USER_ROLES = roles;

export default mongoose.model('User', userSchema);

