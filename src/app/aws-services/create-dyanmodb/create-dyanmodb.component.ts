import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from '../../logout/logout.component';

@Component({
  selector: 'app-create-dyanmodb',
  standalone: true,
  imports: [FormsModule, CommonModule, LogoutComponent],
  templateUrl: './create-dyanmodb.component.html',
  styleUrl: './create-dyanmodb.component.scss'
})
export class CreateDynamoDBComponent {
  currentPage: string = 'create-amazon-dynamodb';
  sessionId: string | null = null;
  tableName: string = '';
  region: string = '';
  readCapacity: number | null = null;
  writeCapacity: number | null = null;
  responseMessage: string | null = null;
  responseStatus: string | null = null;
  showModal: boolean = false;
  showLogoutPopup = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.sessionId = localStorage.getItem('sessionId');
    console.log('Session ID fetched on init:', this.sessionId);
  }

  createDynamoDB() {
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
      table_name: this.tableName,
      region: this.region,
      read_capacity: this.readCapacity,
      write_capacity: this.writeCapacity,
    };

    this.http
      .post<{ message: string }>('http://localhost:8080/user/create-dynamodb-table', payload)
      .subscribe({
        next: (response) => {
          console.log('DynamoDB Table created successfully:', response.message);
          this.responseMessage = response.message;
          this.responseStatus = 'success';
          this.showModal = true;
        },
        error: (error) => {
          console.error('Error creating DynamoDB Table:', error);
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
