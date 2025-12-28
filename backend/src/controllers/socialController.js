const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Return placeholder OAuth URLs (front-end should redirect users here)
exports.getOAuthUrl = async (req, res) => {
  const { provider } = req.params;
  // In production, build real OAuth URLs with client_id & redirect_uri
  const url = `https://example.com/oauth/${provider}?client_id=REPLACE_ME`;
  res.json({ success: true, url });
};

// Store tokens returned by OAuth providers (simple upsert)
exports.storeToken = async (req, res) => {
  try {
    const { provider } = req.params;
    const { providerId, accessToken, refreshToken } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

    const social = await prisma.socialAccount.upsert({
      where: {
        // unique constraint may not exist; use composite-like approach
        // fallback: try to find existing first
        id: providerId || undefined
      },
      update: {
        accessToken,
        refreshToken,
        providerId
      },
      create: {
        provider,
        providerId,
        accessToken,
        refreshToken,
        userId
      }
    });

    res.json({ success: true, social });
  } catch (err) {
    console.error('Store token error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// List connected social accounts for the current user
exports.listAccounts = async (req, res) => {
  try {
    const userId = req.user.id;
    const accounts = await prisma.socialAccount.findMany({ where: { userId } });
    res.json({ success: true, accounts });
  } catch (err) {
    console.error('List social accounts error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
