import express from 'express';
import Workflow from '../models/Workflow.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, requireRole(['owner', 'admin']), async (req, res) => {
  try {
    const { name, description, states, allowedTransitions } = req.body;
    if (!name || !Array.isArray(states) || states.length === 0 || !allowedTransitions) {
      return res.status(400).json({ error: 'name, states, allowedTransitions required' });
    }

    const workflow = await Workflow.create({
      name,
      description,
      states,
      allowedTransitions,
      workspaceId: req.user.workspaceId,
      createdBy: req.user.id,
    });

    res.status(201).json(workflow);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create workflow' });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const workflows = await Workflow.find({ workspaceId: req.user.workspaceId }).sort({ createdAt: -1 });
    res.json(workflows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch workflows' });
  }
});

export default router;

