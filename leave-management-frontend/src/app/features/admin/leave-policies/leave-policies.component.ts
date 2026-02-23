import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { LeavePolicy } from '../../../core/models';
import { MockDataService } from '../../../core/services/mock-data.service';
import { LEAVE_TYPE_COLORS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-leave-policies',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatIconModule,
    MatButtonModule, MatChipsModule, MatSlideToggleModule, FormsModule,
  ],
  template: `
    <div class="leave-policies">
      <h1>Leave Policies</h1>
      <p class="subtitle">Configure and manage leave type policies</p>

      <div class="policies-grid">
        @if (policies().length > 0) {
          @for (policy of policies(); track policy.id) {
            <mat-card class="policy-card">
              <mat-card-content>
                <div class="policy-header">
                  <div class="type-dot" [style.background]="getColor(policy.leaveType)"></div>
                  <h3>{{ policy.leaveTypeName }}</h3>
                  <mat-slide-toggle [(ngModel)]="policy.isActive" color="primary"></mat-slide-toggle>
                </div>

                <p class="policy-desc">{{ policy.description }}</p>

                <div class="policy-details">
                  <div class="detail-row">
                    <span class="detail-label">Days per Year</span>
                    <strong>{{ policy.totalDaysPerYear }}</strong>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Max Consecutive</span>
                    <strong>{{ policy.maxConsecutiveDays }}</strong>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Carry Forward Limit</span>
                    <strong>{{ policy.carryForwardLimit }}</strong>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Min Service Days</span>
                    <strong>{{ policy.minServiceDaysRequired }}</strong>
                  </div>
                </div>

                <div class="policy-flags">
                  @if (policy.requiresAttachment) {
                    <span class="flag">
                      <mat-icon>attach_file</mat-icon> Attachment Required
                    </span>
                  }
                  @if (policy.requiresApproval) {
                    <span class="flag">
                      <mat-icon>verified</mat-icon> Approval Required
                    </span>
                  }
                </div>
              </mat-card-content>
            </mat-card>
          }
        }
      </div>

      @if (policies().length === 0) {
        <mat-card>
          <div class="empty-state">
            <mat-icon>policy</mat-icon>
            <p>No leave policies configured</p>
            <span class="empty-hint">Leave policies will be configured by the HR admin.</span>
          </div>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .leave-policies {
      max-width: 1200px;
      h1 { font-size: 26px; font-weight: 700; margin: 0 0 4px; color: var(--text-primary); letter-spacing: -0.02em; }
      .subtitle { color: var(--text-muted); margin: 0 0 28px; font-size: 14px; }
    }
    .policies-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 16px;
    }
    .policy-card {
      border: 1px solid var(--border-light);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .policy-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md) !important;
    }
    .policy-header {
      display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
      h3 { margin: 0; flex: 1; font-size: 15px; font-weight: 700; color: var(--text-primary); }
    }
    .type-dot { width: 10px; height: 10px; border-radius: 50%; }
    .policy-desc {
      font-size: 13px; color: var(--text-muted); margin: 0 0 16px;
      line-height: 1.6;
    }
    .policy-details { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
    .detail-row {
      display: flex; justify-content: space-between; font-size: 13px;
      padding: 4px 0; border-bottom: 1px solid var(--border-light);
    }
    .detail-label { color: var(--text-muted); font-weight: 500; }
    .detail-row strong { color: var(--text-primary); font-weight: 700; }
    .policy-flags { display: flex; gap: 12px; flex-wrap: wrap; }
    .flag {
      display: flex; align-items: center; gap: 4px;
      font-size: 11.5px; color: var(--text-muted); font-weight: 500;
      background: var(--bg-body); padding: 3px 10px; border-radius: var(--radius-full);
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }
    .empty-state {
      text-align: center; padding: 56px 16px; color: var(--text-muted);
      mat-icon { font-size: 56px; width: 56px; height: 56px; opacity: 0.4; }
      p { margin: 12px 0 4px; font-size: 15px; font-weight: 600; color: var(--text-secondary); }
    }
    .empty-hint { font-size: 13px; color: var(--text-muted); }
  `],
})
export class LeavePoliciesComponent implements OnInit {
  policies = signal<LeavePolicy[]>([]);

  constructor(private mockData: MockDataService) {}

  ngOnInit(): void {
    this.mockData.mockGetPolicies().subscribe((res) => {
      this.policies.set(res.data);
    });
  }

  getColor(type: string): string {
    return (LEAVE_TYPE_COLORS as Record<string, string>)[type] || '#607D8B';
  }
}
