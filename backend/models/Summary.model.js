const mongoose = require("mongoose");

const SummarySchema = new mongoose.Schema({
  meetingRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meeting",
    default: null,
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

// module.exports = mongoose.model("Summary", SummarySchema);
module.exports = mongoose.models.Summary || mongoose.model("Summary", SummarySchema);
