// src/app/services/employee.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Employee, LoginResponse } from '../employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeeUrl = `${environment.apiBaseUrl}/employees`;
  private filterUrl = `${environment.apiBaseUrl}/filter`;

  private http = inject(HttpClient);

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeeUrl);
  }

  getEmployeeByCode(empCode: string): Observable<Employee> {
    return this.http.get<Employee>(
      `${this.employeeUrl}/${empCode}`,
    );
  }

  /* ---------- CREATE / ADD / REGISTER ---------- */
  addEmployee(empData: Employee): Observable<string> {
    // Backend will handle optional password
    return this.http.post(
      `${this.employeeUrl}/addemployees`,
      empData,
      { responseType: 'text' },
    );
  }

  /* ---------- EDIT / UPDATE EMPLOYEE ---------- */
  updateEmployee(
    id: number,
    empData: Employee,
  ): Observable<string> {
    return this.http.put(
      `${this.employeeUrl}/${id}`,
      empData,
      { responseType: 'text' },
    );
  }

  /* ---------- DELETE EMPLOYEE ---------- */
  deleteEmployee(empCode: string): Observable<string> {
    return this.http.delete(
      `${this.employeeUrl}/code/${empCode}`, // assuming API uses empCode to identify

      { responseType: 'text' },
    );
  }

  /* ---------- LOGIN ---------- */
  login(
    empCode: string,
    empPassword: string,
  ): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.employeeUrl}/login`,
      { empCode, empPassword },
    );
  }
  /* ---------- SAVE FILTER STATE ---------- */
  saveFilterState(payload: { filterState: object }) {
    return this.http.put(`${this.filterUrl}/save`, payload);
  }

  /* ---------- GET SAVE FILTER STATE ---------- */
  getSaveFilterStaet() {
    return this.http.get<any>(`${this.filterUrl}/get`);
  }
  /* ---------- DUPLICATE CHECKS ---------- */
  checkEmpCode(
    code: string,
    empCode: string,
  ): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.employeeUrl}/checkEmpCode/${code}?exclude=${empCode}`,
    );
  }

  checkEmpPhone(
    phone: string,
    empCode: string,
  ): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.employeeUrl}/checkEmpPhoneno/${phone}?exclude=${empCode}`,
    );
  }

  checkEmpEmail(
    email: string,
    empCode: string,
  ): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.employeeUrl}/checkEmpEmail/${email}?exclude=${empCode}`,
    );
  }
}
