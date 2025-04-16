const express = require("express");
const router = express.Router();
const { processMeeting, getAllMeetings, getMeetingById } = require("../controllers/meeting.controller");
const multer  = require("multer");
const upload  = multer(); 

// POST /api/meetings - Process full pipeline: Transcript.txt → Summary → CrewAI Output
router.post("/", upload.none(), processMeeting);

// POST /api/meetings - Process full pipeline: Transcript → Summary → CrewAI Output
// router.post("/", processMeeting);

// GET /api/meetings - Retrieve all meetings
router.get("/", getAllMeetings);

// GET /api/meetings/:id - Retrieve a specific meeting by its ID
router.get("/:id", getMeetingById);

module.exports = router;
