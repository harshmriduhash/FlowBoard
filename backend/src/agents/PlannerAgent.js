import OpenAI from 'openai';

// Initialize OpenAI client inside the function or file-level if env is ready
// assuming env is loaded by server.js

export const breakdownTask = async (item, workflow) => {
  if (!process.env.OPENAI_API_KEY) {
     // Return mock data if no key
     return [
       { title: "Research requirements", description: "Analyze what needs to be done", priority: "high" },
       { title: "Draft implementation", description: "Write initial code", priority: "medium" },
       { title: "Test solution", description: "Verify it works", priority: "high" }
     ];
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
Context:
Task Title: ${item.data?.title || 'Untitled'}
Task Description: ${item.data?.description || 'No description'}
Workflow States: ${workflow.states.join(', ')}

Goal:
Break this task down into 3-5 smaller, actionable subtasks.
Return ONLY a valid JSON array of objects with keys: "title", "description", "priority" (low/medium/high).
Do not include markdown formatting.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const text = completion.choices[0].message.content;
    // Sanitize and parse
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const subtasks = JSON.parse(jsonStr);
    return subtasks;
  } catch (err) {
    console.error("Planner Agent Error:", err);
    // Fallback
    return [];
  }
};
