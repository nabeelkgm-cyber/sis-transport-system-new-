// app/api/attendance/mark/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { markAttendance, getConductorById, readSheet, arrayToObject } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conductorId, busNo, date, shift, attendanceData } = body;

    // Validation
    if (!conductorId || !busNo || !date || !shift || !attendanceData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify conductor exists
    const conductor = await getConductorById(conductorId);
    if (!conductor) {
      return NextResponse.json(
        { error: 'Conductor not found' },
        { status: 404 }
      );
    }

    // Mark attendance for each student
    const results = [];
    for (const record of attendanceData) {
      const { enrollmentNo, amStatus, pmStatus } = record;

      await markAttendance({
        date,
        busNo,
        enrollmentNo,
        shift,
        amStatus: amStatus || '',
        pmStatus: pmStatus || '',
        markedBy: conductorId
      });

      results.push({
        enrollmentNo,
        amStatus,
        pmStatus,
        status: 'marked'
      });
    }

    return NextResponse.json({
      success: true,
      message: `Attendance marked for ${results.length} students`,
      data: {
        conductorId,
        conductorName: conductor['Name'],
        busNo,
        date,
        shift,
        results
      }
    });

  } catch (error: any) {
    console.error('Attendance marking error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Fetch students assigned to a bus for attendance
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const busNo = searchParams.get('busNo');
    const shift = searchParams.get('shift');
    const date = searchParams.get('date');

    if (!busNo || !shift) {
      return NextResponse.json(
        { error: 'busNo and shift are required' },
        { status: 400 }
      );
    }

    // Fetch students for this bus
    const data = await readSheet('Students Master!A:Z');
    
    if (data.length < 2) {
      return NextResponse.json({ students: [] });
    }

    const headers = data[0];
    let students = data.slice(1)
      .map(row => arrayToObject(headers, row))
      .filter(student => 
        student['Bus No'] === busNo && 
        student['Shift'] === shift &&
        student['Transport Status'] === 'Active'
      );

    // If date is provided, fetch existing attendance
    if (date) {
      const attendanceData = await readSheet('Attendance Log!A:H');
      
      if (attendanceData.length > 1) {
        const attHeaders = attendanceData[0];
        const existingAttendance = attendanceData.slice(1)
          .map(row => arrayToObject(attHeaders, row))
          .filter(att => 
            att['Date'] === date && 
            att['Bus No'] === busNo && 
            att['Shift'] === shift
          );

        // Merge attendance data with student list
        students = students.map(student => {
          const attendance = existingAttendance.find(
            att => att['Enrollment No'] === student['Enrollment No']
          );
          
          return {
            ...student,
            amStatus: attendance?.['AM Status'] || '',
            pmStatus: attendance?.['PM Status'] || '',
            marked: !!attendance
          };
        });
      }
    }

    return NextResponse.json({
      success: true,
      busNo,
      shift,
      date,
      students: students.map(s => ({
        enrollmentNo: s['Enrollment No'],
        name: s['Name'],
        class: s['Class'],
        section: s['Section'],
        contact: s['Contact'],
        category: s['Category'],
        amStatus: s['amStatus'] || '',
        pmStatus: s['pmStatus'] || '',
        marked: s['marked'] || false
      }))
    });

  } catch (error: any) {
    console.error('Fetch attendance data error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
