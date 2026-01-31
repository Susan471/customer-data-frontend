// import { Directive, HostListener, ElementRef } from '@angular/core';
// import { FormGroupDirective, AbstractControl } from '@angular/forms';

// @Directive({
//   selector: '[appFocusFirstInvalid]',
//   standalone: true
// })
// export class FocusFirstInvalidDirective {

//   constructor(private formGroupDir: FormGroupDirective, private el: ElementRef) {}

//   @HostListener('submit')
//   onSubmit() {
//     this.focusNextInvalid();
//   }

//   private focusNextInvalid() {
//     const form = this.formGroupDir.form;
//     const invalidControls = this.getInvalidControls(form);

//     // Focus the first invalid field
//     if (invalidControls.length > 0) {
//       const firstInvalidName = invalidControls[0];
//       const firstInvalidElem = this.el.nativeElement.querySelector(
//         `[formControlName="${firstInvalidName}"]`
//       ) as HTMLElement;

//       firstInvalidElem?.focus();
//     }
//   }

//   private getInvalidControls(form: FormGroupDirective['form']): string[] {
//     const invalids: string[] = [];
//     Object.keys(form.controls).forEach(key => {
//       if (form.controls[key].invalid) {
//         invalids.push(key);
//       }
//     });
//     return invalids;
//   }
// }
