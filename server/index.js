//server/index.js
const cors = require('cors');
// const userRoutes = require('./routes/user');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./config/serviceAccountKey.json');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const gmailAuth = require('./email/gmailAuth'); // Import Gmail auth module
const { processPdfWithWorqHat } = require('./processPdf'); // Assuming processPdfWithWorqHat exists
const { processExtractedTextWithWorqHat } = require('./processExtractedText');
const userRoutes = require('./routes/userRoutes');

// Initialize Firebase Admin SDK
initializeApp({
  credential: require('firebase-admin').credential.cert(serviceAccount),
});

const db = getFirestore();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/user', userRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

app.use(cors({
  origin: 'http://localhost:3000', // or '*' to allow all origins
  methods: ['GET', 'POST'],
}));
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

    // Redirect to the home page
    res.redirect('http://localhost:3000/home'); // Adjust to your Next.js home page URL
  });
});

// API route to fetch emails (after authentication)
app.get('/fetch-emails', async (req, res) => {
  let { gmailAddress, startDate, endDate, keyword } = req.query; // Change const to let

  // Decode the gmailAddress if needed
  gmailAddress = decodeURIComponent(gmailAddress); // This is fine now because it's a let

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


// app.get('/start-process', async (req, res) => {
//   try {
//     // Define the downloads directory
//     const downloadsDir = path.join(__dirname, 'email', 'downloads');

//     // Read all files from the downloads directory
//     const savedFiles = fs.readdirSync(downloadsDir).map(file => path.join(downloadsDir, file));

//     console.log('Saved PDF file paths:', savedFiles);

//     const structuredData = [];

//     // Process each file
//     for (const filePath of savedFiles) {
//       console.log('Processing file:', filePath);

//       // Process the PDF with WorqHat to extract text
//       const extractedText = await processPdfWithWorqHat(filePath);
//       // console.log("Extracted Text:", extractedText);
//       if (extractedText) {
//         // console.log("Extracted Text:", extractedText);
//         // Process the extracted text to generate structured data
//         const table = await processExtractedTextWithWorqHat(extractedText.data);
//         console.log("Processed response from WorqHat API:");
//         console.log(JSON.stringify(table, null, 2)); // Pretty-print the response

//         // Append the table (structured data) to the main array
//         structuredData.push(table);
//       }
//     }

   
//   } catch (err) {
//     console.error('Error during process:', err.message);
//     res.status(500).send('Error during process: ' + err.message);
//   }
// });

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

      if (extractedText) {
        console.log("Extracted Text:", extractedText);

        // Process the extracted text to generate structured data
        const table = await processExtractedTextWithWorqHat(extractedText.data);
        console.log("Processed response from WorqHat API:");
        console.log(JSON.stringify(table, null, 2)); // Pretty-print the response

        // Append the table (structured data) to the main array
        structuredData.push({
          filePath,
          table,
        });
      }
    }

    // Check if structured data is available
    if (structuredData.length > 0) {
      console.log("Process completed successfully. Structured data:", structuredData);
      res.status(200).json({
        success: true,
        message: "Process completed successfully.",
        data: structuredData,
      });
    } else {
      console.log("No structured data generated.");
      res.status(200).json({
        success: false,
        message: "No data generated. Ensure the PDFs contain valid data.",
        data: [],
      });
    }
  } catch (err) {
    console.error('Error during process:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error during process: ' + err.message,
    });
  }
});

// // CSV generation function
// function createCsvFromStructuredData(data, outputFilePath) {
//   const headers = Object.keys(data[0]).join(','); // CSV headers from the first object
//   const rows = data.map(row => Object.values(row).join(',')); // CSV rows

//   const csvContent = [headers, ...rows].join('\n'); // Combine headers and rows
//   fs.writeFileSync(outputFilePath, csvContent, 'utf8');
//   console.log(`CSV file created at: ${outputFilePath}`);
// }

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 