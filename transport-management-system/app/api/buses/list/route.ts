// app/api/buses/list/route.ts
import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getSheetData('Bus Master');
    
    // Skip header row and map data
    const buses = data.slice(1).map((row: any[]) => ({
      busNo: row[0] || '',           // Col A: Bus No
      capacity: parseInt(row[1]) || 40,  // Col B: Capacity
      status: row[2] || 'Active',    // Col C: Status
      driverId: row[6] || '',        // Col G: Driver ID
      conductorId: row[7] || '',     // Col H: Conductor ID
      driver: 'Driver ' + (row[6] || ''),  // Placeholder - will get from Driver Master
      conductor: 'Conductor ' + (row[7] || ''),  // Placeholder
      currentStudents: 0  // Will calculate from Students Master
    })).filter((bus: any) => bus.busNo); // Filter out empty rows

    return NextResponse.json({ buses, success: true });
  } catch (error: any) {
    console.error('Error fetching buses:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch buses',
      success: false 
    }, { status: 500 });
  }
}
