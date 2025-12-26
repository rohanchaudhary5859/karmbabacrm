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