const fs = require('fs');
const path = require('path');
const axios = require('axios');

// POST /api/ui/generate-ui
// Receives { caption }, calls FastAPI (ngrok URL) to get UI PNG, saves it locally
async function generateUIImage(req, res, next) {
  try {
    const { caption } = req.body;
    // Call your FastAPI endpoint via public URL
    const response = await axios.post(
      'https://1708-34-80-17-31.ngrok-free.app/generate-ui',
      { caption },
      { responseType: 'arraybuffer' }
    );

    // Ensure outputs directory exists
    const outputsDir = path.join(__dirname, '../output');
    if (!fs.existsSync(outputsDir)) {
      fs.mkdirSync(outputsDir);
    }

    // Write file with timestamp
    const filename = `ui_${Date.now()}.png`;
    const filePath = path.join(outputsDir, filename);
    fs.writeFileSync(filePath, response.data);

    // Return path to saved file
    res.json({ message: 'Image generated and saved', path: `/output/${filename}` });
  } catch (error) {
    next(error);
  }
}

module.exports = { generateUIImage };