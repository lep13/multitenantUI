import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerService } from '../services/manager.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../filter.pipe'; // Import the filter pipe
import { LogoutComponent } from '../logout/logout.component';

interface Group {
  // group_id: string; // Updated to include group_id
  group_name: string;
  members: string[];
  manager: string;
  budget?: number;
}

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [FormsModule, CommonModule, FilterPipe, LogoutComponent], // Add FilterPipe here
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {
  searchTerm: string = '';
  groups: Group[] = [];
  currentPage: string = 'dashboard';
  showLogoutPopup = false;

  constructor(
    private managerService: ManagerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.managerService.getGroups().subscribe(
      (data) => {
        console.log('Groups received:', data); // Log data for debugging
        this.groups = data;
      },
      (error) => {
        console.error('Error fetching groups:', error);
      }
    );
  }

  navigateToDashboard() {
    this.currentPage = 'dashboard';
    this.router.navigate(['/manager']);
  }

  navigateToCreateUser() {
    this.currentPage = 'create-user';
    this.router.navigate(['/create-user']);
  }

  navigateToDeleteUser() {
    this.currentPage = 'delete-user';
    this.router.navigate(['/delete-user']);
  }

  navigateToCreateGroup() {
    this.currentPage = 'create-group';
    this.router.navigate(['/create-group']);
  }

  navigateToUpdateGroup() {
    this.currentPage = 'update-group';
    this.router.navigate(['/update-group']);
  }

  toggleLogoutPopup() {
    this.showLogoutPopup = !this.showLogoutPopup;
  }

  handleLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
