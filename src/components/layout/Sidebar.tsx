'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LayoutDashboard,
  Upload,
  Stethoscope,
  Brain,
  Clock,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    description: 'Welcome and overview'
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Patient overview and alerts'
  },
  {
    name: 'Upload Report',
    href: '/upload',
    icon: Upload,
    description: 'Upload medical documents'
  },
  {
    name: 'Symptom Checker',
    href: '/symptoms',
    icon: Stethoscope,
    description: 'Check symptoms and risk'
  },
  {
    name: 'Risk Assessment',
    href: '/risk-assessment',
    icon: Brain,
    description: 'AI-powered risk analysis'
  },
  {
    name: 'Patient History',
    href: '/history',
    icon: Clock,
    description: 'Timeline of medical events'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Data visualization and trends'
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    description: 'View all medical reports'
  }
];

const secondaryItems = [
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  },
  {
    name: 'Help & Support',
    href: '/help',
    icon: HelpCircle
  }
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={cn(
      'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40 transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex flex-col h-full">
        <div className="flex justify-end p-2 border-b border-gray-200">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-medical-100 text-medical-900 border-r-2 border-medical-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
                title={collapsed ? item.name : undefined}
              >
                <IconComponent className={cn(
                  'flex-shrink-0 h-5 w-5',
                  isActive ? 'text-medical-600' : 'text-gray-400 group-hover:text-gray-600',
                  collapsed ? 'mx-auto' : 'mr-3'
                )} />
                {!collapsed && (
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                )}
                {!collapsed && isActive && (
                  <div className="w-2 h-2 bg-medical-600 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-2 space-y-1">
          {secondaryItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-medical-100 text-medical-900'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
                title={collapsed ? item.name : undefined}
              >
                <IconComponent className={cn(
                  'flex-shrink-0 h-5 w-5',
                  isActive ? 'text-medical-600' : 'text-gray-400 group-hover:text-gray-600',
                  collapsed ? 'mx-auto' : 'mr-3'
                )} />
                {!collapsed && (
                  <span>{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>

        {!collapsed && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
              <div className="text-sm">
                <p className="text-gray-600">System Status</p>
                <p className="text-success-600 font-medium">All systems operational</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
