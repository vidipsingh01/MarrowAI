'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Activity,
  FileText,
  Clock,
  Users,
  Calendar,
  Download,
  Eye
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockDashboardStats, mockBloodCounts, mockPatient, mockReports, mockRiskAssessment } from '@/lib/mockData';
import { formatDate, getRiskBadgeColor, formatNumber } from '@/lib/utils';

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('3months');
  const [stats, setStats] = useState(mockDashboardStats);

  const bloodCountTrendData = mockBloodCounts.map(count => ({
    date: formatDate(count.date),
    WBC: count.wbc,
    RBC: count.rbc,
    Hemoglobin: count.hemoglobin,
    Platelets: count.platelets / 10
  }));

  const riskFactorData = mockRiskAssessment.factors.map(factor => ({
    name: factor.factor.split(' ').slice(0, 2).join(' '),
    impact: factor.impact,
    severity: factor.severity
  }));

  const getAlertLevel = (count: number) => {
    if (count >= 3) return { color: 'danger', label: 'Critical' };
    if (count >= 1) return { color: 'warning', label: 'Attention' };
    return { color: 'success', label: 'Normal' };
  };

  const alertLevel = getAlertLevel(stats.highRiskAlerts);

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
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>
      </div>

      {stats.highRiskAlerts > 0 && (
        <Card className="border-l-4 border-danger-500 bg-danger-50">
          <div className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-danger-600 mr-3" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-danger-900">Critical Alerts Require Attention</h3>
                <p className="text-danger-700 mt-1">
                  You have {stats.highRiskAlerts} high-risk findings that need immediate medical attention.
                  Your latest blood counts show severe pancytopenia consistent with your aplastic anemia diagnosis.
                </p>
                <div className="mt-3 flex space-x-3">
                  <Link href="/risk-assessment">
                    <Button variant="danger" size="sm">View Risk Assessment</Button>
                  </Link>
                  <Link href="/reports">
                    <Button variant="outline" size="sm">View Reports</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

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
            <h3 className="text-lg font-semibold text-gray-900">Blood Count Trends</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-medical-500"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bloodCountTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="WBC" stroke="#ef4444" strokeWidth={2} name="WBC (×10³/μL)" />
                <Line type="monotone" dataKey="Hemoglobin" stroke="#f59e0b" strokeWidth={2} name="Hemoglobin (g/dL)" />
                <Line type="monotone" dataKey="Platelets" stroke="#3b82f6" strokeWidth={2} name="Platelets (×10⁴/μL)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>* Red lines indicate values below normal range</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Factor Impact</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskFactorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="impact" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {mockRiskAssessment.factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{factor.factor}</span>
                <Badge className={getRiskBadgeColor(factor.severity)}>
                  {factor.severity}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
            <Link href="/reports">
              <Button variant="outline" size="sm">View All</Button>
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
                  <Button variant="ghost" size="sm">
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
              <div key={index} className="flex items-start space-x-3 p-3 bg-medical-50 rounded-lg">
                <div className="w-2 h-2 bg-medical-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{recommendation}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Link href="/risk-assessment">
              <Button className="w-full">
                View Detailed Risk Assessment
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/upload">
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <FileText className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Upload New Report</div>
                <div className="text-sm text-gray-600">CBC, biopsy, or imaging</div>
              </div>
            </Button>
          </Link>
          <Link href="/symptoms">
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <Activity className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Symptom Checker</div>
                <div className="text-sm text-gray-600">Assess current symptoms</div>
              </div>
            </Button>
          </Link>
          <Link href="/analytics">
            <Button variant="outline" className="w-full justify-start h-auto p-4">
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
