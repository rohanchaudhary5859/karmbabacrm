const dotenv = require('dotenv');
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM;

let client = null;
if (accountSid && authToken) {
  try {
    const Twilio = require('twilio');
    client = new Twilio(accountSid, authToken);
  } catch (err) {
    console.warn('Twilio module not installed. Install "twilio" to enable WhatsApp messaging.');
  }
} else {
  console.info('Twilio credentials not configured; WhatsApp service disabled.');
}

class WhatsAppService {
  static async sendMessage(to, body) {
    if (!client) {
      console.warn('WhatsApp client not available, message not sent:', { to, body });
      return { ok: false, reason: 'twilio_not_configured' };
    }

    if (!fromNumber) {
      console.warn('TWILIO_FROM not set; cannot send message');
      return { ok: false, reason: 'missing_from' };
    }

    try {
      const msg = await client.messages.create({
        body,
        from: `whatsapp:${fromNumber}`,
        to: `whatsapp:${to}`
      });
      return { ok: true, sid: msg.sid };
    } catch (err) {
      console.error('Error sending WhatsApp message:', err);
      return { ok: false, reason: err.message };
    }
  }
}

module.exports = WhatsAppService;
