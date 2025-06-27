const axios = require("axios");
const Summary = require("../models/Summary.model");
const Meeting = require("../models/meeting.model");

const generateArabicSummary = async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ success: false, message: "Meeting transcript is required." });
    }

    // 1. Create a new Meeting document with the transcript
    let meetingDoc = await Meeting.create({ transcript, status: "uploaded" });

    // 2. Call the Arabic summarization endpoint
    const arabicSummaryUrl = process.env.ARABIC_summaryMinutes_URL || "https://a8cd-34-53-23-6.ngrok-free.app";
    const arabicResponse = await axios.post(`${arabicSummaryUrl}/Arabic_Summary_Minutes`, { transcript });
    
    if (!arabicResponse.data || !arabicResponse.data.summary) {
      return res.status(500).json({ 
        success: false, 
        message: "Invalid response from Arabic summarization service." 
      });
    }
    
    // Extract the summary and minutes from the response
    const { summary, minutes } = arabicResponse.data;
    
    // 3. Create a new Summary document linked to the meeting
    const newSummary = new Summary({
      meetingRef: meetingDoc._id,
      summaryText: summary,
    });
    await newSummary.save();

    // Update meeting with the summary reference, meeting minutes, and update status to "summarized"
    meetingDoc.summary = newSummary._id;
    meetingDoc.minutes = minutes;
    meetingDoc.status = "summarized";
    await meetingDoc.save();

    return res.status(201).json({
      success: true,
      data: {
        summaryText: summary,
        minutes: minutes
      },
      message: "Arabic summary and minutes generated successfully.",
    });

  } catch (error) {
    console.error("Error generating Arabic summary:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error generating Arabic summary",
      error: error.message,
    });
  }
};

module.exports = {
  generateArabicSummary
}; 