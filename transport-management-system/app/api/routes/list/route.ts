// app/api/routes/list/route.ts
import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';

export async function GET() {
  try {
    // Read Bus Route Details
    const busRouteData = await getSheetData('Bus Route Details');
    
    // Read Transport Using Students for actual student counts
    const transportData = await getSheetData('Transport Using Students');
    
    // Count students per route from Transport sheet (Col J: ROUTE)
    const routeStudentCount = new Map();
    transportData.slice(1).forEach((row: any[]) => {
      const routeName = String(row[9] || '').trim(); // Col J: ROUTE
      if (routeName) {
        routeStudentCount.set(routeName, (routeStudentCount.get(routeName) || 0) + 1);
      }
    });
    
    // Extract unique routes and aggregate data
    const routeMap = new Map();
    busRouteData.slice(1).forEach((row: any[]) => {
      const routeName = String(row[1] || '').trim(); // Col B: Route Name
      const busNo = String(row[0] || '').trim();     // Col A: Bus No
      const capacity = parseInt(row[18]) || 40;      // Col S: CAPACITY
      
      if (routeName && busNo) {
        if (!routeMap.has(routeName)) {
          routeMap.set(routeName, {
            routeName,
            buses: [],
            totalCapacity: 0,
            currentStudents: 0
          });
        }
        
        const route = routeMap.get(routeName);
        route.buses.push(busNo);
        route.totalCapacity += capacity;
      }
    });
    
    // Convert map to array and add student counts
    const routes = Array.from(routeMap.values()).map((route: any) => {
      const currentStudents = routeStudentCount.get(route.routeName) || 0;
      return {
        routeNo: route.routeName.match(/ROUTE\s*(\d+)/i)?.[1] || '',
        routeName: route.routeName,
        buses: route.buses.join(', '),
        busCount: route.buses.length,
        totalCapacity: route.totalCapacity,
        currentStudents,
        utilization: route.totalCapacity > 0 ? 
          Math.round((currentStudents / route.totalCapacity) * 100) : 0,
        status: 'Active'
      };
    });

    return NextResponse.json({ 
      routes, 
      success: true,
      totalRoutes: routes.length
    });
  } catch (error: any) {
    console.error('Error fetching routes:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch routes',
      success: false,
      routes: []
    }, { status: 500 });
  }
}
