const express = require('express');
const { 
  createClient, 
  getClients, 
  getClient, 
  updateClient, 
  deleteClient,
  searchClients
} = require('../controllers/clientController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.route('/')
  .post(createClient)
  .get(getClients);

router.route('/search')
  .get(searchClients);

router.route('/:id')
  .get(getClient)
  .put(updateClient)
  .delete(deleteClient);

module.exports = router;