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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let adminDb: any = null;

function initializeFirebaseAdmin() {
  if (adminDb) return adminDb;

  const serviceAccountPath = process.env.FIREBASE_ADMIN_CREDENTIALS;
  if (!serviceAccountPath) {
    throw new Error('Missing FIREBASE_ADMIN_CREDENTIALS environment variable');
  }

  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccountPath),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/`,
    }, 'admin');
  }

  adminDb = getFirestore(getApps().find(app => app.name === 'admin') || getApps()[0]);
  return adminDb;
}

export class ServerMedicalReportService {
  static async saveMedicalReport(data: ReportData) {
    const db = initializeFirebaseAdmin();
    const docData = {
      ...data,
      uploadDate: new Date().toISOString(),
      aiAnalyzed: false,
    };

    const docRef = await db.collection('medicalReports').add(docData);
    return { id: docRef.id, ...docData };
  }
}
