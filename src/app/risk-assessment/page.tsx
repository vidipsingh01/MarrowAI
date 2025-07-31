'use client';

import { useState } from 'react';
import { AlertTriangle, TrendingUp, Brain, Calendar, Download } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { mockRiskAssessment, mockBloodCounts } from '@/lib/mockData';
import { getRiskBadgeColor, formatDate } from '@/lib/utils';

export default function RiskAssessmentPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('current');

  const riskFactorData = mockRiskAssessment.factors.map(factor => ({
    name: factor.factor.replace(' ', '\n'),
    impact: factor.impact,
    severity: factor.severity
  }));

  const riskDistribution = [
    { name: 'High Risk Factors', value: 65, color: '#ef4444' },
    { name: 'Medium Risk Factors', value: 22, color: '#f59e0b' },
    { name: 'Low Risk Factors', value: 13, color: '#22c55e' }
  ];

  const trendData = mockBloodCounts.map((count, index) => ({
    date: formatDate(count.date),
    riskScore: Math.max(20, 90 - (index * 5) + Math.random() * 10)
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Risk Assessment</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive risk analysis for aplastic anemia and bone marrow disorders
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Assessment
          </Button>
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Follow-up
          </Button>
        </div>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
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
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Risk Analysis</h3>
        <div className="space-y-4">
          {mockRiskAssessment.factors.map((factor, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{factor.factor}</h4>
                <div className="flex items-center space-x-2">
                  <Badge className={getRiskBadgeColor(factor.severity)}>
                    {factor.severity}
                  </Badge>
                  <span className="text-sm text-gray-600">{factor.impact}% impact</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{factor.description}</p>
              <Progress value={factor.impact} color="danger" size="sm" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Immediate Actions</h4>
            <div className="space-y-3">
              {mockRiskAssessment.recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-danger-50 rounded-lg">
                  <div className="w-2 h-2 bg-danger-600 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-900">{rec}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Long-term Management</h4>
            <div className="space-y-3">
              {mockRiskAssessment.recommendations.slice(3).map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-medical-50 rounded-lg">
                  <div className="w-2 h-2 bg-medical-600 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-900">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
