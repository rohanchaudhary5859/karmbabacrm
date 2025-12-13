const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Razorpay = require('razorpay');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID || '', key_secret: process.env.RAZORPAY_KEY_SECRET || '' });

// Sample in-memory plans (you should create real Price/Plan objects in Stripe/Razorpay dashboard or via API)
const PLANS = {
  STANDARD: { code: 'STANDARD', name: 'Standard', price: 3999, currency: 'INR' },
  PREMIUM: { code: 'PREMIUM', name: 'Premium', price: 7999, currency: 'INR' },
  ELITE: { code: 'ELITE', name: 'Elite', price: 14999, currency: 'INR' }
};

// Create Stripe Checkout Session
router.post('/create-stripe-session', async (req, res) => {
  try {
    const { tier } = req.body;
    if (!PLANS[tier]) return res.status(400).json({ error: 'Invalid tier' });
    const plan = PLANS[tier];
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [ { price_data: { currency: 'INR', product_data: { name: plan.name }, unit_amount: Math.round(plan.price*100) }, quantity: 1 } ],
      success_url: process.env.FRONTEND_URL + '/subscription-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: process.env.FRONTEND_URL + '/subscription-cancel'
    });
    res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

// Stripe webhook endpoint (raw body required)
router.post('/webhook/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature error', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Stripe checkout completed', session.id);
    // TODO: map session -> supplier and create PaymentTransaction & UserSubscription in DB
  }
  res.json({ received: true });
});

// Create Razorpay order
router.post('/create-razorpay-order', async (req, res) => {
  try {
    const { tier } = req.body;
    if (!PLANS[tier]) return res.status(400).json({ error: 'Invalid tier' });
    const plan = PLANS[tier];
    const options = { amount: Math.round(plan.price*100), currency: 'INR', receipt: 'rcpt_'+Date.now() };
    const order = await razorpay.orders.create(options);
    res.json({ order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server error' });
  }
});

// Razorpay webhook
router.post('/webhook/razorpay', (req, res) => {
  // Razorpay sends JSON body - verify signature server-side using your key secret
  console.log('Razorpay webhook:', req.body);
  // TODO: verify signature and update DB accordingly
  res.json({ received: true });
});

// Get plan list
router.get('/plans', (req, res) => {
  res.json(Object.values(PLANS));
});

module.exports = router;
