import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ManagerService } from '../services/manager.service';
import { LogoutComponent } from '../logout/logout.component';
 
@Component({
  selector: 'app-manager-createuser',
  standalone: true,
  imports: [FormsModule, CommonModule, LogoutComponent],
  templateUrl: './manager-createuser.component.html',
  styleUrls: ['./manager-createuser.component.scss']
})
 
export class ManagerCreateUserComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmationMessage: string = '';
  errorMessage: string = '';
  isModalOpen: boolean = false;
  showLogoutPopup = false;
 
  constructor(private managerService: ManagerService, private router: Router) {}
 
  navigateToDashboard() {
    this.router.navigate(['/manager']);
  }
 
  navigateToDeleteUser() {
    this.router.navigate(['/delete-user']);
  }
 
  navigateToCreateGroup() {
    this.router.navigate(['/create-group']);
  }
 
  navigateToUpdateGroup() {
    this.router.navigate(['/update-group']);
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
 
    if (!this.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false;
    }
 
    if (!this.password.trim()) {
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
 
    this.errorMessage = '';
    return true;
  }
 
  onCreateUser() {
    if (!this.validateForm()) {
      return;
    }
 
    this.managerService.createUser(this.username, this.email, this.password).subscribe(
      (response) => {
        if (response.status === 'success') {
          // Show only success message
          this.openModal(`User ${this.username} created successfully.`);
          this.username = '';
          this.email = '';
          this.password = '';
        } else {
          // Show error message from response
          this.openModal(response.message);
        }
      },
      (error) => {
        console.error('Error creating user:', error);
        // Show general error message if request fails
        this.openModal('An error occurred while creating the user.');
      }
    );
  }

  toggleLogoutPopup() {
    this.showLogoutPopup = !this.showLogoutPopup;
  }

  handleLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}