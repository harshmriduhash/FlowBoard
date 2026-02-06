import OpenAI from 'openai';
import Workflow from '../models/Workflow.js';
import Item from '../models/Item.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock-key',
});

// Simple in-memory session store for context (Phase 5: Short-term memory)
const sessionMemory = new Map();

export { openai };

export const chatWithAI = async ({ message, workflowId, userId }) => {
  try {
    let context = "You are FlowBoard AI, a helpful assistant for managing workflows.";
    
    if (workflowId) {
      const workflow = await Workflow.findById(workflowId);
      if (workflow) {
        const items = await Item.find({ workflowId });
        
        const itemSummaries = items.map(item => {
          const title = item.data?.title || 'Untitled';
          return `- [${item.currentState}] ${title} (Priority: ${item.priority})`;
        }).join('\n');

        context += `
        
Current Context:
Workflow Name: ${workflow.name}
States: ${workflow.states.join(', ')}

Items on Board:
${itemSummaries}
`;
      }
    }

    const systemPrompt = `
${context}

User Query: ${message}

Instructions:
1. Answer strictly based on the provided context if related to the board.
2. If the user asks for a summary, group items by state.
3. If the user asks about priorities, highlight high-priority items.
4. Be concise and professional.
`;

    // Only call OpenAI if we have a key, else return a mock response
    if (!process.env.OPENAI_API_KEY) {
      return {
        answer: "OpenAI API Key is missing in the backend environment variables. Please add OPENAI_API_KEY to .env file to enable real AI responses.",
        isMock: true
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    });

    return {
      answer: response.choices[0].message.content,
    };
  } catch (error) {
    console.error("AI Service Error:", error);
    return {
      answer: "I encountered an error processing your request.",
      error: error.message
    };
  }
};

export const suggestWorkflow = async (description) => {
  if (!process.env.OPENAI_API_KEY) {
      return {
          name: "Project Tracker (Mock)",
          states: ["To Do", "In Progress", "Review", "Done"],
          allowedTransitions: {
              "To Do": ["In Progress"],
              "In Progress": ["Review", "To Do"],
              "Review": ["Done", "In Progress"],
              "Done": ["To Do"]
          }
      };
  }

  const prompt = `
  Analyze this workflow description: "${description}"
  Suggest a name, a list of states, and allowed transitions.
  Return JSON only:
  {
    "name": "string",
    "states": ["string"],
    "allowedTransitions": { "StateA": ["StateB"] }
  }
  `;

  const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
  });

  const text = completion.choices[0].message.content.replace(/```json|```/g, '').trim();
  return JSON.parse(text);
};

export const prioritizeTask = async (title, description) => {
    if (!process.env.OPENAI_API_KEY) return 'medium';

    const prompt = `
    Task: ${title}
    Description: ${description}
     Determine priority (low, medium, high). Return ONLY the word.
    `;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
    });

    const priority = completion.choices[0].message.content.trim().toLowerCase();
    return ['low', 'medium', 'high'].includes(priority) ? priority : 'medium';
};

export const analyzeStuckTask = async (taskTitle, currentState, daysStuck) => {
    if (!process.env.OPENAI_API_KEY) return "Check if this task is still relevant.";

    const prompt = `
    Task "${taskTitle}" has been stuck in state "${currentState}" for ${daysStuck} days.
    Suggest a concise, 1-sentence action to unblock it.
    `;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });

    return completion.choices[0].message.content.trim();
};
