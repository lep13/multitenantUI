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
  styleUrl: './admin-create-manager.component.scss'
})

export class AdminCreateManagerComponent {
  username: string = '';
  password: string = '';
  groups: number | null = null;
  confirmationMessage: string = '';

  constructor(private adminService: AdminService, private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(['/admin']);
  }

  currentPage: string = 'dashboard';

  navigateToDeleteManager() {
    this.currentPage = 'delete-manager';
    this.router.navigate(['/delete-manager']);
  }

  onSubmit() {
    if (this.groups !== null) {
      const managerData = {
        username: this.username,
        password: this.password,
        group_limit: this.groups // assuming the backend expects 'group_limit'
      };

      this.adminService.createManager(managerData).subscribe(
        (response) => {
          if (response.success) {
            this.confirmationMessage = `Manager ${this.username} created successfully.`;
          } else {
            this.confirmationMessage = `Failed to create manager: ${response.message}`;
          }
        },
        (error) => {
          console.error('Error creating manager:', error);
          this.confirmationMessage = 'An error occurred while creating the manager.';
        }
      );
    }
  }
}