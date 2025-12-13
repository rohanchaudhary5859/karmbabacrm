const express = require('express');
const router = express.Router();
const controller = require('../controllers/performanceController');

// Get supplier metrics
router.get('/supplier/:supplierId', controller.getSupplierMetrics);

// Increment metrics (used by other services when events occur)
router.post('/supplier/:supplierId/increment', controller.incrementMetric);

// Start a boost campaign
router.post('/supplier/:supplierId/boost', controller.startBoost);

// Get boost campaigns
router.get('/supplier/:supplierId/boosts', controller.listBoosts);

module.exports = router;
