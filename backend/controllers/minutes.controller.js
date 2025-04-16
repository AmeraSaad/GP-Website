const axios = require("axios");
const Summary = require("../models/Summary.model");
const Meeting = require("../models/meeting.model");

const generateMinutes = async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ success: false, message: "Meeting transcript is required." });
    }

    // 1. Create a new Meeting document with the transcript
    let meetingDoc = await Meeting.create({ transcript, status: "uploaded" });

    // 2. Call the summarization endpoint to generate a summary
    const summaryMinutes_URL = process.env.summaryMinutes_URL || "https://805b-34-105-113-234.ngrok-free.app";
    const summaryMinutesResponse  = await axios.post(`${summaryMinutes_URL}/summaryMinutes`, { transcript });
    
    if (!summaryMinutesResponse.data || !summaryMinutesResponse.data.summary) {
      return res.status(500).json({ 
        success: false, 
        message: "Invalid response from summarization service." 
      });
    }
    
    // Extract the summary text and meeting minutes from the response
    const { summary: summaryText, minutes } = summaryMinutesResponse.data;
    
    // 3. Create a new Summary document linked to the meeting
    const newSummary = new Summary({
      meetingRef: meetingDoc._id,
      summaryText: summaryText,
    });
    await newSummary.save();

    // Update meeting with the summary reference, meeting minutes, and update status to "summarized"
    meetingDoc.summary = newSummary._id;
    meetingDoc.minutes = minutes;
    meetingDoc.status = "summarized";
    await meetingDoc.save();

    return res.status(201).json({
      success: true,
      meetingId: meetingDoc._id,
      minutes: meetingDoc.minutes,
      message: "Meeting minutes generated and saved successfully.",
    });

  } catch (error) {
    console.error("Error generating Meeting minutes from transcript:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error running generating Meeting minutes ",
      error: error.message,
    });
  }
};

module.exports = {
  generateMinutes, 
};
