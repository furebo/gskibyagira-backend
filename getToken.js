import { google } from 'googleapis';
import readline from 'readline';
import dotenv from 'dotenv';

dotenv.config();

// Set up OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // redirect URI, must match the one set in your Google Cloud Console
);

// Step 1: Generate URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',        // ✅ needed for refresh token
  prompt: 'consent',             // ✅ force consent screen to get refresh token
  scope: ['https://www.googleapis.com/auth/gmail.send'], // required Gmail scope
});

console.log('\n🔐 Visit this URL to authorize the app:\n\n', authUrl);

// Step 2: Prompt for the authorization code
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\n📥 Paste the code from Google here: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n✅ Tokens retrieved successfully!\n');

    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token); // <- Save this in .env!

    rl.close();
  } catch (error) {
    console.error('\n❌ Error retrieving access token:', error.response?.data || error.message);
    rl.close();
  }
});
