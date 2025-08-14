'use client';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle, AlertCircle, Clock, Brain, Eye, Trash2, Search } from 'lucide-react';
import { useMedicalReportManager } from './hooks/useMedicalReportManager';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useState } from 'react';

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

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => 
  <div className={`bg-white shadow-md rounded-lg ${className}`}>{children}</div>;
const Button = ({ children, variant, className, ...props }: { 
  children: React.ReactNode, variant?: string, className?: string, [key: string]: unknown 
}) => 
  <button className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${className}`} {...props}>
    {children}
  </button>;
const Input = ({ className, ...props }: { className?: string, [key: string]: unknown }) =>
  <input className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props} />;
const Select = ({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: unknown }) =>
  <select className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props}>
    {children}
  </select>;

export default function UploadPage() {
  const {
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
    onDrop,
    removeFile,
    deleteReport,
    searchReports,
    viewExtractedText,
    formatFileSize,
    getFileType,
    REPORT_TYPES,
  } = useMedicalReportManager();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 50 * 1024 * 1024,
    disabled: !user,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);

  const handleDelete = (reportId: string) => {
    setReportToDelete(reportId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (reportToDelete) {
      await deleteReport(reportToDelete);
    }
    setDeleteModalOpen(false);
    setReportToDelete(null);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error.message}</div>;
  if (!user) return <div className="p-8 text-center">Please log in to upload medical reports.</div>;

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'uploading': return <Clock className="h-4 w-4 text-yellow-600 animate-spin" />;
      case 'processing': return <Brain className="h-4 w-4 text-blue-600 animate-pulse" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  // Filter savedReports to show only AI-analyzed reports
  const aiAnalyzedReports = savedReports.filter(report => report.aiAnalyzed);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Medical Report Manager</h1>
        <p className="text-gray-600 mt-2">Upload PDF medical reports for AI-powered health insights</p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Upload New Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <Select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full">
              {REPORT_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <Input type="text" placeholder="Add notes about this report..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full" />
          </div>
        </div>

        <div
          {...getRootProps()}
          className={'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors' }
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-2 font-semibold">
            {isDragActive ? 'Drop PDF files here' : 'Drag & drop PDF files here, or click to select'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Maximum file size: 50MB</p>
          {/* {(savedReports.length >= 1 || uploadedFiles.length >= 1) && (
            <p className="text-sm text-red-600 mt-2">Limit reached: Only one file can be uploaded at a time.</p>
          )} */}
        </div>
      </Card>

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
                      <p className="text-sm text-gray-500">{getFileType(uploadedFile.file.name)}</p>
                      <div className="flex items-center space-x-2 text-sm mt-1">
                        {getStatusIcon(uploadedFile.status)}
                        <span>{uploadedFile.status.charAt(0).toUpperCase() + uploadedFile.status.slice(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => removeFile(uploadedFile.id)} className="text-gray-400 hover:text-red-600 transition-colors">
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
                    <p className="text-sm text-green-600">Successfully processed and saved to your medical records</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-center justify-between space-x-2">
          <h3 className="text-lg font-semibold">Your Medical Reports ({aiAnalyzedReports.length})</h3>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
              onKeyPress={(e) => e.key === 'Enter' && searchReports()}
            />
            <Button onClick={searchReports} className="px-3 py-1">
              <Search className="h-6 w-4" />
            </Button>
          </div>
        </div>

        {isLoadingReports ? (
          <div className="text-center py-8">
            <Brain className="h-8 w-8 mx-auto animate-pulse text-blue-600" />
            <p className="text-gray-500 mt-2">Loading your reports...</p>
          </div>
        ) : aiAnalyzedReports.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-gray-400" />
            <p className="text-gray-500 mt-2">No AI-analyzed medical reports found</p>
            <p className="text-sm text-gray-400">Upload and analyze a PDF report to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {aiAnalyzedReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 mt-4 hover:shadow-md transition-shadow">
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
                        {report.aiAnalyzed && <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">AI Analyzed</span>}
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        <span>{report.pdfInfo.numPages} pages</span>
                      </div>
                      {report.notes && <div className="text-sm text-gray-600 mb-2 italic">Notes: {report.notes}</div>}
                      {report.aiInsights && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <h4 className="font-medium text-blue-900 mb-2">AI Insights</h4>
                          <p className="text-sm text-blue-800 mb-2">Risk Score: {report.aiInsights.riskScore}/100</p>
                          <p className="text-sm text-blue-800 mb-2">Risk Level: {report.aiInsights.riskLevel}</p>
                          <p className="text-sm text-blue-800 mb-2">WBC: {report.aiInsights.wbc} ×10³/μL</p>
                          <p className="text-sm text-blue-800 mb-2">Hemoglobin: {report.aiInsights.hemoglobin} g/dL</p>
                          <p className="text-sm text-blue-800 mb-2">Platelets: {report.aiInsights.platelets} ×10³/μL</p>
                          {report.aiInsights.recommendations.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-blue-900 mb-1">Recommendations:</p>
                              <ul className="text-sm text-blue-800 list-disc list-inside">
                                {report.aiInsights.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-2 max-h-16 overflow-hidden">
                        <strong>Preview:</strong> {report.extractedText?.substring(0, 150) || ''}{report.extractedText?.length > 150 && '...'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => report.id && handleDelete(report.id)}
                      className="text-gray-400 hover:text-white hover:bg-red-600 transition-colors p-2 rounded-lg"
                      title="Delete report"
                      disabled={!report.id}
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
      
      <div>
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this report? This action cannot be undone."
        />
      </div>
    </div>
  );
}