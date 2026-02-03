import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { CommonValidator } from '../../../shared/Validators/common.validators';
import { EmployeeService } from '../../../core/service/employee.service';
import { ToastService } from '../../../core/service/toast.service';
import { BlockCopyPasteDirective } from '../../../directives/block-copy-paste.directive'; // path adjust

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink,
    BlockCopyPasteDirective,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  hidePassword = true;
  hideConfirmPassword = true;
  private cdr = inject(ChangeDetectorRef);

  focusedField: string | null = null;
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private toast = inject(ToastService);

  registerForm: FormGroup<{
    regEmpName: FormControl<string | null>;
    regEmpCode: FormControl<string | null>;
    regEmpEmail: FormControl<string | null>;
    regEmpPhone: FormControl<string | null>;
    regEmpPassword: FormControl<string | null>;
    regConfirmPassword: FormControl<string | null>;
  }> = this.createForm();
  @ViewChild(FormGroupDirective)
  formDirective!: FormGroupDirective;
  private createForm(): FormGroup {
    return this.fb.group(
      {
        regEmpName: new FormControl<string | null>(null, [
          Validators.required,
          Validators.minLength(3),
          CommonValidator.empName,
        ]),
        regEmpCode: new FormControl<string | null>(
          null,
          [
            Validators.required,
            Validators.maxLength(10),
            CommonValidator.empCode,
          ],
          [
            CommonValidator.duplicateEmpCode(
              this.employeeService,
              '',
            ),
          ],
        ),
        regEmpEmail: new FormControl<string | null>(
          null,
          [Validators.required, CommonValidator.empEmail],
          [
            CommonValidator.duplicateEmpEmail(
              this.employeeService,
              '',
            ),
          ],
        ),
        regEmpPhone: new FormControl<string | null>(
          null,
          [
            Validators.required,
            Validators.minLength(10),
            CommonValidator.empPhone,
          ],
          [
            CommonValidator.duplicateEmpPhone(
              this.employeeService,
              '',
            ),
          ],
        ),
        regEmpPassword: new FormControl<string | null>(
          null,
          [
            Validators.required,
            Validators.minLength(8),
            CommonValidator.empPassword,
          ],
        ),
        regConfirmPassword: new FormControl<string | null>(
          null,
          [Validators.required],
        ),
      },
      {
        validators: CommonValidator.confirmPasswordMatch,
      },
    );
  }

  // Getters for template
  get regEmpName() {
    return this.registerForm.get('regEmpName');
  }
  get regEmpCode() {
    return this.registerForm.get('regEmpCode');
  }
  get regEmpEmail() {
    return this.registerForm.get('regEmpEmail');
  }
  get regEmpPhone() {
    return this.registerForm.get('regEmpPhone');
  }
  get regEmpPassword() {
    return this.registerForm.get('regEmpPassword');
  }
  get regConfirmPassword() {
    return this.registerForm.get('regConfirmPassword');
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const employeeData = this.registerForm.value as any;

    this.employeeService
      .addEmployee({
        empName: employeeData.regEmpName,
        empCode: employeeData.regEmpCode,
        empEmailId: employeeData.regEmpEmail,
        empPhoneno: employeeData.regEmpPhone,
        empPassword: employeeData.regEmpPassword,
      })
      .subscribe({
        next: () => {
          this.toast.showSuccess(
            'Employee registered successfully',
          );
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error: () =>
          this.toast.showError('Registration failed'),
      });
  }

  reset() {
    this.formDirective.resetForm();

    // this.registerForm.reset();
    this.hidePassword = true; // reset UI state
    this.hideConfirmPassword = true;
    this.cdr.detectChanges();
  }

  onlyNumbers(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');

    const phoneControl =
      this.registerForm.get('regEmpPhone');
    if (phoneControl) {
      phoneControl.setValue(input.value, {
        emitEvent: false,
      });
    }
  }
}
