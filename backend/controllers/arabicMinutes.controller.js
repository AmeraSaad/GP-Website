const axios = require("axios");
const Meeting = require("../models/meeting.model");

const generateArabicMinutes = async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ success: false, message: "Meeting transcript is required." });
    }

    // 1. Create a new Meeting document with the transcript
    let meetingDoc = await Meeting.create({ transcript, status: "uploaded" });

    // 2. Call the Arabic minutes endpoint
    const arabicMinutesUrl = process.env.ARABIC_summaryMinutes_URL || "https://a8cd-34-53-23-6.ngrok-free.app";
    const arabicResponse = await axios.post(`${arabicMinutesUrl}/summaryMinutes`, { transcript });
    
    if (!arabicResponse.data || !arabicResponse.data.minutes) {
      return res.status(500).json({ 
        success: false, 
        message: "Invalid response from Arabic minutes service." 
      });
    }
    
    // Extract the minutes from the response
    const { minutes } = arabicResponse.data;
    
    // Update meeting with the minutes and update status to "minuted"
    meetingDoc.minutes = minutes;
    await meetingDoc.save();

    return res.status(201).json({
      success: true,
      data: {
        minutes: minutes
      },
      message: "Arabic minutes generated successfully.",
    });

  } catch (error) {
    console.error("Error generating Arabic minutes:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error generating Arabic minutes",
      error: error.message,
    });
  }
};

module.exports = {
  generateArabicMinutes
}; 