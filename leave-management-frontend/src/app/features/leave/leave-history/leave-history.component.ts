import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { LeaveRequest, LeaveStatus, LeaveType } from '../../../core/models';
import { MockDataService } from '../../../core/services/mock-data.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { STATUS_COLORS, LEAVE_TYPE_LABELS } from '../../../core/constants/app.constants';
import { LeaveDetailDialogComponent } from './leave-detail-dialog.component';

@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatPaginatorModule,
    MatIconModule, MatButtonModule, MatChipsModule, MatFormFieldModule,
    MatSelectModule, MatMenuModule, MatTooltipModule, MatDialogModule,
  ],
  template: `
    <div class="leave-history">
      <div class="page-header">
        <div>
          <h1>My Leave Requests</h1>
          <p class="subtitle">View and manage your leave history</p>
        </div>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Status</mat-label>
              <mat-select [(value)]="selectedStatus" (selectionChange)="applyFilters()">
                <mat-option value="">All</mat-option>
                <mat-option value="PENDING">Pending</mat-option>
                <mat-option value="APPROVED">Approved</mat-option>
                <mat-option value="REJECTED">Rejected</mat-option>
                <mat-option value="CANCELLED">Cancelled</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Leave Type</mat-label>
              <mat-select [(value)]="selectedType" (selectionChange)="applyFilters()">
                <mat-option value="">All</mat-option>
                @for (type of leaveTypeOptions; track type.value) {
                  <mat-option [value]="type.value">{{ type.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Leave Table -->
      <mat-card>
        <table mat-table [dataSource]="filteredLeaves()" class="full-width leave-table">
          <ng-container matColumnDef="leaveType">
            <th mat-header-cell *matHeaderCellDef>Leave Type</th>
            <td mat-cell *matCellDef="let leave">
              <span class="leave-type-label">{{ getLeaveTypeLabel(leave.leaveType) }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="startDate">
            <th mat-header-cell *matHeaderCellDef>Start Date</th>
            <td mat-cell *matCellDef="let leave">{{ leave.startDate }}</td>
          </ng-container>

          <ng-container matColumnDef="endDate">
            <th mat-header-cell *matHeaderCellDef>End Date</th>
            <td mat-cell *matCellDef="let leave">{{ leave.endDate }}</td>
          </ng-container>

          <ng-container matColumnDef="totalDays">
            <th mat-header-cell *matHeaderCellDef>Days</th>
            <td mat-cell *matCellDef="let leave">{{ leave.totalDays }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let leave">
              <span class="status-chip" [style.background]="getStatusColor(leave.status)">
                {{ leave.status }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="appliedOn">
            <th mat-header-cell *matHeaderCellDef>Applied On</th>
            <td mat-cell *matCellDef="let leave">{{ leave.appliedOn }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let leave">
              <button mat-icon-button matTooltip="View Details" (click)="viewDetails(leave)">
                <mat-icon>visibility</mat-icon>
              </button>
              @if (leave.status === 'PENDING') {
                <button mat-icon-button matTooltip="Cancel" color="warn" (click)="cancelLeave(leave)">
                  <mat-icon>cancel</mat-icon>
                </button>
              }
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        @if (filteredLeaves().length === 0) {
          <div class="empty-state">
            <mat-icon>inbox</mat-icon>
            <p>No leave requests found</p>
          </div>
        }

        <mat-paginator [length]="filteredLeaves().length" [pageSize]="10"
                       [pageSizeOptions]="[5, 10, 25]"
                       showFirstLastButtons>
        </mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .leave-history {
      max-width: 1200px;
      h1 { font-size: 26px; font-weight: 700; margin: 0 0 4px; color: var(--text-primary); letter-spacing: -0.02em; }
      .subtitle { color: var(--text-muted); margin: 0; font-size: 14px; }
    }
    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 24px;
    }
    .filters-card {
      margin-bottom: 16px;
      border-radius: var(--radius-lg) !important;
      border: 1px solid var(--border-light);
    }
    .filters-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .filter-field { min-width: 180px; }
    .full-width { width: 100%; }
    .leave-type-label { font-weight: 600; font-size: 13px; }
    .status-chip {
      padding: 3px 10px; border-radius: var(--radius-full);
      font-size: 11px; font-weight: 600; color: white;
      text-transform: uppercase; letter-spacing: 0.03em;
    }
    .empty-state {
      text-align: center; padding: 48px 16px; color: var(--text-muted);
      mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.4; }
      p { margin: 12px 0 0; font-size: 15px; font-weight: 600; color: var(--text-secondary); }
    }
  `],
})
export class LeaveHistoryComponent implements OnInit {
  allLeaves = signal<LeaveRequest[]>([]);
  filteredLeaves = signal<LeaveRequest[]>([]);
  selectedStatus = '';
  selectedType = '';

  displayedColumns = ['leaveType', 'startDate', 'endDate', 'totalDays', 'status', 'appliedOn', 'actions'];
  leaveTypeOptions = Object.entries(LEAVE_TYPE_LABELS).map(([value, label]) => ({ value, label }));

  constructor(
    private mockData: MockDataService,
    private authService: AuthService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const userId = this.authService.currentUser()?.id || '1';
    this.mockData.mockGetMyLeaves(userId).subscribe((res) => {
      this.allLeaves.set(res.data.items);
      this.filteredLeaves.set(res.data.items);
    });
  }

  getLeaveTypeLabel(type: string): string {
    return (LEAVE_TYPE_LABELS as Record<string, string>)[type] || type;
  }

  getStatusColor(status: string): string {
    return (STATUS_COLORS as Record<string, string>)[status] || '#9E9E9E';
  }

  applyFilters(): void {
    let leaves = this.allLeaves();
    if (this.selectedStatus) {
      leaves = leaves.filter((l) => l.status === this.selectedStatus);
    }
    if (this.selectedType) {
      leaves = leaves.filter((l) => l.leaveType === this.selectedType);
    }
    this.filteredLeaves.set(leaves);
  }

  viewDetails(leave: LeaveRequest): void {
    this.dialog.open(LeaveDetailDialogComponent, {
      width: '500px',
      data: leave,
    });
  }

  cancelLeave(leave: LeaveRequest): void {
    if (confirm('Are you sure you want to cancel this leave request?')) {
      leave.status = LeaveStatus.CANCELLED;
      this.notification.success('Leave request cancelled successfully');
      this.applyFilters();
    }
  }
}
