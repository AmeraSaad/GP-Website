const fs = require("fs");
require("dotenv").config();
const axios = require("axios");
const multer = require("multer");
const { AssemblyAI } = require("assemblyai");
const { processPipeline } = require("../services/pipeline.service");

const upload = multer({ dest: "uploads/" });

const API_KEY = process.env.ASSEMBLYAI_API_KEY;

/**
 * Full meeting pipeline starting from audio
 * @route POST /api/full-pipeline/audio
 */
const processAudioToOutput = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Audio file is required." });
    }

    if (!API_KEY) {
      throw new Error("AssemblyAI API key is missing in environment variables.");
    }

    const filePath = req.file.path;
    const fileStream = fs.createReadStream(filePath);

    // 1. Upload file to AssemblyAI
    const uploadResp = await axios.post("https://api.assemblyai.com/v2/upload", fileStream, {
      headers: {
        authorization: API_KEY,
        "transfer-encoding": "chunked",
      },
    });
    const audioUrl = uploadResp.data.upload_url;

    // 2. Request transcription with speaker labels
    const client = new AssemblyAI({ apiKey: API_KEY });
    const transcriptJob = await client.transcripts.create({
      audio_url: audioUrl,
      speaker_labels: true,
    });

    // 3. Poll for completion
    let transcriptData;
    while (true) {
      transcriptData = await client.transcripts.get(transcriptJob.id);
      if (transcriptData.status === "completed") break;
      if (transcriptData.status === "error") {
        throw new Error(`Transcription error: ${transcriptData.error}`);
      }
      await new Promise((r) => setTimeout(r, 3000));
    }

    // 4. Format speaker-annotated transcript
    const transcriptText = transcriptData.utterances
      .map((u) => `Speaker ${u.speaker}: ${u.text}`)
      .join("\n");

    // 5. Call your pipeline
    const result = await processPipeline(transcriptText);

    // Cleanup
    fs.unlinkSync(filePath);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error in full audio pipeline:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadMiddleware: upload.single("audio"),
  processAudioToOutput,
};