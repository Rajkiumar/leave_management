import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  template: `
    <div class="register-form">
      <h2>Create Account</h2>
      <p class="subtitle">Fill in your details to get started</p>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" placeholder="First name">
            @if (registerForm.get('firstName')?.hasError('required') && registerForm.get('firstName')?.touched) {
              <mat-error>First name is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" placeholder="Last name">
            @if (registerForm.get('lastName')?.hasError('required') && registerForm.get('lastName')?.touched) {
              <mat-error>Last name is required</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" placeholder="Work email">
          <mat-icon matPrefix>email</mat-icon>
          @if (registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched) {
            <mat-error>Email is required</mat-error>
          }
          @if (registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched) {
            <mat-error>Please enter a valid email</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Employee ID</mat-label>
          <input matInput formControlName="employeeId" placeholder="e.g., EMP006">
          <mat-icon matPrefix>badge</mat-icon>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Department</mat-label>
            <mat-select formControlName="department">
              <mat-option value="Engineering">Engineering</mat-option>
              <mat-option value="Design">Design</mat-option>
              <mat-option value="Marketing">Marketing</mat-option>
              <mat-option value="Human Resources">Human Resources</mat-option>
              <mat-option value="Finance">Finance</mat-option>
              <mat-option value="Sales">Sales</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Designation</mat-label>
            <input matInput formControlName="designation" placeholder="Job title">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password"
                 [type]="hidePassword() ? 'password' : 'text'"
                 placeholder="Create a password">
          <mat-icon matPrefix>lock</mat-icon>
          <button mat-icon-button matSuffix type="button"
                  (click)="hidePassword.set(!hidePassword())">
            <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched) {
            <mat-error>Password is required</mat-error>
          }
          @if (registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
            <mat-error>Password must be at least 8 characters</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirm Password</mat-label>
          <input matInput formControlName="confirmPassword"
                 [type]="hideConfirmPassword() ? 'password' : 'text'"
                 placeholder="Confirm your password">
          <mat-icon matPrefix>lock_outline</mat-icon>
          <button mat-icon-button matSuffix type="button"
                  (click)="hideConfirmPassword.set(!hideConfirmPassword())">
            <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" class="full-width submit-btn"
                [disabled]="isLoading()">
          @if (isLoading()) {
            <mat-spinner diameter="20"></mat-spinner>
          } @else {
            Create Account
          }
        </button>
      </form>

      <p class="login-link">
        Already have an account?
        <a routerLink="/auth/login">Sign in</a>
      </p>
    </div>
  `,
  styles: [`
    .register-form {
      width: 100%;
      max-width: 420px;
    }
    h2 {
      margin: 0 0 6px;
      font-size: 26px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }
    .subtitle {
      color: var(--text-muted);
      margin: 0 0 24px;
      font-size: 14px;
    }
    .full-width { width: 100%; }
    .form-row {
      display: flex;
      gap: 12px;
    }
    .form-row mat-form-field { flex: 1; }
    .submit-btn {
      height: 48px;
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 20px;
      border-radius: 10px !important;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.25) !important;
    }
    .login-link {
      text-align: center;
      font-size: 13.5px;
      color: var(--text-secondary);
      margin: 0;
    }
    .login-link a {
      color: var(--brand);
      font-weight: 600;
      transition: color 0.15s;
    }
    .login-link a:hover { color: var(--brand-dark); }
  `],
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      employeeId: ['', [Validators.required]],
      department: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.notification.error('Passwords do not match');
      return;
    }

    this.isLoading.set(true);
    // Mock registration - navigate to login
    setTimeout(() => {
      this.isLoading.set(false);
      this.notification.success('Account created successfully! Please sign in.');
      this.router.navigate(['/auth/login']);
    }, 1000);
  }
}
