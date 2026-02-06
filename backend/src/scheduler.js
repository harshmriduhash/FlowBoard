import cron from 'node-cron';
import { checkStuckTasks } from './agents/StuckAgent.js';
import { checkDeadlines } from './agents/DeadlineAgent.js';

export const startScheduler = () => {
  console.log('⏳ AI Agents Scheduler Started...');

  // Run 'Stuck Task' check every day at midnight
  cron.schedule('0 0 * * *', () => {
    checkStuckTasks();
  });

  // Run 'Deadline' check every hour
  cron.schedule('0 * * * *', () => {
    checkDeadlines();
  });
  
  // Run once on startup for demo purposes (after 5 seconds)
  setTimeout(() => {
    console.log("Running initial AI Agent sweeps...");
    checkStuckTasks();
    checkDeadlines();
  }, 5000);
};
