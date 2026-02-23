import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { LeaveRequest } from '../../../core/models';
import { STATUS_COLORS, LEAVE_TYPE_LABELS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-leave-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    <h2 mat-dialog-title>Leave Request Details</h2>
    <mat-dialog-content>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="label">Employee</span>
          <span class="value">{{ data.employeeName }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Department</span>
          <span class="value">{{ data.department }}</span>
        </div>
        <mat-divider></mat-divider>
        <div class="detail-item">
          <span class="label">Leave Type</span>
          <span class="value">{{ getLeaveTypeLabel(data.leaveType) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Duration</span>
          <span class="value">{{ data.duration | titlecase }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Dates</span>
          <span class="value">{{ data.startDate }} to {{ data.endDate }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Total Days</span>
          <span class="value">{{ data.totalDays }}</span>
        </div>
        <mat-divider></mat-divider>
        <div class="detail-item">
          <span class="label">Reason</span>
          <span class="value">{{ data.reason }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Status</span>
          <span class="status-chip" [style.background]="getStatusColor(data.status)">
            {{ data.status }}
          </span>
        </div>
        <div class="detail-item">
          <span class="label">Applied On</span>
          <span class="value">{{ data.appliedOn }}</span>
        </div>
        @if (data.approverName) {
          <div class="detail-item">
            <span class="label">Approved By</span>
            <span class="value">{{ data.approverName }} on {{ data.approvedOn }}</span>
          </div>
        }
        @if (data.rejectionReason) {
          <div class="detail-item rejection">
            <span class="label">Rejection Reason</span>
            <span class="value">{{ data.rejectionReason }}</span>
          </div>
        }
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .detail-grid {
      display: flex; flex-direction: column; gap: 14px;
    }
    .detail-item {
      display: flex; flex-direction: column; gap: 3px;
    }
    .label {
      font-size: 11px; color: var(--text-muted); font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.04em;
    }
    .value { font-size: 14px; color: var(--text-primary); font-weight: 500; }
    .status-chip {
      display: inline-block; padding: 4px 12px; border-radius: var(--radius-full);
      font-size: 10.5px; font-weight: 600; color: white;
      text-transform: uppercase; width: fit-content; letter-spacing: 0.03em;
    }
    .rejection .value { color: #dc2626; font-weight: 500; }
    mat-divider { margin: 4px 0; opacity: 0.6; }
  `],
})
export class LeaveDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LeaveDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LeaveRequest
  ) {}

  getLeaveTypeLabel(type: string): string {
    return (LEAVE_TYPE_LABELS as Record<string, string>)[type] || type;
  }

  getStatusColor(status: string): string {
    return (STATUS_COLORS as Record<string, string>)[status] || '#9E9E9E';
  }
}
