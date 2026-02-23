import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MockDataService } from '../../../core/services/mock-data.service';
import { LeaveCalendarEntry, Holiday } from '../../../core/models';
import { STATUS_COLORS, LEAVE_TYPE_COLORS } from '../../../core/constants/app.constants';

interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  entries: LeaveCalendarEntry[];
  holiday?: Holiday;
}

@Component({
  selector: 'app-leave-calendar',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, MatTooltipModule],
  template: `
    <div class="leave-calendar">
      <div class="page-header">
        <div>
          <h1>Leave Calendar</h1>
          <p class="subtitle">Team leave overview and holidays</p>
        </div>
      </div>

      <mat-card>
        <mat-card-content>
          <!-- Calendar Navigation -->
          <div class="calendar-nav">
            <button mat-icon-button (click)="previousMonth()">
              <mat-icon>chevron_left</mat-icon>
            </button>
            <h2>{{ getMonthName() }} {{ currentYear() }}</h2>
            <button mat-icon-button (click)="nextMonth()">
              <mat-icon>chevron_right</mat-icon>
            </button>
            <button mat-button (click)="goToToday()">Today</button>
          </div>

          <!-- Calendar Grid -->
          <div class="calendar-grid">
            <div class="weekday-header">
              @for (day of weekDays; track day) {
                <div class="weekday">{{ day }}</div>
              }
            </div>
            <div class="days-grid">
              @for (day of calendarDays(); track day.date.toISOString()) {
                <div class="day-cell"
                     [class.other-month]="!day.isCurrentMonth"
                     [class.today]="day.isToday"
                     [class.weekend]="day.isWeekend"
                     [class.has-holiday]="day.holiday">
                  <span class="day-number">{{ day.dayOfMonth }}</span>
                  @if (day.holiday) {
                    <div class="holiday-marker" [matTooltip]="day.holiday.name">
                      <mat-icon>celebration</mat-icon>
                      <span class="holiday-name">{{ day.holiday.name }}</span>
                    </div>
                  }
                  @for (entry of day.entries.slice(0, 2); track entry.employeeId) {
                    <div class="leave-marker"
                         [style.background]="getLeaveColor(entry.leaveType)"
                         [matTooltip]="entry.employeeName + ' - ' + entry.leaveType">
                      {{ getInitials(entry.employeeName) }}
                    </div>
                  }
                  @if (day.entries.length > 2) {
                    <span class="more-count">+{{ day.entries.length - 2 }} more</span>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Legend -->
          <div class="legend">
            <div class="legend-item">
              <div class="legend-color legend-today"></div>
              <span>Today</span>
            </div>
            <div class="legend-item">
              <div class="legend-color legend-holiday"></div>
              <span>Holiday</span>
            </div>
            <div class="legend-item">
              <div class="legend-color legend-annual"></div>
              <span>Annual</span>
            </div>
            <div class="legend-item">
              <div class="legend-color legend-sick"></div>
              <span>Sick</span>
            </div>
            <div class="legend-item">
              <div class="legend-color legend-casual"></div>
              <span>Casual</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .leave-calendar {
      max-width: 1100px;
      h1 { font-size: 26px; font-weight: 700; margin: 0 0 4px; color: var(--text-primary); letter-spacing: -0.02em; }
      .subtitle { color: var(--text-muted); margin: 0; font-size: 14px; }
    }
    .page-header { margin-bottom: 24px; }
    .calendar-nav {
      display: flex; align-items: center; gap: 8px; margin-bottom: 20px;
      h2 { margin: 0; font-size: 18px; font-weight: 700; min-width: 200px; text-align: center; color: var(--text-primary); }
    }
    .calendar-grid { border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; }
    .weekday-header {
      display: grid; grid-template-columns: repeat(7, 1fr);
      background: var(--bg-body);
    }
    .weekday {
      padding: 10px; text-align: center; font-weight: 600;
      font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em;
    }
    .days-grid { display: grid; grid-template-columns: repeat(7, 1fr); }
    .day-cell {
      min-height: 90px; padding: 6px; border: 1px solid var(--border-light);
      position: relative; overflow: hidden; transition: background 0.15s;
    }
    .day-cell:hover { background: rgba(79, 70, 229, 0.02); }
    .day-cell.other-month { background: rgba(0,0,0,0.02); }
    .day-cell.other-month .day-number { color: var(--text-muted); }
    .day-cell.today { background: var(--brand-lighter); }
    .day-cell.weekend { background: rgba(0,0,0,0.02); }
    .day-cell.has-holiday { background: rgba(245,158,11,0.06); }

    :host-context(body.dark-theme) {
      .day-cell:hover { background: rgba(99,102,241,0.06); }
      .day-cell.other-month { background: rgba(255,255,255,0.02); }
      .day-cell.weekend { background: rgba(255,255,255,0.02); }
      .day-cell.has-holiday { background: rgba(245,158,11,0.08); }
      .calendar-grid { border-color: var(--border); }
      .day-cell { border-color: var(--border); }
    }
    .day-number { font-size: 12.5px; font-weight: 600; color: var(--text-secondary); }
    .day-cell.today .day-number {
      background: var(--brand); color: white; width: 22px; height: 22px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%; font-size: 11px;
    }
    .holiday-marker {
      display: flex; align-items: center; gap: 2px;
      font-size: 10px; color: #d97706; margin-top: 2px;
      mat-icon { font-size: 12px; width: 12px; height: 12px; }
    }
    .holiday-name {
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px;
    }
    .leave-marker {
      display: inline-block; padding: 1px 6px; border-radius: var(--radius-full);
      font-size: 10px; color: white; font-weight: 600; margin-top: 2px;
      white-space: nowrap;
    }
    .more-count { font-size: 10px; color: var(--text-muted); display: block; margin-top: 2px; }
    .legend {
      display: flex; gap: 20px; margin-top: 16px; flex-wrap: wrap;
      padding: 12px 0;
    }
    .legend-item {
      display: flex; align-items: center; gap: 6px; font-size: 12px;
      color: var(--text-secondary); font-weight: 500;
    }
    .legend-color { width: 12px; height: 12px; border-radius: 4px; }
    .legend-today   { background: #e3f2fd; }
    .legend-holiday { background: #fff3e0; }
    .legend-annual  { background: #4CAF50; }
    .legend-sick    { background: #F44336; }
    .legend-casual  { background: #2196F3; }

    :host-context(body.dark-theme) {
      .legend-today   { background: rgba(99,102,241,0.2); }
      .legend-holiday { background: rgba(245,158,11,0.2); }
    }
  `],
})
export class LeaveCalendarComponent implements OnInit {
  currentMonth = signal(new Date().getMonth());
  currentYear = signal(new Date().getFullYear());
  calendarDays = signal<CalendarDay[]>([]);
  entries = signal<LeaveCalendarEntry[]>([]);
  holidays = signal<Holiday[]>([]);

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(private mockData: MockDataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  getMonthName(): string {
    return new Date(this.currentYear(), this.currentMonth()).toLocaleString('default', { month: 'long' });
  }

  previousMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.update((y) => y - 1);
    } else {
      this.currentMonth.update((m) => m - 1);
    }
    this.buildCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.update((y) => y + 1);
    } else {
      this.currentMonth.update((m) => m + 1);
    }
    this.buildCalendar();
  }

  goToToday(): void {
    this.currentMonth.set(new Date().getMonth());
    this.currentYear.set(new Date().getFullYear());
    this.buildCalendar();
  }

  getLeaveColor(type: string): string {
    return (LEAVE_TYPE_COLORS as Record<string, string>)[type] || '#607D8B';
  }

  getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2);
  }

  private loadData(): void {
    this.mockData.mockGetCalendarEntries().subscribe((res) => {
      this.entries.set(res.data);
      this.mockData.mockGetHolidays().subscribe((hRes) => {
        this.holidays.set(hRes.data);
        this.buildCalendar();
      });
    });
  }

  private buildCalendar(): void {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: CalendarDay[] = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split('T')[0];
      const dayEntries = this.entries().filter((e) => e.date === dateStr);
      const holiday = this.holidays().find((h) => h.date === dateStr);

      days.push({
        date: new Date(current),
        dayOfMonth: current.getDate(),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.getTime() === today.getTime(),
        isWeekend: current.getDay() === 0 || current.getDay() === 6,
        entries: dayEntries,
        holiday,
      });

      current.setDate(current.getDate() + 1);
    }

    this.calendarDays.set(days);
  }
}
