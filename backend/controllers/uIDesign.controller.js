const axios = require("axios");
const UIDesign = require("../models/uIDesign.model");

const createUIDesign = async (req, res) => {
  try {
    const { caption } = req.body;
    
    if (!caption || !caption.trim()) {
      return res.status(400).json({ success: false, message: "Caption is required." });
    }

    const UID_URL = process.env.UID_URL || "https://db49-34-83-124-71.ngrok-free.app";
    const response = await axios.post(`${UID_URL}/generate-ui`, { caption });

    // Validate response structure
    if (!response.data || !response.data.ui_design) {
      return res.status(500).json({ success: false, message: "Invalid response from UI generation service." });
    }

    const ui_design = response.data.ui_design;

    // Create a new UIDesign document with the API output
    const newUIDesign = new UIDesign({
      caption: caption.trim(),
      design_details: ui_design,
    });

    await newUIDesign.save();

      return res.status(201).json({
      success: true,
      data: newUIDesign,
      message: "UI design generated and saved successfully!"
    });

  } catch (error) {
    console.error("Error generating UI design:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error generating UI design",
      error: error.message,
    });
  }
};

const getAllUIDesigns = async (req, res) => {
  try {
    const designs = await UIDesign.find().populate("meetingRef");
    return res.status(200).json({ success: true, data: designs });
  } catch (error) {
    console.error("Error retrieving UI designs:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUIDesignById = async (req, res) => {
  try {
    const design = await UIDesign.findById(req.params.id).populate("meetingRef");
    if (!design) {
      return res.status(404).json({ success: false, message: "UI design not found." });
    }
    return res.status(200).json({ success: true, data: design });
  } catch (error) {
    console.error("Error retrieving UI design:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createUIDesign,
  getAllUIDesigns,
  getUIDesignById,
};
