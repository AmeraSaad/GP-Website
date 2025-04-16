// backend/routes/summaryRoutes.js
const express = require("express");
const router = express.Router();
const { generateMinutes} = require("../controllers/minutes.controller");
const multer  = require("multer");
const upload  = multer();

// POST /api/summaries - Generate and save a summary from a transcript
router.post("/",upload.none(), generateMinutes);

module.exports = router;
