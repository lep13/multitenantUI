import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LogoutComponent } from '../logout/logout.component';
import { Tooltip } from 'bootstrap';

@Component({
  selector: 'app-user-createservice',
  standalone: true,
  imports: [FormsModule, CommonModule, LogoutComponent],
  templateUrl: './user-createservice.component.html',
  styleUrls: ['./user-createservice.component.scss'],
})
export class UserCreateServiceComponent implements AfterViewInit {
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
  showLogoutPopup = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngAfterViewInit(): void {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });
  }

  selectProvider(provider: string) {
    this.selectedProvider = provider;

    // Start session
    this.http
      .get<{ session_id: string }>(
        `http://localhost:8080/user/start-session?username=${this.username}&provider=${provider}`
      )
      .subscribe({
        next: (response) => {
          // Store the session ID in localStorage
          localStorage.setItem('sessionId', response.session_id);
          console.log('Session ID stored in localStorage:', response.session_id);
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
      .post(
        'http://localhost:8080/user/update-session',
        {
          session_id: this.sessionId,
          service: this.selectedService,
        },
        { responseType: 'text' } // Explicitly set response type to text
      )
      .subscribe({
        next: (response) => {
          console.log('Session updated successfully:', response);
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
    this.router.navigate(['/create-service']);
  }

  navigateToDeleteService() {
    this.router.navigate(['/delete-service']);
  }

  normalizeServiceName(service: string): string {
    return service
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[()]/g, '') // Remove parentheses
      .replace(/[^a-z0-9-]/g, ''); // Remove special characters
  }

  navigateToCreateServiceComponent() {
    if (this.selectedService) {
      const normalizedRoute = this.normalizeServiceName(this.selectedService);
      const serviceRoute = `/create-${normalizedRoute}`;
      this.router.navigate([serviceRoute]);
    } else {
      console.error('No service selected to navigate.');
    }
  }

  toggleLogoutPopup() {
    this.showLogoutPopup = !this.showLogoutPopup;
  }

  handleLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
