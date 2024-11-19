import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AdminCreateManagerComponent } from './admin-create-manager/admin-create-manager.component';
import { AdminDeleteManagerComponent } from './admin-delete-manager/admin-delete-manager.component';
import { ManagerComponent } from './manager/manager.component';
import { ManagerCreateUserComponent } from './manager-createuser/manager-createuser.component';
import { ManagerDeleteUserComponent } from './manager-deleteuser/manager-deleteuser.component';
import { ManagerCreateGroupComponent } from './manager-creategroup/manager-creategroup.component';
import { ManagerUpdateGroupComponent } from './manager-updategroup/manager-updategroup.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './services/auth.guard';
import { UserCreateServiceComponent } from './user-createservice/user-createservice.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'create-manager', component: AdminCreateManagerComponent, canActivate: [AuthGuard] },
  { path: 'delete-manager', component: AdminDeleteManagerComponent, canActivate: [AuthGuard] },
  { path: 'manager', component: ManagerComponent, canActivate: [AuthGuard] },
  { path: 'create-user', component: ManagerCreateUserComponent, canActivate: [AuthGuard] },
  { path: 'delete-user', component: ManagerDeleteUserComponent, canActivate: [AuthGuard] },
  { path: 'create-group', component: ManagerCreateGroupComponent, canActivate: [AuthGuard] },
  { path: 'update-group', component: ManagerUpdateGroupComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'create-service', component: UserCreateServiceComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Import routes
  exports: [RouterModule], // Export RouterModule
})
export class AppRoutingModule {}
