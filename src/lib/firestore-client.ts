// lib/firestore-client.ts - CLIENT-SIDE ONLY
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export interface MedicalReport {
  id?: string;
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
  uploadDate?: Timestamp;
  lastModified?: Timestamp;
  fileUrl?: string;
  aiAnalyzed?: boolean;
  aiInsights?: {
    summary?: string;
    keyFindings?: string[];
    recommendations?: string[];
    riskLevel?: 'low' | 'medium' | 'high';
  };
}

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

export class MedicalReportService {
  private static COLLECTION_NAME = 'medicalReports';

  // Client-side save (for direct client operations)
  static async saveMedicalReport(reportData: ReportData): Promise<string> {
    try {
      const docData = {
        ...reportData,
        uploadDate: serverTimestamp(),
        lastModified: serverTimestamp(),
        aiAnalyzed: false
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), docData);
      return docRef.id;
    } catch (error) {
      console.error('Error saving medical report:', error);
      throw new Error(`Failed to save medical report: ${error}`);
    }
  }

  static async getUserMedicalReports(userId: string): Promise<MedicalReport[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('uploadDate', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MedicalReport[];
    } catch (error) {
      console.error('Error fetching user medical reports:', error);
      throw new Error('Failed to fetch medical reports');
    }
  }

  static async updateMedicalReport(reportId: string, updates: Partial<MedicalReport>): Promise<void> {
    try {
      const reportRef = doc(db, this.COLLECTION_NAME, reportId);
      await updateDoc(reportRef, {
        ...updates,
        lastModified: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating medical report:', error);
      throw new Error('Failed to update medical report');
    }
  }

  static async deleteMedicalReport(reportId: string): Promise<void> {
    try {
      const reportRef = doc(db, this.COLLECTION_NAME, reportId);
      await deleteDoc(reportRef);
    } catch (error) {
      console.error('Error deleting medical report:', error);
      throw new Error('Failed to delete medical report');
    }
  }

  static async uploadPdfFile(file: File, userId: string, reportId: string): Promise<string> {
    try {
      const fileName = `${userId}/${reportId}/${file.name}`;
      const storageRef = ref(storage, `medical-reports/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading PDF file:', error);
      throw new Error('Failed to upload PDF file');
    }
  }

  static async searchReports(userId: string, searchTerm: string): Promise<MedicalReport[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // For production, consider using Algolia or similar service
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('uploadDate', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const reports = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MedicalReport[];

      // Client-side filtering (not ideal for large datasets)
      return reports.filter(report => 
        report.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.extractedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.notes && report.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } catch (error) {
      console.error('Error searching reports:', error);
      throw new Error('Failed to search reports');
    }
  }
}