import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

interface LoginResponse {
  success: boolean;
  message: string;
  redirectURL?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private loginService: LoginService, private router: Router) {}

  onSubmit() {
    this.loginService.login(this.username, this.password).subscribe(
      (response: LoginResponse) => {
        if (response.success) {
          const redirectUrl = response.redirectURL || '/';
          console.log('Login successful:', response.message);
          this.router.navigate([redirectUrl]);
        } else {
          console.error('Login failed:', response.message);
          this.errorMessage = response.message;
        }
      },
      (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'An error occurred during login. Please try again.';
      }
    );
  }
}
