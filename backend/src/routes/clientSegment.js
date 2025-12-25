const express = require('express');
const { 
  createSegment, 
  getSegments, 
  getSegment, 
  updateSegment, 
  deleteSegment,
  addClientToSegment,
  removeClientFromSegment
} = require('../controllers/clientSegmentController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.route('/')
  .post(createSegment)
  .get(getSegments);

router.route('/:id')
  .get(getSegment)
  .put(updateSegment)
  .delete(deleteSegment);

router.route('/client/add')
  .post(addClientToSegment);

router.route('/client/remove')
  .post(removeClientFromSegment);

module.exports = router;