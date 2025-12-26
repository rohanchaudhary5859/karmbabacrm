const express = require('express');
const { 
  sendEmailToClient,
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate
} = require('../controllers/emailController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/send', sendEmailToClient);

// Template routes
router.route('/templates')
  .post(createTemplate)
  .get(getTemplates);

router.route('/templates/:id')
  .get(getTemplate)
  .put(updateTemplate)
  .delete(deleteTemplate);

module.exports = router;