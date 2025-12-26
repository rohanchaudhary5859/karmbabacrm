const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'test@example.com',
        pass: process.env.EMAIL_PASS || 'password'
      }
    });
  }

  async sendTaskReminder(user, task) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Karm Baba CRM" <no-reply@karmbaba.com>',
      to: user.email,
      subject: `Task Reminder: ${task.title}`,
      html: `
        <h2>Task Reminder</h2>
        <p>Hello ${user.name},</p>
        <p>This is a reminder for your task:</p>
        <h3>${task.title}</h3>
        <p>${task.description || 'No description provided'}</p>
        <p><strong>Due Date:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
        <p><strong>Status:</strong> ${task.status.replace('_', ' ')}</p>
        ${task.client ? `<p><strong>Client:</strong> ${task.client.name}</p>` : ''}
        <p>Please take action on this task as needed.</p>
        <p>Best regards,<br>Karm Baba CRM</p>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendOverdueTaskAlert(user, task) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Karm Baba CRM" <no-reply@karmbaba.com>',
      to: user.email,
      subject: `OVERDUE TASK: ${task.title}`,
      html: `
        <h2 style="color: red;">Overdue Task Alert</h2>
        <p>Hello ${user.name},</p>
        <p>You have an overdue task that requires immediate attention:</p>
        <h3>${task.title}</h3>
        <p>${task.description || 'No description provided'}</p>
        <p><strong>Due Date:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
        <p><strong>Status:</strong> ${task.status.replace('_', ' ')}</p>
        ${task.client ? `<p><strong>Client:</strong> ${task.client.name}</p>` : ''}
        <p>Please update the status of this task as soon as possible.</p>
        <p>Best regards,<br>Karm Baba CRM</p>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Overdue task email sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending overdue task email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Karm Baba CRM" <no-reply@karmbaba.com>',
      to: user.email,
      subject: 'Welcome to Karm Baba CRM',
      html: `
        <h2>Welcome to Karm Baba CRM!</h2>
        <p>Hello ${user.name},</p>
        <p>Welcome to Karm Baba CRM. Your account has been successfully created.</p>
        <p>You can now start managing your clients, tracking interactions, and organizing tasks.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>Karm Baba CRM Team</p>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();