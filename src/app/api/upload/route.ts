import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileId = Math.random().toString(36).substr(2, 9);
    
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/dicom',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'File type not supported' },
        { status: 400 }
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        fileId,
        fileName: file.name,
        status: 'uploaded',
        estimatedProcessingTime: 3
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
