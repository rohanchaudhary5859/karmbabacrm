const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./src/routes/auth');
const clientRoutes = require('./src/routes/client');
const interactionRoutes = require('./src/routes/interaction');
const taskRoutes = require('./src/routes/task');
const clientSegmentRoutes = require('./src/routes/clientSegment');
const reportRoutes = require('./src/routes/report');
const emailRoutes = require('./src/routes/email');
const documentRoutes = require('./src/routes/document');
const searchRoutes = require('./src/routes/search');
const socialRoutes = require('./src/routes/social');
const whatsappRoutes = require('./src/routes/whatsapp');

// Import middleware
const { auth } = require('./src/middleware/auth');

// Import jobs
require('./src/jobs');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Global auth middleware - skip for auth routes and health
app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/auth') || req.path === '/health') {
    return next();
  }
  return auth(req, res, next);
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Karm Baba CRM API' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/segments', clientSegmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export app for testing
module.exports = app;

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});