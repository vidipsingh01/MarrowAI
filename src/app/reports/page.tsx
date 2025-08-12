'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  Search,
  Filter,
  Eye,
  Calendar,
  AlertTriangle,
  FlaskConical,
  Dna
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { mockData } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const reportTypes = [
    { value: 'all', label: 'All' },
    { value: 'cbc', label: 'Blood Tests' },
    { value: 'biopsy', label: 'Biopsy' },
    { value: 'imaging', label: 'Imaging' },
  ];

  const filteredReports = useMemo(() => {
    return mockData.reports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || report.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, filterType]);

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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'processing':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'error':
        return 'bg-danger-100 text-danger-800 border-danger-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
          <Button size="sm" className='bg-gray-200 hover:bg-gray-300'>
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
          <Link href="/upload">
            <Button size="sm" className='bg-gray-200 hover:bg-gray-300'>
              <FileText className="h-4 w-4 mr-2" />
              Upload New Report
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Section */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="h-4 w-4" />
              </span>
              <Input
                placeholder="Search reports by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            {reportTypes.map(type => (
              <Button
                key={type.value}
                variant={filterType === type.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType(type.value)}
                className='hover:bg-gray-200 bg-gray-200'
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => {
            const IconComponent = getReportIcon(report.type);
            const statusColor = getStatusBadgeColor(report.status);

            return (
              <Card key={report.id} className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-medical-100 rounded-lg flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-medical-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="inline-flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(report.date)}</span>
                        </span>
                        <span className="ml-4">
                          Uploaded on: {formatDate(report.uploadedAt)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <Badge className={statusColor}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-6 text-center text-gray-500">
            <h3 className="text-xl font-semibold mb-2">No Reports Found</h3>
            <p>
              We couldn't find any reports matching your search criteria. Try a different filter or search term.
            </p>
          </Card>
        )}
      </div>

      {/* Information Panel */}
      <Card className="p-6 border-l-4 border-medical-500 bg-medical-50">
        <div className="flex items-start space-x-4">
          <FileText className="h-6 w-6 text-medical-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About Your Reports</h3>
            <p className="text-sm text-gray-600">
              Your medical reports are securely stored and analyzed by our AI system to provide a comprehensive health overview.
              Reports with a "processing" status are currently being analyzed and will be available shortly.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}