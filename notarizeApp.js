// notarizeApp.js - Standalone notarization script
// Run this after building the app with electron-builder
const { notarize } = require('@electron/notarize');
const path = require('path');
const fs = require('fs');

console.log('>>> STANDALONE NOTARIZATION SCRIPT STARTING');
console.log(`Node.js version: ${process.version}`);
console.log(`Using @electron/notarize from: ${require.resolve('@electron/notarize')}`);

async function notarizeApp() {
  // Check environment variables
  if (!process.env.APPLE_ID || !process.env.APPLE_APP_SPECIFIC_PASSWORD || !process.env.APPLE_TEAM_ID) {
    console.error('ERROR: Missing required environment variables for notarization!');
    console.error('Make sure APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, and APPLE_TEAM_ID are set.');
    process.exit(1);
  }

  // Path to your built app
  const appPath = path.resolve(__dirname, 'dist/mac/StealthLynk Client App.app');
  
  if (!fs.existsSync(appPath)) {
    console.error(`ERROR: App not found at ${appPath}`);
    console.error('Build the app first with: npm run build:mac-arm64');
    process.exit(1);
  }

  console.log(`>>> NOTARIZING APP AT: ${appPath}`);
  console.log(`>>> Using Apple ID: ${process.env.APPLE_ID}`);
  console.log(`>>> Using Team ID: ${process.env.APPLE_TEAM_ID}`);

  try {
    console.log('>>> STARTING NOTARYTOOL NOTARIZATION...');
    
    await notarize({
      tool: 'notarytool',
      appPath,
      appBundleId: 'io.stealthlynk',
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    });
    
    console.log('>>> NOTARIZATION SUCCESSFUL! <<<');
  } catch (error) {
    console.error(`>>> NOTARIZATION FAILED: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

notarizeApp().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
