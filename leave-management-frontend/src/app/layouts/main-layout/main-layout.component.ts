import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { NAV_ITEMS } from '../../core/constants/app.constants';
import { UserRole } from '../../core/models';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  template: `
    <div class="main-layout">
      <mat-toolbar class="toolbar">
        <button mat-icon-button (click)="toggleSidebar()" class="menu-btn">
          <mat-icon>{{ sidenavOpened() ? 'menu_open' : 'menu' }}</mat-icon>
        </button>
        <div class="toolbar-title">
          <span class="breadcrumb">Dashboard</span>
        </div>
        <span class="spacer"></span>

        <div class="toolbar-actions">
          <button mat-icon-button (click)="themeService.toggle()"
                  [matTooltip]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
                  class="toolbar-icon-btn theme-toggle-btn">
            <mat-icon>{{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>

          <button mat-icon-button matTooltip="Notifications" class="toolbar-icon-btn"
                  [matBadge]="3" matBadgeColor="warn" matBadgeSize="small">
            <mat-icon>notifications_none</mat-icon>
          </button>

          <div class="toolbar-divider"></div>

          <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn">
            <div class="user-avatar">
              {{ getInitials() }}
            </div>
            <div class="user-details">
              <span class="user-name">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</span>
              <span class="user-role">{{ currentUser()?.role }}</span>
            </div>
            <mat-icon class="dropdown-icon">expand_more</mat-icon>
          </button>
        </div>

        <mat-menu #userMenu="matMenu" class="user-menu-panel">
          <div class="user-menu-header">
            <div class="menu-avatar">{{ getInitials() }}</div>
            <div class="menu-user-info">
              <strong>{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</strong>
              <small>{{ currentUser()?.email }}</small>
              <span class="role-badge">{{ currentUser()?.role }}</span>
            </div>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item routerLink="/profile">
            <mat-icon>person_outline</mat-icon>
            <span>My Profile</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()" class="logout-item">
            <mat-icon>logout</mat-icon>
            <span>Sign Out</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav
          [mode]="sidenavMode()"
          [opened]="sidenavOpened()"
          class="sidenav"
          (closedStart)="sidenavOpened.set(false)"
        >
          <div class="sidenav-header">
            <div class="sidenav-logo-wrap">
              <mat-icon class="sidenav-logo">event_available</mat-icon>
            </div>
            <div class="sidenav-brand">
              <span class="sidenav-title">Leave<span class="accent">Hub</span></span>
              <span class="sidenav-subtitle">Management</span>
            </div>
          </div>

          <div class="nav-section-label">Navigation</div>
          <mat-nav-list class="nav-list">
            @for (item of navItems(); track item.route) {
              <a mat-list-item [routerLink]="item.route" routerLinkActive="active-link"
                 [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
                 class="nav-item">
                <mat-icon matListItemIcon class="nav-icon">{{ item.icon }}</mat-icon>
                <span matListItemTitle class="nav-label">{{ item.label }}</span>
              </a>
            }
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="content">
          <div class="page-content">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .main-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--bg-body);
    }

    /* ─── Toolbar ─── */
    .toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--bg-toolbar);
      color: var(--text-primary);
      box-shadow: var(--shadow-xs);
      border-bottom: 1px solid var(--border-light);
      height: 60px;
      padding: 0 16px;
    }

    .menu-btn {
      color: var(--text-secondary);
    }

    .toolbar-title {
      margin-left: 8px;
    }

    .breadcrumb {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .spacer { flex: 1; }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .toolbar-icon-btn {
      color: var(--text-secondary);
      transition: color 0.15s;
    }
    .toolbar-icon-btn:hover {
      color: var(--text-primary);
    }

    .theme-toggle-btn {
      transition: transform 0.3s ease, color 0.15s;
    }
    .theme-toggle-btn:hover {
      transform: rotate(30deg);
    }

    .toolbar-divider {
      width: 1px;
      height: 28px;
      background: var(--border);
      margin: 0 8px;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      height: auto;
      line-height: normal;
    }

    .user-avatar, .menu-avatar {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--brand), var(--brand-dark));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .menu-avatar {
      width: 42px;
      height: 42px;
      font-size: 15px;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .user-role {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: capitalize;
    }

    .dropdown-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--text-muted);
    }

    /* ─── User Menu ─── */
    .user-menu-header {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .menu-user-info {
      display: flex;
      flex-direction: column;
      gap: 2px;

      strong {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
      }

      small {
        color: var(--text-muted);
        font-size: 12px;
      }
    }

    .role-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: var(--radius-full);
      background: var(--brand-lighter);
      color: var(--brand);
      font-size: 10px;
      font-weight: 600;
      margin-top: 4px;
      width: fit-content;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .logout-item {
      color: #ef4444 !important;
      mat-icon { color: #ef4444 !important; }
    }

    /* ─── Sidenav ─── */
    .sidenav-container {
      flex: 1;
      margin-top: 60px;
    }

    .sidenav {
      width: 260px;
      background: var(--bg-sidebar);
      border-right: none !important;
    }

    .sidenav-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 20px 16px;
    }

    .sidenav-logo-wrap {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: rgba(129, 140, 248, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sidenav-logo {
      font-size: 22px;
      width: 22px;
      height: 22px;
      color: #818cf8;
    }

    .sidenav-brand {
      display: flex;
      flex-direction: column;
    }

    .sidenav-title {
      font-size: 18px;
      font-weight: 800;
      color: var(--text-on-dark);
      letter-spacing: -0.02em;
      line-height: 1.2;
    }

    .sidenav-title .accent {
      color: #818cf8;
    }

    .sidenav-subtitle {
      font-size: 10px;
      font-weight: 500;
      color: rgba(255,255,255,0.3);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .nav-section-label {
      padding: 20px 20px 8px;
      font-size: 10px;
      font-weight: 600;
      color: rgba(255,255,255,0.25);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .nav-list {
      padding: 0 8px;
    }

    .nav-item {
      border-radius: var(--radius-sm) !important;
      margin-bottom: 2px;
      height: 42px !important;
      transition: all 0.15s ease;
    }

    .nav-icon {
      color: rgba(255,255,255,0.4) !important;
      font-size: 20px !important;
      width: 20px !important;
      height: 20px !important;
      margin-right: 14px !important;
      transition: color 0.15s;
    }

    .nav-label {
      font-size: 13.5px !important;
      font-weight: 500 !important;
      color: rgba(255,255,255,0.55) !important;
      transition: color 0.15s;
    }

    .nav-item:hover {
      background: var(--bg-sidebar-hover) !important;
      .nav-icon { color: rgba(255,255,255,0.7) !important; }
      .nav-label { color: rgba(255,255,255,0.8) !important; }
    }

    .active-link {
      background: rgba(99, 102, 241, 0.15) !important;
      .nav-icon { color: #818cf8 !important; }
      .nav-label { color: #ffffff !important; font-weight: 600 !important; }
    }

    /* ─── Content ─── */
    .content {
      background: var(--bg-body);
    }

    .page-content {
      padding: 28px;
      max-width: 1400px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .toolbar-title, .user-details, .toolbar-divider { display: none; }
      .page-content { padding: 16px; }
      .toolbar { padding: 0 8px; }
    }
  `],
})
export class MainLayoutComponent implements OnInit {
  currentUser = this.authService.currentUser;
  sidenavOpened = signal(true);
  sidenavMode = signal<'side' | 'over'>('side');

  navItems = computed(() => {
    const role = this.currentUser()?.role;
    switch (role) {
      case UserRole.MANAGER:
        return NAV_ITEMS.MANAGER;
      case UserRole.HR_ADMIN:
        return NAV_ITEMS.HR_ADMIN;
      default:
        return NAV_ITEMS.EMPLOYEE;
    }
  });

  constructor(private authService: AuthService, public themeService: ThemeService) {}

  ngOnInit(): void {
    this.checkScreenSize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkScreenSize());
    }
  }

  getInitials(): string {
    const user = this.currentUser();
    if (!user) return '?';
    return (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '');
  }

  toggleSidebar(): void {
    this.sidenavOpened.update((v) => !v);
  }

  logout(): void {
    this.authService.logout();
  }

  private checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) {
        this.sidenavMode.set('over');
        this.sidenavOpened.set(false);
      } else {
        this.sidenavMode.set('side');
        this.sidenavOpened.set(true);
      }
    }
  }
}
