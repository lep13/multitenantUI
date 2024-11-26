import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from '../../logout/logout.component';

@Component({
  selector: 'app-create-cloudfront',
  standalone: true,
  imports: [FormsModule, CommonModule, LogoutComponent],
  templateUrl: './create-cloudfront.component.html',
  styleUrl: './create-cloudfront.component.scss'
})
export class CreateCloudFrontComponent {
  currentPage: string = 'create-aws-cloudfront';
  sessionId: string | null = null;
  originDomainName: string = '';
  comment: string = '';
  region: string = '';
  minTTL: number | null = null;
  bucketName: string = '';
  responseMessage: string | null = null;
  responseStatus: string | null = null;
  showLogoutPopup = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.sessionId = localStorage.getItem('sessionId');
    console.log('Session ID fetched on init:', this.sessionId);
  }

  createCloudFront() {
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
      origin_domain_name: this.originDomainName,
      comment: this.comment,
      region: this.region,
      min_ttl: this.minTTL,
      bucket_name: this.bucketName,
    };

    this.http
      .post<{ message: string }>('http://localhost:8080/user/create-cloudfront-distribution', payload)
      .subscribe({
        next: (response) => {
          console.log('CloudFront Distribution created successfully:', response.message);
          this.responseMessage = response.message;
          this.responseStatus = 'success';
          this.finalizeSession('completed'); // Call finalizeSession if the creation was successful
        },
        error: (error) => {
          console.error('Error creating CloudFront distribution:', error);
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
