import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-createservice',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-createservice.component.html',
  styleUrls: ['./user-createservice.component.scss'],
})
export class UserCreateServiceComponent {
  currentPage: string = 'create-service';
  username: string = 'Golang_Developer'; // Example username
  selectedProvider: string | null = null;
  services: string[] = [];
  selectedService: string | null = null;
  sessionId: string | null = null; // To store session ID
  showModal: boolean = false;
  modalMessage: string = ''; // Message for the modal
  budgetStatusMessage: string | null = null;
  estimatedCost: number | null = null;
  status: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  selectProvider(provider: string) {
    this.selectedProvider = provider;

    // Start session
    this.http
      .get<{ session_id: string }>(
        `http://localhost:8080/user/start-session?username=${this.username}&provider=${provider}`
      )
      .subscribe({
        next: (response) => {
          this.sessionId = response.session_id;
          this.fetchServices(provider);
        },
        error: (error) => {
          console.error('Error starting session:', error);
        },
      });
  }

  fetchServices(provider: string) {
    this.http
      .get<{ services: string[] }>(
        `http://localhost:8080/user/get-cloud-services?provider=${provider}`
      )
      .subscribe({
        next: (response) => {
          this.services = response.services;
        },
        error: (error) => {
          console.error('Error fetching services:', error);
        },
      });
  }

  updateSession() {
    if (!this.sessionId || !this.selectedService) {
      console.error('Session ID or selected service is missing');
      return;
    }

    // Call update-session API
    this.http
      .post('http://localhost:8080/user/update-session', {
        session_id: this.sessionId,
        service: this.selectedService,
      })
      .subscribe({
        next: () => {
          console.log('Session updated successfully');
        },
        error: (error) => {
          console.error('Error updating session:', error);
        },
      });
  }

  checkServiceBudget() {
    if (!this.sessionId) {
      this.modalMessage = 'Session ID is missing.';
      this.showModal = true;
      return;
    }

    // Call calculate-cost API
    this.http
      .post<{
        budget: number;
        estimated_cost: number;
        message: string;
        status: string;
      }>('http://localhost:8080/user/calculate-cost', {
        session_id: this.sessionId,
      })
      .subscribe({
        next: (response) => {
          this.modalMessage = response.message;
          this.showModal = true;
          this.estimatedCost = response.estimated_cost;
          this.status = response.status;
        },
        error: (error) => {
          console.error('Error checking budget:', error);
          this.modalMessage = 'An error occurred while checking the budget.';
          this.showModal = true;
        },
      });
  }

  closeModal() {
    this.showModal = false;
  }

  // Navigation methods
  navigateToDashboard() {
    this.router.navigate(['/user']);
  }

  navigateToCreateService() {
    this.currentPage = '/create-service';
  }

  navigateToDeleteService() {
    this.router.navigate(['/delete-service']);
  }
}
