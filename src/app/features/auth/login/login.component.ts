import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ChangeDetectorRef } from '@angular/core';

/* ================== FORMS ================== */
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

/* ================== ANGULAR MATERIAL ================== */
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

/* ================== SERVICES ================== */

import { AuthService } from '../../../core/service/auth.service';
import { EmployeeService } from '../../../core/service/employee.service';
import { ToastService } from '../../../core/service/toast.service';

/* ================== VALIDATORS ================== */
import { CommonValidator } from '../../../shared/Validators/common.validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  @ViewChild(FormGroupDirective)
  formDirective!: FormGroupDirective;
  private cdr = inject(ChangeDetectorRef);
  // inject dependencies
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  hidePassword: boolean = true;
  focusedField: string | null = null;

  loginForm: FormGroup = this.createForm();

  private createForm(): FormGroup {
    return this.fb.group({
      loginEmpCode: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          CommonValidator.empCode,
        ],
      ],
      loginEmpPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          ),
        ],
      ],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { loginEmpCode, loginEmpPassword } =
      this.loginForm.value;

    this.employeeService
      .login(loginEmpCode, loginEmpPassword)
      .subscribe({
        next: (res) => {
          if (res.Success) {
            this.authService.setUsername(res.EmpName!);
            localStorage.setItem('EmpCode', res.EmpCode!);

            this.toast.showSuccess('Login Successful');

            //  Redirect to Register page
            this.router.navigate(['/employees']);
          }
        },
        error: (err) => {
          if (err.status === 401 || err.status === 400) {
            this.toast.showError(
              'Invalid username or password',
            );
          } else {
            console.error('Server error:', err);
            this.toast.showError(
              'Server error. Please try again.',
            );
          }
        },
      });
  }

  onCancel() {
    this.formDirective.resetForm();
    this.hidePassword = true;
    this.cdr.detectChanges();
  }

  get logForm() {
    return this.loginForm.controls;
  }
}
