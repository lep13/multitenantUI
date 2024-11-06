import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(['/admin']);
  }

  onSubmit() {
    console.log('Creating Manager:', this.username, this.password, this.groups);
    this.confirmationMessage = `Manager ${this.username} has been created successfully.`;
  }
}

