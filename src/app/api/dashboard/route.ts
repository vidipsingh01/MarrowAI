import { NextRequest, NextResponse } from 'next/server';
import { mockDashboardStats, mockBloodCounts, mockReports } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '3months';

    let filteredBloodCounts = mockBloodCounts;
    let filteredReports = mockReports;

    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case '1month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    filteredBloodCounts = mockBloodCounts.filter(count => 
      new Date(count.date) >= startDate
    );

    filteredReports = mockReports.filter(report => 
      new Date(report.date) >= startDate
    );

    return NextResponse.json({
      success: true,
      data: {
        ...mockDashboardStats,
        bloodCountTrends: filteredBloodCounts,
        recentReports: filteredReports.slice(0, 5),
        period
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}
