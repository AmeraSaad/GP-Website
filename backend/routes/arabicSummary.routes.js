const express = require("express");
const router = express.Router();
const { generateArabicSummary } = require("../controllers/arabicSummary.controller");
const multer = require("multer");
const upload = multer();

// POST /api/arabic-summaries - Generate and save an Arabic summary from a transcript
router.post("/", upload.none(), generateArabicSummary);

module.exports = router; 