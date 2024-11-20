import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from '../logout/logout.component';

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
  imports: [FormsModule, CommonModule, LogoutComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  currentPage: string = 'dashboard';
  services: Service[] = [];
  showLogoutPopup = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchServices();
    this.renderRingChart();
  }

  fetchServices() {
    this.http.get<Service[]>('http://localhost:5000/api/services').subscribe(
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
