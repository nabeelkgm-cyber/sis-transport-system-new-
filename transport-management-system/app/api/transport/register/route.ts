// app/api/transport/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getStudentByEnrollment,
  updateStudentTransport,
  getBusByNumber,
  logSMS
} from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { enrollmentNo, busNo, routeNo, shift } = body;

    // Validation
    if (!enrollmentNo || !busNo || !routeNo || !shift) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get student details
    const student = await getStudentByEnrollment(enrollmentNo);
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Check if already registered
    if (student['Transport Status'] === 'Active') {
      return NextResponse.json(
        { error: 'Student already registered for transport' },
        { status: 400 }
      );
    }

    // Get bus details to check capacity
    const bus = await getBusByNumber(busNo);
    
    if (!bus) {
      return NextResponse.json(
        { error: 'Bus not found' },
        { status: 404 }
      );
    }

    // Update student transport details
    const registrationDate = new Date().toISOString().split('T')[0];
    
    await updateStudentTransport(enrollmentNo, {
      busNo,
      routeNo,
      shift,
      transportStatus: 'Active',
      registrationDate,
      cancellationDate: ''
    });

    // Generate SMS
    const smsMessage = `Dear Parent, Your ward ${student.Name} (Enr: ${enrollmentNo}) has been registered for school transport. Bus: ${busNo}, Route: ${routeNo}, Shift: ${shift}. Contact: +974-XXXXXXXX`;
    
    // Log SMS (actual sending would be done via SMS gateway)
    await logSMS({
      enrollmentNo,
      type: 'Registration',
      messageText: smsMessage,
      status: 'Pending'
    });

    return NextResponse.json({
      success: true,
      message: 'Student registered successfully',
      data: {
        enrollmentNo,
        name: student.Name,
        busNo,
        routeNo,
        shift,
        registrationDate
      },
      smsMessage
    });

  } catch (error: any) {
    console.error('Transport registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
