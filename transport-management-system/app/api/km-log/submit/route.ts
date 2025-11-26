// app/api/km-log/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logKM, getDriverById, getBusByNumber } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { driverId, busNo, date, startKM, endKM, shift } = body;

    // Validation
    if (!driverId || !busNo || !date || startKM === undefined || endKM === undefined || !shift) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate KM values
    const startKMNum = parseFloat(startKM);
    const endKMNum = parseFloat(endKM);

    if (isNaN(startKMNum) || isNaN(endKMNum)) {
      return NextResponse.json(
        { error: 'Invalid KM values' },
        { status: 400 }
      );
    }

    if (endKMNum <= startKMNum) {
      return NextResponse.json(
        { error: 'End KM must be greater than Start KM' },
        { status: 400 }
      );
    }

    // Verify driver exists
    const driver = await getDriverById(driverId);
    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    // Verify bus exists
    const bus = await getBusByNumber(busNo);
    if (!bus) {
      return NextResponse.json(
        { error: 'Bus not found' },
        { status: 404 }
      );
    }

    // Log KM data
    await logKM({
      date,
      busNo,
      driverId,
      startKM: startKMNum,
      endKM: endKMNum,
      shift
    });

    const totalKM = endKMNum - startKMNum;

    return NextResponse.json({
      success: true,
      message: 'KM logged successfully',
      data: {
        driverId,
        driverName: driver['Name'],
        busNo,
        date,
        startKM: startKMNum,
        endKM: endKMNum,
        totalKM,
        shift
      }
    });

  } catch (error: any) {
    console.error('KM logging error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Fetch KM logs for a driver
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const driverId = searchParams.get('driverId');
    const busNo = searchParams.get('busNo');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    if (!driverId && !busNo) {
      return NextResponse.json(
        { error: 'Either driverId or busNo is required' },
        { status: 400 }
      );
    }

    // Fetch KM logs from Google Sheets
    const { readSheet, arrayToObject } = await import('@/lib/googleSheets');
    const data = await readSheet('KM Log!A:H');
    
    if (data.length < 2) {
      return NextResponse.json({ logs: [] });
    }

    const headers = data[0];
    let logs = data.slice(1).map(row => arrayToObject(headers, row));

    // Filter by driverId
    if (driverId) {
      logs = logs.filter(log => log['Driver ID'] === driverId);
    }

    // Filter by busNo
    if (busNo) {
      logs = logs.filter(log => log['Bus No'] === busNo);
    }

    // Filter by date range
    if (dateFrom) {
      logs = logs.filter(log => log['Date'] >= dateFrom);
    }
    if (dateTo) {
      logs = logs.filter(log => log['Date'] <= dateTo);
    }

    return NextResponse.json({ logs });

  } catch (error: any) {
    console.error('Fetch KM logs error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
