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
  budgetStatusMessage: string | null = null;
  estimatedCost: number | null = null;
  status: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  selectProvider(provider: string) {
    this.selectedProvider = provider;

    // Start session
    this.http
      .get(`http://localhost:8080/user/start-session?username=${this.username}&provider=${provider}`)
      .subscribe({
        next: () => {
          // Fetch services for the selected provider
          this.fetchServices(provider);
        },
        error: (error) => {
          console.error('Error starting session:', error);
        },
      });
  }

  fetchServices(provider: string) {
    this.http
      .get<{ services: string[] }>(`http://localhost:8080/user/get-cloud-services?provider=${provider}`)
      .subscribe({
        next: (response) => {
          this.services = response.services;
        },
        error: (error) => {
          console.error('Error fetching services:', error);
        },
      });
  }

  checkServiceBudget() {
    if (!this.selectedService) {
      this.budgetStatusMessage = 'Please select a service.';
      return;
    }

    // Send request to check budget and estimated cost for the selected service
    this.http
      .get<{
        budget: number;
        estimated_cost: number;
        message: string;
        status: string;
      }>(
        `http://localhost:8080/user/check-budget?username=${this.username}&service=${encodeURIComponent(
          this.selectedService
        )}`
      )
      .subscribe({
        next: (response) => {
          this.budgetStatusMessage = response.message;
          this.estimatedCost = response.estimated_cost;
          this.status = response.status;
        },
        error: (error) => {
          console.error('Error checking budget:', error);
          this.budgetStatusMessage = 'An error occurred while checking the budget.';
        },
      });
  }

  // Navigation methods
  navigateToDashboard() {
    this.router.navigate(['/user']);
  }

  navigateToCreateService() {
    this.currentPage ='/create-service';
  }

  navigateToDeleteService() {
    this.router.navigate(['/delete-service']);
  }
}
