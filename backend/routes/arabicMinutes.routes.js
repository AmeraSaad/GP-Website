const express = require("express");
const router = express.Router();
const { generateArabicMinutes } = require("../controllers/arabicMinutes.controller");
const multer = require("multer");
const upload = multer();

// POST /api/arabic-minutes - Generate and save Arabic minutes from a transcript
router.post("/", upload.none(), generateArabicMinutes);

module.exports = router; 