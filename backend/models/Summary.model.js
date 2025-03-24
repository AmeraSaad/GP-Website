const mongoose = require("mongoose");

const SummarySchema = new mongoose.Schema({
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meeting",
    required: false,
    default: null
  },
  summaryText: {
    type: String,
    required: true,
  }
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Summary", SummarySchema);
