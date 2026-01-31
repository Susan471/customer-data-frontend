// src/app/services/employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, LoginResponse } from '../components/models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8085/api/employees';

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployeeByCode(empCode: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${empCode}`);
  }

  /* ---------- CREATE / ADD / REGISTER ---------- */
  addEmployee(empData: Employee): Observable<string> {
    // Backend will handle optional password
    return this.http.post(`${this.apiUrl}/addemployees`, empData, { responseType: 'text' });
  }

  /* ---------- EDIT / UPDATE EMPLOYEE ---------- */
  updateEmployee(id: number, empData: Employee): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, empData, { responseType: 'text' });
  }

  /* ---------- DELETE EMPLOYEE ---------- */
  deleteEmployee(empCode: string): Observable<string> {
    return this.http.delete(
      `${this.apiUrl}/code/${empCode}`, // assuming API uses empCode to identify

      { responseType: 'text' }
    );
  }

  /* ---------- LOGIN ---------- */
  login(empCode: string, empPassword: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { empCode, empPassword });
  }
  /* ---------- SAVE FILTER STATE ---------- */
  saveFilterState(payload: { filterState: object }) {
    return this.http.put('http://localhost:8085/api/filter/save', payload);
  }

  /* ---------- GET SAVE FILTER STATE ---------- */
   getSaveFilterStaet(){
    return this.http.get<any>('http://localhost:8085/api/filter/get');
   }
  /* ---------- DUPLICATE CHECKS ---------- */
  checkEmpCode(code: string, empCode: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/checkEmpCode/${code}?exclude=${empCode}`);
  }

  checkEmpPhone(phone: string, empCode: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/checkEmpPhoneno/${phone}?exclude=${empCode}`);
  }

  checkEmpEmail(email: string, empCode: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/checkEmpEmail/${email}?exclude=${empCode}`);
  }
}