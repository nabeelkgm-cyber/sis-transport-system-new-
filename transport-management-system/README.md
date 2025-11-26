# SIS Transport Management System

A comprehensive web-based transport management system for Shantiniketan Indian School, Qatar.

## 🎯 System Overview

This system manages all aspects of school transport operations including:

- **Dual Shift Operations** (FN/AN) with complete student transport management
- **Driver & Conductor Portals** for KM logging and attendance tracking
- **Automated Overtime Calculation** with configurable rates and categories
- **Real-time Google Sheets Integration** as primary data source
- **SMS Notifications** for registration, cancellation, and route changes
- **Madrassa Transport Module** for weekend operations
- **Comprehensive Reports** (PDF & Excel exports)

## 📋 Key Features

### 1. Transport Registration & Management
- Search students by enrollment number
- Register/cancel/update transport assignments
- Prevent duplicate registrations
- Auto-validate bus capacity
- Automated SMS notifications

### 2. Driver KM Logging Portal
- Link-based access (no login required)
- Daily KM entry (Start/End readings)
- Shift-wise logging (FN/AN)
- View recent submission history
- Direct Google Sheets sync

### 3. Conductor Attendance Portal
- Bus-specific student lists
- Online attendance marking
- Printable PDF attendance sheets
- AM/PM status tracking
- Date-wise filtering

### 4. Overtime Calculation System
- Automatic categorization based on time & shift
- Driver-specific OT rules:
  - Early Morning (7:30-10:30): 1.5x Gross
  - Friday/Holiday: 1.5x Basic
  - Off Shift (19:30-04:30): 1.5x Basic
  - Additional Duty: 1.25x Basic
- Conductor-specific OT rules:
  - FN Task (≤4h): 1.5x Gross
  - Friday/Holiday: 1.5x Basic
  - Off Shift: 1.5x Basic
  - Additional Duty: 1.25x Basic
- Admin override capabilities
- Monthly summaries and reports

### 5. Report Generation
- **Attendance Sheets**: Bus-wise, date range, shift-wise
- **Route Sheets**: Auto-generated with student lists
- **Event Route Sheets**: Upload Excel for special events
- **Transport Annexure**: FN/AN/All users lists
- **OT Reports**: Individual slips and monthly summaries
- **KM Summary**: Driver-wise distance tracking

### 6. Admin Dashboard
- Live bus capacity utilization
- Real-time seat occupancy
- FN/AN breakdown
- Quick stats and metrics
- CRUD operations for all entities

### 7. Madrassa Transport Module
- Separate student database (1000-1500 students)
- Thursday & Saturday operations
- Print-only route sheets
- No dashboard integration

## 🏗️ Architecture

### Tech Stack
```
Frontend:  Next.js 14 (React) with TypeScript
Backend:   Next.js API Routes + Google Apps Script
Database:  Google Sheets (Primary)
Styling:   Tailwind CSS
Reports:   jsPDF, ExcelJS
Hosting:   Vercel
```

### Data Flow
```
User Input → Next.js API → Google Sheets API → Google Sheet
     ↓           ↓              ↓                    ↓
  Frontend ← API Response ← Validation ← Real-time Sync
```

## 📁 Project Structure

```
transport-management-system/
├── app/
│   ├── api/
│   │   ├── transport/
│   │   │   ├── register/route.ts
│   │   │   ├── cancel/route.ts
│   │   │   └── update/route.ts
│   │   ├── overtime/
│   │   │   ├── submit/route.ts
│   │   │   ├── approve/route.ts
│   │   │   └── report/route.ts
│   │   ├── attendance/
│   │   │   └── mark/route.ts
│   │   ├── km-log/
│   │   │   └── submit/route.ts
│   │   └── reports/
│   │       ├── attendance-pdf/route.ts
│   │       ├── route-sheet/route.ts
│   │       └── overtime-pdf/route.ts
│   ├── admin/
│   │   ├── dashboard/page.tsx
│   │   ├── students/page.tsx
│   │   ├── overtime/page.tsx
│   │   └── reports/page.tsx
│   ├── driver/
│   │   └── [accessToken]/page.tsx
│   ├── conductor/
│   │   └── [accessToken]/page.tsx
│   └── staff/
│       └── overtime/page.tsx
├── components/
│   ├── portals/
│   │   ├── DriverKMForm.tsx
│   │   ├── ConductorAttendanceForm.tsx
│   │   └── OTSubmissionForm.tsx
│   ├── admin/
│   │   ├── TransportRegistration.tsx
│   │   ├── BusCRUD.tsx
│   │   └── OvertimeManager.tsx
│   └── reports/
│       ├── AttendanceSheetPDF.tsx
│       └── RouteSheetGenerator.tsx
├── lib/
│   ├── googleSheets.ts
│   ├── overtimeCalculator.ts
│   └── smsService.ts
├── public/
├── next.config.js
├── tsconfig.json
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Google Cloud Project with Sheets API enabled
- Service Account credentials
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd transport-management-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create `.env.local`:
```env
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
SMS_API_KEY=your_sms_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Setup Google Sheet**

Create a Google Sheet with these tabs:
- Students Master
- Bus Master
- Routes Master
- Driver Master
- Conductor Master
- Attendance Log
- KM Log
- OT Submissions
- OT Configuration
- SMS Log
- Access Tokens
- Madrassa Students

See `DEPLOYMENT_GUIDE.md` for detailed sheet structure.

5. **Run development server**
```bash
npm run dev
```

Visit: `http://localhost:3000`

## 📱 User Access

### Admin Dashboard
```
URL: https://your-app.vercel.app/admin
Login with admin credentials
```

### Driver Portal
```
URL: https://your-app.vercel.app/driver/[access-token]
No login required (token-based access)
```

### Conductor Portal
```
URL: https://your-app.vercel.app/conductor/[access-token]
No login required (token-based access)
```

### OT Submission
```
URL: https://your-app.vercel.app/staff/overtime?empId=DRV001&role=Driver
Direct access for staff
```

## 🔧 Configuration

### OT Configuration
Update values in "OT Configuration" sheet:

| Parameter | Default Value |
|-----------|---------------|
| Driver Daily Hour Value | 1 |
| Conductor Daily Hour Value | 4 |
| Working Days Per Month | 22 |
| Early Morning Start | 07:30 |
| Early Morning End | 10:30 |
| Off Shift Start | 19:30 |
| Off Shift End | 04:30 |

### Access Token Generation
Add entries to "Access Tokens" sheet:
```
Token: [uuid-generated-token]
Emp ID: DRV001
Name: Ahmed Ali
Role: Driver
Created Date: 2024-11-24
Expires Date: 2025-11-24
Status: Active
```

## 📊 API Endpoints

### Transport Management
- `POST /api/transport/register` - Register student
- `POST /api/transport/cancel` - Cancel transport
- `POST /api/transport/update` - Update transport details

### Overtime
- `POST /api/overtime/submit` - Submit OT entry
- `GET /api/overtime/report` - Get monthly report
- `PUT /api/overtime/approve` - Admin approval
- `PUT /api/overtime/nullify` - Nullify entry
- `DELETE /api/overtime/delete` - Delete entry

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/mark?busNo=BUS01&shift=FN&date=2024-11-24` - Get student list

### KM Logging
- `POST /api/km-log/submit` - Log KM entry
- `GET /api/km-log/submit?driverId=DRV001` - Get driver logs

## 📄 Reports

### Available Reports
1. **Attendance Sheet (PDF)**
   - Input: Bus No, Date Range, Shift, Filter (KG/Non-KG)
   - Output: Printable PDF with checkbox grid

2. **Route Sheet (PDF)**
   - Auto-generated per bus/shift
   - Includes capacity utilization
   - Separate KG/Non-KG sections

3. **Event Route Sheet (PDF)**
   - Upload Excel with selected students
   - Generate bus-wise assignments

4. **Transport Annexure (Excel)**
   - FN/AN/All transport users
   - Formatted with school branding

5. **OT Report (PDF & Excel)**
   - Individual monthly slips
   - Consolidated payroll report
   - Category-wise breakdown

## 🔐 Security

- Service account authentication for Google Sheets
- Token-based access for drivers/conductors
- Password-protected admin dashboard
- Environment variables for sensitive data
- API endpoint validation
- Input sanitization

## 🧪 Testing

### API Testing
```bash
# Test transport registration
curl -X POST http://localhost:3000/api/transport/register \
  -H "Content-Type: application/json" \
  -d '{
    "enrollmentNo": "2024001",
    "busNo": "BUS01",
    "routeNo": "R01",
    "shift": "FN"
  }'

# Test OT submission
curl -X POST http://localhost:3000/api/overtime/submit \
  -H "Content-Type: application/json" \
  -d '{
    "empId": "DRV001",
    "role": "Driver",
    "date": "2024-11-24",
    "shift": "FN",
    "startTime": "07:30",
    "endTime": "10:30"
  }'
```

## 📦 Deployment

### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Configure environment variables in Vercel Dashboard**

See `DEPLOYMENT_GUIDE.md` for complete instructions.

## 🛠️ Maintenance

### Daily Tasks
- Monitor SMS delivery status
- Verify attendance submissions
- Check KM log entries

### Weekly Tasks
- Review OT submissions
- Generate weekly reports
- Backup Google Sheet

### Monthly Tasks
- Process OT payroll
- Audit access tokens
- Review system logs
- Generate monthly reports

## 📞 Support

For issues or questions:
- Email: nabeelkgm@gmail.com
- School IT Department
- Check `SYSTEM_ARCHITECTURE.md` for technical details
- Review `DEPLOYMENT_GUIDE.md` for setup help

## 📝 License

Proprietary - Shantiniketan Indian School, Qatar

## 👥 Credits

**Developed by:** Nabeel (Finance Head & System Developer)  
**For:** Shantiniketan Indian School, Qatar  
**Version:** 1.0  
**Last Updated:** November 2024

---

## 🎉 Success Metrics

- ✅ Real-time data synchronization
- ✅ Zero duplicate registrations
- ✅ Automated overtime calculations
- ✅ SMS notification system
- ✅ Mobile-responsive design
- ✅ Role-based access control
- ✅ PDF & Excel report generation
- ✅ Audit trail for all operations

---

**Note:** This system is designed specifically for Shantiniketan Indian School's transport operations and may require customization for other institutions.
