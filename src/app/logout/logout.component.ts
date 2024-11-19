import { Component, Output, EventEmitter } from '@angular/core';
import { InfoService } from '../services/info.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  @Output() onLogout = new EventEmitter<void>();
  username: string | null = null;
  tag: string = 'Loading...'; // Placeholder for tag
  email: string = 'Loading...'; // Placeholder for email

  constructor(private infoService: InfoService) {}

  ngOnInit() {
    // Fetch the username from the BehaviorSubject in UserService
    this.username = this.infoService.getUsername();

    if (this.username) {
      // Fetch additional user data (tag and email) using the username
      this.infoService.getUserInfo(this.username).subscribe(
        (data) => {
          this.tag = data.tag;
          this.email = data.email;
        },
        (error) => {
          console.error('Error fetching user info:', error);
          this.tag = 'Unknown';
          this.email = 'Unknown';
        }
      );
    } else {
      console.error('No username found in JWT token');
      this.tag = 'Unknown';
      this.email = 'Unknown';
    }
  }

  logout() {
    this.onLogout.emit();
  }

}
