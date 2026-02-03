// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AddComponent } from './features/employees/add/add.component';
import { EmployeetableComponent } from './features/employees/employeetable/employeetable.component';
import { EditComponent } from './features/employees/edit/edit.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'employees', component: EmployeetableComponent },
  { path: 'add', component: AddComponent },
  { path: 'edit/:empCode', component: EditComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
