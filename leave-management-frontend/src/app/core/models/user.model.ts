export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  HR_ADMIN = 'HR_ADMIN',
}

export interface User {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  managerId?: string;
  managerName?: string;
  joiningDate: string;
  avatarUrl?: string;
  phone?: string;
  isActive: boolean;
}

export interface UserProfile extends User {
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}
