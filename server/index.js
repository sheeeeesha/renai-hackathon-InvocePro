// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const userRoutes = require('./routes/user');
// const { initializeApp } = require('firebase-admin/app');
// const { getFirestore } = require('firebase-admin/firestore');
// const serviceAccount = require('./config/serviceAccountKey.json');

// // Initialize Firebase Admin SDK
// initializeApp({
//   credential: require('firebase-admin').credential.cert(serviceAccount),
// });

// const db = getFirestore();

// // Create an Express app
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Routes
// app.use('/api/user', userRoutes);

// // Health Check Route
// app.get('/', (req, res) => {
//   res.send('Server is running!');
// });

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send({ error: 'Something went wrong!' });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { google } = require('googleapis');
// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');
// const userRoutes = require('./routes/user');
// const { initializeApp } = require('firebase-admin/app');
// const { getFirestore } = require('firebase-admin/firestore');
// const serviceAccount = require("./config/serviceAccountKey.json");
// require('dotenv').config();

// // Initialize Firebase Admin SDK
// initializeApp({
//   credential: require('firebase-admin').credential.cert(serviceAccount),
// });

// const db = getFirestore();

// // Create an Express app
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Routes
// app.use('/api/user', userRoutes);

// // Health Check Route
// app.get('/', (req, res) => {
//   res.send('Server is running!');
// });

// // Gmail Integration to Fetch PDFs
// async function fetchEmailsAndProcessPdfs() {
//   const auth = new google.auth.GoogleAuth({
//     keyFile: './email/credentials.json',
//     scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
//   });

//   const gmail = google.gmail({ version: 'v1', auth });
//   const user = 'me';
//   const query = 'has:attachment filename:pdf'; // Query to fetch emails with PDF attachments

//   try {
//     const messagesResponse = await gmail.users.messages.list({ userId: user, q: query });
//     const messages = messagesResponse.data.messages || [];

//     for (const message of messages) {
//       const messageId = message.id;
//       const email = await gmail.users.messages.get({ userId: user, id: messageId });
//       const parts = email.data.payload.parts || [];

//       for (const part of parts) {
//         if (part.filename && part.filename.endsWith('.pdf')) {
//           const attachmentId = part.body.attachmentId;
//           const attachment = await gmail.users.messages.attachments.get({
//             userId: user,
//             messageId: messageId,
//             id: attachmentId,
//           });

//           const pdfData = attachment.data.data;
//           const buffer = Buffer.from(pdfData, 'base64');
//           const downloadsDir = path.join(__dirname, 'downloads');
//           if (!fs.existsSync(downloadsDir)) {
//             fs.mkdirSync(downloadsDir);
//           }

//           const pdfPath = path.join(downloadsDir, part.filename);
//           fs.writeFileSync(pdfPath, buffer);
//           console.log(`Saved PDF: ${part.filename}`);

//           // Process the PDF with WorqHat API
//           await processPdfWithWorqHat(pdfPath);
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error fetching emails or processing PDFs:', error.message);
//   }
// }

// // WorqHat API Integration
// async function processPdfWithWorqHat(pdfPath) {
//   const apiUrl = process.env.WORQHAT_API_URL || 'https://api.worqhat.com/api/ai/v2/pdf-extract';
//   const apiKey = process.env.WORQHAT_API_KEY;

//   if (!apiKey) {
//     console.error('WORQHAT_API_KEY is not defined in .env file.');
//     return;
//   }

//   const pdfData = fs.createReadStream(pdfPath);

//   try {
//     const response = await axios.post(
//       apiUrl,
//       { file: pdfData },
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       }
//     );
//     console.log('Processed Data:', response.data);
//     // You can save this data to Firestore or handle it as needed
//   } catch (error) {
//     console.error('Error processing PDF with WorqHat:', error.response?.data || error.message);
//   }
// }

// // Endpoint to Trigger Gmail PDF Processing
// app.post('/api/process-emails', async (req, res) => {
//   try {
//     await fetchEmailsAndProcessPdfs();
//     res.status(200).send({ message: 'Emails fetched and PDFs processed successfully.' });
//   } catch (error) {
//     console.error('Error in /api/process-emails:', error.message);
//     res.status(500).send({ error: 'Failed to process emails.' });
//   }
// });

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send({ error: 'Something went wrong!' });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const gmailAuth = require('./email/gmailAuth'); // Import Gmail auth module
const { processPdfWithWorqHat } = require('./processPdf'); // Assuming processPdfWithWorqHat exists
// const { createExcel } = require('./generateExcel'); // Assuming createExcel exists
const { processExtractedTextWithWorqHat } = require('./processExtractedText');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start OAuth 2.0 authentication flow
app.get('/auth', (req, res) => {
  const authUrl = gmailAuth.generateAuthUrl(); // Redirect user to Google OAuth consent screen
  res.redirect(authUrl);
});

// OAuth callback route to handle the response and save the token
app.get('/oauth2callback', (req, res) => {
  const code = req.query.code; // Capture the code from the URL query parameter
  
  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  gmailAuth.getToken(code, (err, token) => {
    if (err) {
      return res.status(500).send('Error retrieving access token: ' + err.message);
    }

    // Save the token to a file or session for future use
    fs.writeFileSync('token.json', JSON.stringify(token));

    // Send response
    res.send('Authentication successful! You can now use the app.');
  });
});

// API route to fetch emails (after authentication)
app.get('/fetch-emails', async (req, res) => {
  const { gmailAddress, startDate, endDate, keyword } = req.query;

  // Validate input
  if (!gmailAddress || !startDate || !endDate || !keyword) {
    return res.status(400).send('Please provide gmailAddress, startDate, endDate, and keyword.');
  }

  try {
    const savedFiles = await gmailAuth.fetchEmails(gmailAddress, startDate, endDate, keyword);
    res.json({ message: 'Emails fetched and PDFs saved.', savedFiles });
  } catch (err) {
    res.status(500).send('Error fetching emails: ' + err.message);
  }
});


// API route to start processing the PDFs and create Excel


app.get('/start-process', async (req, res) => {
  try {
    // Define the downloads directory
    const downloadsDir = path.join(__dirname, 'email', 'downloads');

    // Read all files from the downloads directory
    const savedFiles = fs.readdirSync(downloadsDir).map(file => path.join(downloadsDir, file));

    console.log('Saved PDF file paths:', savedFiles);

    const structuredData = [];

    // Process each file
    for (const filePath of savedFiles) {
      console.log('Processing file:', filePath);

      // Process the PDF with WorqHat to extract text
      const extractedText = await processPdfWithWorqHat(filePath);
      // console.log("Extracted Text:", extractedText);
      if (extractedText) {
        // console.log("Extracted Text:", extractedText);
        // Process the extracted text to generate structured data
        const table = await processExtractedTextWithWorqHat(extractedText.data);
        console.log("Processed response from WorqHat API:");
        console.log(JSON.stringify(table, null, 2)); // Pretty-print the response

        // Append the table (structured data) to the main array
        structuredData.push(table);
      }
    }

    // // Generate a CSV file from the structured data
    // const outputFilePath = path.join(__dirname, 'output', 'data.csv');
    // createCsvFromStructuredData(structuredData, outputFilePath);

    // res.send('Process completed successfully. CSV file created.');
  } catch (err) {
    console.error('Error during process:', err.message);
    res.status(500).send('Error during process: ' + err.message);
  }
});

// CSV generation function
function createCsvFromStructuredData(data, outputFilePath) {
  const headers = Object.keys(data[0]).join(','); // CSV headers from the first object
  const rows = data.map(row => Object.values(row).join(',')); // CSV rows

  const csvContent = [headers, ...rows].join('\n'); // Combine headers and rows
  fs.writeFileSync(outputFilePath, csvContent, 'utf8');
  console.log(`CSV file created at: ${outputFilePath}`);
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 