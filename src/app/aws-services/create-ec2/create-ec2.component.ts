import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from "../../logout/logout.component";

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-create-ec2',
  standalone: true,
  imports: [FormsModule, CommonModule, LogoutComponent],
  templateUrl: './create-ec2.component.html',
  styleUrl: './create-ec2.component.scss'
})
export class CreateEc2Component {
  currentPage: string = 'create-amazon-ec2-elastic-compute-cloud';
  sessionId: string | null = null;
  instanceType: string = '';
  amiId: string = '';
  keyName: string = '';
  subnetId: string = '';
  securityGroupId: string = '';
  instanceName: string = '';
  responseMessage: string | null = null;
  responseStatus: string | null = null;
  showLogoutPopup = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.sessionId = localStorage.getItem('sessionId');
    console.log('Session ID fetched on init:', this.sessionId);
  }


  createEC2Instance() {
    if (!this.sessionId) {
      console.log(this.sessionId, 'sessionId');
      this.responseMessage = 'Session ID is missing.';
      this.responseStatus = 'error';
      return;
    }

  // Dynamically fetch session ID from localStorage if not already set
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
      instance_type: this.instanceType,
      ami_id: this.amiId,
      key_name: this.keyName,
      subnet_id: this.subnetId,
      security_group_id: this.securityGroupId,
      instance_name: this.instanceName,
    };

    this.http
      .post<{ message: string }>('http://localhost:8080/user/create-ec2-instance', payload)
      .subscribe({
        next: (response) => {
          console.log(this.sessionId, 'session');
          this.responseMessage = response.message;
          this.responseStatus = 'success';
        },
        error: (error) => {
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
