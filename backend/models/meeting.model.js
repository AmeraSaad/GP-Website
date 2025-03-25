const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  transcript: {
    type: String,
    required: true,
    default: null,
  },
  summary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Summary",
    default: null,
  },
  crewai_output:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "CrewAIOutput",
    default: null,
  },
  uiDesign: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "UIDesign",
    default: null,
  },
  // To track the current stage of processing (e.g., 'uploaded', 'summarized', 'processed', 'ui_generated')
  status: {
    type: String,
    default: 'uploaded',
    enum: ['uploaded', 'summarized', 'processed', 'ui_generated'] 
  },
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Meeting", MeetingSchema);
