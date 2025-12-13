
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Verification endpoint
app.get('/webhook', (req, res) => {
    const verify_token = process.env.VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token && mode === 'subscribe' && token === verify_token) {
        return res.status(200).send(challenge);
    } else {
        return res.sendStatus(403);
    }
});

// Webhook receiver
app.post('/webhook', async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const messages = changes?.value?.messages;

        if (messages && messages[0]) {
            const msg = messages[0];
            const from = msg.from;

            // AUTO REPLY
            await axios.post(
                `https://graph.facebook.com/v17.0/${process.env.META_WA_PHONE_ID}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "text",
                    text: {
                        body: process.env.AUTO_REPLY_MESSAGE
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.META_WA_TOKEN}`,
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        res.sendStatus(200);
    } catch (err) {
        console.error("Webhook error:", err);
        res.sendStatus(500);
    }
});

const PORT = 3005;
app.listen(PORT, () => console.log("WhatsApp Service running on port", PORT));
