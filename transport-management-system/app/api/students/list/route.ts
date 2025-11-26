// app/api/students/list/route.ts
import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/googleSheets';

export async function GET() {
  try {
    // Read from 3 sheets
    const fnStudentsData = await getSheetData('FN Students Master');
    const anStudentsData = await getSheetData('AN Students Master');
    const transportData = await getSheetData('Transport Using Students');
    
    // Process FN Students (skip header row)
    const fnStudents = fnStudentsData.slice(1).map((row: any[]) => ({
      qidNo: row[0] || '',                    // Col A: QID NO
      enrollmentNo: row[1] || '',             // Col B: Admn No
      name: row[2] || '',                     // Col C: Name
      classDiv: row[3] || '',                 // Col D: Class & Div
      grade: row[4] || '',                    // Col E: Class
      gender: row[5] || '',                   // Col F: Gender
      fatherName: row[6] || '',               // Col G: Father Name
      fatherMobile: row[7] || '',             // Col H: Father Mobile
      fatherEmail: row[8] || '',              // Col I: Father Email
      motherName: row[9] || '',               // Col J: Mother Name
      motherMobile: row[10] || '',            // Col K: Mother Mobile
      motherEmail: row[11] || '',             // Col L: Mother Email
      admissionDate: row[12] || '',           // Col M: Date of Admission
      parentId: row[13] || '',                // Col N: Parent ID
      shift: 'FN',
      section: 'FN SHIFT'
    })).filter((s: any) => s.enrollmentNo);   // Filter empty rows
    
    // Process AN Students (skip header row)
    const anStudents = anStudentsData.slice(1).map((row: any[]) => ({
      qidNo: row[0] || '',                    // Col A: QID NO
      enrollmentNo: row[1] || '',             // Col B: Admn No
      name: row[2] || '',                     // Col C: Name
      classDiv: row[3] || '',                 // Col D: Class & Div
      grade: row[4] || '',                    // Col E: Class
      gender: row[5] || '',                   // Col F: Gender
      fatherName: row[6] || '',               // Col G: Father Name
      fatherMobile: row[7] || '',             // Col H: Father Mobile
      fatherEmail: row[8] || '',              // Col I: Father Email
      motherName: row[9] || '',               // Col J: Mother Name
      motherMobile: row[10] || '',            // Col K: Mother Mobile
      motherEmail: row[11] || '',             // Col L: Mother Email
      admissionDate: row[12] || '',           // Col M: Date of Admission
      parentId: row[13] || '',                // Col N: Parent ID
      shift: 'AN',
      section: 'AN SHIFT'
    })).filter((s: any) => s.enrollmentNo);   // Filter empty rows
    
    // Process Transport Using Students (skip header row)
    const transportMap = new Map();
    transportData.slice(1).forEach((row: any[]) => {
      const admnNo = row[0] || '';
      if (admnNo) {
        transportMap.set(admnNo, {
          transportStatus: 'Using',
          busNo: row[6] || '',                  // Col G: Bus No
          driverName: row[7] || '',             // Col H: Driver Name
          conductorName: row[8] || '',          // Col I: Conductor
          routeName: row[9] || '',              // Col J: ROUTE
          kgTripBus: row[10] || '',             // Col K: KG TRIP BUS
          kgConductor: row[11] || '',           // Col L: KG CONDUCTOR
          kgDriver: row[12] || '',              // Col M: KG DRIVER
          kgStatus: row[13] || '',              // Col N: KG STATUS
          startDate: row[15] || '',             // Col P: START DATE
          area: row[17] || '',                  // Col R: AREA
          buildingNumber: row[18] || '',        // Col S: Building number
          zone: row[19] || '',                  // Col T: ZONE
          street: row[20] || '',                // Col U: street
          siblingLandmark: row[21] || '',       // Col V: SIBILING/LANDMARK
          // Extract shift from SECTION (Col F)
          transportShift: (row[5] || '').includes('FN') ? 'FN' : 
                         (row[5] || '').includes('AN') ? 'AN' : ''
        });
      }
    });
    
    // Combine all students (FN + AN)
    const allStudents = [...fnStudents, ...anStudents];
    
    // Merge with transport data
    const students = allStudents.map((student: any) => {
      const transport = transportMap.get(student.enrollmentNo);
      
      return {
        enrollmentNo: student.enrollmentNo,
        name: student.name,
        grade: student.classDiv || student.grade,  // Use Class & Div
        section: student.section,
        shift: student.shift,
        parentContact: student.fatherMobile || student.motherMobile,
        parentName: student.fatherName || student.motherName,
        parentId: student.parentId,
        gender: student.gender,
        
        // Transport details (if using transport)
        transportStatus: transport ? 'Using' : 'Not Using',
        busNo: transport?.busNo || '-',
        routeNo: transport?.routeName || '-',
        driverName: transport?.driverName || '-',
        conductorName: transport?.conductorName || '-',
        area: transport?.area || '-',
        startDate: transport?.startDate || '-',
        
        // Additional details
        registrationDate: student.admissionDate,
        qidNo: student.qidNo,
        fatherName: student.fatherName,
        fatherMobile: student.fatherMobile,
        fatherEmail: student.fatherEmail,
        motherName: student.motherName,
        motherMobile: student.motherMobile,
        motherEmail: student.motherEmail
      };
    });

    return NextResponse.json({ 
      students, 
      success: true,
      totalStudents: students.length,
      fnStudents: fnStudents.length,
      anStudents: anStudents.length,
      transportUsers: students.filter((s: any) => s.transportStatus === 'Using').length
    });
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch students',
      success: false,
      students: []
    }, { status: 500 });
  }
}
