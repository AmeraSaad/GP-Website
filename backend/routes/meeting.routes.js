const express = require("express");
const router = express.Router();
const { createMeeting, getAllMeetings, getMeetingById } = require("../controllers/meeting.controller");

// POST /api/meetings - Process full pipeline: Transcript → Summary → CrewAI Output
router.post("/", createMeeting);

// GET /api/meetings - Retrieve all meetings
router.get("/", getAllMeetings);

// GET /api/meetings/:id - Retrieve a specific meeting by its ID
router.get("/:id", getMeetingById);

module.exports = router;
