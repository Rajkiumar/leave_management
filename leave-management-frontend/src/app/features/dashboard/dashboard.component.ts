import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MockDataService } from '../../core/services/mock-data.service';
import { AuthService } from '../../core/services/auth.service';
import {
  DashboardStats, LeaveBalance, LeaveRequest, Holiday, UserRole,
} from '../../core/models';
import { LEAVE_TYPE_COLORS, STATUS_COLORS } from '../../core/constants/app.constants';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule,
    MatChipsModule, MatProgressBarModule, MatTableModule,
  ],
  template: `
    <div class="dashboard">
      <div class="welcome-section">
        <div class="welcome-text">
          <h1>Welcome back, {{ currentUser()?.firstName }}!</h1>
          <p>Here's your leave overview for today.</p>
        </div>
        <div class="welcome-actions">
          <button mat-raised-button color="primary" routerLink="/leave/apply" class="apply-btn">
            <mat-icon>add</mat-icon> Apply for Leave
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-accent accent-indigo"></div>
          <div class="stat-body">
            <div class="stat-icon icon-indigo">
              <mat-icon>account_balance_wallet</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-label">Available Leaves</span>
              <span class="stat-value">{{ getTotalAvailable() }}</span>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-accent accent-amber"></div>
          <div class="stat-body">
            <div class="stat-icon icon-amber">
              <mat-icon>pending_actions</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-label">Pending Requests</span>
              <span class="stat-value">{{ stats()?.pendingRequests || 0 }}</span>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-accent accent-green"></div>
          <div class="stat-body">
            <div class="stat-icon icon-green">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-label">Approved Today</span>
              <span class="stat-value">{{ stats()?.approvedToday || 0 }}</span>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-accent accent-violet"></div>
          <div class="stat-body">
            <div class="stat-icon icon-violet">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-label">On Leave Today</span>
              <span class="stat-value">{{ stats()?.onLeaveToday || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Leave Balances -->
      <div class="section-header">
        <h2>Leave Balances</h2>
        <a mat-button routerLink="/leave/balance" class="view-all-btn">
          View Details <mat-icon>arrow_forward</mat-icon>
        </a>
      </div>
      @if (leaveBalances().length > 0) {
        <div class="balance-grid">
          @for (balance of leaveBalances(); track balance.leaveType) {
            <div class="balance-card">
              <div class="balance-header">
                <span class="balance-type" [style.color]="getLeaveColor(balance.leaveType)">
                  {{ balance.leaveTypeName }}
                </span>
                <span class="balance-count">
                  <strong>{{ balance.available }}</strong><span class="balance-slash">/{{ balance.total }}</span>
                </span>
              </div>
              <div class="balance-bar-track">
                <div class="balance-bar-fill"
                     [style.width.%]="getUsagePercent(balance)"
                     [style.background]="getUsagePercent(balance) > 80 ? '#ef4444' : getLeaveColor(balance.leaveType)">
                </div>
              </div>
              <div class="balance-details">
                <span>Used: {{ balance.used }}</span>
                <span>Pending: {{ balance.pending }}</span>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="empty-card">
          <mat-icon>account_balance_wallet</mat-icon>
          <p>No leave balances available yet</p>
          <span class="empty-hint">Balances will appear once configured by HR</span>
        </div>
      }

      <!-- Recent Leave Requests -->
      <div class="section-header">
        <h2>Recent Requests</h2>
        <a mat-button routerLink="/leave/history" class="view-all-btn">
          View All <mat-icon>arrow_forward</mat-icon>
        </a>
      </div>
      <div class="table-card">
        <table mat-table [dataSource]="recentLeaves()" class="full-width">
          <ng-container matColumnDef="leaveType">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let leave">{{ leave.leaveType }}</td>
          </ng-container>

          <ng-container matColumnDef="dates">
            <th mat-header-cell *matHeaderCellDef>Dates</th>
            <td mat-cell *matCellDef="let leave">{{ leave.startDate }} - {{ leave.endDate }}</td>
          </ng-container>

          <ng-container matColumnDef="days">
            <th mat-header-cell *matHeaderCellDef>Days</th>
            <td mat-cell *matCellDef="let leave">
              <span class="days-badge">{{ leave.totalDays }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let leave">
              <span class="status-chip" [style.background]="getStatusColor(leave.status)">
                {{ leave.status }}
              </span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        @if (recentLeaves().length === 0) {
          <div class="empty-state">
            <mat-icon>inbox</mat-icon>
            <p>No recent leave requests</p>
            <span class="empty-hint">Your requests will appear here</span>
          </div>
        }
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        @if (isManager()) {
          <button mat-stroked-button routerLink="/leave/approvals" class="action-btn">
            <mat-icon>pending_actions</mat-icon> Review Approvals
          </button>
        }
        <button mat-stroked-button routerLink="/leave/calendar" class="action-btn">
          <mat-icon>calendar_month</mat-icon> View Calendar
        </button>
        <button mat-stroked-button routerLink="/leave/balance" class="action-btn">
          <mat-icon>pie_chart</mat-icon> Leave Balances
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { max-width: 1200px; }

    /* ─── Welcome ─── */
    .welcome-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
    }

    .welcome-text {
      h1 {
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 4px;
        color: var(--text-primary);
        letter-spacing: -0.02em;
      }
      p {
        color: var(--text-muted);
        margin: 0;
        font-size: 14px;
      }
    }

    .apply-btn {
      border-radius: 10px !important;
      padding: 0 20px;
      height: 42px;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.25) !important;
    }

    /* ─── Stats ─── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 16px;
      margin-bottom: 36px;
    }

    .stat-card {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-light);
      overflow: hidden;
      transition: box-shadow 0.2s, transform 0.2s;
    }

    .stat-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .stat-accent { height: 3px; }
    .accent-indigo { background: #4f46e5; }
    .accent-amber  { background: #f59e0b; }
    .accent-green  { background: #10b981; }
    .accent-violet { background: #8b5cf6; }

    .icon-indigo { background: #eef2ff; color: #4f46e5; }
    .icon-amber  { background: #fffbeb; color: #f59e0b; }
    .icon-green  { background: #ecfdf5; color: #10b981; }
    .icon-violet { background: #f5f3ff; color: #8b5cf6; }

    :host-context(body.dark-theme) {
      .icon-indigo { background: rgba(79, 70, 229, 0.15); }
      .icon-amber  { background: rgba(245, 158, 11, 0.15); }
      .icon-green  { background: rgba(16, 185, 129, 0.15); }
      .icon-violet { background: rgba(139, 92, 246, 0.15); }
      .balance-card, .table-card, .empty-card {
        background: var(--bg-card);
        border-color: var(--border);
      }
      .balance-bar-track { background: rgba(255,255,255,0.08); }
      .days-badge { background: rgba(255,255,255,0.06); }
    }

    .stat-body {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 12.5px;
      font-weight: 500;
      color: var(--text-muted);
      margin-bottom: 2px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1;
      letter-spacing: -0.03em;
    }

    /* ─── Sections ─── */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;

      h2 {
        font-size: 17px;
        font-weight: 700;
        margin: 0;
        color: var(--text-primary);
        letter-spacing: -0.01em;
      }
    }

    .view-all-btn {
      font-size: 13px;
      font-weight: 500;
      color: var(--brand) !important;
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 0 8px;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }

    /* ─── Leave Balances ─── */
    .balance-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 12px;
      margin-bottom: 36px;
    }

    .balance-card {
      background: var(--bg-card);
      border-radius: var(--radius-md);
      padding: 16px;
      border: 1px solid var(--border-light);
      box-shadow: var(--shadow-xs);
    }

    .balance-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .balance-type {
      font-weight: 600;
      font-size: 13px;
    }

    .balance-count {
      font-size: 14px;
      color: var(--text-primary);

      strong {
        font-size: 18px;
        font-weight: 800;
        letter-spacing: -0.02em;
      }
    }

    .balance-slash {
      color: var(--text-muted);
      font-weight: 400;
      font-size: 13px;
    }

    .balance-bar-track {
      height: 4px;
      border-radius: 4px;
      background: var(--border-light);
      overflow: hidden;
    }

    .balance-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.6s ease;
    }

    .balance-details {
      display: flex;
      justify-content: space-between;
      font-size: 11.5px;
      color: var(--text-muted);
      margin-top: 8px;
    }

    /* ─── Table ─── */
    .table-card {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-light);
      overflow: hidden;
      margin-bottom: 36px;
    }

    .full-width { width: 100%; }

    .days-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 24px;
      border-radius: var(--radius-sm);
      background: var(--bg-body);
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .status-chip {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: var(--radius-full);
      font-size: 11px;
      font-weight: 600;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .empty-card {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
      text-align: center;
      padding: 48px 24px;
      margin-bottom: 36px;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: var(--text-muted);
        opacity: 0.4;
      }

      p {
        margin: 12px 0 4px;
        font-size: 15px;
        font-weight: 600;
        color: var(--text-secondary);
      }
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: var(--text-muted);

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        opacity: 0.4;
      }

      p {
        margin: 12px 0 4px;
        font-size: 15px;
        font-weight: 600;
        color: var(--text-secondary);
      }
    }

    .empty-hint {
      font-size: 13px;
      color: var(--text-muted);
    }

    /* ─── Quick Actions ─── */
    .quick-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .action-btn {
      border-radius: var(--radius-sm) !important;
      font-weight: 500;
      color: var(--text-secondary) !important;
      border-color: var(--border) !important;
    }

    .action-btn:hover {
      border-color: var(--brand) !important;
      color: var(--brand) !important;
    }

    @media (max-width: 600px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .welcome-section { flex-direction: column; gap: 16px; }
    }
  `],
})
export class DashboardComponent implements OnInit {
  currentUser = this.authService.currentUser;
  stats = signal<DashboardStats | null>(null);
  leaveBalances = signal<LeaveBalance[]>([]);
  recentLeaves = signal<LeaveRequest[]>([]);
  displayedColumns = ['leaveType', 'dates', 'days', 'status'];

  constructor(
    private authService: AuthService,
    private mockData: MockDataService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  isManager(): boolean {
    return this.authService.hasAnyRole([UserRole.MANAGER, UserRole.HR_ADMIN]);
  }

  getTotalAvailable(): number {
    return this.leaveBalances().reduce((sum, b) => sum + b.available, 0);
  }

  getUsagePercent(balance: LeaveBalance): number {
    return balance.total > 0 ? ((balance.used + balance.pending) / balance.total) * 100 : 0;
  }

  getLeaveColor(type: string): string {
    return (LEAVE_TYPE_COLORS as Record<string, string>)[type] || '#607D8B';
  }

  getStatusColor(status: string): string {
    return (STATUS_COLORS as Record<string, string>)[status] || '#9E9E9E';
  }

  private loadDashboardData(): void {
    this.mockData.mockDashboardStats().subscribe((res) => {
      this.stats.set(res.data);
    });

    this.mockData.mockGetLeaveBalance().subscribe((res) => {
      this.leaveBalances.set(res.data);
    });

    const userId = this.currentUser()?.id || '1';
    this.mockData.mockGetMyLeaves(userId).subscribe((res) => {
      this.recentLeaves.set(res.data.items.slice(0, 5));
    });
  }
}
