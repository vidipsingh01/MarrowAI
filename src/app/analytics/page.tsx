'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import {
  AlertTriangle,
  TrendingUp,
  FileText,
  Calendar,
  Filter,
  Download,
  Users,
  Activity,
  Heart,
  Droplets,
  FlaskConical,
  Dna
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';
import { mockData } from '@/lib/mockData';
import { getRiskBadgeColor, formatDate } from '@/lib/utils';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const allAnalyticsData = mockData.analyticsData;

  // Filter data based on selected period
  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate = new Date(); // Start with a new Date object to avoid mutation issues.
    
    switch (selectedPeriod) {
      case 'all':
      default:
        startDate = new Date(0); // Epoch time for 'all'
        break;
    }
    
    return allAnalyticsData.filter(d => new Date(d.date) >= startDate);
  }, [selectedPeriod, allAnalyticsData]);

  // Aggregate stats from filtered data
  const aggregatedStats = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        avgRiskScore: 0,
        highRiskDays: 0,
        totalReports: 0,
        symptomCount: 0,
        latestBloodCounts: null,
      };
    }
    
    const totalScore = filteredData.reduce((sum, d) => sum + d.riskScore, 0);
    const highRiskDays = filteredData.filter(d => d.riskScore >= 70).length;
    const totalReports = filteredData.filter(d => d.reportType).length;
    const symptomCount = filteredData.reduce((sum, d) => sum + d.symptoms.length, 0);
    const latestEntry = filteredData[filteredData.length - 1];

    return {
      avgRiskScore: Math.round(totalScore / filteredData.length),
      highRiskDays,
      totalReports,
      symptomCount,
      latestBloodCounts: latestEntry.bloodCounts,
    };
  }, [filteredData]);

  // Data for charts
  const riskTrendData = filteredData.map(d => ({
    date: formatDate(d.date),
    'Risk Score': d.riskScore,
  }));

  const bloodCountComparisonData = aggregatedStats.latestBloodCounts ? [
    { name: 'WBC', value: aggregatedStats.latestBloodCounts.wbc, normalMin: 4, normalMax: 11, unit: 'x10³/μL' },
    { name: 'RBC', value: aggregatedStats.latestBloodCounts.rbc, normalMin: 4.5, normalMax: 5.9, unit: 'x10⁶/μL' },
    { name: 'Hemoglobin', value: aggregatedStats.latestBloodCounts.hemoglobin, normalMin: 12, normalMax: 16, unit: 'g/dL' },
    { name: 'Platelets', value: aggregatedStats.latestBloodCounts.platelets / 100, normalMin: 150, normalMax: 450, unit: 'x10³/μL' },
  ] : [];

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

  const COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'];
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
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Analytics</h1>
          <p className="text-gray-600 mt-2">
            In-depth analysis and trends of your medical data over time.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Follow-up
          </Button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Risk Score</p>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-2xl font-bold text-gray-900">{aggregatedStats.avgRiskScore}/100</p>
              </div>
              <Badge className={getRiskBadgeColor(mockData.analyticsData[mockData.analyticsData.length - 1].riskLevel)}>
                {mockData.analyticsData[mockData.analyticsData.length - 1].riskLevel.toUpperCase()}
              </Badge>
            </div>
            <div className="p-3 bg-medical-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-medical-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk Days</p>
              <p className="text-2xl font-bold text-danger-600 mt-1">{aggregatedStats.highRiskDays}</p>
              <p className="text-xs text-gray-500">days with risk score &gt; 70</p>
            </div>
            <div className="p-3 bg-danger-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-danger-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{aggregatedStats.totalReports}</p>
              <p className="text-xs text-gray-500">in the selected period</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Symptoms Reported</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{aggregatedStats.symptomCount}</p>
              <p className="text-xs text-gray-500">total symptom entries</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-full">
              <Activity className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-medical-500"
          >
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Score Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="Risk Score" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Latest Blood Count vs. Normal Range</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bloodCountComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name, props) => [`${value} ${props.payload.unit}`, name]} />
                <Bar dataKey="value" fill="#3b82f6" />
                {/* Visual indicators for normal range could be added here, e.g., using ReferenceArea or custom components */}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p className="text-xs text-gray-500">*Values are displayed for latest available report. WBC & Hemoglobin values are below normal range.</p>
          </div>
        </Card>
      </div>

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

      {/* Action Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/reports">
            <Button variant="outline" className="w-full justify-start h-auto p-4 hover:bg-gray-200">
              <FileText className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">View All Reports</div>
                <div className="text-sm text-gray-600">Access and manage all reports</div>
              </div>
            </Button>
          </Link>
          <Link href="/history">
            <Button variant="outline" className="w-full justify-start h-auto p-4 hover:bg-gray-200">
              <Activity className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Timeline History</div>
                <div className="text-sm text-gray-600">Review all medical events</div>
              </div>
            </Button>
          </Link>
          <Link href="/risk-assessment">
            <Button variant="outline" className="w-full justify-start h-auto p-4 hover:bg-gray-200">
              <AlertTriangle className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Detailed Risk Assessment</div>
                <div className="text-sm text-gray-600">See AI-powered analysis</div>
              </div>
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" className="w-full justify-start h-auto p-4">
              <Users className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Return to Dashboard</div>
                <div className="text-sm text-gray-200">Go back to the main overview</div>
              </div>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}