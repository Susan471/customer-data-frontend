import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonValidator } from '../../Validators/common.validators';
import { Router } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';

import { EmployeeService } from '../../service/employee.service';
import { HttpClientModule } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../service/auth.service';
import { ToastService } from '../../service/toast.service';

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
  addForm: FormGroup;

  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private toast: ToastService,
  ) {
    // STEP-1: create form with ONE control
    this.addForm = this.fb.group(
      {
        addEmpName: ['', [Validators.required, Validators.minLength(3), CommonValidator.empName]],
        addEmpCode: [
          '',
          [Validators.required, Validators.maxLength(10), CommonValidator.empCode],
          [CommonValidator.duplicateEmpCode(this.employeeService, '')],
        ],
        addEmpEmail: [
          '',
          [Validators.required, CommonValidator.empEmail],
          [CommonValidator.duplicateEmpEmail(this.employeeService, '')],
        ],
        addEmpPhone: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{10}$'), CommonValidator.empPhone],
          [CommonValidator.duplicateEmpPhone(this.employeeService, '')],
        ],
      },
      { updateOn: 'blur' },
    );
  }

  onlyNumbers(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');

    const phoneControl = this.addForm.get('addEmpPhone');
    if (phoneControl) {
      phoneControl.setValue(input.value, { emitEvent: false });
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

  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  onCancel() {
    this.formDirective.resetForm();
  }

  onSubmit() {
    if (this.addForm.invalid) {
      Object.keys(this.addForm.controls).forEach((field) => {
        const control = this.addForm.get(field);
        if (control) control.markAsTouched({ onlySelf: true });
      });
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
        this.toast.showSuccess('Employee registered successfully');

        setTimeout(() => {
          this.router.navigate(['/employees'], { state: { fromAdd: true } });
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
    this.router.navigate(['/employees'], { state: { fromAdd: true } });
  }

  // Navigate back to employees table
  closeForm() {
    this.router.navigate(['/employees']); // Adjust path if your employees table is at /emptable
  }
}
