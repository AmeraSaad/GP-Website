const express = require('express');
const { generateUIImage } = require('../controllers/uiImg.controller');
const router = express.Router();

// Route to generate and save UI image
router.post('/generate-ui', generateUIImage);

module.exports = router;