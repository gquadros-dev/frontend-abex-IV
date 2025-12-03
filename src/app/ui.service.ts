// ui.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class UiService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, action = 'Fechar', duration = 3000) {
    this.snackBar.open(message, action, { duration });
  }
}
