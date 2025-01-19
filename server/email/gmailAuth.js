//server/email/gmailAuth.js
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
 