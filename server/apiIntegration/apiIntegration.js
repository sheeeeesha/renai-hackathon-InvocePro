// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');
// require('dotenv').config(); // Load environment variables

// async function processPdfWithWorqHat(apiUrl, apiKey, pdfPath) {
//   const pdfData = fs.createReadStream(pdfPath);

//   try {
//     const response = await axios.post(
//       apiUrl,
//       { file: pdfData },
//       {
//         headers: {
//           'Authorization': `Bearer ${apiKey}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       }
//     );
//     return response.data; // Assuming the API returns structured data
//   } catch (error) {
//     console.error('Error processing PDF:', error.response?.data || error.message);
//   }
// }

// (async () => {
//   const downloadsDir = path.join(__dirname, 'downloads');
//   const apiUrl = 'https://api.worqhat.com/api/ai/v2/pdf-extract'; // Replace with actual endpoint
//   const apiKey = process.env.WORQHAT_API_KEY; // Get API key from .env file

//   if (!apiKey) {
//     console.error('WORQHAT_API_KEY is not defined in .env file.');
//     return;
//   }

//   const files = fs.readdirSync(downloadsDir);
//   for (const file of files) {
//     if (file.endsWith('.pdf')) {
//       const pdfPath = path.join(downloadsDir, file);
//       const result = await processPdfWithWorqHat(apiUrl, apiKey, pdfPath);
//       console.log('Processed Data:', result);
//       // Save or process the result as needed (e.g., store in a database)
//     }
//   }
// })();
