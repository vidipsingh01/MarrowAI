'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Eye,
  Calendar,
  FlaskConical,
  Dna,
  Trash
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useReportsManager } from './hooks/useReportsManager';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export default function ReportsPage() {
  const { reports, isLoading, formatDate, loading, error, deleteReport } = useReportsManager();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'cbc':
        return FlaskConical;
      case 'biopsy':
        return Dna;
      case 'imaging':
        return Eye;
      default:
        return FileText;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading reports</div>;

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

  // Filter reports to show only AI-analyzed ones
  const aiAnalyzedReports = reports.filter(report => report.aiAnalyzed);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Reports</h1>
          <p className="text-gray-600 mt-2">
            Access and manage all your medical reports in one place.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href="/upload">
            <Button size="sm" className='bg-gray-200 hover:bg-gray-300'>
              <FileText className="h-4 w-4 mr-2" />
              Upload New Report
            </Button>
          </Link>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="p-6 text-center text-gray-500">
            <h3 className="text-xl font-semibold mb-2">Loading Reports...</h3>
          </Card>
        ) : aiAnalyzedReports.length > 0 ? (
          aiAnalyzedReports.map((report) => {
            const IconComponent = getReportIcon(report.reportType || 'default');

            return (
              <Card key={report.id} className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-medical-100 rounded-lg flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-medical-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{report.fileName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="inline-flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(report.uploadDate)}</span>
                        </span>
                        {report.lastModified && (
                          <span className="ml-4">
                            Last Modified: {formatDate(report.lastModified)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => report.id && handleDelete(report.id)}
                        className='hover:bg-red-600 hover:text-white'
                        disabled={!report.id}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-6 text-center text-gray-500">
            <h3 className="text-xl font-semibold mb-2">No AI-Analyzed Reports Found</h3>
            <p>
              We couldn&apos;t find any AI-analyzed reports. Upload and analyze a new report to get started.
            </p>
          </Card>
        )}
      </div>

      {/* Information Panel */}
      <Card className="p-6 border-l-4 border-medical-500 bg-medical-50">
        <div className="flex items-start space-x-4">
          <FileText className="h-6 w-6 text-medical-500 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About Your Reports</h3>
            <p className="text-sm text-gray-600">
              Your medical reports are securely stored and analyzed by our AI system to provide a comprehensive health overview.
              Reports with a &quot;processing&quot; status are currently being analyzed and will be available shortly.
            </p>
          </div>
        </div>
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
