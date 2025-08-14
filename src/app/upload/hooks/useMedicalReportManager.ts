// src/app/upload/hooks/useMedicalReportManager.ts
import { useState, useCallback, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { 
  MedicalReportService, 
  MedicalReport,
  AnalyzedReportData 
} from '@/lib/firestore-client';
import { collection, doc, setDoc } from 'firebase/firestore';

interface UploadedFile {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  extractedText?: string;
  reportId?: string;
  reportType?: string;
  notes?: string;
}

const REPORT_TYPES = [
  { value: 'blood-test', label: 'Blood Test' },
  { value: 'x-ray', label: 'X-Ray' },
  { value: 'mri', label: 'MRI' },
  { value: 'ct-scan', label: 'CT Scan' },
  { value: 'ultrasound', label: 'Ultrasound' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'discharge-summary', label: 'Discharge Summary' },
  { value: 'lab-report', label: 'Lab Report' },
  { value: 'consultation', label: 'Consultation Notes' },
  { value: 'general', label: 'General Report' },
];

export const useMedicalReportManager = () => {
  const [user, loading, error] = useAuthState(auth);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [savedReports, setSavedReports] = useState<MedicalReport[]>([]);
  const [reportType, setReportType] = useState('general');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  useEffect(() => {
    if (user) {
      loadSavedReports();
    } else {
      setSavedReports([]);
    }
  }, [user]);

  const loadSavedReports = async () => {
    if (!user) return;
    setIsLoadingReports(true);
    try {
      const reports = await MedicalReportService.getUserMedicalReports(user.uid);
      if (!Array.isArray(reports)) {
        console.error('Unexpected response from getUserMedicalReports:', reports);
        setSavedReports([]);
        return;
      }
      // Log reports to debug
      console.log('Loaded reports:', reports);
      setSavedReports(reports);
    } catch (error) {
      console.error('Error in loadSavedReports:', error);
      setSavedReports([]);
    } finally {
      setIsLoadingReports(false);
    }
  };

  const analyzeWithGemini = async (extractedText: string): Promise<AnalyzedReportData> => {
    if (!extractedText) {
      throw new Error('No extracted text provided for analysis');
    }
    console.log('Sending text to analyze:', extractedText.substring(0, 100) + '...');
    const response = await fetch('/api/analyze-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: extractedText }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response error:', errorText);
      throw new Error('Failed to analyze with Gemini');
    }
    const { data } = await response.json();
    return {
      riskScore: data.riskScore || 0,
      riskLevel: data.riskLevel || 'low',
      wbc: data.wbc || 0,
      hemoglobin: data.hemoglobin || 0,
      platelets: data.platelets || 0,
      recommendations: data.recommendations || [],
    };
  };

  const processFile = async (uploadedFile: UploadedFile) => {
    if (!user) {
      setUploadedFiles(prev =>
        prev.map(f => f.id === uploadedFile.id ? { ...f, status: 'error', error: 'Please log in to upload files' } : f)
      );
      return;
    }

    setUploadedFiles(prev =>
      prev.map(f => f.id === uploadedFile.id ? { ...f, status: 'uploading' } : f)
    );

    const formData = new FormData();
    formData.append('pdf', uploadedFile.file);
    formData.append('userId', user.uid);
    formData.append('reportType', uploadedFile.reportType || reportType);
    if (uploadedFile.notes || notes) {
      formData.append('notes', uploadedFile.notes || notes);
    }

    try {
      const response = await fetch('/api/parse-pdf', { method: 'POST', body: formData });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      const analyzedData = await analyzeWithGemini(data.text);
      const reportsCollection = collection(db, 'medicalReports');
      const reportRef = doc(reportsCollection); // Generate a new document reference
      const reportId = reportRef.id;
      const reportData: MedicalReport = {
        id: reportId,
        userId: user.uid,
        fileName: uploadedFile.file.name,
        fileSize: uploadedFile.file.size,
        uploadDate: new Date().toISOString(),
        reportType: uploadedFile.reportType || reportType,
        notes: uploadedFile.notes || notes,
        extractedText: data.text,
        aiAnalyzed: true,
        aiInsights: {
          riskScore: analyzedData.riskScore,
          riskLevel: analyzedData.riskLevel,
          wbc: analyzedData.wbc,
          hemoglobin: analyzedData.hemoglobin,
          platelets: analyzedData.platelets,
          recommendations: analyzedData.recommendations,
        },
        pdfInfo: data.info,
      };

      await setDoc(reportRef, reportData); // Use the reference for setDoc
      setUploadedFiles(prev =>
        prev.map(f => f.id === uploadedFile.id ? { ...f, status: 'completed', extractedText: data.text, reportId } : f)
      );
      await loadSavedReports();
      setNotes('');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadedFiles(prev =>
        prev.map(f => f.id === uploadedFile.id ? { ...f, status: 'error', error: (error as Error).message || 'Unknown error' } : f)
      );
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // if (savedReports.length >= 1 || uploadedFiles.length >= 1) {
      //   alert('You can only upload one file at a time. Please remove the existing file or delete a saved report before uploading a new one.');
      //   return;
      // }

      const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: 'pending',
        reportType,
        notes,
      }));

      setUploadedFiles(prev => [...prev, ...newFiles]);

      newFiles.forEach(file => {
        if (file.file.type === 'application/pdf') {
          processFile(file);
        } else {
          setUploadedFiles(prev =>
            prev.map(f => f.id === file.id ? { ...f, status: 'error', error: `Invalid file type: ${file.file.type}. Only PDF files are supported.` } : f)
          );
        }
      });
    },
    [reportType, notes, user, savedReports.length, uploadedFiles.length]
  );

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const deleteReport = async (reportId: string) => {
    try {
      await MedicalReportService.deleteMedicalReport(reportId);
      await loadSavedReports();
    } catch (error) {
      console.error('Failed to delete report:', error);
      alert('Failed to delete report');
    }
  };

  const searchReports = async () => {
    if (!user || !searchTerm.trim()) {
      await loadSavedReports();
      return;
    }

    setIsLoadingReports(true);
    try {
      const results = await MedicalReportService.searchReports(user.uid, searchTerm);
      setSavedReports(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoadingReports(false);
    }
  };

  const viewExtractedText = (text: string, filename: string) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html><head><title>Extracted Text - ${filename}</title><style>body { font-family: Arial; padding: 20px; line-height: 1.6; } pre { white-space: pre-wrap; word-wrap: break-word; }</style></head><body><h1>Extracted Text from: ${filename}</h1><pre>${text}</pre></body></html>
      `);
    }
  };

  const formatFileSize = (size: number) => `${(size / 1024 / 1024).toFixed(2)} MB`;
  const getFileType = (name: string) => name.split('.').pop()?.toUpperCase() || '';

  return {
    user,
    loading,
    error,
    uploadedFiles,
    savedReports,
    reportType,
    notes,
    searchTerm,
    isLoadingReports,
    setReportType,
    setNotes,
    setSearchTerm,
    loadSavedReports,
    onDrop,
    removeFile,
    deleteReport,
    searchReports,
    viewExtractedText,
    formatFileSize,
    getFileType,
    REPORT_TYPES,
  };
};
