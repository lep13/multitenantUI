import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from '../../logout/logout.component';

@Component({
  selector: 'app-create-compute-engine',
  standalone: true,
  imports: [FormsModule, CommonModule, LogoutComponent],
  templateUrl: './create-computeengine.component.html',
  styleUrl: './create-computeengine.component.scss'
})
export class CreateComputeEngineComponent {
  currentPage: string = 'create-compute-engine';
  sessionId: string | null = null;
  name: string = '';
  zone: string = '';
  machineType: string = '';
  imageProject: string = '';
  imageFamily: string = '';
  network: string = '';
  subnetwork: string = '';
  serviceAccount: string = '';
  region: string = '';
  responseMessage: string | null = null;
  responseStatus: string | null = null;
  showLogoutPopup = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.sessionId = localStorage.getItem('sessionId');
    console.log('Session ID fetched on init:', this.sessionId);
  }

  createComputeEngine() {
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
      name: this.name,
      zone: this.zone,
      machine_type: this.machineType,
      image_project: this.imageProject,
      image_family: this.imageFamily,
      network: this.network,
      subnetwork: this.subnetwork,
      service_account: this.serviceAccount,
      region: this.region,
    };

    this.http
      .post<{ message: string }>('http://localhost:8080/user/create-compute-engine', payload)
      .subscribe({
        next: (response) => {
          console.log('Compute Engine instance created successfully:', response.message);
          this.responseMessage = response.message;
          this.responseStatus = 'success';
        },
        error: (error) => {
          console.error('Error creating Compute Engine instance:', error);
          this.responseMessage = error.error.message || 'An error occurred.';
          this.responseStatus = 'error';
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
