import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../services/manager.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LogoutComponent } from '../logout/logout.component';
import { InfoService } from '../services/info.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface Group {
  _id: string;
  group_name: string;
  members: string[];
  manager: string;
  budget?: number;
  group_id: string;
}

interface Manager {
  username: string;
  group_limit: number;
}

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [FormsModule, CommonModule, LogoutComponent],
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})

export class ManagerComponent implements OnInit {
  managerUsername: string = ''; // Manager's username
  tag: string = 'Loading...'; // Placeholder for profile tag
  managerEmail: string = 'Loading...'; // Placeholder for email
  groups: Group[] = []; // List of groups managed by the manager
  selectedGroup: Group | null = null; // Currently selected group
  currentPage: string = 'dashboard'; // Current active sidebar page
  showLogoutPopup = false; // Logout popup state
  responseMessage: string = ''; // Response messages for user feedback
  members: string[] = []; // Members for the selected group
  groupLimit: number = 0; // Manager's group limit
  groupsCreated: number = 0; // Number of groups created
  awsServiceData: { service: string; total: number; running: number }[] = []; // AWS service data for the chart
  gcpServiceData: { service: string; total: number; running: number }[] = [];
  awsChart: Chart | null = null;
  gcpChart: Chart | null = null;
  ringChart: Chart<"doughnut", number[], string> | null = null;

  constructor(
    private managerService: ManagerService,
    private infoService: InfoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.populateActualManager(); // Fetch manager username
    this.fetchGroups(); // Load groups managed by the manager
    this.fetchGroupLimit(); // Fetch group limit for the manager
    // this.renderRingChart();
  }

  // Populate manager's username and fetch additional profile details
  populateActualManager() {
    const username = this.infoService.getUsername();
    if (username) {
      this.managerUsername = username;
      this.fetchProfileDetails(); // Fetch profile details (tag, email)
    } else {
      console.error('Failed to fetch manager username from token.');
    }
  }

  // Fetch profile details like email and tag
  fetchProfileDetails() {
    this.infoService.getUserInfo(this.managerUsername).subscribe(
      (data) => {
        this.tag = data.tag;
        this.managerEmail = data.email;
      },
      (error) => {
        console.error('Error fetching user info:', error);
        this.tag = 'Unknown';
        this.managerEmail = 'Unknown';
      }
    );
  }

  // Fetch groups managed by the current manager
  fetchGroups() {
    this.managerService.getGroupsByManager(this.managerUsername).subscribe(
      (response: { status: string; data: Group[]; message: string }) => {
        if (response.status === 'success') {
          this.groups = response.data;
          this.groupsCreated = this.groups.length; // Count the groups created
          this.responseMessage = '';
        } else {
          this.responseMessage = response.message;
        }
      },
      (error: any) => {
        console.error('An error occurred while fetching groups:', error);
        this.responseMessage = 'An error occurred while fetching groups.';
      }
    );
  }

  // Fetch manager's group limit
  fetchGroupLimit() {
    this.managerService.getManagers().subscribe(
      (data: Manager[]) => {
        const manager = data.find((m) => m.username === this.managerUsername);
        if (manager) {
          this.groupLimit = manager.group_limit;
        }
      },
      (error) => {
        console.error('Error fetching manager group limit:', error);
      }
    );
  }

  // Handle group selection and fetch members
  onGroupSelect(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const groupName = selectElement.value;
  
    this.selectedGroup = this.groups.find((group) => group.group_name === groupName) || null;
  
    if (this.selectedGroup) {
      this.members = this.selectedGroup.members; // Populate members
      const groupId = this.selectedGroup.group_id; // Fetch group_id
      const totalBudget = this.selectedGroup.budget || 0; // Fetch budget of the selected group
  
      this.fetchAwsServices(groupId); // Fetch AWS services
      this.fetchGcpServices(groupId); // Fetch GCP services
      this.fetchBudgetUsage(); // Render the ring chart
    }
  }    

  fetchBudgetUsage() {
    if (!this.selectedGroup) return;
    this.renderRingChart(); // Re-render the chart whenever the group changes
  }

   // Fetch AWS services and aggregate data for the chart
   fetchAwsServices(groupId: string) {
    this.managerService.getServicesByGroup(groupId).subscribe(
      (services: any[]) => {
        const awsServices = services.filter((service) => service.provider === 'aws');
        const serviceMap: { [key: string]: string } = {
          'Amazon EC2 (Elastic Compute Cloud)': 'EC2',
          'Amazon S3 (Simple Storage Service)': 'S3',
          'AWS Lambda': 'Lambda',
          'Amazon RDS (Relational Database Service)': 'RDS',
          'AWS CloudFront': 'CloudFront',
          'Amazon VPC (Virtual Private Cloud)': 'VPC',
        };
  
        // Aggregate service data
        const aggregatedData = Object.entries(serviceMap).map(([fullName, shortName]) => {
          const total = awsServices.filter((service) => service.service === fullName).length;
          const running = awsServices.filter(
            (service) => service.service === fullName && service.status === 'running'
          ).length;
          return { service: shortName, total, running };
        });
  
        this.awsServiceData = aggregatedData; // Update the data for the chart
        this.renderAwsChart(); // Render the chart
      },
      (error: any) => {
        console.error('Error fetching AWS services:', error);
      }
    );
  }  

  // Render AWS chart
  renderAwsChart() {
    const canvas = <HTMLCanvasElement>document.getElementById('awsChart');
    if (!canvas) {
      console.error('Canvas element for AWS chart not found.');
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (this.awsChart) {
        this.awsChart.destroy(); // Destroy the previous chart if it exists
      }
  
      this.awsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.awsServiceData.map((data) => data.service),
          datasets: [
            {
              label: 'Total',
              data: this.awsServiceData.map((data) => data.total),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Running',
              data: this.awsServiceData.map((data) => data.running),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'AWS Services Breakdown',
            },
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } else {
      console.error('2D context for AWS chart not found.');
    }
  }  
  
  fetchGcpServices(groupId: string) {
    this.managerService.getServicesByGroup(groupId).subscribe(
      (services: any[]) => {
        const gcpServices = services.filter((service) => service.provider === 'gcp');
        const serviceMap: { [key: string]: string } = {
          'Compute Engine': 'Compute',
          'Cloud Storage': 'Storage',
          'Google Kubernetes Engine (GKE)': 'GKE',
          'Cloud SQL': 'SQL',
          'BigQuery': 'BigQuery',
        };
  
        // Aggregate service data
        const aggregatedData = Object.entries(serviceMap).map(([fullName, shortName]) => {
          const total = gcpServices.filter((service) => service.service === fullName).length;
          const running = gcpServices.filter(
            (service) => service.service === fullName && service.status === 'running'
          ).length;
          return { service: shortName, total, running };
        });
  
        this.gcpServiceData = aggregatedData; // Update the data for the chart
        this.renderGcpChart(); // Render the chart
      },
      (error: any) => {
        console.error('Error fetching GCP services:', error);
      }
    );
  }  
  renderGcpChart() {
    const canvas = <HTMLCanvasElement>document.getElementById('gcpChart');
    if (!canvas) {
      console.error('Canvas element for GCP chart not found.');
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (this.gcpChart) {
        this.gcpChart.destroy(); // Destroy the previous chart if it exists
      }
  
      this.gcpChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.gcpServiceData.map((data) => data.service),
          datasets: [
            {
              label: 'Total',
              data: this.gcpServiceData.map((data) => data.total),
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
            {
              label: 'Running',
              data: this.gcpServiceData.map((data) => data.running),
              backgroundColor: 'rgba(255, 159, 64, 0.6)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'GCP Services Breakdown',
            },
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } else {
      console.error('2D context for GCP chart not found.');
    }
  }

  renderRingChart() {
    const canvas = document.getElementById('ringChart') as HTMLCanvasElement;
    if (this.ringChart) this.ringChart.destroy(); // Destroy previous chart if it exists
    if (!canvas || !this.selectedGroup) return; // Return if no canvas or no group selected
  
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const totalBudget = this.selectedGroup.budget || 0; // Get the group's budget
      const consumedBudget = 40; // Placeholder for consumed budget
      const remainingBudget = totalBudget - consumedBudget;
  
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
              display: false, // Custom legend handling
            },
            tooltip: {
              enabled: true,
            },
          },
          onClick: (evt, elements, chart) => {
            console.log('Chart clicked!');
          },
        },
        plugins: [
          {
            id: 'centerText',
            beforeDraw(chart) {
              const { width, height } = chart;
              const ctx = chart.ctx;
  
              const titleText = 'Total Budget';
              const valueText = `${totalBudget}`;
  
              ctx.save();
              ctx.font = 'bold 14px Arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#333';
  
              // Draw title
              ctx.fillText(titleText, width / 2, height / 2 - 10);
  
              // Draw value
              ctx.font = 'bold 18px Arial';
              ctx.fillText(valueText, width / 2, height / 2 + 15);
  
              ctx.restore();
            },
          },
        ],
      });
    }
  }
  
  // Toggle logout popup
  toggleLogoutPopup() {
    this.showLogoutPopup = !this.showLogoutPopup;
  }

  // Sidebar navigation
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

  // Handle logout functionality
  handleLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
