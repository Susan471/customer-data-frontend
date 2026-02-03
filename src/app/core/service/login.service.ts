import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface LoginResponse {
  Success: boolean;
  EmpName?: string;
  EmpCode?: string;
  Message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8085/api/employees';

  private http = inject(HttpClient);

  loginEmployee(empCode: string, empPassword: string): Observable<LoginResponse> {
    const loginData = { empCode, empPassword };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData);
  }
}
