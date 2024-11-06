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
  confirmationMessage: string = '';
  errorMessage: string = ''; //display error message if username is empty
  isModalOpen: boolean = false; // Track modal state

  constructor(private adminService: AdminService, private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(['/admin']);
  }

  navigateToCreateManager() {
    this.router.navigate(['/create-manager']);
  }

  openConfirmationModal() {
    if (!this.username.trim()) {
      this.errorMessage = 'Please enter a username to delete.';
      this.confirmationMessage = ''; // Clear any previous success messages
    } else {
      this.errorMessage = ''; // Clear error message if any
      this.isModalOpen = true; // Open modal
    }
  }

  closeConfirmationModal() {
    this.isModalOpen = false; // Close modal without deleting
    this.confirmationMessage = 'Deletion cancelled.'; // Set cancellation message
  }

  confirmDelete() {
    this.isModalOpen = false; // Close modal on confirmation
    const managerData = { username: this.username };
    this.adminService.deleteManager(managerData).subscribe(
      (response: { success: boolean; message: string }) => {
        if (response.success) {
          this.confirmationMessage = `Manager ${this.username} deleted successfully.`;
          this.errorMessage = '';
          this.username = ''; // Clear the input field after deletion
        } else {
          this.confirmationMessage = `Failed to delete manager: ${response.message}`;
        }
      },
      (error: any) => {
        console.error('Error deleting manager:', error);
        this.confirmationMessage = 'An error occurred while deleting the manager.';
      }
    );
  }
}

//   onSubmit() {
//     // Check if username is empty
//     if (!this.username.trim()) {
//       this.errorMessage = 'Please enter a username to delete.';
//       this.confirmationMessage = ''; // Clear any previous success messages
//       return;
//     }

//     // Show confirmation dialog
//     const isConfirmed = window.confirm(`Are you sure you want to delete manager ${this.username}?`);
//     if (!isConfirmed) {
//       this.confirmationMessage = 'Deletion cancelled.';
//       return;
//     }

//     // Proceed with deletion if confirmed
//     const managerData = { username: this.username };
//     this.adminService.deleteManager(managerData).subscribe(
//       (response: { success: boolean; message: string }) => {
//         if (response.success) {
//           this.confirmationMessage = `Manager ${this.username} deleted successfully.`;
//           this.errorMessage = ''; // Clear any previous error messages
//           this.username = ''; // Clear the input field after deletion
//         } else {
//           this.confirmationMessage = `Failed to delete manager: ${response.message}`;
//         }
//       },
//       (error: any) => {
//         console.error('Error deleting manager:', error);
//         this.confirmationMessage = 'An error occurred while deleting the manager.';
//       }
//     );
//   }
// }