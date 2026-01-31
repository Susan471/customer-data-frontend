// src/app/models/employee.model.ts

export interface Employee {
  id?:number,
  empName: string;
  empCode?: string;
  empEmailId: string;
  empPhoneno: string;
  empPassword?: string; // optional for Add/Edit
}

export interface LoginResponse {
  Success: boolean;
  EmpName?: string;
  EmpCode?: string;
  Message?: string;
}
