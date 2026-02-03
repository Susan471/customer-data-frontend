import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appBlockCopyPaste]',
  standalone: true,
})
export class BlockCopyPasteDirective {
  @HostListener('paste', ['$event']) onPaste(
    e: ClipboardEvent,
  ) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) onCopy(
    e: ClipboardEvent,
  ) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) onCut(
    e: ClipboardEvent,
  ) {
    e.preventDefault();
  }
}
