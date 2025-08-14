'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { LucideProps } from 'lucide-react';
import Hero from '@/components/Hero';
import {
  Activity,
  FileText,
  Upload,
  Search,
  LayoutDashboard,
  MessageCircle,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import { mockDashboardStats } from '@/lib/mockData';
import type { DashboardStats } from '@/lib/types';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  href: string;
  color: string;
}

export default function HomePage(): JSX.Element {
  const [stats] = useState<DashboardStats>(mockDashboardStats);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const quickActions: QuickAction[] = [
    {
      title: 'Upload Report',
      description: 'Upload CBC, biopsy, or imaging files',
      icon: Upload,
      href: '/upload',
      color: 'bg-primary',
    },
    {
      title: 'Symptom Check',
      description: 'Check symptoms and get risk assessment',
      icon: Search,
      href: '/symptoms',
      color: 'bg-warning',
    },
    {
      title: 'Dashboard',
      description: 'View your health overview and insights',
      icon: LayoutDashboard,
      href: '/dashboard',
      color: 'bg-accent',
    },
    {
      title: 'Reports',
      description: 'Access and review your medical reports',
      icon: FileText,
      href: '/reports',
      color: 'bg-success',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary mx-auto mb-4"></div>
          <p className="text-lg text-foreground/80 font-serif">
            Loading MarrowAI...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero />
      <main className="flex flex-col items-center w-full">
        <div className="container px-4 pt-6 w-full">
          <div className="space-y-12 animate-fade-in">
            {/* Quick Actions */}
            <div>
              <h2 className="text-3xl font-bold mb-2 text-center">
                Quick Actions
              </h2>
              <div className="w-24 h-1 bg-primary mb-6 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="group block"
                  >
                    <Card className="p-6 h-full border border-muted hover:border-primary hover:shadow-lg transition-all duration-300 text-center">
                      <div
                        className={`inline-flex p-3 rounded-lg ${action.color} mb-4`}
                      >
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-accent mb-2 group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {action.description}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* ✅ New Connect Section */}
            <div>
              <h2 className="text-3xl font-bold mb-2 text-center">Connect</h2>
              <div className="w-24 h-1 bg-primary mb-6 mx-auto"></div>
              <Card className="p-8 bg-card border-2 border-primary/20 text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-accent mb-4">
                  Get in Touch with Experts
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Have questions or need guidance? Connect with our medical
                  advisors or support team to get the help you need.
                </p>
                <Link
                  href="/connect"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-md text-primary-foreground bg-primary hover:bg-accent transition-colors"
                >
                  Go to Connect Page
                </Link>
              </Card>
            </div>

            {/* Understanding Your Health Section */}
            <Card className="p-8 bg-card border-2 border-primary/20">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-accent mb-2">
                  Understanding Your Health
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Aplastic anemia is a condition where your bone marrow
                  doesn&apos;t make enough new blood cells. Early detection is
                  crucial. Use our tools to track your health, but always
                  consult a professional.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/symptoms"
                    className="inline-flex items-center justify-center px-6 py-3 border border-primary text-base font-bold rounded-md text-primary bg-card hover:bg-primary/10 transition-colors"
                  >
                    Check Symptoms
                  </Link>
                  <Link
                    href="/upload"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-md text-primary-foreground bg-primary hover:bg-accent transition-colors"
                  >
                    Upload Report
                  </Link>
                </div>
              </div>
            </Card>

            {/* Footer Note */}
            <div className="text-center text-sm text-muted-foreground py-4">
              <p>
                MarrowAI is an assistant tool. Always consult with qualified
                medical professionals for diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
