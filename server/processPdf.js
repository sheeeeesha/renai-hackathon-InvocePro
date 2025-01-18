// processPdf.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function processPdfWithWorqHat(pdfPath) {
  const apiUrl = process.env.WORQHAT_API_URL || 'https://api.worqhat.com/api/ai/v2/pdf-extract';  // Add your WorqHat API URL
  const apiKey = process.env.WORQHAT_API_KEY;  // Add your WorqHat API Key
  console.log('api url:', apiUrl);
  console.log('api key:', apiKey);
  const pdfData = fs.createReadStream(pdfPath);

  try {
    const response = await axios.post(
      apiUrl,
      { file: pdfData },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('Processed Data:', response.data);
    // Handle processed data (e.g., save to Firestore, generate Excel, etc.)
  } catch (error) {
    console.error('Error processing PDF with WorqHat:', error.message);
  }
}

module.exports = { processPdfWithWorqHat };
 