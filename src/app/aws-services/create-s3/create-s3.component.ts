import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from '../../logout/logout.component';

@Component({
  selector: 'app-create-s3',
  standalone: true,
  imports: [FormsModule, CommonModule, LogoutComponent],
  templateUrl: './create-s3.component.html',
  styleUrl: './create-s3.component.scss'
})
export class CreateS3Component {
  currentPage: string = 'create-service';
  sessionId: string | null = null;
  bucketName: string = '';
  versioning: boolean | null = null;
  region: string = '';
  responseMessage: string | null = null;
  responseStatus: string | null = null;
  showLogoutPopup = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.sessionId = localStorage.getItem('sessionId');
    console.log('Session ID fetched on init:', this.sessionId);
  }

  createS3Bucket() {
    // Fetch session ID from localStorage dynamically
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
      versioning: this.versioning,
      region: this.region,
    };

    console.log(this.versioning, "ver");

    this.http
      .post<{ message: string }>('http://localhost:8080/user/create-s3-bucket', payload)
      .subscribe({
        next: (response) => {
          console.log('Bucket created successfully:', response.message);
          this.responseMessage = response.message;
          this.responseStatus = 'success';
          this.finalizeSession('completed'); // Call finalizeSession if the creation was successful
        },
        error: (error) => {
          console.error('Error creating bucket:', error);
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
