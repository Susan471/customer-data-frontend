
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewChild } from '@angular/core';

/* ================== FORMS ================== */
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormGroupDirective } from '@angular/forms';

/* ================== ANGULAR MATERIAL ================== */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/* ================== SERVICES ================== */

import { EmployeeService } from '../../service/employee.service';
import { AuthService } from '../../service/auth.service';
import { ToastService } from '../../service/toast.service';

/* ================== VALIDATORS ================== */
import { CommonValidator } from '../../Validators/common.validators';

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
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  loginForm: FormGroup;
  hidePassword: boolean = true;
  focusedField: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private toast: ToastService,
  ) {
    this.loginForm = this.createForm();
  }
  private createForm(): FormGroup {
    return this.fb.group({
      loginEmpCode: ['', [Validators.required, Validators.maxLength(10), CommonValidator.empCode]],
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

    const { loginEmpCode, loginEmpPassword } = this.loginForm.value;

    this.employeeService.login(loginEmpCode, loginEmpPassword).subscribe({
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
          this.toast.showError('Invalid username or password');
        } else {
          console.error('Server error:', err);
          this.toast.showError('Server error. Please try again.');
        }
      },
    });
  }

  onCancel() {
    this.formDirective.resetForm();
  }

  get logForm() {
    return this.loginForm.controls;
  }
}
