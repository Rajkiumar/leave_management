import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { User, UserRole } from '../../../core/models';
import { MockDataService } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatPaginatorModule,
    MatIconModule, MatButtonModule, MatChipsModule, MatFormFieldModule,
    MatInputModule, FormsModule,
  ],
  template: `
    <div class="user-management">
      <div class="page-header">
        <div>
          <h1>User Management</h1>
          <p class="subtitle">Manage employee accounts and roles</p>
        </div>
      </div>

      <mat-card>
        <mat-card-content>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search employees</mat-label>
            <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterUsers()"
                   placeholder="Search by name, email, or department">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <table mat-table [dataSource]="filteredUsers()" class="full-width">
            <ng-container matColumnDef="employeeId">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let u">{{ u.employeeId }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let u">
                <div class="name-cell">
                  <mat-icon>account_circle</mat-icon>
                  <span>{{ u.firstName }} {{ u.lastName }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let u">{{ u.email }}</td>
            </ng-container>

            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef>Department</th>
              <td mat-cell *matCellDef="let u">{{ u.department }}</td>
            </ng-container>

            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Role</th>
              <td mat-cell *matCellDef="let u">
                <span class="role-chip" [class]="u.role.toLowerCase()">{{ u.role }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let u">
                <span class="status-dot" [class.active]="u.isActive"></span>
                {{ u.isActive ? 'Active' : 'Inactive' }}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>

          @if (filteredUsers().length === 0) {
            <div class="empty-state">
              <mat-icon>group</mat-icon>
              <p>No employees found</p>
              <span class="empty-hint">Employee records will appear once the backend is connected.</span>
            </div>
          }

          <mat-paginator [length]="filteredUsers().length" [pageSize]="10"
                         [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .user-management {
      max-width: 1200px;
      h1 { font-size: 26px; font-weight: 700; margin: 0 0 4px; color: var(--text-primary); letter-spacing: -0.02em; }
      .subtitle { color: var(--text-muted); margin: 0; font-size: 14px; }
    }
    .page-header { margin-bottom: 24px; }
    .search-field { width: 100%; max-width: 400px; }
    .full-width { width: 100%; }
    .name-cell {
      display: flex; align-items: center; gap: 10px; font-weight: 600;
      mat-icon { color: var(--brand); font-size: 22px; width: 22px; height: 22px; }
    }
    .role-chip {
      padding: 3px 10px; border-radius: var(--radius-full);
      font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;
    }
    .role-chip.employee { background: #eef2ff; color: #4f46e5; }
    .role-chip.manager { background: #f5f3ff; color: #7c3aed; }
    .role-chip.hr_admin { background: #ecfdf5; color: #059669; }
    .status-dot {
      display: inline-block; width: 7px; height: 7px; border-radius: 50%;
      background: #d1d5db; margin-right: 6px;
    }
    .status-dot.active { background: #10b981; }

    :host-context(body.dark-theme) {
      .role-chip.employee { background: rgba(79,70,229,0.12); }
      .role-chip.manager { background: rgba(124,58,237,0.12); }
      .role-chip.hr_admin { background: rgba(5,150,105,0.12); }
      .status-dot { background: #4b5563; }
    }
    .empty-state {
      text-align: center; padding: 56px 16px; color: var(--text-muted);
      mat-icon { font-size: 56px; width: 56px; height: 56px; opacity: 0.4; }
      p { margin: 12px 0 4px; font-size: 15px; font-weight: 600; color: var(--text-secondary); }
    }
    .empty-hint { font-size: 13px; color: var(--text-muted); }
  `],
})
export class UserManagementComponent implements OnInit {
  allUsers = signal<User[]>([]);
  filteredUsers = signal<User[]>([]);
  searchTerm = '';
  columns = ['employeeId', 'name', 'email', 'department', 'role', 'status'];

  constructor(private mockData: MockDataService) {}

  ngOnInit(): void {
    this.mockData.mockGetAllUsers().subscribe((res) => {
      this.allUsers.set(res.data.items);
      this.filteredUsers.set(res.data.items);
    });
  }

  filterUsers(): void {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.filteredUsers.set(this.allUsers());
      return;
    }
    this.filteredUsers.set(
      this.allUsers().filter(
        (u) =>
          u.firstName.toLowerCase().includes(term) ||
          u.lastName.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.department.toLowerCase().includes(term)
      )
    );
  }
}
