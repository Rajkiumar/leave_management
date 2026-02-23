import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { Holiday } from '../../../core/models';
import { MockDataService } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTableModule, MatChipsModule],
  template: `
    <div class="holidays">
      <h1>Public Holidays 2026</h1>
      <p class="subtitle">Company-observed holidays for the year</p>

      <mat-card>
        @if (holidays().length > 0) {
          <table mat-table [dataSource]="holidays()" class="full-width">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Holiday</th>
              <td mat-cell *matCellDef="let h">
                <div class="holiday-name">
                  <mat-icon>celebration</mat-icon>
                  <span>{{ h.name }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let h">{{ h.date }}</td>
            </ng-container>

            <ng-container matColumnDef="day">
              <th mat-header-cell *matHeaderCellDef>Day</th>
              <td mat-cell *matCellDef="let h">{{ getDayName(h.date) }}</td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let h">
                <span class="type-chip" [class.optional]="h.isOptional">
                  {{ h.isOptional ? 'Optional' : 'Mandatory' }}
                </span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                [class.past]="isPast(row.date)"></tr>
          </table>
        } @else {
          <div class="empty-state">
            <mat-icon>celebration</mat-icon>
            <p>No holidays configured yet</p>
            <span class="empty-hint">Holidays will appear here once added by HR.</span>
          </div>
        }
      </mat-card>
    </div>
  `,
  styles: [`
    .holidays {
      max-width: 900px;
      h1 { font-size: 26px; font-weight: 700; margin: 0 0 4px; color: var(--text-primary); letter-spacing: -0.02em; }
      .subtitle { color: var(--text-muted); margin: 0 0 24px; font-size: 14px; }
    }
    .full-width { width: 100%; }
    .holiday-name {
      display: flex; align-items: center; gap: 10px; font-weight: 600;
      mat-icon { color: #f59e0b; font-size: 20px; width: 20px; height: 20px; }
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
    .past { opacity: 0.45; }
    .empty-state {
      text-align: center; padding: 56px 16px; color: var(--text-muted);
      mat-icon { font-size: 56px; width: 56px; height: 56px; opacity: 0.4; }
      p { margin: 12px 0 4px; font-size: 15px; font-weight: 600; color: var(--text-secondary); }
    }
    .empty-hint { font-size: 13px; color: var(--text-muted); }
  `],
})
export class HolidaysComponent implements OnInit {
  holidays = signal<Holiday[]>([]);
  displayedColumns = ['name', 'date', 'day', 'type'];

  constructor(private mockData: MockDataService) {}

  ngOnInit(): void {
    this.mockData.mockGetHolidays().subscribe((res) => {
      this.holidays.set(res.data.sort((a, b) => a.date.localeCompare(b.date)));
    });
  }

  getDayName(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
  }

  isPast(dateStr: string): boolean {
    return new Date(dateStr) < new Date();
  }
}
