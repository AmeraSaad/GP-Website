// backend/controllers/crewaiController.js

const axios = require("axios");
const CrewAIOutput = require("../models/CrewAIOutput.model");
const Summary  = require("../models/Summary.model");

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
    const fastApiUrl = process.env.FASTAPI_URL || "http://127.0.0.1:8000";
    
    // 3. Make POST request to FastAPI to run the CrewAI flow
    const response = await axios.post(`${fastApiUrl}/crewai-flow`, { meeting_summary });
    
    // Extract outputs from the FastAPI response
    const { extracted_requirements, srs_document, uml_diagram } = response.data;
    
    // 4. Create a new document using the Mongoose model
    const newOutput = new CrewAIOutput({
      summaryId: summaryDoc._id,
      extracted_requirements,
      srs_document,
      uml_diagram,
    });
    
    // 5. Save the document to MongoDB
    await newOutput.save();
    
    // 6. Return the FastAPI response along with a success message
    return res.status(200).json({
      success: true,
      data: {
        summary: summaryDoc,
        crewAIOutput: newOutput,
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

module.exports = { runCrewAI };
