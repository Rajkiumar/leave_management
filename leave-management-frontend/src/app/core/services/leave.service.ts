import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PaginatedResponse,
  LeaveRequest,
  LeaveBalance,
  LeaveApplyPayload,
  LeaveActionPayload,
  LeavePolicy,
  Holiday,
  LeaveCalendarEntry,
  LeaveStatus,
  LeaveType,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private readonly apiUrl = `${environment.apiUrl}/leaves`;

  constructor(private http: HttpClient) {}

  // ─── Employee Actions ──────────────────────────────────
  applyLeave(payload: LeaveApplyPayload): Observable<ApiResponse<LeaveRequest>> {
    const formData = new FormData();
    formData.append('leaveType', payload.leaveType);
    formData.append('startDate', payload.startDate);
    formData.append('endDate', payload.endDate);
    formData.append('duration', payload.duration);
    formData.append('reason', payload.reason);
    if (payload.attachment) {
      formData.append('attachment', payload.attachment);
    }
    return this.http.post<ApiResponse<LeaveRequest>>(`${this.apiUrl}/apply`, formData);
  }

  getMyLeaves(
    page = 1,
    pageSize = 10,
    status?: LeaveStatus,
    leaveType?: LeaveType
  ): Observable<ApiResponse<PaginatedResponse<LeaveRequest>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (status) params = params.set('status', status);
    if (leaveType) params = params.set('leaveType', leaveType);

    return this.http.get<ApiResponse<PaginatedResponse<LeaveRequest>>>(`${this.apiUrl}/my-leaves`, {
      params,
    });
  }

  getLeaveById(id: string): Observable<ApiResponse<LeaveRequest>> {
    return this.http.get<ApiResponse<LeaveRequest>>(`${this.apiUrl}/${id}`);
  }

  cancelLeave(id: string): Observable<ApiResponse<LeaveRequest>> {
    return this.http.patch<ApiResponse<LeaveRequest>>(`${this.apiUrl}/${id}/cancel`, {});
  }

  getMyBalance(): Observable<ApiResponse<LeaveBalance[]>> {
    return this.http.get<ApiResponse<LeaveBalance[]>>(`${this.apiUrl}/balance`);
  }

  // ─── Manager Actions ──────────────────────────────────
  getPendingApprovals(
    page = 1,
    pageSize = 10
  ): Observable<ApiResponse<PaginatedResponse<LeaveRequest>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResponse<LeaveRequest>>>(
      `${this.apiUrl}/pending-approvals`,
      { params }
    );
  }

  approveOrRejectLeave(payload: LeaveActionPayload): Observable<ApiResponse<LeaveRequest>> {
    return this.http.post<ApiResponse<LeaveRequest>>(`${this.apiUrl}/action`, payload);
  }

  getTeamLeaves(
    page = 1,
    pageSize = 10
  ): Observable<ApiResponse<PaginatedResponse<LeaveRequest>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResponse<LeaveRequest>>>(
      `${this.apiUrl}/team-leaves`,
      { params }
    );
  }

  // ─── Calendar ──────────────────────────────────────────
  getCalendarEntries(
    month: number,
    year: number,
    department?: string
  ): Observable<ApiResponse<LeaveCalendarEntry[]>> {
    let params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());

    if (department) params = params.set('department', department);

    return this.http.get<ApiResponse<LeaveCalendarEntry[]>>(`${this.apiUrl}/calendar`, { params });
  }

  // ─── Holidays ──────────────────────────────────────────
  getHolidays(year?: number): Observable<ApiResponse<Holiday[]>> {
    let params = new HttpParams();
    if (year) params = params.set('year', year.toString());
    return this.http.get<ApiResponse<Holiday[]>>(`${this.apiUrl}/holidays`, { params });
  }

  // ─── HR Admin Actions ─────────────────────────────────
  getAllLeaveRequests(
    page = 1,
    pageSize = 10,
    filters?: { status?: LeaveStatus; leaveType?: LeaveType; department?: string }
  ): Observable<ApiResponse<PaginatedResponse<LeaveRequest>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.leaveType) params = params.set('leaveType', filters.leaveType);
    if (filters?.department) params = params.set('department', filters.department);

    return this.http.get<ApiResponse<PaginatedResponse<LeaveRequest>>>(`${this.apiUrl}/all`, {
      params,
    });
  }

  getLeavePolicies(): Observable<ApiResponse<LeavePolicy[]>> {
    return this.http.get<ApiResponse<LeavePolicy[]>>(`${this.apiUrl}/policies`);
  }

  updateLeavePolicy(policy: LeavePolicy): Observable<ApiResponse<LeavePolicy>> {
    return this.http.put<ApiResponse<LeavePolicy>>(`${this.apiUrl}/policies/${policy.id}`, policy);
  }

  createHoliday(holiday: Partial<Holiday>): Observable<ApiResponse<Holiday>> {
    return this.http.post<ApiResponse<Holiday>>(`${this.apiUrl}/holidays`, holiday);
  }

  deleteHoliday(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/holidays/${id}`);
  }
}
