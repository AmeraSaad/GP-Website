// backend/models/UIDesign.js
const mongoose = require("mongoose");

const UIDesignSchema = new mongoose.Schema(
  {
    meetingRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
      default: null,
    },
    caption: {
      type: String,
      default: "",
    },
    design_details: {
      type: String,
      default: "",
    },
    // design_image: {
      
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UIDesign", UIDesignSchema);
