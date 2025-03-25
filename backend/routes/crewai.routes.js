
const express = require("express");
const router = express.Router();

// Import the controller
const { runCrewAI, getAllCrewOutputs, getCrewOutputById } = require("../controllers/crewai.controller");

// POST /api/crewai - create a new CrewAI output based on a summary input
router.post("/", runCrewAI);

// GET /api/crewai - retrieve all CrewAI output documents
router.get("/", getAllCrewOutputs);

// GET /api/crewai/:id - retrieve a specific CrewAI output by its ID
router.get("/:id", getCrewOutputById);

module.exports = router;
