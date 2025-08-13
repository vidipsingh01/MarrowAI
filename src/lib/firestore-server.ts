// lib/firestore-server.ts - Enhanced with debugging
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

export interface ReportData {
  userId: string;
  fileName: string;
  fileSize: number;
  extractedText: string;
  textLength: number;
  pdfInfo: {
    numPages: number;
    version?: string;
  };
  reportType: string;
  notes?: string;
}

// Initialize Admin SDK for server-side operations
let adminDb: any = null;

function initializeFirebaseAdmin() {
  if (adminDb) {
    console.log('Admin SDK already initialized, returning existing instance');
    return adminDb;
  }
  
  console.log('Initializing Firebase Admin SDK...');
  
  // Check environment variables
  const requiredEnvVars = {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY
  };
  
  console.log('Environment variables check:');
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    console.log(`${key}: ${value ? 'SET' : 'MISSING'}`);
    if (key === 'FIREBASE_PRIVATE_KEY' && value) {
      console.log(`${key} length: ${value.length} characters`);
      console.log(`${key} starts with: ${value.substring(0, 50)}...`);
    }
  });
  
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);
    
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  try {
    console.log('Checking existing Firebase apps...');
    console.log('Existing apps:', getApps().map(app => app.name));
    
    if (getApps().length === 0) {
      console.log('No existing apps found, initializing new admin app...');
      
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
      console.log('Private key processed, length:', privateKey?.length);
      
      const adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/`,
      }, 'admin');
      
      console.log('Admin app initialized:', adminApp.name);
      adminDb = getFirestore(adminApp);
      console.log('Firestore instance created');
    } else {
      console.log('Finding existing admin app...');
      const adminApp = getApps().find(app => app.name === 'admin') || getApps()[0];
      console.log('Using existing app:', adminApp?.name);
      adminDb = getFirestore(adminApp);
    }
    
    console.log('Firebase Admin SDK initialized successfully');
    return adminDb;
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
  }
}

export class ServerMedicalReportService {
  private static COLLECTION_NAME = 'medicalReports';

  // Server-side save using Admin SDK (for API routes)
  static async saveMedicalReport(reportData: ReportData): Promise<string> {
    console.log('=== Starting ServerMedicalReportService.saveMedicalReport ===');
    console.log('Input data:', {
      userId: reportData.userId,
      fileName: reportData.fileName,
      reportType: reportData.reportType,
      textLength: reportData.textLength,
      hasNotes: !!reportData.notes
    });

    let db;
    try {
      db = initializeFirebaseAdmin();
      console.log('Admin SDK initialized successfully');
    } catch (initError) {
      console.error('Admin SDK initialization failed:', initError);
      throw initError;
    }
    
    if (!db) {
      const error = new Error('Firebase Admin SDK not initialized. Database instance is null.');
      console.error(error.message);
      throw error;
    }

    try {
      const docData = {
        ...reportData,
        uploadDate: new Date(),
        lastModified: new Date(),
        aiAnalyzed: false
      };

      console.log('Prepared document data:', {
        userId: docData.userId,
        fileName: docData.fileName,
        reportType: docData.reportType,
        uploadDate: docData.uploadDate.toISOString(),
        textLength: docData.textLength
      });

      console.log('Attempting to add document to collection:', this.COLLECTION_NAME);
      const docRef = await db.collection(this.COLLECTION_NAME).add(docData);
      console.log('Document successfully saved with ID:', docRef.id);
      
      return docRef.id;
    } catch (error: unknown) { // Catch the error as 'unknown'
    console.error('Firestore operation failed:', error);

    // Now, use a type guard to safely access properties
    if (error instanceof Error) {
        // Since Firebase errors are extensions of Error, we can check for the 'code' property
        // to get more specific details.
        const firestoreError = error as Error & { code?: string };

        console.error('Firestore error details:', {
            name: firestoreError.name,
            message: firestoreError.message,
            code: firestoreError.code || 'N/A', // Safely access the code property
            stack: firestoreError.stack
        });

        if (firestoreError.code === 'permission-denied') {
            throw new Error('Permission denied: Check your Firestore security rules and service account permissions in Google Cloud IAM.');
        } else if (firestoreError.code === 'not-found') {
            throw new Error('Firestore database not found: Check your project configuration.');
        } else if (firestoreError.message?.includes('service account')) {
            throw new Error('Service account authentication failed: Check your Firebase credentials in .env.local.');
        }
        
        throw new Error(`Firestore operation failed: ${firestoreError.message}`);

      } else {
          // Handle cases where the thrown error is not a standard Error object
          console.error('An unexpected error type was caught:', error);
          throw new Error(`An unexpected error occurred: ${String(error)}`);
      }
    }
  }
  
    static async updateMedicalReport(reportId: string, updates: any): Promise<void> {
    const db = initializeFirebaseAdmin();
    
    try {
      await db.collection(this.COLLECTION_NAME).doc(reportId).update({
        ...updates,
        lastModified: new Date()
      });
      console.log('Document updated successfully:', reportId);
    } catch (error: unknown) {
      console.error('Error updating medical report:', error);
      throw new Error(`Failed to update medical report: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Test connection method
  static async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Firebase Admin SDK connection...');
      const db = initializeFirebaseAdmin();
      
      // Try to perform a simple operation
      const testDoc = db.collection('_test').doc('connection-test');
      await testDoc.set({ test: true, timestamp: new Date() });
      await testDoc.delete();
      
      console.log('Firebase Admin SDK connection test passed');
      return true;
    } catch (error) {
      console.error('Firebase Admin SDK connection test failed:', error);
      return false;
    }
  }
}