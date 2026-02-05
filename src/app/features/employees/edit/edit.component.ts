import { Component, OnInit } from '@angular/core';

import { inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CommonValidator } from '../../../shared/Validators/common.validators';

import { MatTooltip } from '@angular/material/tooltip';
import { EmployeeService } from '../../../core/service/employee.service';
import { Employee } from '../../../core/models/models/employee.model';

import { HttpClientModule } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../core/service/toast.service';

import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-edit',
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
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  empCode!: string;
  id!: number;
  username: string | null = '';
  focusedField: string | null = null;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  editForm: FormGroup = this.fb.group(
    {
      editEmpName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          CommonValidator.empName,
        ],
      ],
      editEmpCode: [{ value: '', disabled: true }],
      editEmpEmail: [
        '',
        [Validators.required, CommonValidator.empEmail],
      ],
      editEmpPhone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$'),
          CommonValidator.empPhone,
        ],
      ],
    },
    { updateOn: 'blur' },
  );

  ngOnInit(): void {
    this.empCode =
      this.route.snapshot.paramMap.get('empCode')!; //read value from url
    console.log('EmpCode from Url:', this.empCode);

    this.authService.username$.subscribe((name) => {
      this.username = name;
    });

    this.loadEmployee();
  }

  loadEmployee(): void {
    this.employeeService
      .getEmployeeByCode(this.empCode)
      .subscribe({
        next: (data: Employee) => {
          this.id = data.id!;

          // Patch form with fetched data
          this.editForm.patchValue({
            editEmpCode: data.empCode,
            editEmpName: data.empName,
            editEmpPhone: data.empPhoneno,
            editEmpEmail: data.empEmailId,
          });
        },
        error: (err) => {
          console.error(
            'Failed to fetch Employee data',
            err,
          );
          console.log('Backend message:', err.error);
        },
      });
  }

  // Navigate back to employees table
  closeForm() {
    this.router.navigate(['/employees']); // Adjust path if your employees table is at /emptable
  }

  onSubmit() {
    if (this.editForm.invalid) {
      console.log('Form is Invalid');
      return;
    }

    const payload = this.editForm.getRawValue(); //it returns all fields includes disabled fields also

    // Map Angular form to backend DTO
    const empDTO = {
      id: this.id, // include the ID
      empCode: payload.editEmpCode,
      empName: payload.editEmpName,
      empEmailId: payload.editEmpEmail,
      empPhoneno: payload.editEmpPhone,
      empPassword: undefined, // <-- match DTO
    };

    console.log('Sending to backend:', empDTO);

    // Call backend API
    this.employeeService
      .updateEmployee(this.id, empDTO)
      .subscribe({
        next: (res) => {
          console.log('Backend response:', res);
          this.toast.showSuccess(
            'Employee edited successfully',
          );

          const loggedInEmpCode =
            localStorage.getItem('EmpCode');
          if (empDTO.empCode === loggedInEmpCode) {
            this.authService.setUsername(empDTO.empName);
            console.log(
              'Header username updated to:',
              empDTO.empName,
            );
          }

          setTimeout(() => {
            this.router.navigate(['/employees']);
          }, 1500);
        },

        error: (err) => {
          console.error('Backend error:', err);
          this.toast.showError(
            'Unable to connect to server',
          );
        },
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  getBack() {
    this.router.navigate(['/employees'], {
      state: { fromAdd: true },
    });
  }

  // helper getter
  get editedForm() {
    return this.editForm.controls;
  }
  onlyNumbers(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');

    const phoneControl = this.editForm.get('editEmpPhone');
    if (phoneControl) {
      phoneControl.setValue(input.value, {
        emitEvent: false,
      });
    }
  }
}
