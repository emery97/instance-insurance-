import { Component } from '@angular/core';
import { LandingPageComponent } from './landing-page/landing-page.component'; // Make sure it's correctly imported
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LandingPageComponent, HeaderComponent, RouterModule], // Make sure this is here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular_dashboard';
}
