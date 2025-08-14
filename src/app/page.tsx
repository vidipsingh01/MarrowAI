'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { LucideProps } from 'lucide-react'; // Import types for icons
import Hero from '@/components/Hero';
import {
  Activity,
  FileText,
  AlertTriangle,
  Upload,
  Search,
  LayoutDashboard,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { mockDashboardStats } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';
// Correctly import the types from your types file
import type { DashboardStats, BloodCount, TimelineEvent } from '@/lib/types';

// Define the type for a Quick Action item
interface QuickAction {
  title: string;
  description: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
  href: string;
  color: string;
}

export default function HomePage(): JSX.Element {
  // Use the DashboardStats type for the state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stats, setStats] = useState<DashboardStats>(mockDashboardStats);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Strongly type the quickActions array
  const quickActions: QuickAction[] = [
    { title: 'Upload Report', description: 'Upload CBC, biopsy, or imaging files', icon: Upload, href: '/upload', color: 'bg-primary' },
    { title: 'Symptom Check', description: 'Check symptoms and get risk assessment', icon: Search, href: '/symptoms', color: 'bg-warning' },
    { title: 'Dashboard', description: 'View your health overview and insights', icon: LayoutDashboard, href: '/dashboard', color: 'bg-accent' },
    { title: 'Reports', description: 'Access and review your medical reports', icon: FileText, href: '/reports', color: 'bg-success' },
  ];

  // No longer needed, as we will use stats.bloodCountTrends directly
  // const recentTrends: BloodCount[] = mockBloodCounts.slice(-3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary mx-auto mb-4"></div>
          <p className="text-lg text-foreground/80 font-serif">Loading MarrowAI...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero /> {/* Make sure your Hero component uses the font-serif for its main title! */}
      {/* The main container is now a flex column that centers its children */}
      <main className="flex flex-col items-center w-full">
        {/* This inner div controls the max-width and padding of the content */}
        <div className="container px-4 pt-10 w-full">
          <div className="space-y-12 animate-fade-in">
            
            {stats.highRiskAlerts > 0 && (
              <div className="bg-destructive/10 border-l-4 border-destructive rounded-r-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-6 w-6 text-destructive mr-4" />
                  <div>
                    <h3 className="font-bold text-destructive">
                      High Risk Alert
                    </h3>
                    <p className="text-sm text-destructive/90">
                      You have {stats.highRiskAlerts} high-risk findings that require attention.
                      <Link href="/dashboard" className="ml-2 font-bold underline hover:no-underline">
                        View Details
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-3xl font-bold mb-2 text-center">Quick Actions</h2>
              <div className="w-24 h-1 bg-primary mb-6 mx-auto"></div> {/* Centered decorative underline */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href} className="group block">
                    <Card className="p-6 h-full border border-muted hover:border-primary hover:shadow-lg transition-all duration-300 text-center">
                      <div className={`inline-flex p-3 rounded-lg ${action.color} mb-4`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-accent mb-2 group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{action.description}</p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <Card className="lg:col-span-3 p-6 border border-muted">
                <h3 className="text-2xl font-bold text-accent mb-4 text-center">Recent Activity</h3>
                <div className="space-y-4">
                  {stats.recentActivity.map((event: TimelineEvent) => (
                    <div key={event.id} className="flex items-start space-x-3">
                      <div className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-accent"></div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(event.date)}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="lg:col-span-2 p-6 border border-muted">
                <h3 className="text-2xl font-bold text-accent mb-4 text-center">Latest Counts</h3>
                <div className="space-y-4">
                  {/* UPDATED: Now mapping over stats.bloodCountTrends from the DashboardStats type */}
                  {stats.bloodCountTrends.slice(-3).map((trend: BloodCount) => {
                    const isAbnormal = trend.wbc < 4.0 || trend.hemoglobin < 12.0 || trend.platelets < 150;
                    return(
                    <div key={trend.id} className={`border-l-4 p-3 ${isAbnormal ? 'border-destructive/50' : 'border-success/50'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-foreground">{formatDate(trend.date)}</span>
                        <Badge className={isAbnormal ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}>
                           {isAbnormal ? 'Abnormal' : 'Normal'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm text-center">
                        <p className={trend.wbc < 4.0 ? 'text-destructive' : 'text-foreground'}>WBC: <span className="font-bold">{trend.wbc}</span></p>
                        <p className={trend.hemoglobin < 12.0 ? 'text-destructive' : 'text-foreground'}>Hgb: <span className="font-bold">{trend.hemoglobin}</span></p>
                        <p className={trend.platelets < 150 ? 'text-destructive' : 'text-foreground'}>PLT: <span className="font-bold">{trend.platelets}</span></p>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            <Card className="p-8 bg-card border-2 border-primary/20">
               <div className="text-center">
                 <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                   <Activity className="h-8 w-8 text-primary" />
                 </div>
                 <h3 className="text-3xl font-bold text-accent mb-2">
                   Understanding Your Health
                 </h3>
                 <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                   Aplastic anemia is a condition where your bone marrow doesn&apos;t make enough new blood cells. Early detection is crucial. Use our tools to track your health, but always consult a professional.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Link href="/symptoms" className="inline-flex items-center justify-center px-6 py-3 border border-primary text-base font-bold rounded-md text-primary bg-card hover:bg-primary/10 transition-colors">
                     Check Symptoms
                   </Link>
                   <Link href="/upload" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-md text-primary-foreground bg-primary hover:bg-accent transition-colors">
                     Upload Report
                   </Link>
                 </div>
               </div>
             </Card>

            <div className="text-center text-sm text-muted-foreground py-4">
              <p>
                MarrowAI is an assistant tool. Always consult with qualified medical professionals for diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
