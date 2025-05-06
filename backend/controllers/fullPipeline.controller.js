const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const { AssemblyAI } = require('assemblyai');

const app = express();
const port = 3000;

const API_KEY = process.env.ASSEMBLYAI_API_KEY;

const client = new AssemblyAI({
  apiKey: API_KEY,
});

const upload = multer({ dest: 'uploads/' });

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const filePath = req.file.path;

    // 1) upload to AssemblyAI
    const fileStream = fs.createReadStream(filePath);
    const uploadResp = await axios.post(
      'https://api.assemblyai.com/v2/upload',
      fileStream,
      {
        headers: {
          authorization: API_KEY,
          'transfer-encoding': 'chunked',
        },
      }
    );
    const audio_url = uploadResp.data.upload_url;

    // 2) get the transcript
    const transcript = await client.transcripts.create({
      audio_url,
      speaker_labels: true,
    });

    // 3) map into simple objects
    const result = transcript.utterances.map(u => ({
      speaker: u.speaker,
      text: u.text,
    }));
    
    // ←—— HERE’S THE CHANGE ——→
    const textLines = result
      .map(u => `speaker ${u.speaker}: ${u.text}`)
      .join('\n');

    fs.writeFileSync('transcript.txt', textLines, 'utf8');

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="transcript.txt"'
    );
    res.send(textLines);

    // cleanup
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Transcription failed' });
  }
});


app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
