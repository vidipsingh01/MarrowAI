'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Clock,
  Upload,
  Search,
  Brain,
  BarChart3
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { mockDashboardStats, mockBloodCounts } from '@/lib/mockData';
import { formatDate, getRiskBadgeColor } from '@/lib/utils';

export default function HomePage() {
  const [stats, setStats] = useState(mockDashboardStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const quickActions = [
    {
      title: 'Upload Report',
      description: 'Upload CBC, biopsy, or imaging files',
      icon: Upload,
      href: '/upload',
      color: 'bg-medical-500'
    },
    {
      title: 'Symptom Check',
      description: 'Check symptoms and get risk assessment',
      icon: Search,
      href: '/symptoms',
      color: 'bg-warning-500'
    },
    {
      title: 'AI Analysis',
      description: 'Get AI-powered risk stratification',
      icon: Brain,
      href: '/risk-assessment',
      color: 'bg-purple-500'
    },
    {
      title: 'View Analytics',
      description: 'Explore trends and visualizations',
      icon: BarChart3,
      href: '/analytics',
      color: 'bg-success-500'
    }
  ];

  const recentTrends = mockBloodCounts.slice(-3).map(count => ({
    date: count.date,
    wbc: count.wbc,
    hemoglobin: count.hemoglobin,
    platelets: count.platelets
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MarrowAI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-medical-600">MarrowAI</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Advanced AI-powered platform for detecting and managing aplastic anemia 
          and bone marrow-related diseases. Get instant analysis, risk assessment, 
          and personalized recommendations.
        </p>
      </div>

      {stats.highRiskAlerts > 0 && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-danger-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-danger-800">
                High Risk Alert
              </h3>
              <p className="text-sm text-danger-700">
                You have {stats.highRiskAlerts} high-risk findings that require immediate attention.
                <Link href="/dashboard" className="ml-2 underline hover:no-underline">
                  View Details
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-medical-100">
              <FileText className="h-6 w-6 text-medical-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-warning-100">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Analysis</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingAnalysis}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-danger-100">
              <AlertTriangle className="h-6 w-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Risk Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.highRiskAlerts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-success-100">
              <TrendingUp className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Update</p>
              <p className="text-sm font-bold text-gray-900">
                {formatDate(stats.lastUpdate)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={index}
                href={action.href}
                className="group block"
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-200">
                  <div className={`inline-flex p-3 rounded-lg ${action.color} mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-medical-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {action.description}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recentActivity.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  event.severity === 'high' ? 'bg-danger-500' :
                  event.severity === 'medium' ? 'bg-warning-500' :
                  'bg-success-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-600 truncate">{event.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(event.date)}</p>
                </div>
                {event.severity && (
                  <Badge className={getRiskBadgeColor(event.severity)}>
                    {event.severity}
                  </Badge>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              href="/history"
              className="text-sm text-medical-600 hover:text-medical-700 font-medium"
            >
              View all activity →
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Blood Counts</h3>
          <div className="space-y-4">
            {recentTrends.map((trend, index) => (
              <div key={index} className="border-l-4 border-medical-200 pl-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(trend.date)}
                  </span>
                  <Badge className={
                    trend.wbc < 4.0 || trend.hemoglobin < 12.0 || trend.platelets < 150
                      ? 'bg-danger-100 text-danger-800 border-danger-200'
                      : 'bg-success-100 text-success-800 border-success-200'
                  }>
                    {trend.wbc < 4.0 || trend.hemoglobin < 12.0 || trend.platelets < 150
                      ? 'Abnormal' : 'Normal'}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">WBC:</span>
                    <span className={`ml-1 font-medium ${
                      trend.wbc < 4.0 ? 'text-danger-600' : 'text-gray-900'
                    }`}>
                      {trend.wbc}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Hgb:</span>
                    <span className={`ml-1 font-medium ${
                      trend.hemoglobin < 12.0 ? 'text-danger-600' : 'text-gray-900'
                    }`}>
                      {trend.hemoglobin}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">PLT:</span>
                    <span className={`ml-1 font-medium ${
                      trend.platelets < 150 ? 'text-danger-600' : 'text-gray-900'
                    }`}>
                      {trend.platelets}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              href="/analytics"
              className="text-sm text-medical-600 hover:text-medical-700 font-medium"
            >
              View detailed trends →
            </Link>
          </div>
        </Card>
      </div>

      <Card className="p-8 bg-gradient-to-r from-medical-50 to-blue-50 border-medical-200">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center mb-4">
            <Activity className="h-8 w-8 text-medical-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Understanding Aplastic Anemia
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Aplastic anemia is a rare but serious blood disorder where your bone marrow 
            doesn&apos;t make enough new blood cells. Early detection and proper management 
            are crucial for better outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/symptoms"
              className="inline-flex items-center px-6 py-3 border border-medical-300 text-base font-medium rounded-md text-medical-700 bg-white hover:bg-medical-50 transition-colors"
            >
              Check Symptoms
            </Link>
            <Link
              href="/upload"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-medical-600 hover:bg-medical-700 transition-colors"
            >
              Upload Report
            </Link>
          </div>
        </div>
      </Card>

      <div className="text-center text-sm text-gray-500 py-8">
        <p>
          MarrowAI is designed to assist healthcare professionals in the analysis of hematological conditions.
          Always consult with qualified medical professionals for diagnosis and treatment decisions.
        </p>
      </div>
    </div>
  );
}
