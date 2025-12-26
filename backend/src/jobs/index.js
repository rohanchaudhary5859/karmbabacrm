const cron = require('node-cron');
const sendTaskReminders = require('./taskReminderJob');

// Schedule task reminders to run daily at 9 AM
cron.schedule('0 9 * * *', sendTaskReminders, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

console.log('Job scheduler started');

module.exports = {
  sendTaskReminders
};