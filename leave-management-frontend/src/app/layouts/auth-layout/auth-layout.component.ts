import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <div class="auth-layout">
      <button mat-icon-button class="theme-toggle"
              (click)="themeService.toggle()"
              [matTooltip]="themeService.isDark() ? 'Light mode' : 'Dark mode'">
        <mat-icon>{{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>
      <div class="auth-container">
        <div class="auth-branding">
          <div class="brand-content">
            <div class="brand-logo">
              <mat-icon class="brand-icon">event_available</mat-icon>
            </div>
            <h1>Leave<span>Hub</span></h1>
            <p class="tagline">Modern leave management for modern teams</p>
            <div class="divider"></div>
            <div class="features">
              <div class="feature">
                <div class="feature-dot"></div>
                <div class="feature-text">
                  <strong>Instant Applications</strong>
                  <span>Apply in under 30 seconds</span>
                </div>
              </div>
              <div class="feature">
                <div class="feature-dot"></div>
                <div class="feature-text">
                  <strong>Real-time Tracking</strong>
                  <span>Stay updated on approval status</span>
                </div>
              </div>
              <div class="feature">
                <div class="feature-dot"></div>
                <div class="feature-text">
                  <strong>Smart Reports</strong>
                  <span>Compliance & analytics built-in</span>
                </div>
              </div>
            </div>
          </div>
          <div class="brand-footer">
            <span>&copy; 2025 LeaveHub &middot; All rights reserved</span>
          </div>
        </div>
        <div class="auth-form-area">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f172a;
      background-image:
        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(79, 70, 229, 0.3), transparent),
        radial-gradient(ellipse 60% 60% at 80% 100%, rgba(99, 102, 241, 0.15), transparent);
      padding: 20px;
      position: relative;
    }

    .theme-toggle {
      position: absolute;
      top: 16px;
      right: 16px;
      color: rgba(255,255,255,0.5);
      z-index: 10;
      transition: color 0.15s, transform 0.3s;
    }
    .theme-toggle:hover {
      color: rgba(255,255,255,0.85);
      transform: rotate(30deg);
    }

    .auth-container {
      display: flex;
      max-width: 1020px;
      width: 100%;
      background: var(--bg-card);
      border-radius: 20px;
      overflow: hidden;
      box-shadow:
        0 25px 50px rgba(0, 0, 0, 0.35),
        0 0 0 1px rgba(255, 255, 255, 0.05);
      min-height: 620px;
    }

    .auth-branding {
      flex: 0 0 420px;
      background: linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%);
      color: white;
      padding: 48px 40px 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    .auth-branding::before {
      content: '';
      position: absolute;
      top: -40%;
      right: -30%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(129, 140, 248, 0.2) 0%, transparent 70%);
      border-radius: 50%;
    }

    .auth-branding::after {
      content: '';
      position: absolute;
      bottom: -20%;
      left: -20%;
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
      border-radius: 50%;
    }

    .brand-content {
      position: relative;
      z-index: 1;
    }

    .brand-logo {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .brand-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #a5b4fc;
    }

    .brand-content h1 {
      font-size: 32px;
      font-weight: 800;
      margin: 0 0 8px;
      letter-spacing: -0.03em;
    }

    .brand-content h1 span {
      color: #a5b4fc;
    }

    .tagline {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
      font-weight: 400;
    }

    .divider {
      width: 40px;
      height: 3px;
      background: rgba(165, 180, 252, 0.4);
      border-radius: 2px;
      margin: 32px 0;
    }

    .features {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .feature {
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    .feature-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #818cf8;
      margin-top: 6px;
      flex-shrink: 0;
    }

    .feature-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .feature-text strong {
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
    }

    .feature-text span {
      font-size: 12.5px;
      color: rgba(255, 255, 255, 0.45);
      font-weight: 400;
    }

    .brand-footer {
      position: relative;
      z-index: 1;
      span {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.25);
      }
    }

    .auth-form-area {
      flex: 1;
      padding: 48px 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-card);
      transition: background 0.3s ease;
    }

    @media (max-width: 840px) {
      .auth-branding { display: none; }
      .auth-container {
        max-width: 460px;
        border-radius: 16px;
      }
      .auth-form-area {
        padding: 36px 28px;
      }
    }
  `],
})
export class AuthLayoutComponent {
  constructor(public themeService: ThemeService) {}
}
