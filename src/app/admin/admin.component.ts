import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../filter.pipe';
import { UserService } from '../services/user.service';
import { LogoutComponent } from '../logout/logout.component';

interface Manager {
  username: string;
  group_limit: number;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, FilterPipe, LogoutComponent],
})

export class AdminComponent {
  searchTerm: string = '';
  users: Manager[] = [];
  showLogoutPopup = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}  

  ngOnInit(): void {
    this.userService.getManagers().subscribe(
      (data: Manager[]) => {
        console.log('Data received:', data); // to check if data is coming to the component
        this.users = data; // Keep this as `users` to match the rest of the component
      },
      (error) => {
        console.error('Error fetching managers:', error);
      }
    );
  }     

  currentPage: string = 'dashboard';

  navigateToDashboard() {
    this.currentPage = 'dashboard';
    // this.router.navigate(['/admin']);
  }

  navigateToDeleteManager() {
    this.currentPage = 'delete-manager';
    this.router.navigate(['/delete-manager']);
  }  

  navigateToCreateManager() {
    this.currentPage = 'create-manager';
    this.router.navigate(['/create-manager']);
  }

  toggleLogoutPopup() {
    this.showLogoutPopup = !this.showLogoutPopup;
  }

  handleLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
