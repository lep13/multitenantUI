import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // component is standalone
  imports: [FormsModule], // Import FormsModule directly 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private loginService: LoginService, private router: Router) {}

  onSubmit() {
    this.loginService.login(this.username, this.password).subscribe(
      (response) => {
        if (response.success) {
          // Handle successful login, e.g., store token, navigate to admin page
          console.log('Login successful:', response.message);
          this.router.navigate(['/admin']);
        } else {
          console.error('Login failed:', response.message);
        }
      },
      (error) => {
        console.error('Login error:', error);
      }
    );
  }
}
