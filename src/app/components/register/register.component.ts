import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormGroupDirective } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonValidator } from '../../Validators/common.validators';
import { EmployeeService } from '../../service/employee.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../service/toast.service';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  hidePassword = true;
  hideConfirmPassword = true;
  focusedField: string | null = null;

  registerForm: FormGroup<{
    regEmpName: FormControl<string | null>;
    regEmpCode: FormControl<string | null>;
    regEmpEmail: FormControl<string | null>;
    regEmpPhone: FormControl<string | null>;
    regEmpPassword: FormControl<string | null>;
    regConfirmPassword: FormControl<string | null>;
  }>;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.registerForm = this.createForm();
  }
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
          [Validators.required, Validators.maxLength(10), CommonValidator.empCode],
          [CommonValidator.duplicateEmpCode(this.employeeService, '')],
        ),
        regEmpEmail: new FormControl<string | null>(
          null,
          [Validators.required, CommonValidator.empEmail],
          [CommonValidator.duplicateEmpEmail(this.employeeService, '')],
        ),
        regEmpPhone: new FormControl<string | null>(
          null,
          [Validators.required, Validators.minLength(10), CommonValidator.empPhone],
          [CommonValidator.duplicateEmpPhone(this.employeeService, '')],
        ),
        regEmpPassword: new FormControl<string | null>(null, [
          Validators.required,
          Validators.minLength(8),
          CommonValidator.empPassword,
        ]),
        regConfirmPassword: new FormControl<string | null>(null, [Validators.required]),
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
          this.toast.showSuccess('Employee registered successfully');
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error: () => this.toast.showError('Registration failed'),
      });
  }

  onCancel() {
    this.formDirective.resetForm();
  }

  onlyNumbers(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '');
  }
}
