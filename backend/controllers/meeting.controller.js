const axios = require("axios");
const Meeting = require("../models/meeting.model");
const Summary = require("../models/summary.model");
const CrewAIOutput = require('../models/CrewAIOutput.model');
const UIDesign = require('../models/uIDesign.model');

const processMeeting = async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ success: false, message: "Meeting transcript is required." });
    }

    // 1. Create a new Meeting document with the transcript
    let meetingDoc = await Meeting.create({ transcript, status: "uploaded" });

    // 2. Call the summarization endpoint to generate a summary
    const summaryMinutes_URL = process.env.summaryMinutes_URL || "https://68e5-34-80-104-144.ngrok-free.app";
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

     // 4. Call the CrewAI endpoint using the generated summary text
    const fastApiUrl = process.env.FAST_API_URL || "http://127.0.0.1:8000";
    const crewAIResponse = await axios.post(`${fastApiUrl}/crewai-flow`, { meeting_summary: summaryText });
    if (!crewAIResponse.data) {
      return res.status(500).json({
        success: false,
        message: "Invalid response from CrewAI service."
      });
    }
    
    const { extracted_requirements, srs_document, uml_diagram, ui_specifications} = crewAIResponse.data;
    
    // 5. Create a new CrewAIOutput document linked to the summary
    const crewAIOutputDoc = new CrewAIOutput({
      summaryId: newSummary._id,
      extracted_requirements,
      srs_document,
      uml_diagram,
      ui_specifications,
    });
    await crewAIOutputDoc.save();
    
    // Update meeting with the CrewAIOutput reference and status "processed"
    meetingDoc.crewai_output = crewAIOutputDoc._id;
    meetingDoc.status = "processed";
    await meetingDoc.save();

    const result = {
      meetingId: meetingDoc._id,
      summaryId: newSummary._id,
      transcript: meetingDoc.transcript,
      summaryText: newSummary.summaryText,
      minutes: meetingDoc.minutes,
      extracted_requirements: crewAIOutputDoc.extracted_requirements,
      srs_document: crewAIOutputDoc.srs_document,
      uml_diagram: crewAIOutputDoc.uml_diagram,
      ui_specifications: crewAIOutputDoc.ui_specifications
    };
    
    // Return the in-memory objects without re-querying the database
    return res.status(200).json({
      success: true,
      data: result,
      message: "Full meeting pipeline processed successfully."
    });
    
  } catch (error) {
    console.error("Error processing full meeting pipeline:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error processing full meeting pipeline",
      error: error.message,
    });
  }
};

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
  processMeeting,
  getAllMeetings,
  getMeetingById
};