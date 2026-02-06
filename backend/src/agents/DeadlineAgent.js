import Item from '../models/Item.js';

/**
 * Deadline Agent
 * Scans for items due within 24 hours.
 */
export const checkDeadlines = async () => {
    try {
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const itemsDueSoon = await Item.find({
            dueDate: { 
                $gte: now,
                $lte: tomorrow
            },
            currentState: { $nin: ['Done', 'Completed', 'Closed'] }
        });

        if (itemsDueSoon.length > 0) {
            console.log(`⏰ DeadlineAgent: Found ${itemsDueSoon.length} items due soon.`);
            itemsDueSoon.forEach(item => {
                console.log(`   - "${item.data?.title}" is due on ${item.dueDate}`);
            });
        }
    } catch (err) {
        console.error("DeadlineAgent Error:", err);
    }
};
