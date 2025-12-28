const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and password are required' 
      });
    }
    
    const { user, token } = await User.register({ name, email, password, role });
    
    res.status(201).json({ 
      success: true, 
      token, 
      user 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    const { user, token } = await User.login(email, password);
    
    res.json({ 
      success: true, 
      token, 
      user 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json({ 
      success: true, 
      user: userWithoutPassword 
    });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findByEmail(email);
    if (!user) return res.json({ success: true, message: 'If that email exists we sent instructions' });

    const crypto = require('crypto');
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    await User.setResetToken(user.id, token, expires);

    // Send email (placeholder)
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: process.env.EMAIL_PORT || 587,
      auth: process.env.EMAIL_USER ? { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } : undefined
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:4173'}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@karmbaba.com',
      to: user.email,
      subject: 'Password reset instructions',
      text: `Reset your password: ${resetUrl}`
    }).catch(() => {});

    res.json({ success: true, message: 'If that email exists we sent instructions' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ success: false, message: 'Token and new password required' });

    const user = await User.findByResetToken(token);
    if (!user || !user.passwordResetExpires || new Date(user.passwordResetExpires) < new Date()) {
      return res.status(400).json({ success: false, message: 'Token is invalid or expired' });
    }

    await User.updatePassword(user.id, password);
    res.json({ success: true, message: 'Password has been reset' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};