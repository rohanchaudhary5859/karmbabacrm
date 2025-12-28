const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

class User {
  static async register(userData) {
    const { name, email, password, role } = userData;
    
    // Validate input
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required');
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    // Validate password strength
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'USER'
      }
    });
    
    // Generate token
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async login(email, password) {
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    // Generate token
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async findById(id) {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  static async findByEmail(email) {
    return await prisma.user.findUnique({ where: { email } });
  }

  static async setResetToken(userId, token, expires) {
    return await prisma.user.update({ where: { id: userId }, data: { passwordResetToken: token, passwordResetExpires: expires } });
  }

  static async findByResetToken(token) {
    return await prisma.user.findFirst({ where: { passwordResetToken: token } });
  }

  static async updatePassword(userId, newPassword) {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    return await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword, passwordResetToken: null, passwordResetExpires: null } });
  }
}

module.exports = User;