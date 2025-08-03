'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  File,
  Image,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Brain,
  Download,
  Eye
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import { formatFileSize, getFileType } from '@/lib/utils';

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  prediction?: {
    confidence: number;
    diagnosis: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFileType, setSelectedFileType] = useState<string>('all');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach((uploadedFile, index) => {
      const uploadInterval = setInterval(() => {
        setUploadedFiles(prev =>
          prev.map(f =>
            f.id === uploadedFile.id && f.progress < 100
              ? { ...f, progress: Math.min(f.progress + 10, 100) }
              : f
          )
        );
      }, 200);

      setTimeout(() => {
        clearInterval(uploadInterval);
        setUploadedFiles(prev =>
          prev.map(f =>
            f.id === uploadedFile.id
              ? { ...f, progress: 100, status: 'processing' }
              : f
          )
        );

        setTimeout(() => {
          const mockPrediction = {
            confidence: Math.random() * 30 + 70,
            diagnosis: ['Severe Aplastic Anemia', 'Pancytopenia'],
            riskLevel: 'high' as const
          };

          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === uploadedFile.id
                ? { ...f, status: 'completed', prediction: mockPrediction }
                : f
            )
          );
        }, 3000 + index * 1000);
      }, 2000);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/dicom': ['.dcm'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 50 * 1024 * 1024,
  });

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Clock className="h-4 w-4 text-warning-600" />;
      case 'processing':
        return <Brain className="h-4 w-4 text-medical-600 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-danger-600" />;
    }
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
        return 'success';
      case 'error':
        return 'danger';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'danger';
      default:
        return 'default';
    }
  };

  const fileTypes = [
    { value: 'all', label: 'All Files' },
    { value: 'cbc', label: 'Blood Count (CBC)' },
    { value: 'biopsy', label: 'Bone Marrow Biopsy' },
    { value: 'imaging', label: 'Medical Imaging' },
    { value: 'pathology', label: 'Pathology Reports' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Medical Reports</h1>
        <p className="text-gray-600 mt-2">
          Upload your CBC reports, bone marrow biopsies, imaging studies, or other medical documents 
          for AI-powered analysis and risk assessment.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {fileTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setSelectedFileType(type.value)}
              className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                selectedFileType === type.value
                  ? 'bg-medical-100 border-medical-300 text-medical-900'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors file-upload-area ${
            isDragActive ? 'drag-active' : 'border-gray-300 hover:border-medical-400'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-medical-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isDragActive ? 'Drop files here' : 'Upload your medical reports'}
              </h3>
              <p className="text-gray-600 mt-2">
                Drag and drop files here, or click to browse. Supports PDF, JPEG, PNG, DICOM, and Word documents.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Maximum file size: 50MB per file
              </p>
            </div>
            <Button variant="outline">
              Choose Files
            </Button>
          </div>
        </div>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Uploaded Files</h3>
          <div className="space-y-4">
            {uploadedFiles.map((uploadedFile) => (
              <div key={uploadedFile.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {uploadedFile.file.type.includes('image') ? (
                        <Image className="h-5 w-5 text-gray-600" />
                      ) : (
                        <FileText className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900 truncate">
                          {uploadedFile.file.name}
                        </h4>
                        {getStatusIcon(uploadedFile.status)}
                        <Badge variant={getStatusColor(uploadedFile.status)}>
                          {uploadedFile.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span>{formatFileSize(uploadedFile.file.size)}</span>
                        <span>{getFileType(uploadedFile.file.name)}</span>
                      </div>

                      {uploadedFile.status === 'uploading' && (
                        <Progress 
                          value={uploadedFile.progress} 
                          className="mb-3" 
                          size="sm"
                          showValue
                        />
                      )}

                      {uploadedFile.status === 'processing' && (
                        <div className="mb-3">
                          <div className="flex items-center space-x-2 text-sm text-medical-600">
                            <Brain className="h-4 w-4 animate-pulse" />
                            <span>AI analysis in progress...</span>
                          </div>
                        </div>
                      )}

                      {uploadedFile.status === 'completed' && uploadedFile.prediction && (
                        <div className="bg-gray-50 rounded-lg p-4 mt-3">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900">AI Analysis Results</h5>
                            <Badge variant={getRiskColor(uploadedFile.prediction.riskLevel)}>
                              {uploadedFile.prediction.riskLevel.toUpperCase()} RISK
                            </Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Confidence</span>
                                <span className="text-sm font-medium">
                                  {uploadedFile.prediction.confidence.toFixed(1)}%
                                </span>
                              </div>
                              <Progress 
                                value={uploadedFile.prediction.confidence} 
                                color="primary" 
                                size="sm"
                              />
                            </div>
                            
                            <div>
                              <span className="text-sm text-gray-600">Detected Conditions:</span>
                              <div className="mt-1 space-x-2">
                                {uploadedFile.prediction.diagnosis.map((diagnosis, index) => (
                                  <Badge key={index} variant="info">
                                    {diagnosis}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="border-t border-gray-200 pt-3">
                              <p className="text-sm text-gray-700 mb-3">
                                <strong>Key Findings:</strong> The analysis indicates severe bone marrow 
                                failure with pancytopenia consistent with aplastic anemia. Immediate 
                                hematology consultation is recommended.
                              </p>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download Report
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6 bg-gradient-to-r from-medical-50 to-blue-50 border-medical-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Supported File Types</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• PDF documents (.pdf)</li>
              <li>• Medical images (JPEG, PNG, DICOM)</li>
              <li>• Word documents (.doc, .docx)</li>
              <li>• Laboratory reports</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Best Practices</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Ensure files are clear and readable</li>
              <li>• Include complete patient information</li>
              <li>• Upload most recent reports first</li>
              <li>• Maximum 50MB per file</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-warning-100 rounded-lg">
          <p className="text-sm text-warning-800">
            <strong>Privacy Notice:</strong> All uploaded files are encrypted and processed securely. 
            Reports are analyzed using AI models trained on medical data while maintaining patient confidentiality.
          </p>
        </div>
      </Card>
    </div>
  );
}
