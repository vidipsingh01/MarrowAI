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

let adminDb: any = null;

function initializeFirebaseAdmin() {
  if (adminDb) {
    console.log('Admin SDK already initialized, returning existing instance');
    return adminDb;
  }
  
  console.log('Initializing Firebase Admin SDK...');

  // Check environment variable for service account credentials
  const serviceAccountPath = process.env.FIREBASE_ADMIN_CREDENTIALS;
  console.log('FIREBASE_ADMIN_CREDENTIALS:', serviceAccountPath ? 'SET' : 'NOT SET');

  if (!serviceAccountPath) {
    throw new Error('Missing FIREBASE_ADMIN_CREDENTIALS environment variable');
  }
  
  try {
    console.log('Checking existing Firebase apps...');
    console.log('Existing apps:', getApps().map(app => app.name));
    
    if (getApps().length === 0) {
      console.log('No existing apps found, initializing new admin app...');
      console.log('Loading service account from:', serviceAccountPath);

      const adminApp = initializeApp({
        credential: cert(serviceAccountPath),
        databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/`,
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
    throw error;
  }
}

export class ServerMedicalReportService {
  static async saveMedicalReport(data: ReportData) {
    console.log('=== Starting ServerMedicalReportService.saveMedicalReport ===');
    console.log('Input data:', JSON.stringify({
      userId: data.userId,
      fileName: data.fileName,
      reportType: data.reportType,
      textLength: data.textLength,
      hasNotes: !!data.notes,
    }, null, 2));

    try {
      console.log('Preparing to initialize Firebase Admin SDK...');
      const db = initializeFirebaseAdmin();
      console.log('Admin SDK initialized successfully');

      const docData = {
        userId: data.userId,
        fileName: data.fileName,
        fileSize: data.fileSize,
        extractedText: data.extractedText,
        textLength: data.textLength,
        pdfInfo: data.pdfInfo,
        reportType: data.reportType,
        uploadDate: new Date().toISOString(),
        notes: data.notes || null,
      };

      console.log('Prepared document data:', JSON.stringify(docData, null, 2));
      console.log('Attempting to add document to collection: medicalReports');

      const docRef = await db.collection('medicalReports').add(docData);
      console.log('Document added successfully with ID:', docRef.id);

      return { id: docRef.id, ...docData };
    } catch (error) {
      console.error('Firestore operation failed:', error);
      if (typeof error === 'object' && error !== null) {
        console.error('Firestore error details:', JSON.stringify({
          name: (error as any).name,
          message: (error as any).message,
          code: (error as any).code,
          stack: (error as any).stack,
        }, null, 2));
        throw new Error(`Firestore operation failed: ${(error as any).message}`);
      } else {
        console.error('Firestore error details:', error);
        throw new Error('Firestore operation failed: Unknown error');
      }
    }
  }
}
