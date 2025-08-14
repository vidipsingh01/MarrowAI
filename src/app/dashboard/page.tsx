'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Activity,
  FileText,
  Download,
  Eye
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { mockDashboardStats, mockBloodCounts, mockPatient, mockReports, mockRiskAssessment } from '@/lib/mockData';
import { formatDate, getRiskBadgeColor } from '@/lib/utils';
import { mockData } from '@/lib/mockData';

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stats, setStats] = useState(mockDashboardStats);
  const allAnalyticsData = mockData.analyticsData;

  const filteredData = useMemo(() => {
      let startDate = new Date();
      
      switch (selectedPeriod) {
        case 'all':
        default:
          startDate = new Date(0);
          break;
      }
      
      return allAnalyticsData.filter(d => new Date(d.date) >= startDate);
    }, [selectedPeriod, allAnalyticsData]);

  // Data for charts
  const symptomFrequencyMap = filteredData.reduce((acc, d) => {
    d.symptoms.forEach(s => {
      acc.set(s, (acc.get(s) || 0) + 1);
    });
    return acc;
  }, new Map<string, number>());
  const symptomFrequencyData = Array.from(symptomFrequencyMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Show top 5

  const reportTypeDistributionMap = filteredData.reduce((acc, d) => {
    if (d.reportType) {
      acc.set(d.reportType, (acc.get(d.reportType) || 0) + 1);
    }
    return acc;
  }, new Map<string, number>());
  const reportTypeDistributionData = Array.from(reportTypeDistributionMap.entries())
    .map(([name, value]) => ({ name, value, color: getColorForReportType(name) }));

  function getColorForReportType(type: string): string {
    switch(type) {
      case 'blood_test': return '#ef4444'; // red
      case 'biopsy': return '#f59e0b'; // amber
      case 'imaging': return '#22c55e'; // green
      case 'genetic': return '#3b82f6'; // blue
      default: return '#6b7280'; // gray
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Patient: {mockPatient.name} • Last updated: {formatDate(stats.lastUpdate)}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" className=' hover:bg-gray-200'>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Risk Level</p>
              <p className="text-2xl font-bold text-gray-900">{mockRiskAssessment.score}/100</p>
              <Badge className={getRiskBadgeColor(mockRiskAssessment.riskLevel)}>
                {mockRiskAssessment.riskLevel.toUpperCase()}
              </Badge>
            </div>
            <div className="p-3 bg-danger-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-danger-600" />
            </div>
          </div>
          <Progress 
            value={mockRiskAssessment.score} 
            color="danger" 
            className="mt-4" 
            size="sm"
          />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Latest WBC</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-danger-600">
                  {mockBloodCounts[mockBloodCounts.length - 1].wbc}
                </p>
                <TrendingDown className="h-4 w-4 text-danger-600" />
              </div>
              <p className="text-xs text-gray-500">Normal: 4.0-11.0 ×10³/μL</p>
            </div>
            <div className="p-3 bg-medical-100 rounded-full">
              <Activity className="h-6 w-6 text-medical-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hemoglobin</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-danger-600">
                  {mockBloodCounts[mockBloodCounts.length - 1].hemoglobin}
                </p>
                <TrendingDown className="h-4 w-4 text-danger-600" />
              </div>
              <p className="text-xs text-gray-500">Normal: 12.0-16.0 g/dL</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-full">
              <TrendingDown className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Platelets</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-danger-600">
                  {mockBloodCounts[mockBloodCounts.length - 1].platelets}
                </p>
                <TrendingDown className="h-4 w-4 text-danger-600" />
              </div>
              <p className="text-xs text-gray-500">Normal: 150-450 ×10³/μL</p>
            </div>
            <div className="p-3 bg-danger-100 rounded-full">
              <TrendingDown className="h-6 w-6 text-danger-600" />
            </div>
          </div>
        </Card>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
            <Link href="/reports">
              <Button variant="outline" size="sm" className='hover:bg-gray-200'>View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {mockReports.slice(0, 4).map((report) => (
              <div key={report.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-medical-100 rounded-lg">
                    <FileText className="h-4 w-4 text-medical-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{report.title}</p>
                    <p className="text-xs text-gray-600">{formatDate(report.date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    className={
                      report.status === 'completed' ? 'bg-success-100 text-success-800 border-success-200' :
                      report.status === 'processing' ? 'bg-warning-100 text-warning-800 border-warning-200' :
                      'bg-gray-100 text-gray-800 border-gray-200'
                    }
                  >
                    {report.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className='hover:bg-gray-200 p-2'>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Recommendations</h3>
          <div className="space-y-4">
            {mockRiskAssessment.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-100 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-danger-100 rounded-full mb-6">
            <AlertTriangle className="h-12 w-12 text-danger-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            {mockRiskAssessment.score}/100
          </h2>
          <Badge className={`${getRiskBadgeColor(mockRiskAssessment.riskLevel)} text-xl px-6 py-3 mb-4`}>
            {mockRiskAssessment.riskLevel.toUpperCase()} RISK
          </Badge>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Based on your current symptoms, blood counts, and medical history, our AI analysis 
            indicates a high risk for severe aplastic anemia requiring immediate medical attention.
          </p>
          <Progress 
            value={mockRiskAssessment.score} 
            color="danger" 
            className="max-w-md mx-auto"
            showValue
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top 5 Reported Symptoms</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symptomFrequencyData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p className="text-xs text-gray-500">*Frequency of reported symptoms in the selected period.</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Report Type Distribution</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportTypeDistributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {reportTypeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>


      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/upload">
            <Button variant="outline" className="w-full justify-start h-auto p-4 hover:bg-gray-200">
              <FileText className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Upload New Report</div>
                <div className="text-sm text-gray-600">CBC, biopsy, or imaging</div>
              </div>
            </Button>
          </Link>
          <Link href="/symptoms">
            <Button variant="outline" className="w-full justify-start h-auto p-4 hover:bg-gray-200">
              <Activity className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Symptom Checker</div>
                <div className="text-sm text-gray-600">Assess current symptoms</div>
              </div>
            </Button>
          </Link>
          <Link href="/analytics">
            <Button variant="outline" className="w-full justify-start h-auto p-4 hover:bg-gray-200">
              <TrendingUp className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">View Analytics</div>
                <div className="text-sm text-gray-600">Detailed data analysis</div>
              </div>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
