const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  uploadAudio,
  transcribeAudio,
  getTranscription
} = require('../controllers/transcriptionController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/transcribe-all', upload.single('audio'), uploadAndTranscribe);

module.exports = router;
