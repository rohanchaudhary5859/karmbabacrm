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
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

router.use(auth);

router.route('/')
  .post(validate(schemas.client), createClient)
  .get(getClients);

router.route('/search')
  .get(searchClients);

router.route('/:id')
  .get(getClient)
  .put(validate(schemas.client), updateClient)
  .delete(deleteClient);

module.exports = router;