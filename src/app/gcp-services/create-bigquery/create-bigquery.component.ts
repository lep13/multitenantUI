import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from '../../logout/logout.component';

@Component({
  selector: 'app-create-bigquery',
  standalone: true,
  imports: [FormsModule, CommonModule, LogoutComponent],
  templateUrl: './create-bigquery.component.html',
  styleUrl: './create-bigquery.component.scss'
})
export class CreateBigqueryComponent {
  currentPage: string = 'create-bigquery';
  sessionId: string | null = null;
  datasetId: string = '';
  region: string = '';
  responseMessage: string | null = null;
  responseStatus: string | null = null;
  showModal: boolean = false;
  showLogoutPopup = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.sessionId = localStorage.getItem('sessionId');
    console.log('Session ID fetched on init:', this.sessionId);
  }

  createBigQueryDataset() {
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
      dataset_id: this.datasetId,
      region: this.region,
    };

    this.http
      .post<{ message: string }>('http://localhost:8080/user/create-bigquery-dataset', payload)
      .subscribe({
        next: (response) => {
          console.log('BigQuery Dataset created successfully:', response.message);
          this.responseMessage = response.message;
          this.responseStatus = 'success';
          this.showModal = true;
        },
        error: (error) => {
          console.error('Error creating BigQuery Dataset:', error);
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
