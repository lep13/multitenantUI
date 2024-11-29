import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from '../../logout/logout.component';

@Component({
  selector: 'app-create-cloud-sql',
  standalone: true,
  imports: [FormsModule, CommonModule, LogoutComponent],
  templateUrl: './create-cloud-sql.component.html',
  styleUrl: './create-cloud-sql.component.scss'
})
export class CreateCloudSqlComponent {
  currentPage: string = 'create-cloud-sql';
  sessionId: string | null = null;
  instanceName: string = '';
  region: string = '';
  tier: string = '';
  databaseVersion: string = '';
  responseMessage: string | null = null;
  responseStatus: string | null = null;
  showModal: boolean = false;
  showLogoutPopup = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.sessionId = localStorage.getItem('sessionId');
    console.log('Session ID fetched on init:', this.sessionId);
  }

  createCloudSQLInstance() {
    if (!this.sessionId) {
      this.sessionId = localStorage.getItem('sessionId');
    }

    if (!this.sessionId) {
      console.error('Session ID is missing.');
      this.responseMessage = 'Session ID is missing.';
      this.responseStatus = 'error';
      this.showModal = true;
      return;
    }

    const payload = {
      session_id: this.sessionId,
      instance_name: this.instanceName,
      region: this.region,
      tier: this.tier,
      database_version: this.databaseVersion,
    };

    this.http
      .post<{ message: string }>('http://localhost:8080/user/create-cloud-SQL', payload)
      .subscribe({
        next: (response) => {
          console.log('Cloud SQL Instance created successfully:', response.message);
          this.responseMessage = response.message;
          this.responseStatus = 'success';
          this.showModal = true;
        },
        error: (error) => {
          console.error('Error creating Cloud SQL Instance:', error);
          this.responseMessage = error.error.message || 'An error occurred.';
          this.responseStatus = 'error';
          this.showModal = true;
        },
      });
  }

  handleModalOk() {
    if (this.responseStatus === 'success') {
      this.finalizeSession('completed');
    }
    this.showModal = false;
  }

    // Finalize the session
    finalizeSession(status: string) {
      if (!this.sessionId) {
        console.error('Session ID is missing. Cannot finalize session.');
        return;
      }
    
      const payload = {
        session_id: this.sessionId,
        status: status,
      };

      
    
      this.http
        .post('http://localhost:8080/user/complete-session', payload, { responseType: 'text' }) // Set responseType to 'text'
        .subscribe({
          next: (response) => {
            console.log('Session finalized successfully:', response);
            // Handle success here if needed
          },
          error: (error) => {
            console.error('Error finalizing session:', error);
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
