import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ComplianceReport } from '../../../core/models';
import { MockDataService } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatIconModule,
    MatButtonModule, MatProgressBarModule, MatFormFieldModule, MatSelectModule,
  ],
  template: `
    <div class="reports">
      <div class="page-header">
        <div>
          <h1>Compliance Reports</h1>
          <p class="subtitle">Department-wise leave utilization and compliance overview</p>
        </div>
        <button mat-raised-button color="primary">
          <mat-icon>download</mat-icon> Export Report
        </button>
      </div>

      <!-- Summary Stats -->
      <div class="summary-grid">
        <mat-card class="summary-card">
          <mat-card-content>
            <mat-icon class="icon-blue">people</mat-icon>
            <div>
              <span class="big-number">{{ getTotalEmployees() }}</span>
              <span class="label">Total Employees</span>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="summary-card">
          <mat-card-content>
            <mat-icon class="icon-green">trending_up</mat-icon>
            <div>
              <span class="big-number">{{ getAvgUtilization() }}%</span>
              <span class="label">Avg Utilization</span>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="summary-card">
          <mat-card-content>
            <mat-icon class="icon-red">warning</mat-icon>
            <div>
              <span class="big-number">{{ getTotalExcess() }}</span>
              <span class="label">Excess Leave Cases</span>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="summary-card">
          <mat-card-content>
            <mat-icon class="icon-orange">pending</mat-icon>
            <div>
              <span class="big-number">{{ getTotalPending() }}</span>
              <span class="label">Pending Approvals</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Department Table -->
      <mat-card>
        <mat-card-header>
          <mat-card-title>Department-wise Breakdown</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (reports().length > 0) {
            <table mat-table [dataSource]="reports()" class="full-width">
              <ng-container matColumnDef="department">
                <th mat-header-cell *matHeaderCellDef>Department</th>
                <td mat-cell *matCellDef="let r"><strong>{{ r.department }}</strong></td>
              </ng-container>

              <ng-container matColumnDef="totalEmployees">
                <th mat-header-cell *matHeaderCellDef>Employees</th>
                <td mat-cell *matCellDef="let r">{{ r.totalEmployees }}</td>
              </ng-container>

              <ng-container matColumnDef="avgLeaves">
                <th mat-header-cell *matHeaderCellDef>Avg Leaves Taken</th>
                <td mat-cell *matCellDef="let r">{{ r.averageLeavesTaken }}</td>
              </ng-container>

              <ng-container matColumnDef="utilization">
                <th mat-header-cell *matHeaderCellDef>Utilization</th>
                <td mat-cell *matCellDef="let r">
                  <div class="utilization-cell">
                    <mat-progress-bar mode="determinate" [value]="r.leaveUtilizationPercent"
                      [color]="r.leaveUtilizationPercent > 80 ? 'warn' : 'primary'">
                    </mat-progress-bar>
                    <span>{{ r.leaveUtilizationPercent }}%</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="excess">
                <th mat-header-cell *matHeaderCellDef>Excess Cases</th>
                <td mat-cell *matCellDef="let r">
                  <span [class.excess-warn]="r.excessLeaveCount > 0">{{ r.excessLeaveCount }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="pending">
                <th mat-header-cell *matHeaderCellDef>Pending</th>
                <td mat-cell *matCellDef="let r">{{ r.pendingApprovals }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns;"></tr>
            </table>
          } @else {
            <div class="empty-state">
              <mat-icon>assessment</mat-icon>
              <p>No report data available</p>
              <span class="empty-hint">Compliance data will populate once leave activity begins.</span>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .reports {
      max-width: 1200px;
      h1 { font-size: 26px; font-weight: 700; margin: 0 0 4px; color: var(--text-primary); letter-spacing: -0.02em; }
      .subtitle { color: var(--text-muted); margin: 0; font-size: 14px; }
    }
    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 28px;
    }
    .summary-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 14px; margin-bottom: 28px;
    }
    .summary-card {
      border: 1px solid var(--border-light) !important;
      border-radius: var(--radius-lg) !important;
    }
    .summary-card mat-card-content {
      display: flex; align-items: center; gap: 16px; padding: 20px !important;
    }
    .summary-card mat-icon {
      font-size: 28px; width: 28px; height: 28px;
      padding: 10px; border-radius: 12px;
    }
    .icon-blue   { color: #4f46e5; background: #eef2ff; }
    .icon-green  { color: #10b981; background: #ecfdf5; }
    .icon-red    { color: #ef4444; background: #fef2f2; }
    .icon-orange { color: #f59e0b; background: #fffbeb; }

    :host-context(body.dark-theme) {
      .icon-blue   { background: rgba(79,70,229,0.15); }
      .icon-green  { background: rgba(16,185,129,0.15); }
      .icon-red    { background: rgba(239,68,68,0.15); }
      .icon-orange { background: rgba(245,158,11,0.15); }
    }
    .big-number {
      display: block; font-size: 28px; font-weight: 800; line-height: 1;
      color: var(--text-primary); letter-spacing: -0.03em;
    }
    .label { font-size: 12.5px; color: var(--text-muted); font-weight: 500; }
    .full-width { width: 100%; }
    .utilization-cell {
      display: flex; align-items: center; gap: 8px;
      mat-progress-bar { width: 100px; }
      span { font-size: 12.5px; font-weight: 600; min-width: 40px; color: var(--text-secondary); }
    }
    .excess-warn { color: #ef4444; font-weight: 700; }
    .empty-state {
      text-align: center; padding: 56px 16px; color: var(--text-muted);
      mat-icon { font-size: 56px; width: 56px; height: 56px; opacity: 0.4; }
      p { margin: 12px 0 4px; font-size: 15px; font-weight: 600; color: var(--text-secondary); }
    }
    .empty-hint { font-size: 13px; color: var(--text-muted); }
  `],
})
export class ReportsComponent implements OnInit {
  reports = signal<ComplianceReport[]>([]);
  columns = ['department', 'totalEmployees', 'avgLeaves', 'utilization', 'excess', 'pending'];

  constructor(private mockData: MockDataService) {}

  ngOnInit(): void {
    this.mockData.mockGetComplianceReport().subscribe((res) => {
      this.reports.set(res.data);
    });
  }

  getTotalEmployees(): number {
    return this.reports().reduce((s, r) => s + r.totalEmployees, 0);
  }

  getAvgUtilization(): string {
    const reports = this.reports();
    if (reports.length === 0) return '0';
    return (reports.reduce((s, r) => s + r.leaveUtilizationPercent, 0) / reports.length).toFixed(1);
  }

  getTotalExcess(): number {
    return this.reports().reduce((s, r) => s + r.excessLeaveCount, 0);
  }

  getTotalPending(): number {
    return this.reports().reduce((s, r) => s + r.pendingApprovals, 0);
  }
}
