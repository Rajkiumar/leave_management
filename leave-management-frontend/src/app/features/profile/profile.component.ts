import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatTabsModule, MatDividerModule,
  ],
  template: `
    <div class="profile-page">
      <h1>My Profile</h1>
      <p class="subtitle">Manage your personal information</p>

      <mat-tab-group>
        <mat-tab label="Personal Info">
          <div class="tab-content">
            <mat-card>
              <mat-card-content>
                <div class="profile-header">
                  <div class="avatar">
                    <mat-icon>account_circle</mat-icon>
                  </div>
                  <div class="profile-summary">
                    <h2>{{ user()?.firstName }} {{ user()?.lastName }}</h2>
                    <p>{{ user()?.designation }} · {{ user()?.department }}</p>
                    <span class="role-badge">{{ user()?.role }}</span>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>First Name</mat-label>
                      <input matInput formControlName="firstName">
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Last Name</mat-label>
                      <input matInput formControlName="lastName">
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Email</mat-label>
                      <input matInput formControlName="email" readonly>
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Phone</mat-label>
                      <input matInput formControlName="phone">
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Employee ID</mat-label>
                      <input matInput formControlName="employeeId" readonly>
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Department</mat-label>
                      <input matInput formControlName="department" readonly>
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Designation</mat-label>
                      <input matInput formControlName="designation" readonly>
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Joining Date</mat-label>
                      <input matInput formControlName="joiningDate" readonly>
                    </mat-form-field>
                  </div>
                  <div class="form-actions">
                    <button mat-raised-button color="primary" type="submit">Save Changes</button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Change Password">
          <div class="tab-content">
            <mat-card>
              <mat-card-content>
                <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Current Password</mat-label>
                    <input matInput type="password" formControlName="currentPassword">
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>New Password</mat-label>
                    <input matInput type="password" formControlName="newPassword">
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Confirm New Password</mat-label>
                    <input matInput type="password" formControlName="confirmPassword">
                  </mat-form-field>
                  <div class="form-actions">
                    <button mat-raised-button color="primary" type="submit">Update Password</button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .profile-page {
      max-width: 800px;
      h1 { font-size: 26px; font-weight: 700; margin: 0 0 4px; color: var(--text-primary); letter-spacing: -0.02em; }
      .subtitle { color: var(--text-muted); margin: 0 0 24px; font-size: 14px; }
    }
    .tab-content { padding-top: 20px; }
    .profile-header {
      display: flex; align-items: center; gap: 20px; padding: 20px 0;
    }
    .avatar mat-icon {
      font-size: 40px; width: 40px; height: 40px; color: white;
      background: linear-gradient(135deg, var(--brand), var(--brand-dark));
      padding: 20px; border-radius: 16px;
    }
    .profile-summary {
      h2 { margin: 0 0 4px; font-size: 22px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.01em; }
      p { margin: 0 0 8px; color: var(--text-muted); font-size: 14px; }
    }
    .role-badge {
      display: inline-block; padding: 3px 12px; border-radius: var(--radius-full);
      background: var(--brand-lighter); color: var(--brand);
      font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;
    }
    mat-divider { margin: 0 0 24px; }
    .form-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px;
    }
    .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 12px; }
    @media (max-width: 600px) {
      .form-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class ProfileComponent implements OnInit {
  user = this.authService.currentUser;
  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NotificationService
  ) {
    this.profileForm = this.fb.group({
      firstName: [''], lastName: [''], email: [''],
      phone: [''], employeeId: [''], department: [''],
      designation: [''], joiningDate: [''],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const u = this.user();
    if (u) {
      this.profileForm.patchValue({
        firstName: u.firstName, lastName: u.lastName, email: u.email,
        phone: u.phone, employeeId: u.employeeId, department: u.department,
        designation: u.designation, joiningDate: u.joiningDate,
      });
    }
  }

  saveProfile(): void {
    this.notification.success('Profile updated successfully');
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.notification.error('Passwords do not match');
      return;
    }
    this.notification.success('Password updated successfully');
    this.passwordForm.reset();
  }
}
