import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { AdminComponent } from './app/admin/admin.component';
import { AdminCreateManagerComponent } from './app/admin-create-manager/admin-create-manager.component';
import { AdminDeleteManagerComponent } from './app/admin-delete-manager/admin-delete-manager.component';

import { ManagerComponent } from './app/manager/manager.component';
import { ManagerCreateUserComponent } from './app/manager-createuser/manager-createuser.component';
import { ManagerDeleteUserComponent } from './app/manager-deleteuser/manager-deleteuser.component';
import { ManagerCreateGroupComponent } from './app/manager-creategroup/manager-creategroup.component';
import { ManagerUpdateGroupComponent } from './app/manager-updategroup/manager-updategroup.component';

import { UserComponent } from './app/user/user.component';
import { UserCreateServiceComponent } from './app/user-createservice/user-createservice.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
  { path: 'create-manager', component: AdminCreateManagerComponent },
  { path: 'delete-manager', component: AdminDeleteManagerComponent },

  { path: 'manager', component: ManagerComponent },
  { path: 'create-user', component: ManagerCreateUserComponent },
  { path: 'delete-user', component: ManagerDeleteUserComponent },
  { path: 'create-group', component: ManagerCreateGroupComponent },
  { path: 'update-group', component: ManagerUpdateGroupComponent },

  { path: 'user', component: UserComponent },
  { path: 'create-service', component: UserCreateServiceComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserModule, HttpClientModule) 
  ]
});
