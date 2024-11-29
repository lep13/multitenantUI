import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InfoService } from '../services/info.service';
import { LogoutComponent } from '../logout/logout.component';
import { UserServicecardComponent } from '../user-servicecard/user-servicecard.component';

@Component({
  selector: 'app-user-deleteservice',
  standalone: true,
  imports: [LogoutComponent, FormsModule, CommonModule, UserServicecardComponent],
  templateUrl: './user-deleteservice.component.html',
  styleUrl: './user-deleteservice.component.scss'
})
export class UserDeleteserviceComponent implements OnInit {
  currentPage: string = 'delete-service';
  selectedProvider: string | null = null;
  services: string[] = [];
  username: string | null = null;
  selectedService: string | null = null; // Currently selected service
  serviceToDelete: string = ''; // Input field value
  showModal: boolean = false; // Modal visibility
  showLogoutPopup: boolean = false;

  // Response handling
  responseMessage: string | null = null; // To store the response message
  responseStatus: 'success' | 'error' | null = null; // To store the status of the response

  constructor(
    private http: HttpClient,
    private router: Router,
    private infoService: InfoService
  ) { }

  ngOnInit() {
    this.username = this.infoService.getUsername();
  }

  selectProvider(provider: string): void {
    this.selectedProvider = provider;
    this.fetchServices(provider);
  }

  fetchServices(provider: string) {
    this.http
      .get<{ services: string[] }>(
        `http://localhost:8080/user/get-cloud-services?provider=${provider}`
      )
      .subscribe({
        next: (response) => {
          this.services = response.services;
          console.log(this.services, 'services');
        },
        error: (error) => {
          console.error('Error fetching services:', error);
        },
      });
  }

  selectService(service: string): void {
    this.selectedService = service;
    console.log(`Selected service: ${service}`);
  }

  openConfirmationModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  deleteService(): void {
    if (!this.serviceToDelete || !this.selectedService || !this.username) return;
  
    if (this.selectedProvider === 'aws') {
      this.deleteAWSService();
    } else if (this.selectedProvider === 'gcp') {
      this.deleteGCPService();
    } else {
      this.responseMessage = 'Invalid provider selected.';
      this.responseStatus = 'error';
    }
  }
  
  deleteAWSService(): void {
    const payload: any = {
      service_type: this.selectedService,
    };
  
    if (this.selectedService === 'AWS CloudFront') {
      payload.service_id = this.serviceToDelete;
    } else {
      payload.service_name = this.serviceToDelete;
    }
  
    this.http
      .post(`http://localhost:8080/user/delete-aws-service?username=${this.username}`, payload)
      .subscribe({
        next: (response: any) => {
          this.responseMessage = response.message || 'AWS Service deleted successfully!';
          this.responseStatus = 'success';
          this.closeModal();
        },
        error: (error) => {
          this.responseMessage = error.error.message || 'Failed to delete AWS service.';
          this.responseStatus = 'error';
          this.closeModal();
        },
      });
  }
  
  deleteGCPService(): void {
    const payload: any = {
      service_type: this.selectedService,
      service_name: this.serviceToDelete,
    };
  
    this.http
      .post(`http://localhost:8080/user/delete-gcp-service?username=${this.username}`, payload)
      .subscribe({
        next: (response: any) => {
          this.responseMessage = response.message || 'GCP Service deleted successfully!';
          this.responseStatus = 'success';
          this.closeModal();
        },
        error: (error) => {
          this.responseMessage = error.error.message || 'Failed to delete GCP service.';
          this.responseStatus = 'error';
          this.closeModal();
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
    this.currentPage = 'delete-service';
  }

  toggleLogoutPopup() {
    this.showLogoutPopup = !this.showLogoutPopup;
  }

  handleLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
