import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LeaveRequest } from '../../../core/models';
import { MockDataService } from '../../../core/services/mock-data.service';
import { STATUS_COLORS, LEAVE_TYPE_LABELS } from '../../../core/constants/app.constants';
import { LeaveDetailDialogComponent } from '../../leave/leave-history/leave-detail-dialog.component';

@Component({
  selector: 'app-all-requests',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatPaginatorModule,
    MatIconModule, MatButtonModule, MatFormFieldModule, MatSelectModule,
    MatDialogModule, MatTooltipModule,
  ],
  template: `
    <div class="all-requests">
      <h1>All Leave Requests</h1>
      <p class="subtitle">View and manage all employee leave requests</p>

      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field appearance="outline">
              <mat-label>Status</mat-label>
              <mat-select [(value)]="statusFilter" (selectionChange)="applyFilters()">
                <mat-option value="">All</mat-option>
                <mat-option value="PENDING">Pending</mat-option>
                <mat-option value="APPROVED">Approved</mat-option>
                <mat-option value="REJECTED">Rejected</mat-option>
                <mat-option value="CANCELLED">Cancelled</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Department</mat-label>
              <mat-select [(value)]="deptFilter" (selectionChange)="applyFilters()">
                <mat-option value="">All</mat-option>
                <mat-option value="Engineering">Engineering</mat-option>
                <mat-option value="Design">Design</mat-option>
                <mat-option value="Marketing">Marketing</mat-option>
                <mat-option value="Human Resources">Human Resources</mat-option>
                <mat-option value="Finance">Finance</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        @if (filteredRequests().length > 0) {
          <table mat-table [dataSource]="filteredRequests()" class="full-width">
            <ng-container matColumnDef="employeeName">
              <th mat-header-cell *matHeaderCellDef>Employee</th>
              <td mat-cell *matCellDef="let r">{{ r.employeeName }}</td>
            </ng-container>
            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef>Department</th>
              <td mat-cell *matCellDef="let r">{{ r.department }}</td>
            </ng-container>
            <ng-container matColumnDef="leaveType">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let r">{{ getLabel(r.leaveType) }}</td>
            </ng-container>
            <ng-container matColumnDef="dates">
              <th mat-header-cell *matHeaderCellDef>Dates</th>
              <td mat-cell *matCellDef="let r">{{ r.startDate }} - {{ r.endDate }}</td>
            </ng-container>
            <ng-container matColumnDef="totalDays">
              <th mat-header-cell *matHeaderCellDef>Days</th>
              <td mat-cell *matCellDef="let r">{{ r.totalDays }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let r">
                <span class="status-chip" [style.background]="getStatusColor(r.status)">{{ r.status }}</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let r">
                <button mat-icon-button matTooltip="View" (click)="viewDetails(r)">
                  <mat-icon>visibility</mat-icon>
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
          <mat-paginator [length]="filteredRequests().length" [pageSize]="10"
                         [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons></mat-paginator>
        } @else {
          <div class="empty-state">
            <mat-icon>folder_open</mat-icon>
            <p>No leave requests found</p>
            <span class="empty-hint">Leave requests will appear here once employees start applying.</span>
          </div>
        }
      </mat-card>
    </div>
  `,
  styles: [`
    .all-requests {
      max-width: 1200px;
      h1 { font-size: 26px; font-weight: 700; margin: 0 0 4px; color: var(--text-primary); letter-spacing: -0.02em; }
      .subtitle { color: var(--text-muted); margin: 0 0 24px; font-size: 14px; }
    }
    .filters-card {
      margin-bottom: 16px;
      border-radius: var(--radius-lg) !important;
      border: 1px solid var(--border-light);
    }
    .filters-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .full-width { width: 100%; }
    .status-chip {
      padding: 3px 10px; border-radius: var(--radius-full);
      font-size: 11px; font-weight: 600; color: white;
      text-transform: uppercase; letter-spacing: 0.03em;
    }
    .empty-state {
      text-align: center; padding: 56px 16px; color: var(--text-muted);
      mat-icon { font-size: 56px; width: 56px; height: 56px; opacity: 0.4; }
      p { margin: 12px 0 4px; font-size: 15px; font-weight: 600; color: var(--text-secondary); }
    }
    .empty-hint { font-size: 13px; color: var(--text-muted); }
  `],
})
export class AllRequestsComponent implements OnInit {
  allRequests = signal<LeaveRequest[]>([]);
  filteredRequests = signal<LeaveRequest[]>([]);
  statusFilter = '';
  deptFilter = '';
  columns = ['employeeName', 'department', 'leaveType', 'dates', 'totalDays', 'status', 'actions'];

  constructor(private mockData: MockDataService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.mockData.mockGetAllLeaveRequests().subscribe((res) => {
      this.allRequests.set(res.data.items);
      this.filteredRequests.set(res.data.items);
    });
  }

  getLabel(type: string): string {
    return (LEAVE_TYPE_LABELS as Record<string, string>)[type] || type;
  }

  getStatusColor(status: string): string {
    return (STATUS_COLORS as Record<string, string>)[status] || '#9E9E9E';
  }

  applyFilters(): void {
    let data = this.allRequests();
    if (this.statusFilter) data = data.filter((r) => r.status === this.statusFilter);
    if (this.deptFilter) data = data.filter((r) => r.department === this.deptFilter);
    this.filteredRequests.set(data);
  }

  viewDetails(leave: LeaveRequest): void {
    this.dialog.open(LeaveDetailDialogComponent, { width: '500px', data: leave });
  }
}
