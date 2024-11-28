import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from '../logout/logout.component';
import { InfoService } from '../services/info.service';
import { FilterPipe } from '../filter.pipe';
import { UserService } from '../services/user.service';

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
  username: string = '';
  tag: string = 'Loading...'; // Placeholder for profile tag
  userEmail: string = 'Loading...'; // Placeholder for email
  currentPage: string = 'dashboard';
  services: Service[] = [];
  userGroupId: string | null = null; // Group ID of the logged-in user
  managerName: string | null = null; // Manager name of the user's group
  groupName: string | null = null;  
  totalbudget: number | null = null; 
  showLogoutPopup = false;
  searchTerm: string = '';
  groupMembers: string[] = []; // Members of the user's group
  totalAwsServices: number = 0; // Total AWS services
  totalGcpServices: number = 0; // Total GCP services
  runningAwsServices: number = 0; // Running AWS services
  runningGcpServices: number = 0; // Running GCP services
  ringChart: Chart<'doughnut', number[], string> | null = null;
  selectedGroup: { budget: number | null } | null = null;

  constructor(private http: HttpClient, private router: Router, private infoService: InfoService, private userService: UserService) {}

  ngOnInit(): void {
    // this.fetchServices();
    this.renderRingChart();
    this.fetchUserGroup();
    this.populateUser();
  }

    // Populate username and fetch additional profile details
    populateUser() {
      const username = this.infoService.getUsername();
      if (username) {
        this.username = username;
        this.fetchProfileDetails(); // Fetch profile details (tag, email)
      } else {
        console.error('Failed to fetch manager username from token.');
      }
    }

      // Fetch profile details like email and tag
  fetchProfileDetails() {
    this.infoService.getUserInfo(this.username).subscribe(
      (data) => {
        this.tag = data.tag;
        this.userEmail = data.email;
      },
      (error) => {
        console.error('Error fetching user info:', error);
        this.tag = 'Unknown';
        this.userEmail = 'Unknown';
      }
    );
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
            this.userGroupId = response.group_id;
            this.managerName = response.manager;
            this.groupMembers = response.members;
  
            // Fetch the group name
            this.fetchGroupName(this.userGroupId);
  
            // Fetch the budget for the group
            this.userService.getGroupBudget(this.userGroupId).subscribe(
              (budgetResponse: { budget: number }) => {
                this.totalbudget = budgetResponse.budget; // Set the total budget dynamically
                this.renderRingChart(); // Update the ring chart with the actual budget
              },
              (error: any) => {
                console.error('Error fetching group budget:', error);
              }
            );
  
            this.fetchServices();
          },
          (error: any) => {
            console.error('Error fetching user group:', error);
          }
        );
    } else {
      console.error('Username not found');
    }
  }    

  fetchGroupName(groupId: string): void {
    this.http
      .get<{ group_name: string }>(`http://localhost:5000/api/group-name?group_id=${groupId}`)
      .subscribe(
        (response) => {
          this.groupName = response.group_name; // Update the group name for the Group Details card
        },
        (error) => {
          console.error('Error fetching group name:', error);
          this.groupName = 'N/A'; // Fallback if group name cannot be fetched
        }
      );
  }  

  // Fetch services belonging to the user's group
  fetchServices(): void {
    if (!this.userGroupId) {
      console.error('User group ID not found');
      return;
    }
  
    this.http
      .get<any[]>(`http://localhost:5000/api/services?group_id=${this.userGroupId}`)
      .subscribe(
        (services) => {
          // Total services for AWS and GCP
          this.totalAwsServices = services.filter(
            (service) => service.provider === 'aws'
          ).length;
          this.totalGcpServices = services.filter(
            (service) => service.provider === 'gcp'
          ).length;
  
          // Running services for AWS and GCP
          this.runningAwsServices = services.filter(
            (service) => service.provider === 'aws' && service.status === 'running'
          ).length;
          this.runningGcpServices = services.filter(
            (service) => service.provider === 'gcp' && service.status === 'running'
          ).length;
  
          // Save the services to display in the table
          this.services = services;
        },
        (error) => {
          console.error('Error fetching services:', error);
        }
      );
  }  

  renderRingChart() {
    const canvas = document.getElementById('ringChart') as HTMLCanvasElement;
  
    if (!canvas) {
      console.error('Canvas element for ring chart not found.');
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (this.ringChart) {
        this.ringChart.destroy();
      }
  
      const totalBudget = this.totalbudget || 0;
      const consumedBudget = 40; // Placeholder for consumed
      const remainingBudget = totalBudget - consumedBudget;
  
      canvas.style.width = '250px';
      canvas.style.height = '250px';
  
      this.ringChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Consumed Budget', 'Remaining Budget'],
          datasets: [
            {
              data: [consumedBudget, remainingBudget],
              backgroundColor: ['#ff6384', '#36a2eb'],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              display: false, // Disable Chart.js legend
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
              const ctx = chart.ctx;
              const { width, height } = chart;
  
              ctx.save();
  
              // Title text
              ctx.font = 'bold 14px Arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#333';
              ctx.fillText('Total Budget', width / 2, height / 2 - 10);
  
              // Budget value
              ctx.font = 'bold 18px Arial';
              ctx.fillText(`$${totalBudget}`, width / 2, height / 2 + 10);
  
              ctx.restore();
            },
          },
        ],
      });
    } else {
      console.error('2D context for ring chart not found.');
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

