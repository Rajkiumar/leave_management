import { LeaveType } from '../models';

export const APP_CONSTANTS = {
  APP_NAME: 'Leave Management System',
  DATE_FORMAT: 'yyyy-MM-dd',
  DISPLAY_DATE_FORMAT: 'MMM dd, yyyy',
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  },
};

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  [LeaveType.ANNUAL]: 'Annual Leave',
  [LeaveType.SICK]: 'Sick Leave',
  [LeaveType.CASUAL]: 'Casual Leave',
  [LeaveType.MATERNITY]: 'Maternity Leave',
  [LeaveType.PATERNITY]: 'Paternity Leave',
  [LeaveType.COMPENSATORY]: 'Compensatory Off',
  [LeaveType.UNPAID]: 'Unpaid Leave',
};

export const LEAVE_TYPE_COLORS: Record<LeaveType, string> = {
  [LeaveType.ANNUAL]: '#4CAF50',
  [LeaveType.SICK]: '#F44336',
  [LeaveType.CASUAL]: '#2196F3',
  [LeaveType.MATERNITY]: '#E91E63',
  [LeaveType.PATERNITY]: '#9C27B0',
  [LeaveType.COMPENSATORY]: '#FF9800',
  [LeaveType.UNPAID]: '#607D8B',
};

export const STATUS_COLORS = {
  PENDING: '#FF9800',
  APPROVED: '#4CAF50',
  REJECTED: '#F44336',
  CANCELLED: '#9E9E9E',
};

export const NAV_ITEMS = {
  EMPLOYEE: [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Apply Leave', icon: 'add_circle', route: '/leave/apply' },
    { label: 'My Leaves', icon: 'history', route: '/leave/history' },
    { label: 'Leave Balance', icon: 'account_balance_wallet', route: '/leave/balance' },
    { label: 'Calendar', icon: 'calendar_month', route: '/leave/calendar' },
    { label: 'Holidays', icon: 'celebration', route: '/leave/holidays' },
  ],
  MANAGER: [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Approvals', icon: 'pending_actions', route: '/leave/approvals' },
    { label: 'Apply Leave', icon: 'add_circle', route: '/leave/apply' },
    { label: 'My Leaves', icon: 'history', route: '/leave/history' },
    { label: 'Leave Balance', icon: 'account_balance_wallet', route: '/leave/balance' },
    { label: 'Team Calendar', icon: 'calendar_month', route: '/leave/calendar' },
    { label: 'Holidays', icon: 'celebration', route: '/leave/holidays' },
  ],
  HR_ADMIN: [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'All Requests', icon: 'list_alt', route: '/admin/requests' },
    { label: 'Leave Policies', icon: 'policy', route: '/admin/policies' },
    { label: 'Reports', icon: 'assessment', route: '/admin/reports' },
    { label: 'User Management', icon: 'people', route: '/admin/users' },
    { label: 'Calendar', icon: 'calendar_month', route: '/leave/calendar' },
    { label: 'Holidays', icon: 'celebration', route: '/admin/holidays' },
  ],
};
