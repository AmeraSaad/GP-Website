
const express = require("express");
const router = express.Router();

// Import the controller
const { runCrewAI } = require("../controllers/crewaiController");

// POST /api/crewai
router.post("/", runCrewAI);

module.exports = router;
