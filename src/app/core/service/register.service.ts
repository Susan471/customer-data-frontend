// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// import { environment } from '../../environments/environment';

// @Injectable({
//   providedIn: 'root',
// })
// export class RegisterService {
//   // private employeeUrll = 'http://localhost:8085/api/employees';
//   private employeeUrl = `${environment.apiBaseUrl}/employees`;

//   constructor(private http: HttpClient) {}

//   // Register new employee
//   registerEmployee(empData: any): Observable<string> {
//     return this.http.post(
//       `${this.employeeUrl}/addemployees`,
//       empData,
//       { responseType: 'text' }, // backend returns plain text
//     );
//   }

//   // Check if Employee Code already exists
//   checkEmpCode(code: string): Observable<boolean> {
//     return this.http.get<boolean>(`${this.employeeUrl}/checkEmpCode/${code}`);
//   }

//   // Check if Employee Phone already exists
//   checkEmpPhone(phone: string): Observable<boolean> {
//     return this.http.get<boolean>(`${this.employeeUrl}/checkEmpPhoneno/${phone}`);
//   }

//   // Check if Employee Email already exists
//   checkEmpEmail(email: string): Observable<boolean> {
//     return this.http.get<boolean>(`${this.employeeUrl}/checkEmpEmail/${email}`);
//   }
// }
