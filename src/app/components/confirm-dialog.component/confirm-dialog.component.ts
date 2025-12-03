// confirm-dialog.component.ts
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatDialogContent, MatDialogActions, MatDialogTitle],
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirmação</h2>
    <mat-dialog-content>
      Deseja realmente excluir <b>{{data.nome}}</b>?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancelar</button>
      <button mat-button color="warn" (click)="dialogRef.close(true)">Excluir</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
