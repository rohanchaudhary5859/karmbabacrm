// The individual job modules handle their own scheduling.
// Require the task reminder jobs so they initialize themselves.
const taskReminderJobs = require('./taskReminderJob');

console.log('Job scheduler initialized');

module.exports = taskReminderJobs;