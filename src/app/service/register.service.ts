import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'http://localhost:8085/api/employees';

  constructor(private http: HttpClient) {}

  // Register new employee
  registerEmployee(empData: any): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/addemployees`,
      empData,
      { responseType: 'text' }  // backend returns plain text
    );
  }

  // Check if Employee Code already exists
  checkEmpCode(code: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/checkEmpCode/${code}`);
  }

  // Check if Employee Phone already exists
  checkEmpPhone(phone: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/checkEmpPhoneno/${phone}`);
  }

  // Check if Employee Email already exists
  checkEmpEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/checkEmpEmail/${email}`);
  }
}
