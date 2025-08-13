// test-firestore.js

// Load environment variables from .env.local
require('dotenv').config({ path: './.env.local' });

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

console.log('--- Starting Firestore Connection Test ---');

// Check if all required environment variables are present
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKeyRaw) {
  console.error('🔴 ERROR: Missing one or more required environment variables in .env.local');
  console.error('Please check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY');
  process.exit(1);
}

// Replace the literal \n strings with actual newline characters
const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

const serviceAccount = {
  projectId,
  clientEmail,
  privateKey,
};

try {
  console.log('Attempting to initialize Firebase Admin SDK...');
  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
  
  const db = getFirestore();
  console.log('✅ Firebase Admin SDK Initialized Successfully.');

  async function writeTestDocument() {
    console.log("Attempting to write to collection 'test-collection'...");
    const testDocRef = db.collection('test-collection').doc('test-doc');
    await testDocRef.set({
      message: 'Hello from the test script!',
      timestamp: new Date(),
    });
    console.log('✅✅✅ SUCCESS! Test document written successfully to your LIVE cloud database.');
    console.log('Go check your Firebase Console now. You should see a "test-collection".');
  }

  writeTestDocument();

} catch (error) {
  console.error('🔴🔴🔴 TEST FAILED. An error occurred:');
  console.error(error);
  console.log('\nThis confirms the problem is with your credentials or environment, not the Next.js app.');
}