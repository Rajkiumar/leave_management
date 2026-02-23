import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-approval-action-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.action === 'reject' ? 'Reject' : 'Approve' }} Leave Request</h2>
    <mat-dialog-content>
      <p>Are you sure you want to {{ data.action }} the leave request from <strong>{{ data.employeeName }}</strong>?</p>
      @if (data.action === 'reject') {
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Reason for rejection</mat-label>
          <textarea matInput [(ngModel)]="comments" rows="3"
                    placeholder="Provide a reason for the rejection"></textarea>
        </mat-form-field>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button [color]="data.action === 'reject' ? 'warn' : 'primary'"
              (click)="confirm()" [disabled]="data.action === 'reject' && !comments.trim()">
        {{ data.action === 'reject' ? 'Reject' : 'Approve' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; }
    p { margin-bottom: 16px; color: var(--text-secondary); line-height: 1.6; }
    p strong { color: var(--text-primary); }
  `],
})
export class ApprovalActionDialogComponent {
  comments = '';

  constructor(
    public dialogRef: MatDialogRef<ApprovalActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeName: string; action: string }
  ) {}

  confirm(): void {
    this.dialogRef.close({ comments: this.comments });
  }
}
