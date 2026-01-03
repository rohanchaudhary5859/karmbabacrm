const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Karm Baba CRM API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API Route Working ✔' });
});

// Simple client routes for testing
let clients = [
  { id: '1', name: 'Pizza Palace', email: 'owner@pizzapalace.com' },
  { id: '2', name: 'Sushi Central', email: 'hello@sushicentral.com' },
  { id: '3', name: 'Burger Barn', email: 'contact@burgerbarn.com' }
];

app.get('/api/clients', (req, res) => {
  res.json({ success: true, clients });
});

app.get('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ success: false, message: 'Client not found' });
  }
  res.json({ success: true, client });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});