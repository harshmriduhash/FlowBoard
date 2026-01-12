import express from 'express';
import Item from '../models/Item.js';
import Workflow from '../models/Workflow.js';
import EventLog from '../models/EventLog.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, requireRole(['owner', 'admin', 'operator']), async (req, res) => {
  try {
    const { workflowId, data, assignedTo, priority } = req.body;
    if (!workflowId) return res.status(400).json({ error: 'workflowId required' });

    const workflow = await Workflow.findOne({ _id: workflowId, workspaceId: req.user.workspaceId });
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });

    const initialState = workflow.states[0];
    const item = await Item.create({
      workflowId: workflow._id,
      currentState: initialState,
      data: data || {},
      assignedTo,
      priority: priority || 'medium',
      workspaceId: req.user.workspaceId,
    });

    await EventLog.create({
      itemId: item._id,
      action: 'item_created',
      fromState: null,
      toState: initialState,
      performedBy: req.user.id,
      workspaceId: req.user.workspaceId,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create item' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const { workflowId, state, q } = req.query;
    const filter = { workspaceId: req.user.workspaceId };
    if (workflowId) filter.workflowId = workflowId;
    if (state) filter.currentState = state;
    if (q) filter['$or'] = [{ 'data.title': new RegExp(q, 'i') }, { 'data.description': new RegExp(q, 'i') }];

    const items = await Item.find(filter).sort({ updatedAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch items' });
  }
});

router.post('/:id/transition', requireAuth, requireRole(['owner', 'admin', 'operator']), async (req, res) => {
  try {
    const { toState } = req.body;
    const item = await Item.findOne({ _id: req.params.id, workspaceId: req.user.workspaceId });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const workflow = await Workflow.findOne({ _id: item.workflowId, workspaceId: req.user.workspaceId });
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });

    // MongoDB Map needs to be converted to object or accessed via get()
    const transitionsMap = workflow.allowedTransitions instanceof Map 
      ? Object.fromEntries(workflow.allowedTransitions)
      : workflow.allowedTransitions;
    const allowed = transitionsMap[item.currentState] || [];
    if (!allowed.includes(toState)) {
      return res.status(400).json({ error: 'Invalid transition' });
    }

    const fromState = item.currentState;
    item.currentState = toState;
    await item.save();

    await EventLog.create({
      itemId: item._id,
      action: 'state_transition',
      fromState,
      toState,
      performedBy: req.user.id,
      workspaceId: req.user.workspaceId,
    });

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Transition failed' });
  }
});

router.get('/:id/logs', requireAuth, async (req, res) => {
  try {
    const logs = await EventLog.find({ itemId: req.params.id, workspaceId: req.user.workspaceId }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch logs' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, workspaceId: req.user.workspaceId });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch item' });
  }
});

export default router;

