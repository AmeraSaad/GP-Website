// backend/controllers/crewaiController.js

const axios = require("axios");
const CrewAIOutput = require("../models/CrewAIOutput.model");
const Summary  = require("../models/Summary.model");


const getFastApiUrl = () => {
  const raw = process.env.FASTAPI_URL || "http://127.0.0.1:8000";
  return raw.replace(/\/+$/, "");
};
// Create a new CrewAI output
const runCrewAI = async (req, res) => {
  try {
    // 1. Extract the meeting summary from request body
    const { meeting_summary } = req.body;
    
    // (Optional) Input validation: check if the summary is empty.
    if (!meeting_summary.trim()) {
      return res.status(400).json({ success: false, message: "Meeting summary is required." });
    }

    const summaryDoc = await Summary.create({
      summaryText: meeting_summary,
    });
    
    // 2. Get FastAPI URL from environment variables
    const fastApiUrl = getFastApiUrl();
    
    // 3. Make POST request to FastAPI to run the CrewAI flow
    const response = await axios.post(`${fastApiUrl}/crewai-flow`, { meeting_summary });
    
    // Extract outputs from the FastAPI response
    const { extracted_requirements, srs_document, uml_diagram } = response.data;   //ui_specifications
    
    // 4. Create a new document using the Mongoose model
    const newOutput = new CrewAIOutput({
      summaryId: summaryDoc._id,
      extracted_requirements,
      srs_document,
      uml_diagram,
      // ui_specifications  
    });
    
    // 5. Save the document to MongoDB
    await newOutput.save();
    
    // 6. Return the FastAPI response along with a success message
    return res.status(200).json({
      success: true,
      data: {
        summary_id: summaryDoc._id,
        crew_flow_id: summaryDoc._id,
        requirements: newOutput.extracted_requirements,
        srs_document: newOutput.srs_document, 
        uml_diagram: newOutput.uml_diagram,
        // ui_specifications: newOutput.ui_specifications,
      },
      message: "Data saved successfully!",
    });
    
  } catch (error) {
    console.error("Error processing CrewAI flow:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error running CrewAI flow",
      error: error.message,
    });
  }
};

// Retrieve all CrewAI outputs
const getAllCrewOutputs = async (req, res) => {
  try {
    const outputs = await CrewAIOutput.find().populate("summaryId");
    return res.status(200).json({ success: true, data: outputs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Retrieve a specific CrewAI output by its ID
const getCrewOutputById = async (req, res) => {
  try {
    const output = await CrewAIOutput.findById(req.params.id).populate("summaryId");
    if (!output) {
      return res.status(404).json({ success: false, message: "CrewAI output not found." });
    }
    return res.status(200).json({ success: true, data: output });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/crewai/req (only extract requirements, no DB)
const runCrewReq = async (req, res) => {
  try {
    const { meeting_summary } = req.body;
    if (!meeting_summary || !meeting_summary.trim()) {
      return res.status(400).json({ success: false, message: "Meeting summary is required." });
    }

    const fastApiUrl = getFastApiUrl();
    const response = await axios.post(`${fastApiUrl}/crewai-req`, { meeting_summary });
    return res.status(200).json({ success: true, data: response.data });

  } catch (error) {
    console.error("[runCrewReq] error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Error extracting requirements", error: error.message });
  }
};

// POST /api/crewai/srs (extract + SRS, no DB)
const runCrewSRS = async (req, res) => {
  try {
    const { meeting_summary } = req.body;
    if (!meeting_summary || !meeting_summary.trim()) {
      return res.status(400).json({ success: false, message: "Meeting summary is required." });
    }

    const fastApiUrl = getFastApiUrl();
    const response = await axios.post(`${fastApiUrl}/crewai-srs`, { meeting_summary });
    return res.status(200).json({
    success: true,
    data: {
      srs_document: response.data.srs_document
    }
})

  } catch (error) {
    console.error("[runCrewSRS] error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Error generating SRS", error: error.message });
  }
};

// POST /api/crewai/uml (extract + UML, no DB)
const runCrewUML = async (req, res) => {
  try {
    const { meeting_summary } = req.body;
    if (!meeting_summary || !meeting_summary.trim()) {
      return res.status(400).json({ success: false, message: "Meeting summary is required." });
    }

    const fastApiUrl = getFastApiUrl();
    const response = await axios.post(`${fastApiUrl}/crewai-uml`, { meeting_summary });
    return res.status(200).json({ success: true, data: response.data });

  } catch (error) {
    console.error("[runCrewUML] error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Error generating UML diagram", error: error.message });
  }
};

module.exports = {
  runCrewAI, 
  getAllCrewOutputs,
  getCrewOutputById,
  runCrewReq,
  runCrewSRS,
  runCrewUML
};
