const express = require('express');
const { 
  createInteraction, 
  getInteractions, 
  getInteraction, 
  getClientInteractions,
  updateInteraction, 
  deleteInteraction
} = require('../controllers/interactionController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.route('/')
  .post(createInteraction)
  .get(getInteractions);

router.route('/client/:clientId')
  .get(getClientInteractions);

router.route('/:id')
  .get(getInteraction)
  .put(updateInteraction)
  .delete(deleteInteraction);

module.exports = router;