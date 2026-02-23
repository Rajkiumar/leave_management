import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models';

export const routes: Routes = [
  // ─── Auth Routes (Guest only) ─────────────────────────
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },

  // ─── Protected Routes ──────────────────────────────────
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },

      // Leave Module
      {
        path: 'leave/apply',
        loadComponent: () =>
          import('./features/leave/apply-leave/apply-leave.component').then(
            (m) => m.ApplyLeaveComponent
          ),
      },
      {
        path: 'leave/history',
        loadComponent: () =>
          import('./features/leave/leave-history/leave-history.component').then(
            (m) => m.LeaveHistoryComponent
          ),
      },
      {
        path: 'leave/balance',
        loadComponent: () =>
          import('./features/leave/leave-balance/leave-balance.component').then(
            (m) => m.LeaveBalanceComponent
          ),
      },
      {
        path: 'leave/calendar',
        loadComponent: () =>
          import('./features/leave/leave-calendar/leave-calendar.component').then(
            (m) => m.LeaveCalendarComponent
          ),
      },
      {
        path: 'leave/holidays',
        loadComponent: () =>
          import('./features/leave/holidays/holidays.component').then(
            (m) => m.HolidaysComponent
          ),
      },

      // Manager Routes
      {
        path: 'leave/approvals',
        canActivate: [roleGuard([UserRole.MANAGER, UserRole.HR_ADMIN])],
        loadComponent: () =>
          import('./features/leave/leave-approvals/leave-approvals.component').then(
            (m) => m.LeaveApprovalsComponent
          ),
      },

      // HR Admin Routes
      {
        path: 'admin/requests',
        canActivate: [roleGuard([UserRole.HR_ADMIN])],
        loadComponent: () =>
          import('./features/admin/all-requests/all-requests.component').then(
            (m) => m.AllRequestsComponent
          ),
      },
      {
        path: 'admin/policies',
        canActivate: [roleGuard([UserRole.HR_ADMIN])],
        loadComponent: () =>
          import('./features/admin/leave-policies/leave-policies.component').then(
            (m) => m.LeavePoliciesComponent
          ),
      },
      {
        path: 'admin/reports',
        canActivate: [roleGuard([UserRole.HR_ADMIN])],
        loadComponent: () =>
          import('./features/admin/reports/reports.component').then(
            (m) => m.ReportsComponent
          ),
      },
      {
        path: 'admin/users',
        canActivate: [roleGuard([UserRole.HR_ADMIN])],
        loadComponent: () =>
          import('./features/admin/user-management/user-management.component').then(
            (m) => m.UserManagementComponent
          ),
      },
      {
        path: 'admin/holidays',
        canActivate: [roleGuard([UserRole.HR_ADMIN])],
        loadComponent: () =>
          import('./features/admin/manage-holidays/manage-holidays.component').then(
            (m) => m.ManageHolidaysComponent
          ),
      },

      // Profile
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },

      // Default redirect
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'auth/login' },
];
