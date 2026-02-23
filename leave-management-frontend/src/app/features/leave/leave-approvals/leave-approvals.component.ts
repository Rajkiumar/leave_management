import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LeaveRequest } from '../../../core/models';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { STATUS_COLORS, LEAVE_TYPE_LABELS } from '../../../core/constants/app.constants';
import { LeaveDetailDialogComponent } from '../leave-history/leave-detail-dialog.component';
import { ApprovalActionDialogComponent } from './approval-action-dialog.component';

@Component({
  selector: 'app-leave-approvals',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatTableModule, MatIconModule,
    MatButtonModule, MatChipsModule, MatTooltipModule, MatBadgeModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
  ],
  template: `
    <div class="approvals">
      <div class="page-header">
        <div>
          <h1>Leave Approvals</h1>
          <p class="subtitle">Review and manage team leave requests</p>
        </div>
        <div class="pending-badge">
          <mat-icon [matBadge]="pendingCount()" matBadgeColor="warn">pending_actions</mat-icon>
          <span>{{ pendingCount() }} pending</span>
        </div>
      </div>

      <!-- Pending Approvals -->
      @if (pendingLeaves().length > 0) {
        <h2 class="section-title">Pending Requests</h2>
        <div class="approval-cards">
          @for (leave of pendingLeaves(); track leave.id) {
            <mat-card class="approval-card">
              <mat-card-content>
                <div class="card-header">
                  <div class="employee-info">
                    <mat-icon class="avatar-icon">account_circle</mat-icon>
                    <div>
                      <strong>{{ leave.employeeName }}</strong>
                      <span class="dept">{{ leave.department }}</span>
                    </div>
                  </div>
                  <span class="status-chip pending">PENDING</span>
                </div>

                <div class="card-details">
                  <div class="detail">
                    <mat-icon>category</mat-icon>
                    <span>{{ getLeaveTypeLabel(leave.leaveType) }}</span>
                  </div>
                  <div class="detail">
                    <mat-icon>date_range</mat-icon>
                    <span>{{ leave.startDate }} - {{ leave.endDate }}</span>
                  </div>
                  <div class="detail">
                    <mat-icon>schedule</mat-icon>
                    <span>{{ leave.totalDays }} day(s) · {{ leave.duration }}</span>
                  </div>
                  <div class="detail reason">
                    <mat-icon>notes</mat-icon>
                    <span>{{ leave.reason }}</span>
                  </div>
                </div>

                <div class="card-actions">
                  <button mat-raised-button color="primary" (click)="approveLeave(leave)">
                    <mat-icon>check</mat-icon> Approve
                  </button>
                  <button mat-raised-button color="warn" (click)="rejectLeave(leave)">
                    <mat-icon>close</mat-icon> Reject
                  </button>
                  <button mat-button (click)="viewDetails(leave)">
                    <mat-icon>info</mat-icon> Details
                  </button>
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      } @else {
        <mat-card class="empty-card">
          <mat-card-content>
            <div class="empty-state">
              <mat-icon>check_circle_outline</mat-icon>
              <h3>All caught up!</h3>
              <p>No pending leave requests to review.</p>
            </div>
          </mat-card-content>
        </mat-card>
      }

      <!-- Recent Decisions -->
      @if (processedLeaves().length > 0) {
        <h2 class="section-title" style="margin-top: 32px;">Recent Decisions</h2>
        <mat-card>
          <table mat-table [dataSource]="processedLeaves()" class="full-width">
            <ng-container matColumnDef="employeeName">
              <th mat-header-cell *matHeaderCellDef>Employee</th>
              <td mat-cell *matCellDef="let leave">{{ leave.employeeName }}</td>
            </ng-container>
            <ng-container matColumnDef="leaveType">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let leave">{{ getLeaveTypeLabel(leave.leaveType) }}</td>
            </ng-container>
            <ng-container matColumnDef="dates">
              <th mat-header-cell *matHeaderCellDef>Dates</th>
              <td mat-cell *matCellDef="let leave">{{ leave.startDate }} - {{ leave.endDate }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Decision</th>
              <td mat-cell *matCellDef="let leave">
                <span class="status-chip" [style.background]="getStatusColor(leave.status)">
                  {{ leave.status }}
                </span>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="processedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: processedColumns;"></tr>
          </table>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .approvals {
      max-width: 1100px;
      h1 { font-size: 26px; font-weight: 700; margin: 0 0 4px; color: var(--text-primary); letter-spacing: -0.02em; }
      .subtitle { color: var(--text-muted); margin: 0; font-size: 14px; }
    }
    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 28px;
    }
    .pending-badge {
      display: flex; align-items: center; gap: 8px;
      color: var(--status-pending); font-weight: 600; font-size: 14px;
      background: #fffbeb; padding: 6px 14px; border-radius: var(--radius-full);
      border: 1px solid rgba(245, 158, 11, 0.2);
    }

    :host-context(body.dark-theme) {
      .pending-badge { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.25); }
    }
    .section-title { font-size: 17px; font-weight: 700; margin: 0 0 14px; color: var(--text-primary); }
    .approval-cards {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 16px; margin-bottom: 24px;
    }
    .approval-card {
      border-left: 4px solid var(--status-pending) !important;
      border: 1px solid var(--border-light);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .approval-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md) !important;
    }
    .card-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 16px;
    }
    .employee-info { display: flex; align-items: center; gap: 12px; }
    .avatar-icon {
      font-size: 20px; width: 20px; height: 20px; color: white;
      background: linear-gradient(135deg, var(--brand), var(--brand-dark));
      padding: 10px; border-radius: 12px;
    }
    .employee-info strong { display: block; font-size: 14px; font-weight: 700; color: var(--text-primary); }
    .dept { font-size: 12px; color: var(--text-muted); }
    .card-details { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    .detail {
      display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary);
      mat-icon { font-size: 16px; width: 16px; height: 16px; color: var(--text-muted); }
    }
    .detail.reason { color: var(--text-secondary); font-style: italic; }
    .card-actions { display: flex; gap: 8px; }
    .status-chip {
      padding: 3px 10px; border-radius: var(--radius-full);
      font-size: 11px; font-weight: 600; color: white;
      text-transform: uppercase; letter-spacing: 0.03em;
    }
    .status-chip.pending { background: var(--status-pending); }
    .full-width { width: 100%; }
    .empty-card { margin-bottom: 24px; }
    .empty-state {
      text-align: center; padding: 48px 16px;
      mat-icon { font-size: 56px; width: 56px; height: 56px; color: var(--status-approved); opacity: 0.6; }
      h3 { margin: 12px 0 4px; font-size: 17px; font-weight: 700; color: var(--text-primary); }
      p { margin: 0; color: var(--text-muted); font-size: 14px; }
    }
  `],
})
export class LeaveApprovalsComponent implements OnInit {
  allLeaves = signal<LeaveRequest[]>([]);
  pendingLeaves = signal<LeaveRequest[]>([]);
  processedLeaves = signal<LeaveRequest[]>([]);
  pendingCount = signal(0);
  processedColumns = ['employeeName', 'leaveType', 'dates', 'status'];

  constructor(
    private mockData: MockDataService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  getLeaveTypeLabel(type: string): string {
    return (LEAVE_TYPE_LABELS as Record<string, string>)[type] || type;
  }

  getStatusColor(status: string): string {
    return (STATUS_COLORS as Record<string, string>)[status] || '#9E9E9E';
  }

  viewDetails(leave: LeaveRequest): void {
    this.dialog.open(LeaveDetailDialogComponent, { width: '500px', data: leave });
  }

  approveLeave(leave: LeaveRequest): void {
    this.mockData.mockApproveReject(leave.id, 'APPROVE').subscribe((res) => {
      this.notification.success(res.message);
      this.loadData();
    });
  }

  rejectLeave(leave: LeaveRequest): void {
    const dialogRef = this.dialog.open(ApprovalActionDialogComponent, {
      width: '400px',
      data: { employeeName: leave.employeeName, action: 'reject' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.mockData.mockApproveReject(leave.id, 'REJECT', result.comments).subscribe((res) => {
          this.notification.success(res.message);
          this.loadData();
        });
      }
    });
  }

  private loadData(): void {
    this.mockData.mockGetPendingApprovals().subscribe((res) => {
      this.pendingLeaves.set(res.data.items);
      this.pendingCount.set(res.data.items.length);
    });

    this.mockData.mockGetAllLeaveRequests().subscribe((res) => {
      this.processedLeaves.set(
        res.data.items.filter((l) => l.status !== 'PENDING').slice(0, 10)
      );
    });
  }
}
