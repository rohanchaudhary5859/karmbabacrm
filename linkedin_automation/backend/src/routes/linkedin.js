
const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const clientId = process.env.LINKEDIN_CLIENT_ID;
const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

// Step 1: Redirect user to LinkedIn OAuth
router.get('/auth', (req, res) => {
  const url =
    `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=r_liteprofile%20r_emailaddress`;
  res.redirect(url);
});

// Step 2: LinkedIn returns callback with "code"
router.get('/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        }
      }
    );

    const accessToken = tokenRes.data.access_token;
    // Save accessToken to DB (TODO)
    return res.json({ success: true, accessToken });
  } catch (err) {
    console.error("OAuth error", err);
    return res.status(500).json({ error: "OAuth failed" });
  }
});

module.exports = router;
