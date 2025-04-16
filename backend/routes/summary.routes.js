// backend/routes/summaryRoutes.js
const express = require("express");
const router = express.Router();
const { generateSummary, getAllSummaries, getSummaryById } = require("../controllers/summary.controller");
const multer  = require("multer");
const upload  = multer();

// POST /api/summaries - Generate and save a summary from a transcript
router.post("/",upload.none(), generateSummary);

// GET /api/summaries - Retrieve all summaries
router.get("/", getAllSummaries);

// GET /api/summaries/:id - Retrieve a specific summary by ID
router.get("/:id", getSummaryById);

module.exports = router;
