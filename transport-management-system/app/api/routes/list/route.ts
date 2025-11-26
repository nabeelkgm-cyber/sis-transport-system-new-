// app/api/routes/list/route.ts
import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getSheetData('Routes Master');
    
    // Skip header row and map data
    const routes = data.slice(1).map((row: any[]) => ({
      routeNo: row[0] || '',          // Col A: Route No
      routeName: row[1] || '',        // Col B: Route Name
      area: row[2] || '',             // Col C: Area
      stops: row[3] || '',            // Col D: Stops
      distance: parseFloat(row[4]) || 0,  // Col E: Distance
      timingFN: row[5] || '',         // Col F: Timing FN
      timingAN: row[6] || '',         // Col G: Timing AN
      status: row[7] || 'Active'      // Col H: Status
    })).filter((route: any) => route.routeNo); // Filter out empty rows

    return NextResponse.json({ routes, success: true });
  } catch (error: any) {
    console.error('Error fetching routes:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch routes',
      success: false 
    }, { status: 500 });
  }
}
