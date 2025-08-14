'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Activity,
  FileText,
  Eye
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useMedicalReportManager } from '../upload/hooks/useMedicalReportManager';
import { formatDate, getRiskBadgeColor } from '@/lib/utils';

export default function DashboardPage() {
  const { savedReports, loadSavedReports } = useMedicalReportManager();
  const [stats, setStats] = useState({
    lastUpdate: new Date().toISOString(),
    highRiskAlerts: 0,
    recentActivity: [],
    bloodCountTrends: [],
  });

  useEffect(() => {
    loadSavedReports();
  }, [loadSavedReports]);

  // Filter savedReports to include only AI-analyzed reports
  const aiAnalyzedReports = savedReports.filter(report => report.aiAnalyzed);

  useEffect(() => {
    if (aiAnalyzedReports.length > 0) {
      const latestReport = aiAnalyzedReports.reduce((latest, current) =>
        new Date(latest.uploadDate) > new Date(current.uploadDate) ? latest : current
      );
      setStats({
        lastUpdate: latestReport.uploadDate,
        highRiskAlerts: aiAnalyzedReports.filter(r => r.aiInsights?.riskScore >= 70).length,
        recentActivity: aiAnalyzedReports.map(r => ({
          id: r.id,
          title: `Uploaded ${r.fileName}`,
          description: `Type: ${r.reportType}`,
          date: r.uploadDate,
        })).slice(0, 5),
        bloodCountTrends: aiAnalyzedReports.map(r => ({
          id: r.id,
          date: r.uploadDate,
          wbc: r.aiInsights?.wbc || 0,
          hemoglobin: r.aiInsights?.hemoglobin || 0,
          platelets: r.aiInsights?.platelets || 0,
        })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
      });
    } else {
      setStats({
        lastUpdate: new Date().toISOString(),
        highRiskAlerts: 0,
        recentActivity: [],
        bloodCountTrends: [],
      });
    }
  }, [aiAnalyzedReports]);

  // Use blood count metrics for Pie Chart
  const bloodCountData = useMemo(() => {
    const latest = stats.bloodCountTrends[0] || { wbc: 0, hemoglobin: 0, platelets: 0 };
    return [
      { name: 'WBC', value: latest.wbc, color: '#ef4444', normalRange: '4.0-11.0 ×10³/μL' },
      { name: 'Hemoglobin', value: latest.hemoglobin, color: '#f59e0b', normalRange: '12.0-16.0 g/dL' },
      { name: 'Platelets', value: latest.platelets, color: '#22c55e', normalRange: '150-450 ×10³/μL' },
    ].filter(item => item.value > 0); // Ensure only valid data is included
  }, [stats.bloodCountTrends]);

  // Use blood count metrics as categories for Bar Chart
  const bloodCountBarData = useMemo(() => {
    const latest = stats.bloodCountTrends[0] || { wbc: 0, hemoglobin: 0, platelets: 0 };
    return [
      { name: 'WBC', value: latest.wbc, normalRange: '4.0-11.0 ×10³/μL' },
      { name: 'Hemoglobin', value: latest.hemoglobin, normalRange: '12.0-16.0 g/dL' },
      { name: 'Platelets', value: latest.platelets, normalRange: '150-450 ×10³/μL' },
    ].filter(item => item.value > 0); // Ensure only valid data is included
  }, [stats.bloodCountTrends]);

  const latestCounts = stats.bloodCountTrends[0] || { wbc: 0, hemoglobin: 0, platelets: 0 };
  const riskAssessment = aiAnalyzedReports.length > 0 ? aiAnalyzedReports[0].aiInsights || { riskScore: 0, riskLevel: 'low', recommendations: [] } : { riskScore: 0, riskLevel: 'low', recommendations: [] };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Dashboard</h1>
          <p className="text-gray-600 mt-2">Last updated: {formatDate(stats.lastUpdate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Risk Level</p>
              <p className="text-2xl font-bold text-gray-900">{riskAssessment.riskScore}/100</p>
              <Badge className={getRiskBadgeColor(riskAssessment.riskLevel)}>
                {riskAssessment.riskLevel.toUpperCase()}
              </Badge>
            </div>
            <div className="p-3 bg-danger-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-danger-600" />
            </div>
          </div>
          <Progress value={riskAssessment.riskScore} color="danger" className="mt-4" size="sm" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Latest WBC</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-danger-600">{latestCounts.wbc}</p>
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
                <p className="text-2xl font-bold text-danger-600">{latestCounts.hemoglobin}</p>
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
                <p className="text-2xl font-bold text-danger-600">{latestCounts.platelets}</p>
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
              <Button variant="outline" size="sm" className="hover:bg-gray-200">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {aiAnalyzedReports.slice(0, 4).map((report) => (
              <div key={report.id} className="flex items-center bg-gray-100 px-2 rounded-lg justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-medical-100 rounded-lg">
                    <FileText className="h-4 w-4 text-medical-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{report.fileName}</p>
                    <p className="text-xs text-gray-600">{formatDate(report.uploadDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="hover:bg-gray-200 p-2">
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
            {riskAssessment.recommendations.map((recommendation, index) => (
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
          <h2 className="text-4xl font-bold text-gray-900 mb-2">{riskAssessment.riskScore}/100</h2>
          <Badge className={`${getRiskBadgeColor(riskAssessment.riskLevel)} text-xl px-6 py-3 mb-4`}>
            {riskAssessment.riskLevel.toUpperCase()} RISK
          </Badge>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Based on your current data, our AI analysis indicates a {riskAssessment.riskLevel} risk level.
          </p>
          <Progress value={riskAssessment.riskScore} color="danger" className="max-w-md mx-auto" showValue />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Blood Count Metrics</h3>
          <div className="h-80">
            {bloodCountBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bloodCountBarData} margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value, `${name} (Normal: ${bloodCountBarData.find(d => d.name === name)?.normalRange})`]} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center h-full flex items-center justify-center text-gray-500">
                No blood count data available. Upload more analyzed reports for insights.
              </div>
            )}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p className="text-xs text-gray-500">*Latest blood count values from analyzed reports.</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Blood Count Distribution</h3>
          <div className="h-80 flex items-center justify-center">
            {bloodCountData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bloodCountData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {bloodCountData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, `${name} (Normal: ${bloodCountData.find(d => d.name === name)?.normalRange})`]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center h-full flex items-center justify-center text-gray-500">
                No blood count data available. Upload more analyzed reports for distribution.
              </div>
            )}
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
