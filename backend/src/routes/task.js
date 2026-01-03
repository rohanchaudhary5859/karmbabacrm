const express = require('express');
const { 
  createTask, 
  getTasks, 
  getTask, 
  updateTask, 
  deleteTask
} = require('../controllers/taskController');
const { auth } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

router.use(auth);

router.route('/')
  .post(validate(schemas.task), createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTask)
  .put(validate(schemas.task), updateTask)
  .delete(deleteTask);

module.exports = router;