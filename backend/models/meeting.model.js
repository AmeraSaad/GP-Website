const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  transcript: {
    type: String,
    required: true,
  },
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Meeting", MeetingSchema);
