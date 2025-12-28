const nodeCron = require('node-cron');
const TaskReminderService = require('../services/taskReminderService');

// Schedule daily task reminders at 9 AM (server local time)
const runDaily = async () => {
  try {
    console.log('Running daily task reminder job');
    if (typeof TaskReminderService.sendDailyReminders === 'function') {
      await TaskReminderService.sendDailyReminders();
    } else {
      console.error('TaskReminderService.sendDailyReminders is not a function');
    }
  } catch (err) {
    console.error('Error in daily reminder job:', err);
  }
};

// Schedule overdue task notifications every hour (at minute 0)
const runOverdue = async () => {
  try {
    console.log('Running overdue task notification job');
    if (typeof TaskReminderService.sendOverdueNotifications === 'function') {
      await TaskReminderService.sendOverdueNotifications();
    } else {
      console.error('TaskReminderService.sendOverdueNotifications is not a function');
    }
  } catch (err) {
    console.error('Error in overdue notification job:', err);
  }
};

const dailyReminderJob = nodeCron.schedule('0 9 * * *', runDaily);
const overdueNotificationJob = nodeCron.schedule('0 * * * *', runOverdue);

console.log('Task reminder jobs scheduled');

module.exports = {
  dailyReminderJob,
  overdueNotificationJob
};