import { NextRequest, NextResponse } from 'next/server';
import { calculateRiskScore, getRiskLevel } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symptoms, severities, durations } = body;

    if (!symptoms || !Array.isArray(symptoms)) {
      return NextResponse.json(
        { success: false, error: 'Invalid symptoms data' },
        { status: 400 }
      );
    }

    const riskScore = calculateRiskScore(symptoms);
    const riskLevel = getRiskLevel(riskScore);

    let recommendations: string[] = [];
    let urgency = 'routine';

    if (riskLevel === 'high') {
      urgency = 'urgent';
      recommendations = [
        'Seek immediate medical attention from a hematologist',
        'Complete blood count (CBC) with differential urgently needed',
        'Consider emergency department visit if experiencing fever or severe bleeding',
        'Avoid activities that could cause injury or bleeding',
        'Monitor for signs of infection and seek care immediately if fever develops'
      ];
    } else if (riskLevel === 'medium') {
      urgency = 'soon';
      recommendations = [
        'Schedule appointment with your primary care physician within 1-2 weeks',
        'Request complete blood count (CBC) to evaluate blood cell levels',
        'Keep a symptom diary to track changes',
        'Avoid taking aspirin or blood-thinning medications',
        'Practice good hygiene to prevent infections'
      ];
    } else {
      recommendations = [
        'Continue monitoring symptoms and note any changes',
        'Maintain a healthy lifestyle with adequate rest',
        'Consider routine blood work at your next physical exam',
        'Contact healthcare provider if symptoms worsen',
        'Stay up to date with preventive care'
      ];
    }

    return NextResponse.json({
      success: true,
      data: {
        riskScore,
        riskLevel,
        urgency,
        recommendations,
        assessmentId: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Assessment failed' },
      { status: 500 }
    );
  }
}
