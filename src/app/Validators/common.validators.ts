import { AbstractControl, ValidationErrors } from '@angular/forms';

import { Observable, map, of } from 'rxjs';
import { RegisterService } from '../service/register.service';
import { EmployeeService } from '../service/employee.service';

export class CommonValidator {
  static empName(control: AbstractControl) {
    const value = control.value;

    if (!value) return null;

    const trimmed = value.trim();

    const errors: any = {};

    //  Starts with number
    if (/^[0-9]/.test(trimmed)) {
      errors.startsWithNumber = true;
    }

    // Contains number anywhere
    if (/[0-9]/.test(trimmed)) {
      errors.containsNumber = true;
    }

    //  Contains special characters
    if (/[^a-zA-Z\s]/.test(trimmed)) {
      errors.specialChar = true;
    }

    // Minimum length check (optional extra)
    if (trimmed.length < 3) {
      errors.minlength = true;
    }

    return Object.keys(errors).length ? errors : null;
  }

  static empCode(control: AbstractControl) {
    const value = control.value;

    if (!value) {
      return null;
    }
    const trimmedValue = value.trim();
    const pattern = /^[A-Za-z]+[0-9]+[A-Za-z0-9]*$/;

    return pattern.test(trimmedValue) ? null : { empCodeInvalid: true };
  }

  static empPhone(control: AbstractControl) {
    const value = control.value;

    // IMPORTANT: Stop if empty
    if (!value) return null;

    const trimmed = value.toString().trim(); // safe conversion
    const pattern = /^[0-9]{10}$/;

    return pattern.test(trimmed) ? null : { empPhoneInvalid: true };
  }

  static empEmail(control: AbstractControl) {
    const value = control.value;
    if (!value) {
      return null;
    }
    const trimmedValue = value.trim();
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

    return pattern.test(trimmedValue) ? null : { empEmailInvalid: true };
  }
  static empPassword(control: AbstractControl) {
    const value = control.value;
    if (!value) {
      return null;
    }
    const trimmedValue = value.trim();
    const errors:any={}
    if (trimmedValue.length < 8) {
    errors.minLength = true;
  }
  if (!/[A-Z]/.test(trimmedValue)) {
    errors.noUppercase = true;
  }
  if (!/[a-z]/.test(trimmedValue)) {
    errors.noLowercase = true;
  }
  if (!/[0-9]/.test(trimmedValue)) {
    errors.noNumber = true;
  }
  if (!/[@$!%*?&#]/.test(trimmedValue)) {
    errors.noSpecialChar = true;
  }

  return Object.keys(errors).length ? errors : null;
}
  
  static confirmPasswordMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get('regEmpPassword');
    const confirm = group.get('regConfirmPassword');

    if (!password || !confirm) return null;

    // preserve other errors
    const errors = confirm.errors || {};

    if (password.value !== confirm.value) {
      confirm.setErrors({ ...errors, passwordMismatch: true });
    } else {
      if (errors['passwordMismatch']) {
        delete errors['passwordMismatch'];
        confirm.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
    return null;
  }

  static duplicateEmpCode(employeeService: EmployeeService, currentEmpCode: string) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value?.trim();

      return employeeService
        .checkEmpCode(value, currentEmpCode)
        .pipe(map((exists: boolean) => (exists ? { empCodeDuplicate: true } : null)));
    };
  }

  // Check Employee Phone Duplicate
  static duplicateEmpPhone(employeeService: EmployeeService, currentEmpCode: string) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value?.trim();
      if (!value) return of(null);

      return employeeService
        .checkEmpPhone(value, currentEmpCode)
        .pipe(map((exists) => (exists ? { empPhoneDuplicate: true } : null)));
    };
  }

  // Check Employee Email Duplicate
  static duplicateEmpEmail(employeeService: EmployeeService, currentEmpCode: string) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value?.trim();
      if (!value) return of(null);

      return employeeService
        .checkEmpEmail(value, currentEmpCode)
        .pipe(map((exists) => (exists ? { empEmailDuplicate: true } : null)));
    };
  }
}
