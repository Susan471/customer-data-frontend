// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AddComponent } from './components/add/add.component';
import { EmployeetableComponent } from './components/employeetable/employeetable.component';
import { EditComponent } from './components/edit/edit.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'employees', component: EmployeetableComponent },
  { path: 'add', component: AddComponent },
  { path: 'edit/:empCode', component: EditComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
