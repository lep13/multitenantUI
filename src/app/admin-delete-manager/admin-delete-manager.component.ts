import { Component } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-admin-delete-manager',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-delete-manager.component.html',
  styleUrl: './admin-delete-manager.component.scss'
})
 
export class AdminDeleteManagerComponent {
  username: string = '';
  managers: { username: string }[] = []; // List of manager usernames for the dropdown
  errorMessage: string = ''; // Display error message if username is empty
  feedbackMessage: string = ''; // Message shown in the feedback modal
  isConfirmationModalOpen: boolean = false; // Track confirmation modal state
  isFeedbackModalOpen: boolean = false; // Track feedback modal state
 
  constructor(private adminService: AdminService, private router: Router) {}
 
  ngOnInit(): void {
    this.loadManagerUsernames();
  }
 
  loadManagerUsernames() {
    this.adminService.getManagerUsernames().subscribe(
      (data) => {
        this.managers = data;
      },
      (error) => {
        console.error('Failed to load manager usernames', error);
      }
    );
  }
 
  navigateToDashboard() {
    this.router.navigate(['/admin']);
  }
 
  navigateToCreateManager() {
    this.router.navigate(['/create-manager']);
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
 
  // Close confirmation modal and show cancellation feedback
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
    const managerData = { username: this.username };
    this.adminService.deleteManager(managerData).subscribe(
      (response: { success: boolean; message: string }) => {
        if (response.success) {
          this.feedbackMessage = `Manager "${this.username}" was successfully deleted.`; // Success message
        } else {
          this.feedbackMessage = `Failed to delete manager: ${response.message}`; // Failure message
        }
        this.isFeedbackModalOpen = true; // Show feedback modal
        this.username = ''; // Clear the input field after deletion
      },
      (error: any) => {
        this.feedbackMessage = `Error: Manager "${this.username}" does not exist or another error occurred.`; // Error message
        this.isFeedbackModalOpen = true; // Show feedback modal
      }
    );
  }
 
    // Close feedback modal
    closeFeedbackModal() {
      this.isFeedbackModalOpen = false;
      this.feedbackMessage = ''; // Clear feedback message after modal close
    }
  }