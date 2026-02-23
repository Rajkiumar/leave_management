export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: import('./user.model').User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  employeeId: string;
  department: string;
  designation: string;
  phone?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  pendingRequests: number;
  approvedToday: number;
  onLeaveToday: number;
  upcomingHolidays: number;
}

export interface ComplianceReport {
  department: string;
  totalEmployees: number;
  averageLeavesTaken: number;
  leaveUtilizationPercent: number;
  excessLeaveCount: number;
  pendingApprovals: number;
}
