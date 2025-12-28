const express = require('express');
const router = express.Router();
const { getOAuthUrl, storeToken, listAccounts } = require('../controllers/socialController');
const { auth } = require('../middleware/auth');

// Public: give front-end an OAuth URL to redirect user to
router.get('/oauth/:provider', getOAuthUrl);

// Callback POST from OAuth provider (or client) to store tokens
router.post('/connect/:provider', auth, storeToken);

// List connected accounts for current user
router.get('/accounts', auth, listAccounts);

module.exports = router;
