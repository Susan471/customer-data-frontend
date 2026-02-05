import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private employeeUrl = `${environment.apiBaseUrl}`;
  private http = inject(HttpClient);

  loginEmployee(
    empCode: string,
    empPassword: string,
  ): Observable<LoginResponse> {
    const loginData = { empCode, empPassword };
    return this.http.post<LoginResponse>(
      `${this.employeeUrl}/login`,
      loginData,
    );
  }
}
