// Simple examples to call AI services from Node.js
const axios = require('axios');
async function leadScoreExample(){
  const res = await axios.post('http://localhost:8001/predict', { monthly_qty: 5000, price_fit: 0.8, certifications: 2, urgency_days: 10 });
  console.log('Lead score:', res.data);
}
async function replyExample(){
  const res = await axios.post('http://localhost:8002/generate', { buyer_message: 'Need 1000kg rice', product: 'Basmati Rice', tone: 'friendly' });
  console.log('Reply:', res.data);
}
async function productOptExample(){
  const res = await axios.post('http://localhost:8003/suggest', { name:'Sample', moq:50, price_min:100, price_max:105 });
  console.log('Product suggestions:', res.data);
}
(async ()=>{ await leadScoreExample(); await replyExample(); await productOptExample(); })();
