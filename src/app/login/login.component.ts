import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule

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

  onSubmit() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);
  }
}
