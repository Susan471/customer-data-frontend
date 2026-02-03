import { Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CommonValidator } from '../../../shared/Validators/common.validators';

import { HttpClientModule } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { EmployeeService } from '../../../core/service/employee.service';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/service/auth.service';
import { ToastService } from '../../../core/service/toast.service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltip,
    HttpClientModule,
  ],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private employeeService = inject(EmployeeService);
  private toast = inject(ToastService);

  // STEP-1: create form with ONE control

  addForm: FormGroup = this.fb.group(
    {
      addEmpName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          CommonValidator.empName,
        ],
      ],
      addEmpCode: [
        '',
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
      ],
      addEmpEmail: [
        '',
        [Validators.required, CommonValidator.empEmail],
        [
          CommonValidator.duplicateEmpEmail(
            this.employeeService,
            '',
          ),
        ],
      ],
      addEmpPhone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$'),
          CommonValidator.empPhone,
        ],
        [
          CommonValidator.duplicateEmpPhone(
            this.employeeService,
            '',
          ),
        ],
      ],
    },
    { updateOn: 'blur' },
  );

  onlyNumbers(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');

    const phoneControl = this.addForm.get('addEmpPhone');
    if (phoneControl) {
      phoneControl.setValue(input.value, {
        emitEvent: false,
      });
    }
  }

  // set username above logout button
  username: string | null = '';
  //form input box border highlight..
  focusedField: string | null = null;

  ngOnInit() {
    this.authService.username$.subscribe((name) => {
      this.username = name;
    });
  }

  @ViewChild(FormGroupDirective)
  formDirective!: FormGroupDirective;
  onCancel() {
    this.formDirective.resetForm();
  }

  onSubmit() {
    if (this.addForm.invalid) {
      Object.keys(this.addForm.controls).forEach(
        (field) => {
          const control = this.addForm.get(field);
          if (control)
            control.markAsTouched({ onlySelf: true });
        },
      );
      console.log('Form is Invalid');
      return;
    }

    // Map Angular form to backend object
    const emp = {
      empName: this.addForm.value.addEmpName,
      empCode: this.addForm.value.addEmpCode,
      empEmailId: this.addForm.value.addEmpEmail,
      empPhoneno: this.addForm.value.addEmpPhone,
    };

    console.log('Sending to backend:', emp);

    //  Call backend API
    this.employeeService.addEmployee(emp).subscribe({
      next: (res) => {
        console.log('Backend response:', res);
        this.toast.showSuccess(
          'Employee registered successfully',
        );

        setTimeout(() => {
          this.router.navigate(['/employees'], {
            state: { fromAdd: true },
          });
        }, 2000);
      },

      error: (err) => {
        console.error('Backend error:', err);
        this.toast.showError('Unable to connect to server');
      },
    });
  }

  //logout

  logout() {
    this.authService.logout(); // clear username & empcode
    this.router.navigate(['/login']);
  }

  // helper getter
  get addedForm() {
    return this.addForm.controls;
  }
  //Back to emptable
  getBack() {
    this.router.navigate(['/employees'], {
      state: { fromAdd: true },
    });
  }

  // Navigate back to employees table
  closeForm() {
    this.router.navigate(['/employees']); // Adjust path if your employees table is at /emptable
  }
}
