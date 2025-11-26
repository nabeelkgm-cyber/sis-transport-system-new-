// app/api/drivers/list/route.ts
import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';

export async function GET() {
  try {
    // Read Bus Route Details
    const busRouteData = await getSheetData('Bus Route Details');
    
    // Extract unique drivers
    const driverMap = new Map();
    
    busRouteData.slice(1).forEach((row: any[]) => {
      const driverName = String(row[8] || '').trim();    // Col I: Driver Name
      const driverContact = String(row[9] || '').trim(); // Col J: Driver Contact
      const busNo = String(row[0] || '').trim();         // Col A: Bus No
      
      if (driverName && !driverMap.has(driverName)) {
        driverMap.set(driverName, {
          name: driverName,
          contact: driverContact,
          busAssigned: busNo,
          status: 'Active',
          empId: `DRV${String(driverMap.size + 1).padStart(3, '0')}`,
          licenseNo: '-',
          joiningDate: '-'
        });
      }
    });
    
    const drivers = Array.from(driverMap.values());

    return NextResponse.json({ 
      drivers, 
      success: true,
      totalDrivers: drivers.length
    });
  } catch (error: any) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch drivers',
      success: false,
      drivers: []
    }, { status: 500 });
  }
}
