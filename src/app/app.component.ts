import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>', // allows child routes to display here
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'multitenantUI';
}

