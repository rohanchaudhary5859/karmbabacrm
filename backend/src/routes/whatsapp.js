const express = require('express');
const router = express.Router();
const WhatsAppService = require('../services/whatsappService');

// POST /api/whatsapp/send
// body: { to: string, message: string }
router.post('/send', async (req, res) => {
  const { to, message } = req.body || {};
  if (!to || !message) {
    return res.status(400).json({ error: 'to and message are required' });
  }

  const result = await WhatsAppService.sendMessage(to, message);
  if (result.ok) return res.json({ success: true, sid: result.sid });
  return res.status(500).json({ success: false, reason: result.reason });
});

module.exports = router;
