import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from '../../logout/logout.component';

@Component({
  selector: 'app-create-lambda',
  standalone: true,
  imports: [FormsModule, CommonModule, LogoutComponent],
  templateUrl: './create-lambdap.component.html',
  styleUrl: './create-lambdap.component.scss'
})
export class CreateLambdaComponent {

  currentPage: string = 'create-lambda';
  sessionId: string | null = null;
  functionName: string = '';
  handler: string = '';
  runtime: string = '';
  zipFilePath: string = ''; // Provide the zip file path as a string
  region: string = '';
  responseMessage: string | null = null;
  responseStatus: string | null = null;
  showModal: boolean = false;
  showLogoutPopup = false;
  zipTouched: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.sessionId = localStorage.getItem('sessionId');
    if (!this.sessionId) {
      console.error('Session ID is missing.');
    }
  }


  createLambdaFunction() {
    if (!this.sessionId || !this.zipFilePath) {
      this.responseMessage = 'Session ID or ZIP file path is missing.';
      this.responseStatus = 'error';
      this.showModal = true;
      return;
    }

    const payload = {
      session_id: this.sessionId,
      function_name: this.functionName,
      handler: this.handler,
      runtime: this.runtime,
      zip_file_path: this.zipFilePath, // Pass the zip file path as a string
      region: this.region,
    };

    this.http
      .post<{ message: string }>('http://localhost:8080/user/create-lambda-function', payload)
      .subscribe({
        next: (response) => {
          this.responseMessage = response.message;
          this.responseStatus = 'success';
          this.showModal = true;
        },
        error: (error) => {
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

  navigateToCreateLambda() {
    this.router.navigate(['/create-lambda']);
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
