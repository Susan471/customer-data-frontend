import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
  Success: boolean;
  EmpName?: string;
  EmpCode?: string;
  Message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:8085/api/employees';

  constructor(private http: HttpClient) {}

  loginEmployee(empCode: string, empPassword: string): Observable<LoginResponse> {
    const loginData = { empCode, empPassword };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData);
  }
}
