const { authorize, listEmails, downloadAttachments } = require('./email');
const { processPdfWithWorqHat } = require('./apiIntegration');
const path = require('path');
require('dotenv').config(); // Load .env file

const apiUrl = 'https://api.worqhat.com/api/ai/v2/pdf-extract'; // Replace with actual endpoint
const apiKey = process.env.WORQHAT_API_KEY; // Fetch API key from .env

(async () => {
  const auth = await authorize();
  const messages = await listEmails(auth);
  if (messages.length) {
    console.log('Downloading attachments...');
    await downloadAttachments(auth, messages);

    const downloadsDir = path.join(__dirname, 'downloads');
    const files = fs.readdirSync(downloadsDir);

    for (const file of files) {
      if (file.endsWith('.pdf')) {
        const pdfPath = path.join(downloadsDir, file);
        const result = await processPdfWithWorqHat(apiUrl, apiKey, pdfPath);
        console.log('Processed Data:', result);
        // Store or display the result as needed
      }
    }
  } else {
    console.log('No matching emails found.');
  }
})();
 