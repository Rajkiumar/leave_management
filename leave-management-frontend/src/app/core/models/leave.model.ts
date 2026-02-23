export enum LeaveType {
  ANNUAL = 'ANNUAL',
  SICK = 'SICK',
  CASUAL = 'CASUAL',
  MATERNITY = 'MATERNITY',
  PATERNITY = 'PATERNITY',
  COMPENSATORY = 'COMPENSATORY',
  UNPAID = 'UNPAID',
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum LeaveDuration {
  FULL_DAY = 'FULL_DAY',
  FIRST_HALF = 'FIRST_HALF',
  SECOND_HALF = 'SECOND_HALF',
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  duration: LeaveDuration;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  approvedBy?: string;
  approverName?: string;
  approvedOn?: string;
  rejectionReason?: string;
  attachmentUrl?: string;
}

export interface LeaveBalance {
  leaveType: LeaveType;
  leaveTypeName: string;
  total: number;
  used: number;
  pending: number;
  available: number;
  carryForward: number;
}

export interface LeavePolicy {
  id: string;
  leaveType: LeaveType;
  leaveTypeName: string;
  totalDaysPerYear: number;
  maxConsecutiveDays: number;
  carryForwardLimit: number;
  minServiceDaysRequired: number;
  requiresAttachment: boolean;
  requiresApproval: boolean;
  description: string;
  isActive: boolean;
}

export interface LeaveApplyPayload {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  duration: LeaveDuration;
  reason: string;
  attachment?: File;
}

export interface LeaveActionPayload {
  leaveRequestId: string;
  action: 'APPROVE' | 'REJECT';
  comments?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  isOptional: boolean;
  description?: string;
}

export interface LeaveCalendarEntry {
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  leaveType: LeaveType;
  duration: LeaveDuration;
  status: LeaveStatus;
}
