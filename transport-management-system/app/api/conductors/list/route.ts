// app/api/conductors/list/route.ts
import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getSheetData('Conductor Master');
    
    // Skip header row and map data
    const conductors = data.slice(1).map((row: any[]) => ({
      empId: row[0] || '',           // Col A: Emp ID
      name: row[1] || '',             // Col B: Name
      contact: row[2] || '',          // Col C: Contact
      busAssigned: row[3] || '',      // Col D: Bus Assigned
      status: row[4] || 'Active',     // Col E: Status
      joiningDate: row[5] || ''       // Col F: Joining Date
    })).filter((conductor: any) => conductor.empId); // Filter out empty rows

    return NextResponse.json({ conductors, success: true });
  } catch (error: any) {
    console.error('Error fetching conductors:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch conductors',
      success: false 
    }, { status: 500 });
  }
}
