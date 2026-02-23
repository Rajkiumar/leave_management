import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Holiday } from '../../../core/models';
import { MockDataService } from '../../../core/services/mock-data.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-manage-holidays',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatTableModule, MatIconModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule,
    MatNativeDateModule, MatCheckboxModule, MatDialogModule,
  ],
  template: `
    <div class="manage-holidays">
      <div class="page-header">
        <div>
          <h1>Manage Holidays</h1>
          <p class="subtitle">Add, edit, or remove company holidays</p>
        </div>
        <button mat-raised-button color="primary" (click)="showAddForm = !showAddForm">
          <mat-icon>add</mat-icon> Add Holiday
        </button>
      </div>

      @if (showAddForm) {
        <mat-card class="add-form">
          <mat-card-content>
            <h3>Add New Holiday</h3>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Holiday Name</mat-label>
                <input matInput [(ngModel)]="newHoliday.name" placeholder="e.g., Independence Day">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Date</mat-label>
                <input matInput [matDatepicker]="picker" [(ngModel)]="newHoliday.date">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
              <mat-checkbox [(ngModel)]="newHoliday.isOptional" color="primary">Optional</mat-checkbox>
              <button mat-raised-button color="primary" (click)="addHoliday()">Add</button>
            </div>
          </mat-card-content>
        </mat-card>
      }

      <mat-card>
        @if (holidays().length > 0) {
          <table mat-table [dataSource]="holidays()" class="full-width">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Holiday</th>
              <td mat-cell *matCellDef="let h">
                <div class="holiday-name">
                  <mat-icon>celebration</mat-icon>
                  {{ h.name }}
                </div>
              </td>
            </ng-container>
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let h">{{ h.date }}</td>
            </ng-container>
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let h">
                <span class="type-chip" [class.optional]="h.isOptional">
                  {{ h.isOptional ? 'Optional' : 'Mandatory' }}
                </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let h">
                <button mat-icon-button color="warn" (click)="deleteHoliday(h)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
        } @else {
          <div class="empty-state">
            <mat-icon>celebration</mat-icon>
            <p>No holidays added yet</p>
            <span class="empty-hint">Click "Add Holiday" to configure company holidays.</span>
          </div>
        }
      </mat-card>
    </div>
  `,
  styles: [`
    .manage-holidays {
      max-width: 900px;
      h1 { font-size: 26px; font-weight: 700; margin: 0 0 4px; color: var(--text-primary); letter-spacing: -0.02em; }
      .subtitle { color: var(--text-muted); margin: 0; font-size: 14px; }
    }
    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 24px;
    }
    .add-form {
      margin-bottom: 16px;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg) !important;
    }
    .add-form h3 { margin: 0 0 12px; font-size: 15px; font-weight: 700; color: var(--text-primary); }
    .form-row {
      display: flex; gap: 16px; align-items: center; flex-wrap: wrap;
    }
    .full-width { width: 100%; }
    .holiday-name {
      display: flex; align-items: center; gap: 10px; font-weight: 600;
      mat-icon { color: #f59e0b; }
    }
    .type-chip {
      padding: 3px 10px; border-radius: var(--radius-full);
      font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;
      background: #ecfdf5; color: #059669;
    }
    .type-chip.optional { background: #fffbeb; color: #d97706; }

    :host-context(body.dark-theme) {
      .type-chip { background: rgba(5,150,105,0.12); }
      .type-chip.optional { background: rgba(217,119,6,0.12); }
    }
    .empty-state {
      text-align: center; padding: 56px 16px; color: var(--text-muted);
      mat-icon { font-size: 56px; width: 56px; height: 56px; opacity: 0.4; }
      p { margin: 12px 0 4px; font-size: 15px; font-weight: 600; color: var(--text-secondary); }
    }
    .empty-hint { font-size: 13px; color: var(--text-muted); }
  `],
})
export class ManageHolidaysComponent implements OnInit {
  holidays = signal<Holiday[]>([]);
  columns = ['name', 'date', 'type', 'actions'];
  showAddForm = false;
  newHoliday: { name: string; date: any; isOptional: boolean } = {
    name: '', date: null, isOptional: false,
  };

  constructor(
    private mockData: MockDataService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.mockData.mockGetHolidays().subscribe((res) => {
      this.holidays.set(res.data.sort((a, b) => a.date.localeCompare(b.date)));
    });
  }

  addHoliday(): void {
    if (!this.newHoliday.name || !this.newHoliday.date) {
      this.notification.warning('Please fill in all fields');
      return;
    }
    const current = this.holidays();
    current.push({
      id: 'H' + (current.length + 1),
      name: this.newHoliday.name,
      date: new Date(this.newHoliday.date).toISOString().split('T')[0],
      isOptional: this.newHoliday.isOptional,
    });
    this.holidays.set([...current].sort((a, b) => a.date.localeCompare(b.date)));
    this.notification.success('Holiday added successfully');
    this.newHoliday = { name: '', date: null, isOptional: false };
    this.showAddForm = false;
  }

  deleteHoliday(holiday: Holiday): void {
    if (confirm(`Delete "${holiday.name}"?`)) {
      this.holidays.set(this.holidays().filter((h) => h.id !== holiday.id));
      this.notification.success('Holiday deleted');
    }
  }
}
