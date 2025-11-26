// app/api/buses/list/route.ts
import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';

export async function GET() {
  try {
    // Read from Bus Route Details sheet
    const busRouteData = await getSheetData('Bus Route Details');
    
    // Read Transport Using Students to count actual students per bus
    const transportData = await getSheetData('Transport Using Students');
    
    // Count students per bus
    const busStudentCount = new Map();
    transportData.slice(1).forEach((row: any[]) => {
      const busNo = String(row[6] || '').trim(); // Col G: Bus No
      if (busNo) {
        busStudentCount.set(busNo, (busStudentCount.get(busNo) || 0) + 1);
      }
    });
    
    // Process Bus Route Details (skip header row)
    const buses = busRouteData.slice(1).map((row: any[]) => {
      const busNo = String(row[0] || '').trim();        // Col A: Bus No
      const routeName = row[1] || '';                   // Col B: Row Labels (Route Name)
      const kgStudents = parseInt(row[2]) || 0;         // Col C: KG STUDENTS
      const otherStudents = parseInt(row[3]) || 0;      // Col D: OTHER STUDENTS
      const staff = parseInt(row[4]) || 0;              // Col E: STAFF
      const grandTotal = parseInt(row[5]) || 0;         // Col F: Grand Total
      const capacity = parseInt(row[18]) || 40;         // Col S: CAPACITY
      
      // Get actual current students from transport data
      const currentStudents = busStudentCount.get(busNo) || 0;
      
      // Parse driver and conductor info
      const driverInfo = row[8] || '';                  // Col I: Driver Name
      const driverContact = row[9] || '';               // Col J: Contact (Driver)
      const conductorInfo = row[10] || '';              // Col K: Conductor Name
      const conductorContact = row[11] || '';           // Col L: Contact (Conductor)
      
      return {
        busNo,
        routeName,
        capacity,
        currentStudents,
        utilization: capacity > 0 ? Math.round((currentStudents / capacity) * 100) : 0,
        status: currentStudents > 0 ? 'Active' : 'Available',
        
        // Student breakdown
        kgStudents,
        otherStudents,
        staff,
        grandTotal,
        
        // Driver/Conductor info
        driverName: driverInfo,
        driverContact: driverContact,
        driver: driverContact ? `${driverInfo} - ${driverContact}` : driverInfo,
        
        conductorName: conductorInfo,
        conductorContact: conductorContact,
        conductor: conductorContact ? `${conductorInfo} - ${conductorContact}` : conductorInfo,
        
        // Additional info
        ownership: row[6] || '',                        // Col G: Owned/Leased
        busType: row[7] || '',                          // Col H: BUS TYPE
        plateNo: row[14] || '',                         // Col O: Plate #
        make: row[15] || '',                            // Col P: Make
      };
    }).filter((bus: any) => bus.busNo); // Filter out empty rows

    return NextResponse.json({ 
      buses, 
      success: true,
      totalBuses: buses.length,
      totalCapacity: buses.reduce((sum: number, b: any) => sum + b.capacity, 0),
      totalCurrentStudents: buses.reduce((sum: number, b: any) => sum + b.currentStudents, 0)
    });
  } catch (error: any) {
    console.error('Error fetching buses:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch buses',
      success: false,
      buses: []
    }, { status: 500 });
  }
}
