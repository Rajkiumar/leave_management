import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse, User, UserProfile, DashboardStats, ComplianceReport } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.apiUrl}/profile`);
  }

  updateProfile(profile: Partial<UserProfile>): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.apiUrl}/profile`, profile);
  }

  changePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/change-password`, payload);
  }

  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/dashboard-stats`);
  }

  // ─── HR Admin ──────────────────────────────────────────
  getAllUsers(page = 1, pageSize = 10, search?: string): Observable<ApiResponse<PaginatedResponse<User>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) params = params.set('search', search);

    return this.http.get<ApiResponse<PaginatedResponse<User>>>(`${this.apiUrl}`, { params });
  }

  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, user: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, user);
  }

  getComplianceReport(
    year?: number,
    department?: string
  ): Observable<ApiResponse<ComplianceReport[]>> {
    let params = new HttpParams();
    if (year) params = params.set('year', year.toString());
    if (department) params = params.set('department', department);
    return this.http.get<ApiResponse<ComplianceReport[]>>(`${this.apiUrl}/compliance-report`, {
      params,
    });
  }

  getTeamMembers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/team`);
  }
}
