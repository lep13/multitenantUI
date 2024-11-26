import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from '../../logout/logout.component';

@Component({
  selector: 'app-create-cloud-storage',
  standalone: true,
  imports: [FormsModule, CommonModule, LogoutComponent],
  templateUrl: './create-cloudstorage.component.html',
  styleUrl: './create-cloudstorage.component.scss'
})
export class CreateCloudStorageComponent {
  currentPage: string = 'create-cloud-storage';
  sessionId: string | null = null;
  bucketName: string = '';
  region: string = '';
  responseMessage: string | null = null;
  responseStatus: string | null = null;
  showLogoutPopup = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.sessionId = localStorage.getItem('sessionId');
    console.log('Session ID fetched on init:', this.sessionId);
  }

  createCloudStorage() {
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
      bucket_name: this.bucketName,
      region: this.region,
    };

    this.http
      .post<{ message: string }>('http://localhost:8080/user/create-cloud-storage', payload)
      .subscribe({
        next: (response) => {
          console.log('Cloud Storage Bucket created successfully:', response.message);
          this.responseMessage = response.message;
          this.responseStatus = 'success';
          this.finalizeSession('completed'); // Call finalizeSession if the creation was successful
        },
        error: (error) => {
          console.error('Error creating Cloud Storage Bucket:', error);
          this.responseMessage = error.error.message || 'An error occurred.';
          this.responseStatus = 'error';
        },
      });
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
        .post<{ message: string }>('http://localhost:8080/user/complete-session', payload)
        .subscribe({
          next: (response) => {
            console.log('Session finalized successfully:', response.message);
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
