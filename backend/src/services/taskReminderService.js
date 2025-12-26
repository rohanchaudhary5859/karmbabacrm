const { PrismaClient } = require('@prisma/client');
const { sendEmail } = require('../config/email');

const prisma = new PrismaClient();

class TaskReminderService {
  // Send reminders for tasks due today
  static async sendDailyReminders() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Find tasks due today that haven't been reminded about
      const tasks = await prisma.task.findMany({
        where: {
          dueDate: {
            gte: today,
            lt: tomorrow
          },
          status: {
            not: 'COMPLETED'
          },
          reminderSent: false
        },
        include: {
          user: true,
          client: true
        }
      });
      
      for (const task of tasks) {
        await this.sendTaskReminder(task);
      }
      
      console.log(`Sent ${tasks.length} task reminders`);
    } catch (error) {
      console.error('Error sending task reminders:', error);
    }
  }
  
  // Send reminder for a specific task
  static async sendTaskReminder(task) {
    try {
      if (!task.user.email) {
        console.log('User has no email address');
        return;
      }
      
      const subject = `Task Reminder: ${task.title}`;
      const clientInfo = task.client 
        ? `for client ${task.client.name}` 
        : '';
      
      const html = `
        <h2>Task Reminder</h2>
        <p><strong>Task:</strong> ${task.title}</p>
        <p><strong>Description:</strong> ${task.description || 'No description'}</p>
        ${clientInfo ? `<p><strong>Client:</strong> ${clientInfo}</p>` : ''}
        <p><strong>Due Date:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
        <p>Please complete this task as soon as possible.</p>
      `;
      
      await sendEmail(task.user.email, subject, html);
      
      // Mark reminder as sent
      await prisma.task.update({
        where: { id: task.id },
        data: { reminderSent: true }
      });
      
      console.log(`Reminder sent for task: ${task.title}`);
    } catch (error) {
      console.error('Error sending task reminder:', error);
    }
  }
  
  // Send overdue task notifications
  static async sendOverdueNotifications() {
    try {
      const now = new Date();
      
      // Find overdue tasks that haven't been notified about
      const overdueTasks = await prisma.task.findMany({
        where: {
          dueDate: {
            lt: now
          },
          status: {
            not: 'COMPLETED'
          },
          overdueNotified: false
        },
        include: {
          user: true,
          client: true
        }
      });
      
      for (const task of overdueTasks) {
        await this.sendOverdueNotification(task);
      }
      
      console.log(`Sent ${overdueTasks.length} overdue notifications`);
    } catch (error) {
      console.error('Error sending overdue notifications:', error);
    }
  }
  
  // Send overdue notification for a specific task
  static async sendOverdueNotification(task) {
    try {
      if (!task.user.email) {
        console.log('User has no email address');
        return;
      }
      
      const subject = `OVERDUE TASK: ${task.title}`;
      const clientInfo = task.client 
        ? `for client ${task.client.name}` 
        : '';
      
      const daysOverdue = Math.floor((new Date() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24));
      
      const html = `
        <h2 style="color: red;">OVERDUE TASK</h2>
        <p><strong>Task:</strong> ${task.title}</p>
        <p><strong>Description:</strong> ${task.description || 'No description'}</p>
        ${clientInfo ? `<p><strong>Client:</strong> ${clientInfo}</p>` : ''}
        <p><strong>Due Date:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
        <p><strong>Days Overdue:</strong> ${daysOverdue}</p>
        <p style="color: red;">This task is overdue. Please complete it immediately.</p>
      `;
      
      await sendEmail(task.user.email, subject, html);
      
      // Mark as notified
      await prisma.task.update({
        where: { id: task.id },
        data: { overdueNotified: true }
      });
      
      console.log(`Overdue notification sent for task: ${task.title}`);
    } catch (error) {
      console.error('Error sending overdue notification:', error);
    }
  }
}

module.exports = TaskReminderService;