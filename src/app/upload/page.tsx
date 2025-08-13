// src/app/upload/page.tsx - Updated to use client-side service
'use client';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { MedicalReportService, MedicalReport } from '@/lib/firestore-client';
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Brain,
  Eye,
  Trash2,
  Search,
  Filter
} from 'lucide-react';

// Dummy components (replace with your actual UI components)
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => 
  <div className={`bg-white shadow-md rounded-lg ${className}`}>{children}</div>;
const Button = ({ children, variant, className, ...props }: { 
  children: React.ReactNode, variant?: string, className?: string, [key: string]: any 
}) => 
  <button className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${className}`} {...props}>
    {children}
  </button>;
const Input = ({ className, ...props }: { className?: string, [key: string]: any }) =>
  <input className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props} />;
const Select = ({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) =>
  <select className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props}>
    {children}
  </select>;

const formatFileSize = (size: number) => `${(size / 1024 / 1024).toFixed(2)} MB`;
const getFileType = (name: string) => name.split('.').pop()?.toUpperCase() || '';

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
  { value: 'general', label: 'General Report' }
];

export default function UploadPage() {
  const [user, loading, error] = useAuthState(auth);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [savedReports, setSavedReports] = useState<MedicalReport[]>([]);
  const [reportType, setReportType] = useState('general');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  // Load saved reports when component mounts
  useEffect(() => {
    if (user) {
      loadSavedReports();
    }
  }, [user]);

  const loadSavedReports = async () => {
    if (!user) return;
    
    setIsLoadingReports(true);
    try {
      const reports = await MedicalReportService.getUserMedicalReports(user.uid);
      setSavedReports(reports);
    } catch (error) {
      console.error('Failed to load saved reports:', error);
    } finally {
      setIsLoadingReports(false);
    }
  };

  const processFile = async (uploadedFile: UploadedFile) => {
    if (!user) {
      setUploadedFiles(prev =>
        prev.map(f =>
          f.id === uploadedFile.id ? { 
            ...f, 
            status: 'error', 
            error: 'Please log in to upload files' 
          } : f
        )
      );
      return;
    }

    console.log(`Starting to process file: ${uploadedFile.file.name}`);
    
    setUploadedFiles(prev =>
      prev.map(f =>
        f.id === uploadedFile.id ? { ...f, status: 'uploading' } : f
      )
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
        prev.map(f =>
          f.id === uploadedFile.id ? { ...f, status: 'processing' } : f
        )
      );

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // Display extracted text in console
      console.log(`--- Extracted text for ${uploadedFile.file.name} ---`);
      console.log(data.text);
      console.log(`--- End of extracted text (${data.info?.textLength} characters) ---`);

      setUploadedFiles(prev =>
        prev.map(f =>
          f.id === uploadedFile.id ? { 
            ...f, 
            status: 'completed',
            extractedText: data.text,
            reportId: data.reportId
          } : f
        )
      );

      // Reload saved reports to include the new one
      await loadSavedReports();
      
      // Clear form
      setNotes('');

    } catch (error: any) {
      console.error('Upload failed:', error);
      setUploadedFiles(prev =>
        prev.map(f =>
          f.id === uploadedFile.id
            ? { ...f, status: 'error', error: error.message }
            : f
        )
      );
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
      reportType: reportType,
      notes: notes
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach(file => {
      if (file.file.type === 'application/pdf') {
        processFile(file);
      } else {
        console.error(`Invalid file type: ${file.file.type}`);
        setUploadedFiles(prev =>
          prev.map(f =>
            f.id === file.id ? { 
              ...f, 
              status: 'error', 
              error: `Invalid file type: ${file.file.type}. Only PDF files are supported.` 
            } : f
          )
        );
      }
    });
  }, [reportType, notes, user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 50 * 1024 * 1024,
    disabled: !user
  });

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
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

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'uploading': return <Clock className="h-4 w-4 text-yellow-600 animate-spin" />;
      case 'processing': return <Brain className="h-4 w-4 text-blue-600 animate-pulse" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
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

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error.message}</div>;
  if (!user) return <div className="p-8 text-center">Please log in to upload medical reports.</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Medical Report Manager</h1>
        <p className="text-gray-600 mt-2">Upload PDF medical reports for AI-powered health insights</p>
      </div>

      {/* Upload Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Upload New Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <Select value={reportType} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReportType(e.target.value)} className="w-full">
              {REPORT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <Input
              type="text"
              placeholder="Add notes about this report..."
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-2 font-semibold">
            {isDragActive ? 'Drop PDF files here' : 'Drag & drop PDF files here, or click to select'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Maximum file size: 50MB</p>
        </div>
      </Card>

      {/* Recent Uploads */}
      {uploadedFiles.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Uploads</h3>
          <div className="space-y-4">
            {uploadedFiles.map((uploadedFile) => (
              <div key={uploadedFile.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-6 w-6 text-gray-500" />
                    <div>
                      <p className="font-medium">{uploadedFile.file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(uploadedFile.file.size)} • {getFileType(uploadedFile.file.name)}
                      </p>
                      <div className="flex items-center space-x-2 text-sm mt-1">
                        {getStatusIcon(uploadedFile.status)}
                        <span>{uploadedFile.status.charAt(0).toUpperCase() + uploadedFile.status.slice(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {uploadedFile.status === 'completed' && uploadedFile.extractedText && (
                      <Button 
                        variant="outline" 
                        onClick={() => viewExtractedText(uploadedFile.extractedText!, uploadedFile.file.name)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Text
                      </Button>
                    )}
                    <button 
                      onClick={() => removeFile(uploadedFile.id)} 
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {uploadedFile.status === 'error' && uploadedFile.error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{uploadedFile.error}</p>
                  </div>
                )}
                
                {uploadedFile.status === 'completed' && uploadedFile.extractedText && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-600">
                      Successfully processed and saved to your medical records
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Saved Reports */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Medical Reports ({savedReports.length})</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-64"
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && searchReports()}
              />
              <Button onClick={searchReports} className="px-3">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={loadSavedReports} variant="outline" className="px-3">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoadingReports ? (
          <div className="text-center py-8">
            <Brain className="h-8 w-8 mx-auto animate-pulse text-blue-600" />
            <p className="text-gray-500 mt-2">Loading your reports...</p>
          </div>
        ) : savedReports.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-gray-400" />
            <p className="text-gray-500 mt-2">No medical reports found</p>
            <p className="text-sm text-gray-400">Upload your first PDF report to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <FileText className="h-6 w-6 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium">{report.fileName}</p>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          report.aiAnalyzed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {report.reportType?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'General'}
                        </span>
                        {report.aiAnalyzed && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            AI Analyzed
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-2">
                        <span>Uploaded: {report.uploadDate?.toDate().toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>{formatFileSize(report.fileSize)}</span>
                        <span className="mx-2">•</span>
                        <span>{report.pdfInfo.numPages} pages</span>
                        <span className="mx-2">•</span>
                        <span>{report.textLength.toLocaleString()} characters</span>
                      </div>
                      {report.notes && (
                        <div className="text-sm text-gray-600 mb-2 italic">
                          Notes: {report.notes}
                        </div>
                      )}
                      {report.aiInsights && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <h4 className="font-medium text-blue-900 mb-2">AI Insights</h4>
                          {report.aiInsights.summary && (
                            <p className="text-sm text-blue-800 mb-2">{report.aiInsights.summary}</p>
                          )}
                          {report.aiInsights.keyFindings && report.aiInsights.keyFindings.length > 0 && (
                            <div className="mb-2">
                              <p className="text-xs font-semibold text-blue-900 mb-1">Key Findings:</p>
                              <ul className="text-sm text-blue-800 list-disc list-inside">
                                {report.aiInsights.keyFindings.map((finding, index) => (
                                  <li key={index}>{finding}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {report.aiInsights.recommendations && report.aiInsights.recommendations.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-blue-900 mb-1">Recommendations:</p>
                              <ul className="text-sm text-blue-800 list-disc list-inside">
                                {report.aiInsights.recommendations.map((rec, index) => (
                                  <li key={index}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-2 max-h-16 overflow-hidden">
                        <strong>Preview:</strong> {report.extractedText.substring(0, 150)}
                        {report.extractedText.length > 150 && '...'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button 
                      variant="outline" 
                      className="px-3"
                      onClick={() => viewExtractedText(report.extractedText, report.fileName)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <button 
                      onClick={() => report.id && deleteReport(report.id)} 
                      className="text-gray-400 hover:text-red-600 transition-colors p-2"
                      title="Delete report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}