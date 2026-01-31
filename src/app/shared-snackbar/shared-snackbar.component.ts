import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { Component, Inject, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-shared-snackbar', // Your component selector
  standalone: true, // Required for standalone component
  imports: [CommonModule, MatButtonModule], // Needed Angular modules
  templateUrl: './shared-snackbar.component.html', // Template file
  styleUrls: ['./shared-snackbar.component.css'], // Styles file
})
export class SharedSnackbarComponent {
  private outsideClickEnabled = false;

  getTitle(): string {
    switch (this.data.type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'confirm':
        return 'Confirmation';
      default:
        return 'Notification';
    }
  }

  constructor(
    private snackBarRef: MatSnackBarRef<SharedSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA)
    public data: {
      message: string;
      onConfirm?: () => void;
      type?: 'success' | 'error' | 'warning' | 'confirm';
    },
    private elRef: ElementRef,
  ) {
    // Enable outside click detection after the view has initialized
    setTimeout(() => {
      this.outsideClickEnabled = true;
    });
  }

  confirm() {
    if (this.data.onConfirm) {
      this.data.onConfirm(); // directly call callback
    }
    this.snackBarRef.dismiss();
  }
  cancel() {
    this.snackBarRef.dismiss(); // Called when Cancel clicked
  }
  // --- Detect click outside ---
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.outsideClickEnabled) return; // <-- ignore first click that opened snackbar

    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.snackBarRef.dismiss();
    }
  }
}
