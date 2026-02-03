import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SharedSnackbarComponent } from '../../shared/shared-snackbar/shared-snackbar.component';

@Injectable({
  providedIn: 'root', // This makes it GLOBAL
})
export class ToastService {
  private snackBar = inject(MatSnackBar);
  showToast(
    message: string,
    type: 'success' | 'error' | 'warning',
  ) {
    this.snackBar.openFromComponent(
      SharedSnackbarComponent,
      {
        data: { message, type },
        duration: 1500,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['custom-toast-container'],
      },
    );
  }
  showConfirm(message: string, onConfirm: () => void) {
    this.snackBar.openFromComponent(
      SharedSnackbarComponent,
      {
        data: {
          message,
          type: 'confirm',
          onConfirm,
        },
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['custom-toast-container'],
      },
    );
  }

  showSuccess(msg: string) {
    this.showToast(msg, 'success');
  }
  showError(msg: string) {
    this.showToast(msg, 'error');
  }
  showWarning(msg: string) {
    this.showToast(msg, 'warning');
  }
}
