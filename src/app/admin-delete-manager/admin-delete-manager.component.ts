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

  constructor(private adminService: AdminService, private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(['/admin']);
  }

  navigateToCreateManager() {
    this.router.navigate(['/create-manager']);
  }

  onSubmit() {
    this.adminService.deleteManager(this.username).subscribe(
      (response: { success: boolean; message: string }) => {
        if (response.success) {
          this.confirmationMessage = `Manager ${this.username} deleted successfully.`;
        } else {
          this.confirmationMessage = `Failed to delete manager: ${response.message}`;
        }
      },
      (error: any) => {
        console.error('Error deleting manager:', error);
      }
    );
  }
}
