import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { LeaveBalance } from '../../../core/models';
import { MockDataService } from '../../../core/services/mock-data.service';
import { LEAVE_TYPE_COLORS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-leave-balance',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatButtonModule, RouterModule],
  template: `
    <div class="leave-balance">
      <div class="page-header">
        <div>
          <h1>Leave Balance</h1>
          <p class="subtitle">Overview of your available leave balances</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/leave/apply">
          <mat-icon>add_circle</mat-icon> Apply Leave
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="summary-row">
        <mat-card class="summary-card total">
          <mat-card-content>
            <mat-icon>calendar_month</mat-icon>
            <div>
              <span class="summary-value">{{ getTotalLeaves() }}</span>
              <span class="summary-label">Total Allocated</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card used">
          <mat-card-content>
            <mat-icon>event_busy</mat-icon>
            <div>
              <span class="summary-value">{{ getTotalUsed() }}</span>
              <span class="summary-label">Used</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card pending">
          <mat-card-content>
            <mat-icon>pending</mat-icon>
            <div>
              <span class="summary-value">{{ getTotalPending() }}</span>
              <span class="summary-label">Pending</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card available">
          <mat-card-content>
            <mat-icon>event_available</mat-icon>
            <div>
              <span class="summary-value">{{ getTotalAvailable() }}</span>
              <span class="summary-label">Available</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Detailed Balance Cards -->
      @if (balances().length > 0) {
        <div class="balance-grid">
          @for (balance of balances(); track balance.leaveType) {
            <mat-card class="balance-detail-card">
              <mat-card-content>
                <div class="balance-card-header">
                  <div class="type-indicator" [style.background]="getColor(balance.leaveType)"></div>
                  <h3>{{ balance.leaveTypeName }}</h3>
                </div>

                <div class="balance-visual">
                  <div class="circle-progress">
                    <svg viewBox="0 0 36 36" class="circular-chart">
                      <path class="circle-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path class="circle"
                            [attr.stroke]="getColor(balance.leaveType)"
                            [attr.stroke-dasharray]="getUsagePercent(balance) + ', 100'"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div class="circle-text">
                      <span class="circle-value">{{ balance.available }}</span>
                      <span class="circle-label">left</span>
                    </div>
                  </div>
                </div>

                <div class="balance-breakdown">
                  <div class="breakdown-item">
                    <span>Total</span>
                    <strong>{{ balance.total }}</strong>
                  </div>
                  <div class="breakdown-item">
                    <span>Used</span>
                    <strong>{{ balance.used }}</strong>
                  </div>
                  <div class="breakdown-item">
                    <span>Pending</span>
                    <strong>{{ balance.pending }}</strong>
                  </div>
                  @if (balance.carryForward > 0) {
                    <div class="breakdown-item">
                      <span>Carry Forward</span>
                      <strong>{{ balance.carryForward }}</strong>
                    </div>
                  }
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      } @else {
        <mat-card>
          <div class="empty-state">
            <mat-icon>account_balance_wallet</mat-icon>
            <p>No leave balances available</p>
            <span class="empty-hint">Your leave balance data will appear once configured by HR.</span>
          </div>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .leave-balance {
      max-width: 1200px;
      h1 { font-size: 26px; font-weight: 700; margin: 0 0 4px; color: var(--text-primary); letter-spacing: -0.02em; }
      .subtitle { color: var(--text-muted); margin: 0; font-size: 14px; }
    }
    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 28px;
    }
    .summary-row {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 14px; margin-bottom: 36px;
    }
    .summary-card {
      border-radius: var(--radius-lg) !important;
      border: 1px solid var(--border-light);
    }
    .summary-card mat-card-content {
      display: flex; align-items: center; gap: 16px; padding: 20px !important;
    }
    .summary-card mat-icon {
      font-size: 32px; width: 32px; height: 32px;
      padding: 10px; border-radius: 12px;
    }
    .summary-card.total mat-icon { color: #4f46e5; background: #eef2ff; }
    .summary-card.used mat-icon { color: #ef4444; background: #fef2f2; }
    .summary-card.pending mat-icon { color: #f59e0b; background: #fffbeb; }
    .summary-card.available mat-icon { color: #10b981; background: #ecfdf5; }

    :host-context(body.dark-theme) {
      .summary-card.total mat-icon { background: rgba(79,70,229,0.15); }
      .summary-card.used mat-icon { background: rgba(239,68,68,0.15); }
      .summary-card.pending mat-icon { background: rgba(245,158,11,0.15); }
      .summary-card.available mat-icon { background: rgba(16,185,129,0.15); }
      .circle-bg { stroke: rgba(255,255,255,0.08); }
    }
    .summary-value {
      display: block; font-size: 28px; font-weight: 800; line-height: 1;
      color: var(--text-primary); letter-spacing: -0.03em;
    }
    .summary-label { font-size: 12.5px; color: var(--text-muted); font-weight: 500; }
    .balance-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;
    }
    .balance-detail-card {
      text-align: center;
      border: 1px solid var(--border-light) !important;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .balance-detail-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md) !important;
    }
    .balance-card-header {
      display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
    }
    .type-indicator { width: 10px; height: 10px; border-radius: 50%; }
    .balance-card-header h3 { margin: 0; font-size: 15px; font-weight: 700; color: var(--text-primary); }
    .balance-visual { display: flex; justify-content: center; margin-bottom: 16px; }
    .circle-progress { position: relative; width: 100px; height: 100px; }
    .circular-chart { display: block; }
    .circle-bg { fill: none; stroke: var(--border-light); stroke-width: 3.8; }
    .circle {
      fill: none; stroke-width: 3.8; stroke-linecap: round;
      animation: progress 1s ease-out forwards;
    }
    .circle-text {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      text-align: center;
    }
    .circle-value { display: block; font-size: 24px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
    .circle-label { font-size: 11px; color: var(--text-muted); font-weight: 500; }
    .balance-breakdown { display: flex; justify-content: space-around; }
    .breakdown-item {
      display: flex; flex-direction: column; align-items: center; gap: 2px;
      span { font-size: 11.5px; color: var(--text-muted); font-weight: 500; }
      strong { font-size: 16px; font-weight: 700; color: var(--text-primary); }
    }
    @keyframes progress { 0% { stroke-dasharray: 0, 100; } }
    .empty-state {
      text-align: center; padding: 56px 16px; color: var(--text-muted);
      mat-icon { font-size: 56px; width: 56px; height: 56px; opacity: 0.4; }
      p { margin: 12px 0 4px; font-size: 15px; font-weight: 600; color: var(--text-secondary); }
    }
    .empty-hint { font-size: 13px; color: var(--text-muted); }
  `],
})
export class LeaveBalanceComponent implements OnInit {
  balances = signal<LeaveBalance[]>([]);

  constructor(private mockData: MockDataService) {}

  ngOnInit(): void {
    this.mockData.mockGetLeaveBalance().subscribe((res) => {
      this.balances.set(res.data);
    });
  }

  getColor(type: string): string {
    return (LEAVE_TYPE_COLORS as Record<string, string>)[type] || '#607D8B';
  }

  getUsagePercent(balance: LeaveBalance): number {
    return balance.total > 0 ? Math.round(((balance.used + balance.pending) / balance.total) * 100) : 0;
  }

  getTotalLeaves(): number { return this.balances().reduce((s, b) => s + b.total, 0); }
  getTotalUsed(): number { return this.balances().reduce((s, b) => s + b.used, 0); }
  getTotalPending(): number { return this.balances().reduce((s, b) => s + b.pending, 0); }
  getTotalAvailable(): number { return this.balances().reduce((s, b) => s + b.available, 0); }
}
