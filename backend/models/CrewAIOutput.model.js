const mongoose = require('mongoose');

const CrewAIOutputSchema = new mongoose.Schema({
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meeting",
    required: false,
    default: null
  },
  summaryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Summary",
    required: true,
  },
  extracted_requirements: {
    type: String,
    default: '',
  },
  srs_document: {
    type: String,
    default: '',
  },
  uml_diagram: {
    type: String,
    default: '',
  }
},
  {
    timestamps: true,
  }
);

// module.exports = mongoose.model('CrewAIOutput', CrewAIOutputSchema);
const CrewAIOutput = mongoose.model('CrewAIOutput', CrewAIOutputSchema);
module.exports = CrewAIOutput;