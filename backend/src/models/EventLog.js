import mongoose from 'mongoose';

const eventLogSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    action: { type: String, required: true },
    fromState: String,
    toState: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

eventLogSchema.index({ itemId: 1, timestamp: -1 });

export default mongoose.model('EventLog', eventLogSchema);

