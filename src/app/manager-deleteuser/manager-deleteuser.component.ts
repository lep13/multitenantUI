import { Component } from '@angular/core';
import { ManagerService } from '../services/manager.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manager-deleteuser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-deleteuser.component.html',
  styleUrl: './manager-deleteuser.component.scss'
})

export class ManagerDeleteUserComponent {
  username: string = '';
  message: string = '';
  error: string = '';

  constructor(
    private managerService: ManagerService,
    private router: Router
  ) {}

  onDeleteUser() {
    if (this.username.trim()) {
      this.managerService.deleteUser(this.username).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.message = response.message;
            this.error = '';
          } else {
            this.error = response.message;
            this.message = '';
          }
        },
        (error) => {
          this.error = 'Error deleting user';
          this.message = '';
        }
      );
    } else {
      this.error = 'Please enter a valid username';
      this.message = '';
    }
  }
}
