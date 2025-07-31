'use client';

import { useState } from 'react';
import { Calendar, FileText, Activity, Clock, Filter, Search } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { mockTimelineEvents } from '@/lib/mockData';
import { formatDate, getRiskBadgeColor } from '@/lib/utils';

export default function HistoryPage() {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = mockTimelineEvents.filter(event => {
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'test', label: 'Tests' },
    { value: 'visit', label: 'Visits' },
    { value: 'report', label: 'Reports' },
    { value: 'symptom', label: 'Symptoms' }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'test':
        return Activity;
      case 'visit':
        return Calendar;
      case 'report':
        return FileText;
      case 'symptom':
        return Clock;
      default:
        return Activity;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patient History Timeline</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive timeline of your medical events, tests, and treatments
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            {eventTypes.map(type => (
              <Button
                key={type.value}
                variant={filterType === type.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType(type.value)}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        <div className="space-y-8">
          {filteredEvents.map((event, index) => {
            const IconComponent = getEventIcon(event.type);
            return (
              <div key={event.id} className="relative flex items-start space-x-6">
                <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 border-white shadow-md ${
                  event.severity === 'high' ? 'bg-danger-100' :
                  event.severity === 'medium' ? 'bg-warning-100' :
                  'bg-success-100'
                }`}>
                  <IconComponent className={`h-6 w-6 ${
                    event.severity === 'high' ? 'text-danger-600' :
                    event.severity === 'medium' ? 'text-warning-600' :
                    'text-success-600'
                  }`} />
                </div>
                <Card className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{formatDate(event.date)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {event.severity && (
                        <Badge className={getRiskBadgeColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      )}
                      <Badge variant="default">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={event.status === 'completed' ? 'success' : 'warning'}
                    >
                      {event.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
