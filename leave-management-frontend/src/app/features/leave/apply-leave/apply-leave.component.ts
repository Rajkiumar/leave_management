import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { LeaveType, LeaveDuration, LeaveBalance } from '../../../core/models';
import { LEAVE_TYPE_LABELS } from '../../../core/constants/app.constants';
import { MockDataService } from '../../../core/services/mock-data.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatButtonModule, MatIconModule, MatRadioModule, MatProgressSpinnerModule,
    MatChipsModule,
  ],
  template: `
    <div class="apply-leave">
      <h1>Apply for Leave</h1>
      <p class="subtitle">Submit a new leave request for approval</p>

      <div class="form-container">
        <mat-card class="leave-form-card">
          <mat-card-content>
            <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Leave Type</mat-label>
                <mat-select formControlName="leaveType">
                  @for (type of leaveTypes; track type.value) {
                    <mat-option [value]="type.value">{{ type.label }}</mat-option>
                  }
                </mat-select>
                @if (leaveForm.get('leaveType')?.hasError('required') && leaveForm.get('leaveType')?.touched) {
                  <mat-error>Leave type is required</mat-error>
                }
              </mat-form-field>

              <div class="date-row">
                <mat-form-field appearance="outline">
                  <mat-label>Start Date</mat-label>
                  <input matInput [matDatepicker]="startPicker" formControlName="startDate"
                         [min]="minDate">
                  <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
                  @if (leaveForm.get('startDate')?.hasError('required') && leaveForm.get('startDate')?.touched) {
                    <mat-error>Start date is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>End Date</mat-label>
                  <input matInput [matDatepicker]="endPicker" formControlName="endDate"
                         [min]="leaveForm.get('startDate')?.value || minDate">
                  <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                  <mat-datepicker #endPicker></mat-datepicker>
                  @if (leaveForm.get('endDate')?.hasError('required') && leaveForm.get('endDate')?.touched) {
                    <mat-error>End date is required</mat-error>
                  }
                </mat-form-field>
              </div>

              <div class="duration-section">
                <label class="duration-label">Duration</label>
                <mat-radio-group formControlName="duration" class="duration-group">
                  <mat-radio-button value="FULL_DAY">Full Day</mat-radio-button>
                  <mat-radio-button value="FIRST_HALF">First Half</mat-radio-button>
                  <mat-radio-button value="SECOND_HALF">Second Half</mat-radio-button>
                </mat-radio-group>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Reason</mat-label>
                <textarea matInput formControlName="reason" rows="4"
                          placeholder="Provide a brief reason for your leave request"></textarea>
                @if (leaveForm.get('reason')?.hasError('required') && leaveForm.get('reason')?.touched) {
                  <mat-error>Reason is required</mat-error>
                }
                @if (leaveForm.get('reason')?.hasError('minlength') && leaveForm.get('reason')?.touched) {
                  <mat-error>Reason must be at least 10 characters</mat-error>
                }
              </mat-form-field>

              @if (calculatedDays() > 0) {
                <div class="days-summary">
                  <mat-icon>info</mat-icon>
                  <span>Total leave days: <strong>{{ calculatedDays() }}</strong></span>
                </div>
              }

              <div class="form-actions">
                <button mat-button type="button" (click)="onCancel()">Cancel</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="isSubmitting()">
                  @if (isSubmitting()) {
                    <mat-spinner diameter="20"></mat-spinner>
                  } @else {
                    Submit Application
                  }
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Balance Summary Sidebar -->
        <mat-card class="balance-sidebar">
          <mat-card-header>
            <mat-card-title>Your Leave Balance</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (balances().length > 0) {
              @for (balance of balances(); track balance.leaveType) {
                <div class="balance-item">
                  <span class="balance-label">{{ balance.leaveTypeName }}</span>
                  <div class="balance-bar-container">
                    <div class="balance-bar"
                         [style.width.%]="(balance.available / balance.total) * 100"
                         [style.background]="getBarColor(balance)"></div>
                  </div>
                  <span class="balance-value">{{ balance.available }} / {{ balance.total }}</span>
                </div>
              }
            } @else {
              <div class="sidebar-empty">
                <mat-icon>info_outline</mat-icon>
                <p>No balance data yet</p>
              </div>
            }
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .apply-leave {
      max-width: 1100px;
      h1 { font-size: 26px; font-weight: 700; margin: 0 0 4px; color: var(--text-primary); letter-spacing: -0.02em; }
      .subtitle { color: var(--text-muted); margin: 0 0 24px; font-size: 14px; }
    }
    .form-container {
      display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start;
    }
    .full-width { width: 100%; }
    .date-row { display: flex; gap: 16px; }
    .date-row mat-form-field { flex: 1; }
    .duration-section { margin-bottom: 16px; }
    .duration-label {
      display: block; font-size: 13px; font-weight: 600; color: var(--text-secondary);
      margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.04em;
    }
    .duration-group { display: flex; gap: 16px; }
    .days-summary {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 16px; background: var(--brand-lighter); border-radius: var(--radius-md);
      margin-bottom: 16px; color: var(--brand-dark); font-size: 13.5px;
      border: 1px solid rgba(79, 70, 229, 0.1);
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }
    .form-actions {
      display: flex; justify-content: flex-end; gap: 12px; margin-top: 12px;
    }
    .balance-sidebar {
      position: sticky; top: 88px;
      background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-light);
      mat-card-title { font-size: 15px; font-weight: 700; color: var(--text-primary); }
    }
    .balance-item {
      display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px;
    }
    .balance-label { font-size: 12.5px; font-weight: 600; color: var(--text-secondary); }
    .balance-bar-container {
      height: 4px; background: var(--border-light); border-radius: 4px; overflow: hidden;
    }
    .balance-bar { height: 100%; border-radius: 4px; transition: width 0.4s ease; }
    .balance-value { font-size: 11.5px; color: var(--text-muted); text-align: right; }
    .sidebar-empty {
      text-align: center; padding: 24px 0; color: var(--text-muted);
      mat-icon { font-size: 32px; width: 32px; height: 32px; opacity: 0.4; }
      p { margin: 8px 0 0; font-size: 13px; }
    }
    @media (max-width: 900px) {
      .form-container { grid-template-columns: 1fr; }
      .balance-sidebar { position: static; }
    }
  `],
})
export class ApplyLeaveComponent implements OnInit {
  leaveForm: FormGroup;
  isSubmitting = signal(false);
  calculatedDays = signal(0);
  balances = signal<LeaveBalance[]>([]);
  minDate = new Date();

  leaveTypes = Object.entries(LEAVE_TYPE_LABELS).map(([value, label]) => ({ value, label }));

  constructor(
    private fb: FormBuilder,
    private mockData: MockDataService,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      duration: [LeaveDuration.FULL_DAY, Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]],
    });

    // Calculate days on date change
    this.leaveForm.get('startDate')?.valueChanges.subscribe(() => this.calculateDays());
    this.leaveForm.get('endDate')?.valueChanges.subscribe(() => this.calculateDays());
    this.leaveForm.get('duration')?.valueChanges.subscribe(() => this.calculateDays());
  }

  ngOnInit(): void {
    this.mockData.mockGetLeaveBalance().subscribe((res) => {
      this.balances.set(res.data);
    });
  }

  getBarColor(balance: LeaveBalance): string {
    const pct = balance.available / balance.total;
    if (pct > 0.5) return '#4CAF50';
    if (pct > 0.2) return '#FF9800';
    return '#F44336';
  }

  onSubmit(): void {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.leaveForm.value;
    const user = this.authService.currentUser();

    this.mockData.mockApplyLeave({
      leaveType: formValue.leaveType,
      startDate: this.formatDate(formValue.startDate),
      endDate: this.formatDate(formValue.endDate),
      duration: formValue.duration,
      reason: formValue.reason,
      totalDays: this.calculatedDays(),
      employeeId: user?.id,
      employeeName: `${user?.firstName} ${user?.lastName}`,
      department: user?.department,
    }).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.notification.success(res.message);
        this.router.navigate(['/leave/history']);
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  private calculateDays(): void {
    const start = this.leaveForm.get('startDate')?.value;
    const end = this.leaveForm.get('endDate')?.value;
    const duration = this.leaveForm.get('duration')?.value;

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      let days = 0;

      const current = new Date(startDate);
      while (current <= endDate) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) {
          days++;
        }
        current.setDate(current.getDate() + 1);
      }

      if (duration === LeaveDuration.FIRST_HALF || duration === LeaveDuration.SECOND_HALF) {
        days = Math.max(0.5, days - 0.5);
      }

      this.calculatedDays.set(days);
    }
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}
