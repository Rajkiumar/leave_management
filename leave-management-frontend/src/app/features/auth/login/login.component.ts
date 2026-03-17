import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../../core/services/auth.service';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
  ],
  template: `
    <div class="login-form">
      <div class="login-header">
        <h2>Welcome back</h2>
        <p class="subtitle">Enter your credentials to access your account</p>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email address</mat-label>
          <input matInput formControlName="email" type="email" placeholder="you&#64;company.com">
          <mat-icon matPrefix>mail_outline</mat-icon>
          @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
            <mat-error>Email is required</mat-error>
          }
          @if (loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched) {
            <mat-error>Please enter a valid email</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password"
                 [type]="hidePassword() ? 'password' : 'text'"
                 placeholder="Enter your password">
          <mat-icon matPrefix>lock_outline</mat-icon>
          <button mat-icon-button matSuffix type="button"
                  (click)="hidePassword.set(!hidePassword())">
            <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
            <mat-error>Password is required</mat-error>
          }
        </mat-form-field>

        <div class="form-actions-row">
          <mat-checkbox formControlName="rememberMe" color="primary">Remember me</mat-checkbox>
          <a routerLink="/auth/forgot-password" class="forgot-link">Forgot password?</a>
        </div>

        <button mat-raised-button color="primary" type="submit" class="full-width submit-btn"
                [disabled]="isLoading()">
          @if (isLoading()) {
            <mat-spinner diameter="20"></mat-spinner>
          } @else {
            Sign In
          }
        </button>
      </form>

      <div class="demo-accounts">
        <div class="demo-label">
          <div class="demo-line"></div>
          <span>Quick access</span>
          <div class="demo-line"></div>
        </div>
        <div class="demo-buttons">
          <button class="demo-btn" (click)="fillDemo('john.doe@company.com')" type="button">
            <div class="demo-avatar avatar-blue">
              <mat-icon>person</mat-icon>
            </div>
            <div class="demo-info">
              <strong>Employee</strong>
              <span>Basic access</span>
            </div>
          </button>
          <button class="demo-btn" (click)="fillDemo('jane.smith@company.com')" type="button">
            <div class="demo-avatar avatar-amber">
              <mat-icon>supervisor_account</mat-icon>
            </div>
            <div class="demo-info">
              <strong>Manager</strong>
              <span>Team approvals</span>
            </div>
          </button>
          <button class="demo-btn" (click)="fillDemo('sarah.johnson@company.com')" type="button">
            <div class="demo-avatar avatar-purple">
              <mat-icon>admin_panel_settings</mat-icon>
            </div>
            <div class="demo-info">
              <strong>HR Admin</strong>
              <span>Full control</span>
            </div>
          </button>
        </div>
      </div>

      <p class="register-link">
        Don't have an account?
        <a routerLink="/auth/register">Create one</a>
      </p>
    </div>
  `,
  styles: [`
    .login-form {
      width: 100%;
      max-width: 380px;
    }

    .login-header {
      margin-bottom: 28px;
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
      margin: 0;
      font-size: 14px;
      font-weight: 400;
    }

    .full-width { width: 100%; }

    .form-actions-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 22px;
    }

    .forgot-link {
      color: var(--brand);
      font-size: 13px;
      font-weight: 500;
      transition: color 0.15s;
    }
    .forgot-link:hover { color: var(--brand-dark); }

    .submit-btn {
      height: 48px;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.01em;
      margin-bottom: 24px;
      border-radius: 10px !important;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.25) !important;
      transition: box-shadow 0.15s, transform 0.15s;
    }
    .submit-btn:hover:not([disabled]) {
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.35) !important;
      transform: translateY(-1px);
    }

    .demo-accounts {
      margin-bottom: 20px;
    }

    .demo-label {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;

      span {
        font-size: 11px;
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        white-space: nowrap;
      }
    }

    .demo-line {
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    .demo-buttons {
      display: flex;
      gap: 8px;
    }

    .demo-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 14px 8px;
      background: var(--bg-body);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.15s;
    }

    .demo-btn:hover {
      border-color: var(--brand-light);
      background: var(--brand-lighter);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    .demo-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .avatar-blue   { background: #dbeafe; color: #2563eb; }
    .avatar-amber  { background: #fef3c7; color: #d97706; }
    .avatar-purple { background: #ede9fe; color: #7c3aed; }

    :host-context(body.dark-theme) {
      .avatar-blue   { background: rgba(37, 99, 235, 0.15); }
      .avatar-amber  { background: rgba(217, 119, 6, 0.15); }
      .avatar-purple { background: rgba(124, 58, 237, 0.15); }
      .demo-btn {
        background: rgba(255,255,255,0.04);
        border-color: var(--border);
      }
      .demo-btn:hover {
        background: rgba(99,102,241,0.1);
        border-color: var(--brand-light);
      }
    }

    .demo-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1px;

      strong {
        font-size: 12px;
        color: var(--text-primary);
        font-weight: 600;
      }

      span {
        font-size: 10px;
        color: var(--text-muted);
      }
    }

    .register-link {
      text-align: center;
      font-size: 13.5px;
      color: var(--text-secondary);
      margin: 0;
    }
    .register-link a {
      color: var(--brand);
      font-weight: 600;
      transition: color 0.15s;
    }
    .register-link a:hover { color: var(--brand-dark); }
  `],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = signal(true);
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private mockData: MockDataService,
    private notification: NotificationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  fillDemo(email: string): void {
    this.loginForm.patchValue({ email, password: 'password123' });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;

    // Using mock data for now - replace with authService.login() when backend is ready
    this.mockData.mockLogin(email, password).subscribe({
      next: (response) => {
        if (response.success) {
          // Manually store auth data since we're using mock
          localStorage.setItem('lms_token', response.data.token);
          localStorage.setItem('lms_refresh_token', response.data.refreshToken);
          localStorage.setItem('lms_user', JSON.stringify(response.data.user));
          this.authService.currentUser.set(response.data.user);
          this.notification.success(`Welcome back, ${response.data.user.firstName}!`);
          this.router.navigate(['/dashboard']);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notification.error('Login failed. Please check your credentials.');
      },
    });
  }
}
