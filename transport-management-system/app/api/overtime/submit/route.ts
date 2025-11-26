// app/api/overtime/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getDriverById,
  getConductorById,
  submitOT,
  getOTConfig
} from '@/lib/googleSheets';
import {
  calculateOT,
  validateOTSubmission,
  OTConfig
} from '@/lib/overtimeCalculator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { empId, role, date, shift, startTime, endTime, remarks } = body;

    // Validation
    if (!empId || !role || !date || !shift || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== 'Driver' && role !== 'Conductor') {
      return NextResponse.json(
        { error: 'Invalid role. Must be Driver or Conductor' },
        { status: 400 }
      );
    }

    // Get employee data
    let employee;
    if (role === 'Driver') {
      employee = await getDriverById(empId);
    } else {
      employee = await getConductorById(empId);
    }

    if (!employee) {
      return NextResponse.json(
        { error: `${role} not found` },
        { status: 404 }
      );
    }

    // Prepare submission data
    const submission = {
      date,
      shift,
      startTime,
      endTime,
      remarks: remarks || ''
    };

    // Validate submission
    const validation = validateOTSubmission(submission);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Get OT configuration
    const configData = await getOTConfig();
    const config: OTConfig = {
      driverDailyHourValue: parseFloat(configData['Driver Daily Hour Value']) || 1,
      conductorDailyHourValue: parseFloat(configData['Conductor Daily Hour Value']) || 4,
      workingDaysPerMonth: parseInt(configData['Working Days Per Month']) || 22,
      earlyMorningStart: configData['Early Morning Start'] || '07:30',
      earlyMorningEnd: configData['Early Morning End'] || '10:30',
      offShiftStart: configData['Off Shift Start'] || '19:30',
      offShiftEnd: configData['Off Shift End'] || '04:30'
    };

    // Calculate OT
    const employeeData = {
      empId: employee['Emp ID'],
      name: employee['Name'],
      role: role,
      basicSalary: parseFloat(employee['Basic Salary']) || 0,
      grossSalary: parseFloat(employee['Gross Salary']) || 0
    };

    const otResult = calculateOT(employeeData, submission, config);

    // Submit to Google Sheets
    const submissionId = await submitOT({
      empId: employeeData.empId,
      name: employeeData.name,
      role,
      date,
      shift,
      startTime,
      endTime,
      hours: otResult.hours,
      otCategory: otResult.category,
      rateMultiplier: otResult.rateMultiplier,
      amount: otResult.amount,
      remarks: remarks || ''
    });

    return NextResponse.json({
      success: true,
      message: 'OT submitted successfully',
      data: {
        submissionId,
        empId: employeeData.empId,
        name: employeeData.name,
        role,
        date,
        shift,
        hours: otResult.hours,
        category: otResult.category,
        rateMultiplier: otResult.rateMultiplier,
        basedOn: otResult.basedOn,
        amount: otResult.amount,
        description: otResult.description
      }
    });

  } catch (error: any) {
    console.error('OT submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
