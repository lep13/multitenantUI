import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../filter.pipe';
import { UserService } from '../services/user.service';

interface User {
  username: string;
  tag: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, FilterPipe],
})

export class AdminComponent {
  searchTerm: string = '';
  users: User[] = [];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}  

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        console.log('Data received:', data); // to check if data is coming to the component
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }  

  currentPage: string = 'dashboard';

  navigateToDashboard() {
    this.currentPage = 'dashboard';
    // this.router.navigate(['/admin']);
  }

  navigateToCreateManager() {
    this.currentPage = 'create-manager';
    this.router.navigate(['/create-manager']);
  }
}
