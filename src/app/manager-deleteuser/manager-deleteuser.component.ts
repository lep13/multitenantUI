import { Component } from '@angular/core';
import { ManagerService } from '../services/manager.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogoutComponent } from '../logout/logout.component';
 
@Component({
  selector: 'app-manager-deleteuser',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoutComponent],
  templateUrl: './manager-deleteuser.component.html',
  styleUrl: './manager-deleteuser.component.scss'
})
 
export class ManagerDeleteUserComponent {
  username: string = '';
  usernames: string[] = []; // List of usernames for the dropdown
  errorMessage: string = ''; // Display error message if username is empty
  feedbackMessage: string = ''; // Message shown in the feedback modal
  isConfirmationModalOpen: boolean = false; // Track confirmation modal state
  isFeedbackModalOpen: boolean = false; // Track feedback modal state
  showLogoutPopup = false;
 
  constructor(private managerService: ManagerService, private router: Router) {}
 
  ngOnInit(): void {
    this.loadUsernames(); // Load usernames on component initialization
  }
 
  loadUsernames(): void {
    this.managerService.getUsernames().subscribe(
      (data) => {
        this.usernames = data; // Populate the usernames array
      },
      (error) => {
        console.error('Failed to load usernames', error);
      }
    );
  }
 
  navigateToDashboard() {
    this.router.navigate(['/manager']);
  }
 
  navigateToCreateUser() {
    this.router.navigate(['/create-user']);
  }
 
  navigateToCreateGroup() {
    this.router.navigate(['/create-group']);
  }
 
  navigateToUpdateGroup() {
    this.router.navigate(['/update-group']);
  }
 
  openConfirmationModal() {
    if (!this.username.trim()) {
      this.errorMessage = 'Please enter a username to delete.';
      this.feedbackMessage = ''; // Clear any previous feedback messages
    } else {
      this.errorMessage = ''; // Clear error message if any
      this.isConfirmationModalOpen = true; // Open confirmation modal
    }
  }
 
  closeConfirmationModal(action: string) {
    this.isConfirmationModalOpen = false; // Close confirmation modal
    if (action === 'cancelled') {
      this.feedbackMessage = 'Deletion cancelled.'; // Set cancellation message
      this.isFeedbackModalOpen = true; // Show feedback modal
    }
  }
 
  // Confirm deletion and handle success or failure feedback
  confirmDelete() {
    this.isConfirmationModalOpen = false; // Close confirmation modal on confirmation
 
    this.managerService.deleteUser(this.username).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.feedbackMessage = `User "${this.username}" was successfully deleted.`; // Success message
          this.loadUsernames();
        } else {
          this.feedbackMessage = `Failed to delete user: ${response.message}`; // Failure message
        }
        this.isFeedbackModalOpen = true; // Show feedback modal
        this.username = ''; // Clear the input field after deletion
      },
      (error) => {
        this.feedbackMessage = `Failed to delete user: User doesn't exist.`; // Error message for user not found
        this.isFeedbackModalOpen = true; // Show feedback modal
      }
    );
  }
 
  closeFeedbackModal() {
    this.isFeedbackModalOpen = false;
    this.feedbackMessage = ''; // Clear feedback message after modal close
  }

  toggleLogoutPopup() {
    this.showLogoutPopup = !this.showLogoutPopup;
  }

  handleLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}