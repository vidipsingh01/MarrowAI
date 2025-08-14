'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LayoutDashboard,
  Upload,
  Stethoscope,
  FileText,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  MessageCircle, 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUI } from '@/context/UIContext';

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    description: 'Welcome and overview',
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Patient overview and alerts',
  },
  {
    name: 'Upload Report',
    href: '/upload',
    icon: Upload,
    description: 'Upload medical documents',
  },
  {
    name: 'Symptom Checker',
    href: '/symptoms',
    icon: Stethoscope,
    description: 'Check symptoms and risk',
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    description: 'View all medical reports',
  },
  {
    name: 'Connect', 
    href: '/connect',
    icon: MessageCircle,
    description: 'Connect with doctors',
  },
];

const secondaryItems = [
  {
    name: 'Help & Support',
    href: '/help',
    icon: HelpCircle,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname();
  const { searchTerm } = useUI();
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !collapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [collapsed]);

  const filteredNavigationItems = useMemo(() => {
    if (!searchTerm) return navigationItems;

    const lowerCaseSearch = searchTerm.toLowerCase();
    return navigationItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerCaseSearch) ||
        item.description.toLowerCase().includes(lowerCaseSearch)
    );
  }, [searchTerm]);

  const filteredSecondaryItems = useMemo(() => {
    if (!searchTerm) return secondaryItems;

    const lowerCaseSearch = searchTerm.toLowerCase();
    return secondaryItems.filter((item) =>
      item.name.toLowerCase().includes(lowerCaseSearch)
    );
  }, [searchTerm]);

  return (
    <div
      ref={sidebarRef}
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-end p-2 border-b border-gray-200">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-8" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredNavigationItems.length > 0 ? (
            filteredNavigationItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => !collapsed && setCollapsed(true)}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-gray-200 text-black'
                      : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <IconComponent
                    className={cn(
                      'flex-shrink-0 h-5 w-5',
                      isActive
                        ? 'text-medical-600'
                        : 'text-gray-400 group-hover:text-gray-600',
                      collapsed ? 'mx-auto' : 'mr-3'
                    )}
                  />
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.name}</div>
                      <div className="text-xs text-gray-500 truncate mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  )}
                </Link>
              );
            })
          ) : (
            !collapsed && (
              <div className="p-4 text-center text-sm text-gray-500">
                No results found.
              </div>
            )
          )}
        </nav>

        {/* Bottom Secondary Links */}
        <div className="border-t border-gray-200 p-2 space-y-1">
          {filteredSecondaryItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => !collapsed && setCollapsed(true)}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-gray-200 text-black'
                    : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                )}
                title={collapsed ? item.name : undefined}
              >
                <IconComponent
                  className={cn(
                    'flex-shrink-0 h-5 w-5',
                    isActive
                      ? 'text-medical-600'
                      : 'text-gray-400 group-hover:text-gray-600',
                    collapsed ? 'mx-auto' : 'mr-3'
                  )}
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}