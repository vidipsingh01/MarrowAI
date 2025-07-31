import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, reportType } = body;

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'File ID required' },
        { status: 400 }
      );
    }

    // Mock AI prediction processing
    // In a real implementation, this would integrate with ML models
    
    const mockPredictions = {
      'cbc': {
        confidence: 92.5,
        diagnosis: ['Severe Aplastic Anemia', 'Pancytopenia'],
        probability: {
          'Severe Aplastic Anemia': 92.5,
          'Moderate Aplastic Anemia': 7.2,
          'MDS': 0.3
        },
        severity: 'high',
        keyFindings: [
          'WBC count significantly below normal range',
          'Hemoglobin levels indicate severe anemia',
          'Platelet count suggests high bleeding risk',
          'Pattern consistent with bone marrow failure'
        ]
      },
      'biopsy': {
        confidence: 96.8,
        diagnosis: ['Severe Aplastic Anemia'],
        probability: {
          'Severe Aplastic Anemia': 96.8,
          'Hypoplastic MDS': 2.8,
          'Drug-induced aplasia': 0.4
        },
        severity: 'high',
        keyFindings: [
          'Bone marrow cellularity <20%',
          'Absence of abnormal cell populations',
          'No evidence of infiltrative disease',
          'Consistent with severe aplastic anemia'
        ]
      }
    };

    const prediction = mockPredictions[reportType as keyof typeof mockPredictions] || mockPredictions.cbc;

    const recommendations = [
      'Immediate hematology consultation required',
      'Consider immunosuppressive therapy vs. stem cell transplant evaluation',
      'Implement strict infection precautions',
      'Monitor for bleeding complications',
      'Family HLA typing for potential donors'
    ];

    const additionalTests = [
      'Bone marrow cytogenetics',
      'PNH flow cytometry',
      'Viral studies (EBV, CMV, Parvovirus B19)',
      'Vitamin B12 and folate levels',
      'HLA typing'
    ];

    return NextResponse.json({
      success: true,
      data: {
        predictionId: Math.random().toString(36).substr(2, 9),
        fileId,
        confidence: prediction.confidence,
        diagnosis: prediction.diagnosis,
        probability: prediction.probability,
        severity: prediction.severity,
        keyFindings: prediction.keyFindings,
        recommendations,
        additionalTests,
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Prediction failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get('id');

    if (!predictionId) {
      return NextResponse.json(
        { success: false, error: 'Prediction ID required' },
        { status: 400 }
      );
    }

    // Mock prediction retrieval
    // In a real implementation, this would fetch from a database
    
    return NextResponse.json({
      success: true,
      data: {
        predictionId,
        status: 'completed',
        confidence: 92.5,
        diagnosis: ['Severe Aplastic Anemia', 'Pancytopenia'],
        severity: 'high',
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve prediction' },
      { status: 500 }
    );
  }
}
