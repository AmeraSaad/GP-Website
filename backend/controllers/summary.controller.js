const axios = require("axios");
const Summary = require("../models/summary.model");
const Meeting = require("../models/meeting.model");

const generateSummary = async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Transcript is required.' 
      });
    }

    const fastApiUrl = process.env.FAST_API_URL || "http://127.0.0.1:8000";
    const response = await axios.post(`${fastApiUrl}/summarize`, { transcript });

     // Validate the response (assuming the API returns { summary: "..." })
    if (!response.data || !response.data.summary) {
      return res.status(500).json({ 
        success: false, 
        message: "Invalid response from summarization service." 
      });
    }

    const summaryText = response.data.summary;

    const meetingDoc = await Meeting.create({ transcript });

    const newSummary = new Summary({
      meetingRef: meetingDoc._id,
      summaryText: summaryText,
    });

    await newSummary.save();

    return res.status(201).json({
      success: true,
      data: newSummary,
      message: "Summary generated and saved successfully.",
    });

  } catch (error) {
    console.error("Error generating summary from transcript:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error running generating summary ",
      error: error.message,
    });
  }
};

const getAllSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find().populate("meetingRef");
    return res.status(200).json({ success: true, data: summaries });
  } catch (error) {
    console.error("Error retrieving summaries:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getSummaryById = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id).populate("meetingRef");
    if (!summary) {
      return res.status(404).json({ success: false, message: "Summary not found." });
    }
    return res.status(200).json({ success: true, data: summary });
  } catch (error) {
    console.error("Error retrieving summary:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateSummary, 
  getAllSummaries,
  getSummaryById,
};
