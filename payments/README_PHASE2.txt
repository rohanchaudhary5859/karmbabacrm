Phase-2: Payments System (Stripe + Razorpay)
--------------------------------------------
1. Configure backend/.env with STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, FRONTEND_URL, BASE_URL.
2. Start backend: cd backend && npm install && node src/server.js
3. Start frontend: cd frontend && npm install && npm run dev (vite)
4. For Stripe webhooks, expose backend via ngrok and set webhook endpoint to /api/payments/webhook/stripe
5. Implement mapping from session/order to supplier/user in your DB (TODO in webhook handlers).
