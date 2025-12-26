const { sendEmail } = require('../config/email');
const EmailTemplate = require('../models/EmailTemplate');

exports.sendEmailToClient = async (req, res) => {
  try {
    const { clientId, templateId, subject, body, attachments } = req.body;
    const userId = req.user.id;
    
    // Get client details
    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
        userId
      }
    });
    
    if (!client || !client.email) {
      return res.status(400).json({
        success: false,
        message: 'Client not found or no email address'
      });
    }
    
    // Get template if provided
    let emailBody = body;
    let emailSubject = subject;
    
    if (templateId) {
      const template = await EmailTemplate.findById(templateId, userId);
      if (template) {
        emailBody = template.body;
        emailSubject = template.subject;
        
        // Replace placeholders
        emailBody = emailBody.replace(/\{\{client\.name\}\}/g, client.name);
        emailBody = emailBody.replace(/\{\{client\.company\}\}/g, client.company || '');
        emailSubject = emailSubject.replace(/\{\{client\.name\}\}/g, client.name);
      }
    }
    
    // Send email
    await sendEmail(client.email, emailSubject, emailBody, attachments);
    
    // Log interaction
    await prisma.interaction.create({
      data: {
        type: 'Email',
        notes: `Email sent: ${emailSubject}`,
        userId,
        clientId
      }
    });
    
    res.json({
      success: true,
      message: 'Email sent successfully'
    });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({
      success: false,
      message: 'Error sending email'
    });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.create(req.body, req.user.id);
    res.status(201).json({
      success: true,
      template
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.findAll(req.user.id);
    res.json({
      success: true,
      templates
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id, req.user.id);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    res.json({
      success: true,
      template
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.update(req.params.id, req.body, req.user.id);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    res.json({
      success: true,
      template
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.delete(req.params.id, req.user.id);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};