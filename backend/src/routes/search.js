const express = require('express');
const { 
  globalSearch,
  advancedClientSearch
} = require('../controllers/searchController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', globalSearch);
router.get('/clients/advanced', advancedClientSearch);

module.exports = router;