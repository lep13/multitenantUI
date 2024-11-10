import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-create-manager',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-create-manager.component.html',
  styleUrls: ['./admin-create-manager.component.scss']
})

export class AdminCreateManagerComponent {
  username: string = '';
  password: string = '';
  groups: number = 1;
  confirmationMessage: string = '';
  errorMessage: string = '';
  isModalOpen: boolean = false;

  constructor(private adminService: AdminService, private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(['/admin']);
  }

  navigateToDeleteManager() {
    this.router.navigate(['/delete-manager']);
  }

  openModal(message: string) {
    this.confirmationMessage = message;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.confirmationMessage = '';
  }

  validateForm(): boolean {
    if (!this.username.trim()) {
      this.errorMessage = 'Please enter a username.';
      return false;
    }

    if (!this.password) {
      this.errorMessage = 'Please enter a password.';
      return false;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!passwordRegex.test(this.password)) {
      this.errorMessage = 'Password must contain uppercase, lowercase, number, and special character.';
      return false;
    }

    if (this.groups < 1) {
      this.errorMessage = 'Number of groups cannot be less than 1.';
      return false;
    }

    if (this.groups > 10) {
      this.errorMessage = 'Number of groups cannot be more than 10.';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    const managerData = {
      username: this.username,
      password: this.password,
      group_limit: this.groups
    };

    this.adminService.createManager(managerData).subscribe(
      (response) => {
        if (response.success) {
          this.openModal(`Manager ${this.username} created successfully.`);
          this.username = '';
          this.password = '';
          this.groups = 1;
        } else {
          this.openModal(`Failed to create manager: ${response.message}`);
        }
      },
      (error) => {
        console.error('Error creating manager:', error);
        this.openModal('An error occurred while creating the manager.');
      }
    );
  }
}
