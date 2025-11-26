// app/api/drivers/list/route.ts
import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getSheetData('Driver Master');
    
    // Skip header row and map data
    const drivers = data.slice(1).map((row: any[]) => ({
      empId: row[0] || '',            // Col A: Emp ID
      name: row[1] || '',             // Col B: Name
      contact: row[2] || '',          // Col C: Contact
      licenseNo: row[3] || '',        // Col D: License No
      busAssigned: row[4] || '',      // Col E: Bus Assigned
      status: row[5] || 'Active',     // Col F: Status
      joiningDate: row[6] || ''       // Col G: Joining Date
    })).filter((driver: any) => driver.empId); // Filter out empty rows

    return NextResponse.json({ drivers, success: true });
  } catch (error: any) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch drivers',
      success: false 
    }, { status: 500 });
  }
}
