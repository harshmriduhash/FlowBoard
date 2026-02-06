import Item from '../models/Item.js';
import { analyzeStuckTask } from '../services/aiService.js';

/**
 * Stuck Task Agent
 * Scans for items that haven't been updated in > 3 days.
 * In a real app, this would notify the user or auto-comment.
 */
export const checkStuckTasks = async () => {
    try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const stuckItems = await Item.find({
            updatedAt: { $lt: threeDaysAgo },
            // Simplification: Assume 'Done' or 'Completed' are final states to ignore
            currentState: { $nin: ['Done', 'Completed', 'Closed'] }
        });

        if (stuckItems.length > 0) {
            console.log(`🕵️ StuckAgent: Found ${stuckItems.length} stuck items.`);
            
            for (const item of stuckItems) {
                const suggestion = await analyzeStuckTask(
                    item.data?.title || 'Untitled', 
                    item.currentState, 
                    3 // simplistic, should calc real diff
                );
                
                console.log(`   - "${item.data?.title}" (ID: ${item._id}) stuck in ${item.currentState}`);
                console.log(`     AI Suggestion: ${suggestion}`);
                
                // Optional: Save suggestion to item
                // item.data.aiSuggestion = suggestion;
                // await item.save();
            }
        }
    } catch (err) {
        console.error("StuckAgent Error:", err);
    }
};
