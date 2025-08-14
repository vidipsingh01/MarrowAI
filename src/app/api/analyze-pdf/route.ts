// src/app/api/analyze-pdf/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  console.log('Received request for /api/analyze-pdf');
  const { text } = await request.json();
  console.log('Request body:', { text: text ? text.substring(0, 100) + '...' : 'null' });

  if (!text) {
    console.error('No text provided in request');
    return NextResponse.json({ error: 'No text provided' }, { status: 400 });
  }

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
  console.log('Gemini API key loaded:', !!process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `Analyze the following medical report text and return ONLY a JSON object with the following structure:
  {
    "riskScore": number (0-100),
    "riskLevel": "low" | "medium" | "high",
    "wbc": number (×10³/μL),
    "hemoglobin": number (g/dL),
    "platelets": number (×10³/μL),
    "recommendations": string[]
  }
  Text: ${text}`;

  try {
    console.log('Generating content with prompt:', prompt.substring(0, 200) + '...');
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    console.log('Raw Gemini response:', response.substring(0, 200) + '...');

    // Extract JSON (assuming it might not be in a code block)
    let jsonString = response.trim();
    if (jsonString.startsWith('```json') && jsonString.endsWith('```')) {
      jsonString = jsonString.replace(/```json|```/g, '').trim();
    }

    const data = JSON.parse(jsonString);
    console.log('Parsed data:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Failed to analyze text', details: (error as Error).message }, { status: 500 });
  }
}
