import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from '../../logout/logout.component';

@Component({
  selector: 'app-create-rds',
  standalone: true,
  imports: [FormsModule, CommonModule, LogoutComponent],
  templateUrl: './create-rds.component.html',
  styleUrl: './create-rds.component.scss'
})
export class CreateRdsComponent {
  currentPage: string = 'create-amazon-rds-relational-database-service';
  sessionId: string | null = null;
  dbName: string = '';
  instanceId: string = '';
  instanceClass: string = '';
  engine: string = '';
  username: string = '';
  password: string = '';
  allocatedStorage: number | null = null;
  subnetGroupName: string = '';
  responseMessage: string | null = null;
  responseStatus: string | null = null;
  showLogoutPopup = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.sessionId = localStorage.getItem('sessionId');
    console.log('Session ID fetched on init:', this.sessionId);
  }

  createRDSInstance() {
    // Fetch session ID dynamically from localStorage
    if (!this.sessionId) {
      this.sessionId = localStorage.getItem('sessionId');
    }

    if (!this.sessionId) {
      console.error('Session ID is missing.');
      this.responseMessage = 'Session ID is missing.';
      this.responseStatus = 'error';
      return;
    }

    const payload = {
      session_id: this.sessionId,
      db_name: this.dbName,
      instance_id: this.instanceId,
      instance_class: this.instanceClass,
      engine: this.engine,
      username: this.username,
      password: this.password,
      allocated_storage: this.allocatedStorage,
      subnet_group_name: this.subnetGroupName,
    };

    this.http
      .post<{ message: string }>('http://localhost:8080/user/create-rds-instance', payload)
      .subscribe({
        next: (response) => {
          console.log('RDS Instance created successfully:', response.message);
          this.responseMessage = response.message;
          this.responseStatus = 'success';
        },
        error: (error) => {
          console.error('Error creating RDS instance:', error);
          this.responseMessage = error.error.message || 'An error occurred.';
          this.responseStatus = 'error';
        },
      });
  }

  navigateToDashboard() {
    this.router.navigate(['/user']);
  }

  navigateToCreateService() {
    this.router.navigate(['/create-service']);
  }

  navigateToDeleteService() {
    this.router.navigate(['/delete-service']);
  }

  toggleLogoutPopup() {
    this.showLogoutPopup = !this.showLogoutPopup;
  }

  handleLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
