// app/api/conductors/list/route.ts
import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';

export async function GET() {
  try {
    // Read Bus Route Details
    const busRouteData = await getSheetData('Bus Route Details');
    
    // Extract unique conductors
    const conductorMap = new Map();
    
    busRouteData.slice(1).forEach((row: any[]) => {
      const conductorName = String(row[10] || '').trim();    // Col K: Conductor Name
      const conductorContact = String(row[11] || '').trim(); // Col L: Conductor Contact
      const busNo = String(row[0] || '').trim();             // Col A: Bus No
      
      if (conductorName && !conductorMap.has(conductorName)) {
        conductorMap.set(conductorName, {
          name: conductorName,
          contact: conductorContact,
          busAssigned: busNo,
          status: 'Active',
          empId: `CND${String(conductorMap.size + 1).padStart(3, '0')}`,
          joiningDate: '-'
        });
      }
    });
    
    const conductors = Array.from(conductorMap.values());

    return NextResponse.json({ 
      conductors, 
      success: true,
      totalConductors: conductors.length
    });
  } catch (error: any) {
    console.error('Error fetching conductors:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch conductors',
      success: false,
      conductors: []
    }, { status: 500 });
  }
}
