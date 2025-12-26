const express = require('express');
const { 
  upload,
  uploadDocument,
  getClientDocuments,
  deleteDocument,
  downloadDocument
} = require('../controllers/documentController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/upload', upload, uploadDocument);
router.get('/client/:clientId', getClientDocuments);
router.delete('/:id', deleteDocument);
router.get('/:id/download', downloadDocument);

module.exports = router;