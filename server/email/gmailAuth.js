// const { google } = require("googleapis");
// const path = require("path");
// const fs = require("fs");
// const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
// const TOKEN_PATH = path.join(__dirname, "token.json");
// const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

// // Load credentials from the credentials.json file
// const credentials = require("./credentials.json"); // Make sure this file exists
// console.log(credentials); // Debugging: Check if credentials are loaded properly

// // Function to create the OAuth2 client
// function getOAuth2Client() {
//   const { client_id, client_secret, redirect_uris } = credentials.web;
//   return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
// }

// // OAuth2.0 flow for authentication
// function generateAuthUrl() {
//   const oAuth2Client = getOAuth2Client();
//   return oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: SCOPES,
//   });
// }

// // Exchange authorization code for access token
// function getToken(code, callback) {
//   const oAuth2Client = getOAuth2Client();
//   oAuth2Client.getToken(code, (err, token) => {
//     if (err) return callback(err);
//     oAuth2Client.setCredentials(token);
//     // Save the token to token.json
//     fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
//     callback(null, token);
//   });
// }

// // Get authenticated Gmail client
// function getGmailClient() {
//   // Check if token exists before proceeding
//   if (!fs.existsSync(TOKEN_PATH)) {
//     throw new Error("Token file not found. Please authenticate first.");
//   }

//   const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
//   const oAuth2Client = getOAuth2Client();
//   oAuth2Client.setCredentials(token);
//   return google.gmail({ version: "v1", auth: oAuth2Client });
// }

// module.exports = { generateAuthUrl, getToken, getGmailClient };


// // gmailAuth.js
// const { google } = require('googleapis');
// const fs = require('fs');
// const path = require('path');
// const TOKEN_PATH = path.join(__dirname, 'token.json');

// // Get authenticated Gmail client
// function getGmailClient() {
//   const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
//   const credentials = require('./credentials.json');
//   const { client_id, client_secret, redirect_uris } = credentials.web;
//   const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
//   oAuth2Client.setCredentials(token);
//   return google.gmail({ version: 'v1', auth: oAuth2Client });
// }

// // Fetch emails with PDF attachments
// async function fetchEmails() {
//   const gmail = getGmailClient();
//   const res = await gmail.users.messages.list({
//     userId: 'me',
//     q: 'has:attachment filename:pdf', // Only fetch emails with PDFs attached
//   });

//   const messages = res.data.messages || [];
//   for (let message of messages) {
//     await fetchAndSavePdf(message.id); // Process each email
//   }
// }

// // Extract and save PDF attachments
// async function fetchAndSavePdf(messageId) {
//   const gmail = getGmailClient();
//   const email = await gmail.users.messages.get({ userId: 'me', id: messageId });
//   const parts = email.data.payload.parts || [];

//   for (let part of parts) {
//     if (part.filename && part.filename.endsWith('.pdf')) {
//       const attachmentId = part.body.attachmentId;
//       const attachment = await gmail.users.messages.attachments.get({
//         userId: 'me',
//         messageId: messageId,
//         id: attachmentId,
//       });

//       const pdfData = attachment.data.data;
//       const buffer = Buffer.from(pdfData, 'base64');
//       const pdfPath = path.join(__dirname, 'downloads', part.filename);
//       fs.writeFileSync(pdfPath, buffer);

//       console.log(`PDF saved: ${part.filename}`);
//       return pdfPath; // Return path to saved PDF
//     }
//   }
// }

// module.exports = { fetchEmails, fetchAndSavePdf };







const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Define paths for token and credentials
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

// Get authenticated Gmail client
function getGmailClient() {
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  const credentials = require(CREDENTIALS_PATH);
  const { client_id, client_secret, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(token);
  return google.gmail({ version: 'v1', auth: oAuth2Client });
}

// OAuth2.0 flow for authentication
function generateAuthUrl() {
  const credentials = require(CREDENTIALS_PATH);
  const { client_id, client_secret, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  });
}

// Exchange authorization code for an access token
function getToken(code, callback) {
  const credentials = require(CREDENTIALS_PATH);
  const { client_id, client_secret, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  oAuth2Client.getToken(code, (err, token) => {
    if (err) return callback(err);
    oAuth2Client.setCredentials(token);
    // Save the token to token.json
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    callback(null, token);
  });
}

// Recursive function to extract PDFs from nested parts
async function extractPdfsFromParts(parts, messageId, savedFiles = []) {
  const gmail = getGmailClient();

  for (let part of parts) {
    // If the part is a PDF attachment
    if (part.filename && part.filename.endsWith('.pdf') && part.body.attachmentId) {
      const attachmentId = part.body.attachmentId;
      const attachment = await gmail.users.messages.attachments.get({
        userId: 'me',
        messageId,
        id: attachmentId,
      });

      const pdfData = attachment.data.data;
      const buffer = Buffer.from(pdfData, 'base64');
      const downloadsDir = path.join(__dirname, 'downloads');

      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir);
      }

      const pdfPath = path.join(downloadsDir, part.filename);
      fs.writeFileSync(pdfPath, buffer);
      console.log(`PDF saved: ${part.filename}`);
      savedFiles.push(pdfPath); // Add to saved files list
    }

    // If the part has nested parts, recursively process them
    if (part.parts) {
      await extractPdfsFromParts(part.parts, messageId, savedFiles);
    }
  }

  return savedFiles;
}

// Extract and save all PDF attachments from an email
async function fetchAndSavePdf(messageId) {
  const gmail = getGmailClient();
  const email = await gmail.users.messages.get({ userId: 'me', id: messageId });
  const parts = email.data.payload.parts || [];
  const savedFiles = [];

  return await extractPdfsFromParts(parts, messageId, savedFiles);
}

// Fetch emails with PDF attachments
async function fetchEmails(gmailAddress, startDate, endDate, keyword) {
  const gmail = getGmailClient();

  // Construct the search query with the provided parameters
  const query = `from:${gmailAddress} after:${startDate} before:${endDate} has:attachment "${keyword}"`;

  try {
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: query, // Using the dynamically constructed query string
    });

    const messages = res.data.messages || [];
    let savedFiles = [];

    for (let message of messages) {
      const pdfFiles = await fetchAndSavePdf(message.id); // Fetch and save all PDFs
      savedFiles = savedFiles.concat(pdfFiles);
    }

    return savedFiles;
  } catch (err) {
    throw new Error('Error fetching emails: ' + err.message);
  }
}

module.exports = { generateAuthUrl, getToken, getGmailClient, fetchEmails, fetchAndSavePdf };
 