const axios = require("axios");
const Meeting = require("../models/meeting.model");
const Summary = require("../models/summary.model");
const CrewAIOutput = require('../models/crewAIOutput.model');
const UIDesign = require('../models/uIDesign.model');

const processMeeting = async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ success: false, message: "Meeting transcript is required." });
    }

    const newMeeting = new Meeting({
      transcript,
      status: "uploaded", 
    });

    await newMeeting.save();

    
  } catch (error) {
    console.error("Error processing meeting:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error processing meeting",
      error: error.message,
    });
  }
};

module.exports = { processMeeting };