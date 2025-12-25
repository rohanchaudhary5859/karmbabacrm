const express = require('express');
const { 
  getClientReport,
  getInteractionReport,
  getTaskReport
} = require('../controllers/reportController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/clients', getClientReport);
router.get('/interactions', getInteractionReport);
router.get('/tasks', getTaskReport);

module.exports = router;