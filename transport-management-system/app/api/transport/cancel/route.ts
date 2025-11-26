// app/api/transport/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getStudentByEnrollment,
  updateStudentTransport,
  logSMS
} from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { enrollmentNo, reason } = body;

    // Validation
    if (!enrollmentNo) {
      return NextResponse.json(
        { error: 'Enrollment number is required' },
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

    // Check if student is using transport
    if (student['Transport Status'] !== 'Active') {
      return NextResponse.json(
        { error: 'Student is not registered for transport' },
        { status: 400 }
      );
    }

    // Update student transport details
    const cancellationDate = new Date().toISOString().split('T')[0];
    
    await updateStudentTransport(enrollmentNo, {
      transportStatus: 'Cancelled',
      cancellationDate
    });

    // Generate SMS
    const smsMessage = `Dear Parent, Transport service for ${student.Name} (Enr: ${enrollmentNo}) has been cancelled effective ${cancellationDate}. For queries contact: +974-XXXXXXXX`;
    
    // Log SMS
    await logSMS({
      enrollmentNo,
      type: 'Cancellation',
      messageText: smsMessage,
      status: 'Pending'
    });

    return NextResponse.json({
      success: true,
      message: 'Transport cancelled successfully',
      data: {
        enrollmentNo,
        name: student.Name,
        cancellationDate,
        reason
      },
      smsMessage
    });

  } catch (error: any) {
    console.error('Transport cancellation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
