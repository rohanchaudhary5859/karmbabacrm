const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

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

// Import jobs
require('./src/jobs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});