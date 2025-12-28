import express from 'express';
import axios from 'axios';
const router = express.Router();

// Proxy lead scoring to AI service (ai-lead-scorer)
// POST /api/ai/lead-score
router.post('/lead-score', async (req, res) => {
  const payload = req.body;
  const aiUrl = process.env.AI_LEAD_SCORER_URL || 'http://localhost:8000/predict';
  try {
    const r = await axios.post(aiUrl, payload, { headers: { 'Content-Type':'application/json' } });
    return res.json({ ok: true, data: r.data });
  } catch (err) {
    console.error('AI lead-score error:', err.message || err);
    return res.status(502).json({ ok: false, error: 'ai_service_unavailable', detail: err.message });
  }
});

export default router;
