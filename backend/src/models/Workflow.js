import mongoose from 'mongoose';

const workflowSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    states: [{ type: String, required: true }],
    allowedTransitions: { type: Map, of: [String], required: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Workflow', workflowSchema);

