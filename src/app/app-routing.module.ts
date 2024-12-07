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
import { CreateEc2Component } from './aws-services/create-ec2/create-ec2.component';
import { CreateS3Component } from './aws-services/create-s3/create-s3.component';
import { CreateRdsComponent } from './aws-services/create-rds/create-rds.component';
import { CreateCloudFrontComponent } from './aws-services/create-cloudfront/create-cloudfront.component';
import { CreateVPCComponent } from './aws-services/create-vpc/create-vpc.component';
// import { CreateDynamoDBComponent } from './aws-services/create-dyanmodb/create-dyanmodb.component';
import { CreateComputeEngineComponent } from './gcp-services/create-computeengine/create-computeengine.component';
import { CreateCloudStorageComponent } from './gcp-services/create-cloudstorage/create-cloudstorage.component';
import { CreateGkeComponent } from './gcp-services/create-gke/create-gke.component';
import { CreateBigqueryComponent } from './gcp-services/create-bigquery/create-bigquery.component';
import { CreateCloudSqlComponent } from './gcp-services/create-cloud-sql/create-cloud-sql.component';
import { UserDeleteserviceComponent } from './user-deleteservice/user-deleteservice.component';
import { CreateLambdaComponent } from './aws-services/create-lambdap/create-lambdap.component';

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
  { path: 'create-amazon-ec2-elastic-compute-cloud', component: CreateEc2Component, canActivate: [AuthGuard]},
  { path: 'create-amazon-s3-simple-storage-service', component: CreateS3Component, canActivate: [AuthGuard]},
  { path: 'create-aws-lambda', component: CreateLambdaComponent, canActivate: [AuthGuard]},
  { path: 'create-amazon-rds-relational-database-service', component: CreateRdsComponent, canActivate: [AuthGuard]},
  { path: 'create-aws-cloudfront', component: CreateCloudFrontComponent, canActivate: [AuthGuard]},
  { path: 'create-amazon-vpc-virtual-private-cloud', component: CreateVPCComponent, canActivate: [AuthGuard]},
  // { path: 'create-amazon-dynamodb', component: CreateDynamoDBComponent, canActivate: [AuthGuard]},
  { path: 'create-compute-engine', component: CreateComputeEngineComponent, canActivate: [AuthGuard]},
  { path: 'create-cloud-storage', component: CreateCloudStorageComponent, canActivate: [AuthGuard]},
  { path: 'create-google-kubernetes-engine-gke', component: CreateGkeComponent, canActivate: [AuthGuard]},
  { path: 'create-bigquery', component: CreateBigqueryComponent, canActivate: [AuthGuard]},
  { path: 'create-cloud-sql', component: CreateCloudSqlComponent, canActivate: [AuthGuard]},

  { path: 'delete-service', component: UserDeleteserviceComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Import routes
  exports: [RouterModule], // Export RouterModule
})
export class AppRoutingModule {}
