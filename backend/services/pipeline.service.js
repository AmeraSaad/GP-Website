const axios = require("axios");
const Meeting = require("../models/meeting.model");
const Summary = require("../models/Summary.model");
const CrewAIOutput = require("../models/CrewAIOutput.model");

/**
 * Shared function to process full pipeline starting from transcript
 */
async function processPipeline(transcript) {
  // 1. Create meeting doc
  let meetingDoc = await Meeting.create({ transcript, status: "uploaded" });

  // 2. Summarization API
  const summaryURL = process.env.summaryMinutes_URL || "https://34a5-34-80-93-140.ngrok-free.app";
  const summaryResp = await axios.post(`${summaryURL}/summaryMinutes`, { transcript });

  if (!summaryResp.data || !summaryResp.data.summary) {
    throw new Error("Invalid response from summarization service.");
  }

  const { summary: summaryText, minutes } = summaryResp.data;

  // 3. Save summary
  const summaryDoc = await Summary.create({
    meetingRef: meetingDoc._id,
    summaryText,
  });

  // 4. Update meeting with summary
  meetingDoc.summary = summaryDoc._id;
  meetingDoc.minutes = minutes;
  meetingDoc.status = "summarized";
  await meetingDoc.save();

  // 5. Call CrewAI
  const crewAIURL = process.env.FAST_API_URL || "http://127.0.0.1:8000";
  const crewResp = await axios.post(`${crewAIURL}/crewai-flow`, {
    meeting_summary: summaryText,
  });

  const { extracted_requirements, srs_document, uml_diagram } = crewResp.data;

  // 6. Save CrewAI output
  const crewDoc = await CrewAIOutput.create({
    summaryId: summaryDoc._id,
    extracted_requirements,
    srs_document,
    uml_diagram,
  });

  // 7. Final meeting update
  meetingDoc.crewai_output = crewDoc._id;
  meetingDoc.status = "processed";
  await meetingDoc.save();

  return {
    meetingId: meetingDoc._id,
    summaryId: summaryDoc._id,
    transcript: meetingDoc.transcript,
    summaryText: summaryDoc.summaryText,
    minutes: meetingDoc.minutes,
    extracted_requirements,
    srs_document,
    uml_diagram,
  };
}

module.exports = { processPipeline };
