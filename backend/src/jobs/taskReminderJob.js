const { PrismaClient } = require('@prisma/client');
const emailService = require('../services/emailService');

const prisma = new PrismaClient();

async function sendTaskReminders() {
  console.log('Running task reminder job...');
  
  try {
    // Get all users with tasks due in the next 24 hours
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    dayAfterTomorrow.setHours(0, 0, 0, 0);
    
    const tasks = await prisma.task.findMany({
      where: {
        status: {
          not: 'COMPLETED'
        },
        dueDate: {
          gte: tomorrow,
          lt: dayAfterTomorrow
        }
      },
      include: {
        user: true,
        client: true
      }
    });
    
    console.log(`Found ${tasks.length} tasks due tomorrow`);
    
    // Send reminders
    for (const task of tasks) {
      try {
        await emailService.sendTaskReminder(task.user, task);
        console.log(`Sent reminder for task ${task.id} to ${task.user.email}`);
      } catch (error) {
        console.error(`Failed to send reminder for task ${task.id}:`, error);
      }
    }
    
    // Also check for overdue tasks
    const now = new Date();
    const overdueTasks = await prisma.task.findMany({
      where: {
        status: {
          not: 'COMPLETED'
        },
        dueDate: {
          lt: now
        }
      },
      include: {
        user: true,
        client: true
      }
    });
    
    console.log(`Found ${overdueTasks.length} overdue tasks`);
    
    // Send overdue alerts
    for (const task of overdueTasks) {
      try {
        await emailService.sendOverdueTaskAlert(task.user, task);
        console.log(`Sent overdue alert for task ${task.id} to ${task.user.email}`);
      } catch (error) {
        console.error(`Failed to send overdue alert for task ${task.id}:`, error);
      }
    }
    
    console.log('Task reminder job completed');
  } catch (error) {
    console.error('Error in task reminder job:', error);
  }
}

module.exports = sendTaskReminders;