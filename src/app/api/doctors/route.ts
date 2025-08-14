import { NextResponse } from 'next/server';
import { getDoctorData } from '@/lib/doctors'; // 1. Import the function instead of the array

export async function GET() {
  // 2. Call the centralized function to get the data
  const doctors = getDoctorData();
  
  // 3. Return the data as JSON, just like before
  return NextResponse.json(doctors);
}