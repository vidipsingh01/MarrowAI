// src/app/upload/hooks/useMedicalReportManager.ts
import { useState, useCallback, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { MedicalReportService, MedicalReport } from '@/lib/firestore-client';

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
  console.log('useMedicalReportManager hook initialized');
  const [user, loading, error] = useAuthState(auth);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [savedReports, setSavedReports] = useState<MedicalReport[]>([]);
  const [reportType, setReportType] = useState('general');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  useEffect(() => {
    console.log('User state changed:', user ? user.uid : 'No user');
    if (user) {
      loadSavedReports();
    } else {
      setSavedReports([]);
      console.log('No user logged in, clearing saved reports.');
    }
  }, [user]);

  const loadSavedReports = async () => {
    if (!user) return;
    console.trace(`Attempting to load reports for user: ${user.uid}`);
    setIsLoadingReports(true);
    try {
      console.log('Before calling getUserMedicalReports...');
      const reports = await MedicalReportService.getUserMedicalReports(user.uid);
      console.log('After getUserMedicalReports, received:', reports);
      if (!Array.isArray(reports)) {
        console.error('Unexpected response from getUserMedicalReports:', reports);
        setSavedReports([]);
        return;
      }
      console.log(`Successfully fetched ${reports.length} reports:`, reports);
      setSavedReports(reports);
    } catch (error) {
      console.error('Error in loadSavedReports:', error);
      setSavedReports([]);
    } finally {
      console.log('Finished loading reports, isLoadingReports set to false.');
      setIsLoadingReports(false);
    }
  };

  const processFile = async (uploadedFile: UploadedFile) => {
    if (!user) {
      setUploadedFiles(prev =>
        prev.map(f =>
          f.id === uploadedFile.id
            ? { ...f, status: 'error', error: 'Please log in to upload files' }
            : f
        )
      );
      return;
    }

    console.log(`Starting to process file: ${uploadedFile.file.name}`);

    setUploadedFiles(prev =>
      prev.map(f => (f.id === uploadedFile.id ? { ...f, status: 'uploading' } : f))
    );

    const formData = new FormData();
    formData.append('pdf', uploadedFile.file);
    formData.append('userId', user.uid);
    formData.append('reportType', uploadedFile.reportType || reportType);
    if (uploadedFile.notes || notes) {
      formData.append('notes', uploadedFile.notes || notes);
    }

    try {
      console.log('Sending request to API...');
      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      console.log('Response received, status:', response.status);

      setUploadedFiles(prev =>
        prev.map(f => (f.id === uploadedFile.id ? { ...f, status: 'processing' } : f))
      );

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      console.log(`--- Extracted text for ${uploadedFile.file.name} ---`);
      console.log(data.text);
      console.log(`--- End of extracted text (${data.info?.textLength} characters) ---`);

      setUploadedFiles(prev =>
        prev.map(f =>
          f.id === uploadedFile.id
            ? {
                ...f,
                status: 'completed',
                extractedText: data.text,
                reportId: data.reportId,
              }
            : f
        )
      );

      await loadSavedReports();
      setNotes('');
    } catch (error: unknown) {
      console.error('Upload failed:', error);
      setUploadedFiles(prev =>
        prev.map(f =>
          f.id === uploadedFile.id
            ? { ...f, status: 'error', error: (error as Error).message || 'Unknown error' }
            : f
        )
      );
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log('Files dropped:', acceptedFiles);

      // Check if the user already has a saved report or an active upload
      if (savedReports.length >= 1 || uploadedFiles.length >= 1) {
        alert('You can only upload one file at a time. Please remove the existing file or delete a saved report before uploading a new one.');
        return;
      }

      const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: 'pending',
        reportType: reportType,
        notes: notes,
      }));

      setUploadedFiles(prev => [...prev, ...newFiles]);

      newFiles.forEach(file => {
        if (file.file.type === 'application/pdf') {
          processFile(file);
        } else {
          console.error(`Invalid file type: ${file.file.type}`);
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === file.id
                ? {
                    ...f,
                    status: 'error',
                    error: `Invalid file type: ${file.file.type}. Only PDF files are supported.`,
                  }
                : f
            )
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
      console.log(`Attempting to delete report with ID: ${reportId}`);
      await MedicalReportService.deleteMedicalReport(reportId);
      console.log(`Report with ID ${reportId} deleted successfully.`);
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
      console.log(`Searching reports for user ${user.uid} with term: "${searchTerm}"`);
      const results = await MedicalReportService.searchReports(user.uid, searchTerm);
      console.log(`Search results: ${results.length} reports found.`, results);
      setSavedReports(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      console.log('Search completed, isLoadingReports set to false.');
      setIsLoadingReports(false);
    }
  };

  const viewExtractedText = (text: string, filename: string) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Extracted Text - ${filename}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              pre { white-space: pre-wrap; word-wrap: break-word; }
            </style>
          </head>
          <body>
            <h1>Extracted Text from: ${filename}</h1>
            <pre>${text}</pre>
          </body>
        </html>
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
