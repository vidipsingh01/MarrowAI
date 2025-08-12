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

    </div>
  );
}
