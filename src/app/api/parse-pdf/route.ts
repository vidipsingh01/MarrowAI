// src/app/api/parse-pdf/route.ts - FINAL WORKING VERSION

import { NextRequest, NextResponse } from 'next/server';
import { ServerMedicalReportService } from '@/lib/firestore-server';

// Load the library using require for Node.js compatibility
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

// --- THE FINAL CONFIGURATION FIX ---
// Tell the library where to find its worker script, bypassing the Next.js bundler.
// @ts-ignore - We are intentionally bypassing the bundler's static analysis here.
pdfjs.GlobalWorkerOptions.workerSrc = eval('require').resolve('pdfjs-dist/legacy/build/pdf.worker.js');


export const runtime = 'nodejs';
export const maxDuration = 60; 

export async function POST(req: NextRequest) {
  let userId: string | null = null;
  let file: File | null = null;

  try {
    console.log("API route hit - processing PDF with 'pdfjs-dist'");
    
    const formData = await req.formData();
    file = formData.get('pdf') as File | null;
    userId = formData.get('userId') as string | null;
    const reportType = formData.get('reportType') as string | null;
    const notes = formData.get('notes') as string | null;
    
    if (!file || !userId) {
      return NextResponse.json({ error: "File and User ID are required." }, { status: 400 });
    }
    
    console.log(`File received: ${file.name}`);
    
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: "File must be a PDF." }, { status: 400 });
    }
    
    // Convert the file to the Uint8Array format that the library requires
    const fileArrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(fileArrayBuffer);
    
    console.log("Starting PDF parsing...");

    // Pass the Uint8Array to the library
    const pdfDocument = await pdfjs.getDocument(uint8Array).promise;
    const numPages = pdfDocument.numPages;
    let extractedText = '';

    // Loop through each page and extract text content
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => ('str' in item ? item.str : '')).join(' ');
      extractedText += pageText + '\n';
    }
    
    console.log("--- Successfully Extracted PDF Text ---");
    console.log(`Pages: ${numPages}, Text length: ${extractedText.length}`);
    console.log("------------------------------------");
    
    // Prepare the data object to be saved in Firestore
    const reportData = {
      userId: userId,
      fileName: file.name,
      fileSize: file.size,
      extractedText: extractedText.trim(),
      textLength: extractedText.trim().length,
      pdfInfo: { numPages: numPages, version: '' }, // pdfjs doesn't easily provide the PDF version
      reportType: reportType || 'general',
      ...(notes && { notes: notes }) 
    };
    
    console.log("Preparing to save to Firestore...");
    
    const reportId = await ServerMedicalReportService.saveMedicalReport(reportData);
    console.log("Medical report saved successfully with ID:", reportId);
      
    // Return a success response to the client
    return NextResponse.json({
      success: true,
      reportId: reportId,
      message: "PDF processed and saved successfully"
    });

  } catch (error: unknown) {
    console.error("Error in API route:", error);
    let errorMessage = 'An unexpected error occurred.';
    let errorStack = undefined;
    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack;
    }
    
    // Return a detailed error response in development
    return NextResponse.json({ 
      error: 'Failed to process request.',
      details: errorMessage,
      debugInfo: process.env.NODE_ENV === 'development' ? {
          userId: userId,
          fileName: file ? file.name : "File not available",
          errorStack: errorStack
      } : undefined
    }, { status: 500 });
  }
}