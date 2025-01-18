// const fs = require('fs');
// const readline = require('readline');
// const { google } = require('googleapis');
// const path = require('path');

// const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
// const TOKEN_PATH = path.join(__dirname, 'token.json');

// // Load client secrets from a local file.
// function authorize(callback) {
//   const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
//   const { client_secret, client_id, redirect_uris } = credentials.installed;
//   const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

//   // Check if token already exists.
//   if (fs.existsSync(TOKEN_PATH)) {
//     const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
//     oAuth2Client.setCredentials(token);
//     callback(oAuth2Client);
//   } else {
//     getAccessToken(oAuth2Client, callback);
//   }
// }

// function getAccessToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this URL:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err);
//       oAuth2Client.setCredentials(token);
//       fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
//       console.log('Token stored to', TOKEN_PATH);
//       callback(oAuth2Client);
//     });
//   });
// }

// // Fetch emails with PDFs
// function listMessages(auth) {
//   const gmail = google.gmail({ version: 'v1', auth });
//   gmail.users.messages.list(
//     {
//       userId: 'me',
//       q: 'has:attachment filename:pdf',
//     },
//     (err, res) => {
//       if (err) return console.log('The API returned an error: ' + err);
//       const messages = res.data.messages || [];
//       console.log(`Found ${messages.length} messages:`);
//       messages.forEach((message) => console.log(message.id));
//     }
//   );
// }

// // Initialize the process
// authorize(listMessages);
