import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usernameSubject = new BehaviorSubject<
    string | null
  >(null);

  username$ = this.usernameSubject.asObservable();

  constructor() {
    // when app loads, try to get name from localStorage
    const savedName = localStorage.getItem('EmpName');
    if (savedName) {
      this.usernameSubject.next(savedName);
    }
  }

  setUsername(name: string) {
    localStorage.setItem('EmpName', name);
    this.usernameSubject.next(name);
  }

  getUsername() {
    return this.usernameSubject.value;
  }

  logout() {
    localStorage.removeItem('EmpName');
    this.usernameSubject.next(null);
  }
}
