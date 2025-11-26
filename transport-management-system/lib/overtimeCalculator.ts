// lib/overtimeCalculator.ts
import { format, parse, differenceInHours, differenceInMinutes, isWithinInterval } from 'date-fns';

export interface OTConfig {
  driverDailyHourValue: number;
  conductorDailyHourValue: number;
  workingDaysPerMonth: number;
  earlyMorningStart: string; // "07:30"
  earlyMorningEnd: string; // "10:30"
  offShiftStart: string; // "19:30"
  offShiftEnd: string; // "04:30"
}

export interface EmployeeData {
  empId: string;
  name: string;
  role: 'Driver' | 'Conductor';
  basicSalary: number;
  grossSalary: number;
}

export interface OTSubmission {
  date: string;
  shift: string; // 'FN' | 'AN' | 'Both' | 'Special Task'
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  remarks?: string;
}

export interface OTCalculationResult {
  hours: number;
  category: string;
  rateMultiplier: number;
  basedOn: 'Basic' | 'Gross';
  amount: number;
  description: string;
}

// Default configuration
const DEFAULT_CONFIG: OTConfig = {
  driverDailyHourValue: 1, // Can be configured (previously was 4.5)
  conductorDailyHourValue: 4,
  workingDaysPerMonth: 22,
  earlyMorningStart: '07:30',
  earlyMorningEnd: '10:30',
  offShiftStart: '19:30',
  offShiftEnd: '04:30'
};

/**
 * Calculate total hours between start and end time
 */
function calculateHours(startTime: string, endTime: string): number {
  const today = format(new Date(), 'yyyy-MM-dd');
  let start = parse(`${today} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date());
  let end = parse(`${today} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date());
  
  // Handle overnight shifts
  if (end < start) {
    end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  }
  
  const minutes = differenceInMinutes(end, start);
  return Number((minutes / 60).toFixed(2));
}

/**
 * Check if time falls within a range
 */
function isTimeInRange(time: string, rangeStart: string, rangeEnd: string): boolean {
  const today = format(new Date(), 'yyyy-MM-dd');
  const checkTime = parse(`${today} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
  let start = parse(`${today} ${rangeStart}`, 'yyyy-MM-dd HH:mm', new Date());
  let end = parse(`${today} ${rangeEnd}`, 'yyyy-MM-dd HH:mm', new Date());
  
  // Handle overnight ranges
  if (end < start) {
    // Split into two ranges: start to midnight and midnight to end
    const midnight = new Date(start);
    midnight.setHours(23, 59, 59, 999);
    
    const nextDayStart = new Date(start);
    nextDayStart.setDate(nextDayStart.getDate() + 1);
    nextDayStart.setHours(0, 0, 0, 0);
    
    return (checkTime >= start && checkTime <= midnight) || 
           (checkTime >= nextDayStart && checkTime <= end);
  }
  
  return checkTime >= start && checkTime <= end;
}

/**
 * Check if date is Friday
 */
function isFriday(dateString: string): boolean {
  const date = parse(dateString, 'yyyy-MM-dd', new Date());
  return date.getDay() === 5;
}

/**
 * Calculate overtime for Driver
 */
export function calculateDriverOT(
  employee: EmployeeData,
  submission: OTSubmission,
  config: OTConfig = DEFAULT_CONFIG
): OTCalculationResult {
  const hours = calculateHours(submission.startTime, submission.endTime);
  const isFridayOrHoliday = isFriday(submission.date) || 
                            submission.remarks?.toLowerCase().includes('holiday');
  
  // Priority order for categorization:
  // 1. Friday/Holiday
  // 2. Early Morning Shift (7:30am - 10:30am)
  // 3. Off Shift (7:30pm - 4:30am)
  // 4. Additional Duty Allowance
  
  if (isFridayOrHoliday) {
    const hourlyRate = employee.basicSalary / (config.driverDailyHourValue * config.workingDaysPerMonth);
    return {
      hours,
      category: 'Friday/Holiday',
      rateMultiplier: 1.5,
      basedOn: 'Basic',
      amount: Number((hours * hourlyRate * 1.5).toFixed(2)),
      description: `Friday/Holiday duty at 1.5x Basic Salary`
    };
  }
  
  if (isTimeInRange(submission.startTime, config.earlyMorningStart, config.earlyMorningEnd)) {
    const hourlyRate = employee.grossSalary / (config.driverDailyHourValue * config.workingDaysPerMonth);
    return {
      hours,
      category: 'Early Morning Shift',
      rateMultiplier: 1.5,
      basedOn: 'Gross',
      amount: Number((hours * hourlyRate * 1.5).toFixed(2)),
      description: `Early morning shift (${config.earlyMorningStart}-${config.earlyMorningEnd}) at 1.5x Gross Salary`
    };
  }
  
  if (isTimeInRange(submission.startTime, config.offShiftStart, config.offShiftEnd) ||
      isTimeInRange(submission.endTime, config.offShiftStart, config.offShiftEnd)) {
    const hourlyRate = employee.basicSalary / (config.driverDailyHourValue * config.workingDaysPerMonth);
    return {
      hours,
      category: 'Off Shift',
      rateMultiplier: 1.5,
      basedOn: 'Basic',
      amount: Number((hours * hourlyRate * 1.5).toFixed(2)),
      description: `Off-shift duty (${config.offShiftStart}-${config.offShiftEnd}) at 1.5x Basic Salary`
    };
  }
  
  // Additional Duty Allowance (default category)
  const hourlyRate = employee.basicSalary / (config.driverDailyHourValue * config.workingDaysPerMonth);
  return {
    hours,
    category: 'Additional Duty Allowance',
    rateMultiplier: 1.25,
    basedOn: 'Basic',
    amount: Number((hours * hourlyRate * 1.25).toFixed(2)),
    description: `Additional duty at 1.25x Basic Salary`
  };
}

/**
 * Calculate overtime for Conductor
 */
export function calculateConductorOT(
  employee: EmployeeData,
  submission: OTSubmission,
  config: OTConfig = DEFAULT_CONFIG
): OTCalculationResult {
  const hours = calculateHours(submission.startTime, submission.endTime);
  const isFridayOrHoliday = isFriday(submission.date) || 
                            submission.remarks?.toLowerCase().includes('holiday');
  
  // Priority order for categorization:
  // 1. Friday/Holiday
  // 2. FN Shift Task (up to 4 hours)
  // 3. Off Shift (7:30pm - 4:30am)
  // 4. Additional Duty Allowance
  
  if (isFridayOrHoliday) {
    const hourlyRate = employee.basicSalary / (config.conductorDailyHourValue * config.workingDaysPerMonth);
    return {
      hours,
      category: 'Friday/Holiday',
      rateMultiplier: 1.5,
      basedOn: 'Basic',
      amount: Number((hours * hourlyRate * 1.5).toFixed(2)),
      description: `Friday/Holiday duty at 1.5x Basic Salary`
    };
  }
  
  if (submission.shift === 'FN' && hours <= config.conductorDailyHourValue) {
    const hourlyRate = employee.grossSalary / (config.conductorDailyHourValue * config.workingDaysPerMonth);
    return {
      hours,
      category: 'FN Shift Task',
      rateMultiplier: 1.5,
      basedOn: 'Gross',
      amount: Number((hours * hourlyRate * 1.5).toFixed(2)),
      description: `FN shift task (up to ${config.conductorDailyHourValue}h) at 1.5x Gross Salary`
    };
  }
  
  if (isTimeInRange(submission.startTime, config.offShiftStart, config.offShiftEnd) ||
      isTimeInRange(submission.endTime, config.offShiftStart, config.offShiftEnd)) {
    const hourlyRate = employee.basicSalary / (config.conductorDailyHourValue * config.workingDaysPerMonth);
    return {
      hours,
      category: 'Off Shift',
      rateMultiplier: 1.5,
      basedOn: 'Basic',
      amount: Number((hours * hourlyRate * 1.5).toFixed(2)),
      description: `Off-shift duty (${config.offShiftStart}-${config.offShiftEnd}) at 1.5x Basic Salary`
    };
  }
  
  // Additional Duty Allowance (default category)
  const hourlyRate = employee.basicSalary / (config.conductorDailyHourValue * config.workingDaysPerMonth);
  return {
    hours,
    category: 'Additional Duty Allowance',
    rateMultiplier: 1.25,
    basedOn: 'Basic',
    amount: Number((hours * hourlyRate * 1.25).toFixed(2)),
    description: `Additional duty at 1.25x Basic Salary`
  };
}

/**
 * Main OT calculation function
 */
export function calculateOT(
  employee: EmployeeData,
  submission: OTSubmission,
  config?: OTConfig
): OTCalculationResult {
  if (employee.role === 'Driver') {
    return calculateDriverOT(employee, submission, config);
  } else {
    return calculateConductorOT(employee, submission, config);
  }
}

/**
 * Calculate monthly OT summary for an employee
 */
export interface MonthlyOTSummary {
  empId: string;
  name: string;
  role: string;
  month: string;
  categories: {
    [category: string]: {
      hours: number;
      amount: number;
      count: number;
    };
  };
  totalHours: number;
  totalAmount: number;
}

export function calculateMonthlyOT(
  employee: EmployeeData,
  submissions: OTSubmission[],
  config?: OTConfig
): MonthlyOTSummary {
  const summary: MonthlyOTSummary = {
    empId: employee.empId,
    name: employee.name,
    role: employee.role,
    month: '',
    categories: {},
    totalHours: 0,
    totalAmount: 0
  };
  
  submissions.forEach(submission => {
    const result = calculateOT(employee, submission, config);
    
    if (!summary.categories[result.category]) {
      summary.categories[result.category] = {
        hours: 0,
        amount: 0,
        count: 0
      };
    }
    
    summary.categories[result.category].hours += result.hours;
    summary.categories[result.category].amount += result.amount;
    summary.categories[result.category].count += 1;
    
    summary.totalHours += result.hours;
    summary.totalAmount += result.amount;
  });
  
  return summary;
}

/**
 * Validate OT submission
 */
export function validateOTSubmission(submission: OTSubmission): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate date format
  try {
    parse(submission.date, 'yyyy-MM-dd', new Date());
  } catch (e) {
    errors.push('Invalid date format. Use YYYY-MM-DD');
  }
  
  // Validate time format
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(submission.startTime)) {
    errors.push('Invalid start time format. Use HH:mm');
  }
  if (!timeRegex.test(submission.endTime)) {
    errors.push('Invalid end time format. Use HH:mm');
  }
  
  // Validate shift
  const validShifts = ['FN', 'AN', 'Both', 'Special Task'];
  if (!validShifts.includes(submission.shift)) {
    errors.push('Invalid shift. Must be FN, AN, Both, or Special Task');
  }
  
  // Validate hours are positive
  const hours = calculateHours(submission.startTime, submission.endTime);
  if (hours <= 0) {
    errors.push('End time must be after start time');
  }
  
  if (hours > 24) {
    errors.push('Duty hours cannot exceed 24 hours');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export default {
  calculateOT,
  calculateDriverOT,
  calculateConductorOT,
  calculateMonthlyOT,
  validateOTSubmission,
  calculateHours
};
