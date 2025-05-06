const express = require("express");
const { uploadMiddleware, processAudioToOutput } = require("../controllers/fullPipeline.controller");

const router = express.Router();

router.post("/audio", uploadMiddleware, processAudioToOutput);

module.exports = router;
