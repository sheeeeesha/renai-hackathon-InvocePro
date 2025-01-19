// processPdf.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function processPdfWithWorqHat(pdfPath) {
  const apiUrl = process.env.WORQHAT_API_URL || 'https://api.worqhat.com/api/ai/v2/pdf-extract';  // Add your WorqHat API URL
  const apiKey = process.env.WORQHAT_API_KEY;  // Add your WorqHat API Key

  if (!apiKey) {
    console.error('WORQHAT_API_KEY is not defined in .env file.');
    return null;
  }

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
    return response.data;

  } catch (error) {
    console.error('Error processing PDF with WorqHat:', error.response?.data || error.message);
    return null;
  }
}

module.exports = { processPdfWithWorqHat };

 

// const axios = require('axios');
// const fs = require('fs');
// const path = require('path');
// const FormData = require('form-data'); // Import the FormData library
// require('dotenv').config();

// async function processPdfWithWorqHat(pdfPath) {
//   const apiUrl = process.env.WORQHAT_API_URL || 'https://api.worqhat.com/api/ai/v2/pdf-extract';  // Ensure you have the correct API URL
//   const apiKey = process.env.WORQHAT_API_KEY;  // Ensure the API key is set in environment variables

//   if (!apiKey) {
//     console.error('API key is missing');
//     return;
//   }

//   const pdfFile = fs.createReadStream(pdfPath); // Read the PDF file

//   try {
//     const form = new FormData();
//     form.append('file', pdfFile); // Append the file to the form-data

//     // Set up the headers for the POST request, including form-data headers and the API authorization
//     const headers = {
//       ...form.getHeaders(), // Automatically adds 'Content-Type' for multipart form-data
//       Authorization: `Bearer ${apiKey}`,
//     };

//     // Make the POST request to the WorqHat API with the file
//     const response = await axios.post(apiUrl, form, { headers });

//     console.log('Processed Data:', response.data);
//     return response.data.text; // You can return the response or process it further

//   } catch (error) {
//     console.error('Error processing PDF with WorqHat:', error.message);
//   }
// }

// module.exports = { processPdfWithWorqHat };
