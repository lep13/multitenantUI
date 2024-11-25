import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from '../logout/logout.component';
import { InfoService } from '../services/info.service';
import { FilterPipe } from '../filter.pipe';

interface Service {
  username: string;
  provider: string;
  service: string;
  status: string;
  estimated_cost: number;
  date_created: string;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, CommonModule, FilterPipe, LogoutComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  currentPage: string = 'dashboard';
  services: Service[] = [];
  userGroupId: string | null = null; // Group ID of the logged-in user
  managerName: string | null = null; // Manager name of the user's group
  showLogoutPopup = false;
  searchTerm: string = '';
  groupMembers: string[] = []; // Members of the user's group

  constructor(private http: HttpClient, private router: Router, private infoService: InfoService) {}

  ngOnInit(): void {
    // this.fetchServices();
    this.renderRingChart();
    this.fetchUserGroup();
  }

  // Fetch the group information of the logged-in user
  fetchUserGroup(): void {
    const username = this.infoService.getUsername();
    if (username) {
      this.http
        .get<{ group_id: string; manager: string; members: string[] }>(
          `http://localhost:5000/api/user-group?username=${username}`
        )
        .subscribe(
          (response) => {
            this.userGroupId = response.group_id; // Get the group ID of the user
            this.managerName = response.manager; // Get the manager's name
            this.groupMembers = response.members; // Get the group members
            this.fetchServices(); // Fetch services after the group is loaded
          },
          (error) => {
            console.error('Error fetching user group:', error);
          }
        );
    } else {
      console.error('Username not found');
    }
  }

  // Fetch services belonging to the user's group
  fetchServices() {
    if (!this.userGroupId) {
      console.error('User group ID not found');
      return;
    }

    // Call the API with group filter
    this.http
      .get<Service[]>(
        `http://localhost:5000/api/services?group_id=${this.userGroupId}`
      )
      .subscribe(
        (data) => {
          this.services = data;
        },
        (error) => {
          console.error('Error fetching services:', error);
        }
      );
  }

  renderRingChart() {
    const ctx = (document.getElementById('ringChart') as HTMLCanvasElement).getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Consumed Budget', 'Remaining Budget'],
          datasets: [
            {
              data: [40, 60], // Hardcoded values
              backgroundColor: ['#ff6384', '#36a2eb'],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Ensure the canvas size is respected
          cutout: '70%', // Create a larger hole for better visibility of the text
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            tooltip: {
              enabled: true,
            },
          },
        },
        plugins: [
          {
            id: 'centerText',
            beforeDraw(chart) {
              const { width, height } = chart;
              const ctx = chart.ctx;

              // Define text properties
              const titleText = 'Total Budget';
              const valueText = '5000'; // Hardcoded budget value

              ctx.save();
              ctx.font = 'bold 16px Arial'; // Font for title text
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#333'; // Text color

              // Draw "Total Budget" on the first line
              ctx.fillText(titleText, width / 2, height / 2 - 10);

              // Draw "5000" on the second line
              ctx.font = 'bold 20px Arial'; // Larger font for numeric value
              ctx.fillText(valueText, width / 2, height / 2 + 15);

              ctx.restore();
            },
          },
        ],
      });
    }
  }

  navigateToDashboard() {
    this.currentPage = 'dashboard';
  }

  navigateToCreateService() {
    this.router.navigate(['/create-service']);
  }

  navigateToDeleteService() {
    this.router.navigate (['/delete-service']);
  }

  toggleLogoutPopup() {
    this.showLogoutPopup = !this.showLogoutPopup;
  }

  handleLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
