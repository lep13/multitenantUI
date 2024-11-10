import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ManagerService } from '../services/manager.service';

@Component({
  selector: 'app-manager-createuser',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manager-createuser.component.html',
  styleUrl: './manager-createuser.component.scss'
})

export class ManagerCreateUserComponent {
  username: string = '';
  password: string = '';
  message: string = '';

  constructor(private managerService: ManagerService, private router: Router) {}

  onCreateUser() {
    this.managerService.createUser(this.username, this.password).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.message = 'User created successfully';
          this.username = '';
          this.password = '';
        } else {
          this.message = response.message;
        }
      },
      (error) => {
        console.error('Error creating user:', error);
        this.message = 'Error creating user. Please try again.';
      }
    );
  }

  navigateToDashboard() {
    this.router.navigate(['/manager']);
  }
}
