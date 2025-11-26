// lib/googleSheets.ts
import { google } from 'googleapis';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;

// Initialize Google Sheets API
const getAuth = () => {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

const sheets = google.sheets({ version: 'v4', auth: getAuth() });

// Sheet Names
export const SHEETS = {
  STUDENTS: 'Students Master',
  BUSES: 'Bus Master',
  ROUTES: 'Routes Master',
  DRIVERS: 'Driver Master',
  CONDUCTORS: 'Conductor Master',
  ATTENDANCE: 'Attendance Log',
  KM_LOG: 'KM Log',
  OT_SUBMISSIONS: 'OT Submissions',
  OT_CONFIG: 'OT Configuration',
  MADRASSA: 'Madrassa Students',
  SMS_LOG: 'SMS Log',
  ACCESS_TOKENS: 'Access Tokens'
};

// Generic read function
export async function readSheet(range: string): Promise<any[][]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });
    return response.data.values || [];
  } catch (error) {
    console.error('Error reading sheet:', error);
    throw error;
  }
}

// Get all data from a sheet
export async function getSheetData(sheetName: string): Promise<any[][]> {
  return await readSheet(`${sheetName}!A:ZZ`);
}

// Generic write function
export async function writeSheet(range: string, values: any[][]): Promise<void> {
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'RAW',
      requestBody: { values },
    });
  } catch (error) {
    console.error('Error writing to sheet:', error);
    throw error;
  }
}

// Append data to sheet
export async function appendSheet(range: string, values: any[][]): Promise<void> {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'RAW',
      requestBody: { values },
    });
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw error;
  }
}

// Update specific cell
export async function updateCell(range: string, value: any): Promise<void> {
  await writeSheet(range, [[value]]);
}

// Find row by value in specific column
export async function findRowByValue(
  sheetName: string,
  columnIndex: number,
  searchValue: string
): Promise<number | null> {
  const data = await readSheet(`${sheetName}!A:ZZ`);
  
  for (let i = 1; i < data.length; i++) { // Skip header row
    if (data[i][columnIndex] === searchValue) {
      return i + 1; // Return 1-indexed row number
    }
  }
  
  return null;
}

// Delete row
export async function deleteRow(sheetName: string, rowIndex: number): Promise<void> {
  try {
    const spreadsheetId = SHEET_ID;
    
    // Get sheet ID by name
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = spreadsheet.data.sheets?.find(s => s.properties?.title === sheetName);
    
    if (!sheet || !sheet.properties?.sheetId) {
      throw new Error(`Sheet ${sheetName} not found`);
    }
    
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: sheet.properties.sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex - 1,
              endIndex: rowIndex
            }
          }
        }]
      }
    });
  } catch (error) {
    console.error('Error deleting row:', error);
    throw error;
  }
}

// Helper: Convert array to object using header row
export function arrayToObject(headers: string[], row: any[]): any {
  const obj: any = {};
  headers.forEach((header, index) => {
    obj[header] = row[index] || '';
  });
  return obj;
}

// Helper: Convert object to array using header row
export function objectToArray(headers: string[], obj: any): any[] {
  return headers.map(header => obj[header] || '');
}

// Students Master Operations
export async function getStudentByEnrollment(enrollmentNo: string): Promise<any | null> {
  const data = await readSheet(`${SHEETS.STUDENTS}!A:Z`);
  if (data.length < 2) return null;
  
  const headers = data[0];
  const enrollmentIndex = headers.indexOf('Enrollment No');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][enrollmentIndex] === enrollmentNo) {
      return arrayToObject(headers, data[i]);
    }
  }
  
  return null;
}

export async function updateStudentTransport(
  enrollmentNo: string,
  transportData: {
    busNo?: string;
    routeNo?: string;
    shift?: string;
    transportStatus?: string;
    registrationDate?: string;
    cancellationDate?: string;
  }
): Promise<void> {
  const rowIndex = await findRowByValue(SHEETS.STUDENTS, 0, enrollmentNo); // Assuming enrollment is in column A
  
  if (!rowIndex) {
    throw new Error('Student not found');
  }
  
  const data = await readSheet(`${SHEETS.STUDENTS}!A${rowIndex}:Z${rowIndex}`);
  const headers = await readSheet(`${SHEETS.STUDENTS}!A1:Z1`);
  
  if (data.length === 0 || headers.length === 0) return;
  
  const currentData = arrayToObject(headers[0], data[0]);
  const updatedData = { ...currentData, ...transportData };
  const updatedRow = objectToArray(headers[0], updatedData);
  
  await writeSheet(`${SHEETS.STUDENTS}!A${rowIndex}:Z${rowIndex}`, [updatedRow]);
}

// Bus Operations
export async function getAllBuses(): Promise<any[]> {
  const data = await readSheet(`${SHEETS.BUSES}!A:Z`);
  if (data.length < 2) return [];
  
  const headers = data[0];
  return data.slice(1).map(row => arrayToObject(headers, row));
}

export async function getBusByNumber(busNo: string): Promise<any | null> {
  const data = await readSheet(`${SHEETS.BUSES}!A:Z`);
  if (data.length < 2) return null;
  
  const headers = data[0];
  const busIndex = headers.indexOf('Bus No');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][busIndex] === busNo) {
      return arrayToObject(headers, data[i]);
    }
  }
  
  return null;
}

// Route Operations
export async function getAllRoutes(): Promise<any[]> {
  const data = await readSheet(`${SHEETS.ROUTES}!A:Z`);
  if (data.length < 2) return [];
  
  const headers = data[0];
  return data.slice(1).map(row => arrayToObject(headers, row));
}

// Driver/Conductor Operations
export async function getDriverById(empId: string): Promise<any | null> {
  const data = await readSheet(`${SHEETS.DRIVERS}!A:Z`);
  if (data.length < 2) return null;
  
  const headers = data[0];
  const empIndex = headers.indexOf('Emp ID');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][empIndex] === empId) {
      return arrayToObject(headers, data[i]);
    }
  }
  
  return null;
}

export async function getConductorById(empId: string): Promise<any | null> {
  const data = await readSheet(`${SHEETS.CONDUCTORS}!A:Z`);
  if (data.length < 2) return null;
  
  const headers = data[0];
  const empIndex = headers.indexOf('Emp ID');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][empIndex] === empId) {
      return arrayToObject(headers, data[i]);
    }
  }
  
  return null;
}

// Attendance Operations
export async function markAttendance(attendanceData: {
  date: string;
  busNo: string;
  enrollmentNo: string;
  shift: string;
  amStatus?: string;
  pmStatus?: string;
  markedBy: string;
}): Promise<void> {
  const timestamp = new Date().toISOString();
  
  const row = [
    attendanceData.date,
    attendanceData.busNo,
    attendanceData.enrollmentNo,
    attendanceData.shift,
    attendanceData.amStatus || '',
    attendanceData.pmStatus || '',
    attendanceData.markedBy,
    timestamp
  ];
  
  await appendSheet(`${SHEETS.ATTENDANCE}!A:H`, [row]);
}

// KM Log Operations
export async function logKM(kmData: {
  date: string;
  busNo: string;
  driverId: string;
  startKM: number;
  endKM: number;
  shift: string;
}): Promise<void> {
  const timestamp = new Date().toISOString();
  const totalKM = kmData.endKM - kmData.startKM;
  
  const row = [
    kmData.date,
    kmData.busNo,
    kmData.driverId,
    kmData.startKM,
    kmData.endKM,
    totalKM,
    kmData.shift,
    timestamp
  ];
  
  await appendSheet(`${SHEETS.KM_LOG}!A:H`, [row]);
}

// OT Operations
export async function submitOT(otData: {
  empId: string;
  name: string;
  role: string;
  date: string;
  shift: string;
  startTime: string;
  endTime: string;
  hours: number;
  otCategory: string;
  rateMultiplier: number;
  amount: number;
  remarks?: string;
}): Promise<string> {
  const submissionId = `OT-${Date.now()}`;
  const timestamp = new Date().toISOString();
  
  const row = [
    submissionId,
    otData.empId,
    otData.name,
    otData.role,
    otData.date,
    otData.shift,
    otData.startTime,
    otData.endTime,
    otData.hours,
    otData.otCategory,
    otData.rateMultiplier,
    otData.amount,
    'Active',
    otData.remarks || '',
    timestamp
  ];
  
  await appendSheet(`${SHEETS.OT_SUBMISSIONS}!A:O`, [row]);
  return submissionId;
}

export async function getOTConfig(): Promise<any> {
  const data = await readSheet(`${SHEETS.OT_CONFIG}!A:Z`);
  if (data.length < 2) return null;
  
  const headers = data[0];
  return arrayToObject(headers, data[1]);
}

// SMS Log
export async function logSMS(smsData: {
  enrollmentNo: string;
  type: string;
  messageText: string;
  status: string;
}): Promise<void> {
  const timestamp = new Date().toISOString();
  
  const row = [
    timestamp,
    smsData.enrollmentNo,
    smsData.type,
    smsData.messageText,
    smsData.status
  ];
  
  await appendSheet(`${SHEETS.SMS_LOG}!A:E`, [row]);
}

// Access Token Management
export async function getAccessToken(token: string): Promise<any | null> {
  const data = await readSheet(`${SHEETS.ACCESS_TOKENS}!A:Z`);
  if (data.length < 2) return null;
  
  const headers = data[0];
  const tokenIndex = headers.indexOf('Token');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][tokenIndex] === token) {
      return arrayToObject(headers, data[i]);
    }
  }
  
  return null;
}

export default {
  readSheet,
  writeSheet,
  appendSheet,
  updateCell,
  findRowByValue,
  deleteRow,
  arrayToObject,
  objectToArray,
  getStudentByEnrollment,
  updateStudentTransport,
  getAllBuses,
  getBusByNumber,
  getAllRoutes,
  getDriverById,
  getConductorById,
  markAttendance,
  logKM,
  submitOT,
  getOTConfig,
  logSMS,
  getAccessToken
};
