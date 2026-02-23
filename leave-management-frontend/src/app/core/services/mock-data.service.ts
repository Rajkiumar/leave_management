import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  User, UserRole, LeaveRequest, LeaveBalance, LeavePolicy, Holiday,
  LeaveType, LeaveStatus, LeaveDuration, LeaveCalendarEntry, DashboardStats, ComplianceReport,
  ApiResponse, PaginatedResponse, AuthResponse
} from '../models';

/**
 * MockDataService provides stub responses for frontend development
 * before the Rust backend is ready. All data arrays are empty —
 * replace with real HTTP calls once the backend APIs are available.
 */
@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  // ─── Stub Users (login only, no display data) ─────────
  private users: User[] = [
    {
      id: '1', employeeId: 'EMP001', firstName: 'John', lastName: 'Doe',
      email: 'john.doe@company.com', role: UserRole.EMPLOYEE, department: '',
      designation: '', joiningDate: '', isActive: true,
    },
    {
      id: '2', employeeId: 'EMP002', firstName: 'Jane', lastName: 'Smith',
      email: 'jane.smith@company.com', role: UserRole.MANAGER, department: '',
      designation: '', joiningDate: '', isActive: true,
    },
    {
      id: '3', employeeId: 'EMP003', firstName: 'Sarah', lastName: 'Johnson',
      email: 'sarah.johnson@company.com', role: UserRole.HR_ADMIN, department: '',
      designation: '', joiningDate: '', isActive: true,
    },
  ];

  // All data arrays are empty — will be populated from the backend
  private leaveRequests: LeaveRequest[] = [];
  private leaveBalances: LeaveBalance[] = [];
  private holidays: Holiday[] = [];
  private leavePolicies: LeavePolicy[] = [];

  // ─── Simulated API Responses ───────────────────────────

  private wrap<T>(data: T, message = 'Success'): Observable<ApiResponse<T>> {
    return of({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    }).pipe(delay(300));
  }

  private emptyPage<T>(): PaginatedResponse<T> {
    return { items: [], totalItems: 0, currentPage: 1, totalPages: 0, pageSize: 10 };
  }

  // Auth — keeps login working for navigation
  mockLogin(email: string, _password: string): Observable<ApiResponse<AuthResponse>> {
    const user = this.users.find((u) => u.email === email) || this.users[0];
    return this.wrap<AuthResponse>({
      token: 'mock-jwt-token-' + user.id,
      refreshToken: 'mock-refresh-token-' + user.id,
      expiresIn: 86400,
      user,
    }, 'Login successful');
  }

  // Dashboard — all zeros
  mockDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.wrap<DashboardStats>({
      totalEmployees: 0,
      pendingRequests: 0,
      approvedToday: 0,
      onLeaveToday: 0,
      upcomingHolidays: 0,
    });
  }

  // Leaves
  mockGetMyLeaves(_employeeId: string): Observable<ApiResponse<PaginatedResponse<LeaveRequest>>> {
    return this.wrap(this.emptyPage<LeaveRequest>());
  }

  mockGetLeaveBalance(): Observable<ApiResponse<LeaveBalance[]>> {
    return this.wrap(this.leaveBalances);
  }

  mockGetPendingApprovals(): Observable<ApiResponse<PaginatedResponse<LeaveRequest>>> {
    return this.wrap(this.emptyPage<LeaveRequest>());
  }

  mockGetAllLeaveRequests(): Observable<ApiResponse<PaginatedResponse<LeaveRequest>>> {
    return this.wrap(this.emptyPage<LeaveRequest>());
  }

  mockGetHolidays(): Observable<ApiResponse<Holiday[]>> {
    return this.wrap(this.holidays);
  }

  mockGetPolicies(): Observable<ApiResponse<LeavePolicy[]>> {
    return this.wrap(this.leavePolicies);
  }

  mockGetCalendarEntries(): Observable<ApiResponse<LeaveCalendarEntry[]>> {
    return this.wrap<LeaveCalendarEntry[]>([]);
  }

  mockGetAllUsers(): Observable<ApiResponse<PaginatedResponse<User>>> {
    return this.wrap(this.emptyPage<User>());
  }

  mockGetComplianceReport(): Observable<ApiResponse<ComplianceReport[]>> {
    return this.wrap<ComplianceReport[]>([]);
  }

  mockApplyLeave(leaveRequest: Partial<LeaveRequest>): Observable<ApiResponse<LeaveRequest>> {
    const newRequest: LeaveRequest = {
      id: 'LR' + String(this.leaveRequests.length + 1).padStart(3, '0'),
      employeeId: leaveRequest.employeeId || '1',
      employeeName: leaveRequest.employeeName || '',
      department: leaveRequest.department || '',
      leaveType: leaveRequest.leaveType || LeaveType.ANNUAL,
      startDate: leaveRequest.startDate || '',
      endDate: leaveRequest.endDate || '',
      duration: leaveRequest.duration || LeaveDuration.FULL_DAY,
      totalDays: leaveRequest.totalDays || 1,
      reason: leaveRequest.reason || '',
      status: LeaveStatus.PENDING,
      appliedOn: new Date().toISOString().split('T')[0],
    };
    this.leaveRequests.push(newRequest);
    return this.wrap(newRequest, 'Leave application submitted successfully');
  }

  mockApproveReject(id: string, action: 'APPROVE' | 'REJECT', comments?: string): Observable<ApiResponse<LeaveRequest>> {
    const request = this.leaveRequests.find((lr) => lr.id === id);
    if (request) {
      request.status = action === 'APPROVE' ? LeaveStatus.APPROVED : LeaveStatus.REJECTED;
      request.approvedBy = '2';
      request.approverName = 'Jane Smith';
      request.approvedOn = new Date().toISOString().split('T')[0];
      if (action === 'REJECT') request.rejectionReason = comments;
    }
    return this.wrap(request!, `Leave request ${action.toLowerCase()}d successfully`);
  }
}
