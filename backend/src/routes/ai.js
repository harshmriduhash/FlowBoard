import express from 'express';
import { chatWithAI, suggestWorkflow, prioritizeTask } from '../services/aiService.js';
import { breakdownTask } from '../agents/PlannerAgent.js';
import { requireAuth } from '../middleware/auth.js';
import Workflow from '../models/Workflow.js';
import Item from '../models/Item.js';

const router = express.Router();

router.post('/chat', requireAuth, async (req, res) => {
  try {
    const { message, workflowId } = req.body;
    const userId = req.user.id; 

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await chatWithAI({ message, workflowId, userId });
    res.json(response);
  } catch (error) {
    console.error('Chat Route Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/planner/breakdown', requireAuth, async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ error: 'itemId is required' });

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const workflow = await Workflow.findById(item.workflowId);
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });
    
    const subtasks = await breakdownTask(item, workflow);
    res.json({ subtasks });
  } catch (error) {
    console.error('Planner Route Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/suggest-workflow', requireAuth, async (req, res) => {
    try {
        const { description } = req.body;
        if (!description) return res.status(400).json({ error: 'Description is required' });

        const suggestion = await suggestWorkflow(description);
        res.json(suggestion);
    } catch (error) {
        console.error('Suggest Workflow Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/prioritize-task', requireAuth, async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });

        const priority = await prioritizeTask(title, description);
        res.json({ priority });
    } catch (error) {
        console.error('Prioritize Task Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
