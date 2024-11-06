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

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
  { path: 'create-manager', component: AdminCreateManagerComponent },
  { path: 'delete-manager', component: AdminDeleteManagerComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserModule, HttpClientModule) 
  ]
});
