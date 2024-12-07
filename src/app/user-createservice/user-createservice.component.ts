import { Component, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LogoutComponent } from '../logout/logout.component';
import { Tooltip } from 'bootstrap';
import { InfoService } from '../services/info.service';
import { UserService } from '../services/user.service';
import { UserServicecardComponent } from '../user-servicecard/user-servicecard.component';

@Component({
  selector: 'app-user-createservice',
  standalone: true,
  imports: [FormsModule, CommonModule, LogoutComponent, UserServicecardComponent],
  templateUrl: './user-createservice.component.html',
  styleUrls: ['./user-createservice.component.scss'],
})
export class UserCreateServiceComponent implements AfterViewInit, OnInit {
  currentPage: string = 'create-service';
  username: string | null = null; // Example username
  selectedProvider: string | null = null;
  services: string[] = [];
  selectedService: string | null = null;
  sessionId: string | null = null; // To store session ID
  showModal: boolean = false;
  showRequestSentModal: boolean = false;
  modalMessage: string = ''; // Message for the modal
  budgetStatusMessage: string | null = null;
  estimatedCost: number | null = null;
  status: string | null = null;
  showLogoutPopup = false;
  requestSent: boolean = false;
  currentBudget: number | null = null;

  constructor(private http: HttpClient, private router: Router, private infoService: InfoService, private userService: UserService) { }

  ngOnInit(): void {
    this.username = this.infoService.getUsername();
    if (!this.username) {
      console.error('Username is missing. Redirecting to login...');
      this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit(): void {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });
  }

  selectProvider(provider: string): void {
    if (!this.username) {
      console.error('Cannot start session: Username is missing.');
      this.modalMessage = 'Username is missing. Please log in again.';
      this.showModal = true;
      return;
    }

    this.selectedProvider = provider;

    this.http
      .get<{ session_id: string }>(
        `http://localhost:8080/user/start-session?username=${this.username}&provider=${provider}`
      )
      .subscribe({
        next: (response) => {
          this.sessionId = response.session_id;
          localStorage.setItem('sessionId', response.session_id);
          this.fetchServices(provider);
        },
        error: (error) => {
          console.error('Error starting session:', error);
          this.modalMessage = 'Failed to start session. Please try again.';
          this.showModal = true;
        },
      });
  }

  fetchServices(provider: string): void {
    this.http
      .get<{ services: string[] }>(
        `http://localhost:8080/user/get-cloud-services?provider=${provider}`
      )
      .subscribe({
        next: (response) => {
          this.services = response.services;
          if (this.services.length === 0) {
            console.warn('No services available for this provider.');
          }
        },
        error: (error) => {
          console.error('Error fetching services:', error);
          this.modalMessage = 'Failed to fetch services. Please try again later.';
          this.showModal = true;
        },
      });
  }
  selectService(service: string): void {
    this.selectedService = service;

    if (!this.sessionId || !this.selectedService) {
      console.error('Session ID or selected service is missing.');
      return;
    }

    this.http
      .post(
        'http://localhost:8080/user/update-session',
        { session_id: this.sessionId, service: this.selectedService },
        { responseType: 'text' }
      )
      .subscribe({
        next: () => {
          this.checkServiceBudget();
        },
        error: (error) => {
          console.error('Error updating session:', error);
        }
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
          this.estimatedCost = response.estimated_cost;
          this.status = response.status;

          // Show the modal with appropriate buttons
          this.showModal = true;
        },
        error: (error) => {
          console.error('Error checking budget:', error);
          this.modalMessage = 'An error occurred while checking the budget.';
          this.showModal = true;
        },
      });
  }

  fetchUserGroup(): Promise<{ manager: string; budget: number }> {
    return new Promise((resolve, reject) => {
      this.http
        .get<{ group_id: string; manager: string; members: string[]; budget: number }>(
          `http://localhost:5000/api/user-group?username=${this.username}`
        )
        .subscribe({
          next: (response) => {
            console.log('User group data:', response); // Debugging: Log the response
            resolve({
              manager: response.manager,
              budget: response.budget || 0, // Default to 0 if budget is undefined
            });
          },
          error: (error) => {
            console.error('Error fetching user group:', error);
            reject(error);
          },
        });
    });
  }

  // Fetch manager username
  fetchManagerUsername(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.http
        .get<{ group_id: string; manager: string; members: string[] }>(
          `http://localhost:5000/api/user-group?username=${this.username}`
        )
        .subscribe({
          next: (response) => resolve(response.manager),
          error: (error) => {
            console.error('Error fetching manager username:', error);
            reject(null);
          },
        });
    });
  }

  // Send request to manager
  sendRequestToManager(): void {
    if (!this.username || !this.selectedService || !this.estimatedCost) {
      this.modalMessage = 'An error occurred. Please try again.';
      this.showModal = true; // Show modal with the error message
      return;
    }
  
    // Fetch manager and budget details
    this.fetchUserGroup()
      .then(({ manager, budget }) => {
        if (!manager) {
          throw new Error('Manager username not found');
        }
  
        // Debugging: Ensure budget is fetched properly
        console.log('Fetched Manager:', manager);
        console.log('Fetched Budget:', budget);
  
        const requestData = {
          username: this.username,
          manager: manager,
          requested_service: this.selectedService,
          estimated_cost: this.estimatedCost,
          budget: budget || 0, // Default to 0 if budget is undefined
        };
  
        // Debugging: Verify request payload
        console.log('Request Data:', requestData);
  
        // Send notification to the manager
        this.http.post('http://localhost:8080/user/send-notification', requestData, { responseType: 'text' }).subscribe({
          next: () => {
            this.modalMessage = 'Notification sent to the manager successfully.';
            this.showModal = false; // Hide primary modal
            this.showRequestSentModal = true; // Show confirmation modal
          },
          error: (error) => {
            console.error('Error sending request to manager:', error);
            this.modalMessage = 'Failed to send notification. Please try again.';
          },
        });
      })
      .catch((error) => {
        console.error('Error fetching manager or budget:', error);
        this.modalMessage = 'Failed to send notification. Please try again.';
      });
  }  

  closeModal() {
    this.showModal = false;
  }

  // Close secondary modal
  closeRequestSentModal(): void {
    this.showRequestSentModal = false;
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
