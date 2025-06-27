const axios = require("axios");
const Meeting = require("../models/meeting.model");
const Summary = require("../models/Summary.model");
const CrewAIOutput = require('../models/CrewAIOutput.model');
const UIDesign = require('../models/uIDesign.model');

const { processPipeline  } = require("../services/pipeline.service");

async function processTranscript(req, res) {
  try {
    const { transcript } = req.body;
    if (!transcript?.trim()) {
      return res.status(400)
                .json({ success: false, message: "Meeting transcript is required." });
    }

    const data = await processPipeline (transcript);
    return res.status(200).json({ success: true, data, message: "Processed successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

// Retrieve all meetings with populated references
const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate("summary")
      .populate("crewai_output")
      .populate("uiDesign");
    return res.status(200).json({
      success: true,
      data: meetings,
    });
  } catch (error) {
    console.error("Error retrieving meetings:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error retrieving meetings",
      error: error.message,
    });
  }
};

// Retrieve a specific meeting by ID with populated references
const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("summary")
      .populate("crewai_output")
      .populate("uiDesign");
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: meeting,
    });
  } catch (error) {
    console.error("Error retrieving meeting:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error retrieving meeting",
      error: error.message,
    });
  }
};

module.exports = { 
  processTranscript,
  getAllMeetings,
  getMeetingById
};