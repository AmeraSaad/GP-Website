const axios = require('axios');
const API_KEY = process.env.ASSEMBLYAI_API_KEY;

// Helper to poll transcription status
async function pollTranscription(id) {
  const url = `https://api.assemblyai.com/v2/transcript/${id}`;
  while (true) {
    const resp = await axios.get(url, { headers: { authorization: API_KEY } });
    const { status } = resp.data;
    if (status === 'completed' || status === 'error') {
      return resp.data;
    }
    // wait 3 seconds before polling again
    await new Promise((r) => setTimeout(r, 3000));
  }
}

// Single endpoint: upload, transcribe, poll, return final result
exports.uploadAndTranscribe = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio file provided.' });

    const uploadResp = await axios.post(
      'https://api.assemblyai.com/v2/upload',
      req.file.buffer,
      {
        headers: {
          authorization: API_KEY,
          'Content-Type': 'application/octet-stream'
        }
      }
    );
    const audio_url = uploadResp.data.upload_url;

    const transResp = await axios.post(
      'https://api.assemblyai.com/v2/transcript',
      { audio_url, speaker_labels: true },
      { headers: { authorization: API_KEY, 'Content-Type': 'application/json' } }
    );
    const transcriptId = transResp.data.id;

    const finalResult = await pollTranscription(transcriptId);
    if (finalResult.status === 'error') {
      return res.status(500).json({ error: 'Transcription failed', details: finalResult });
    }

    res.json(finalResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

