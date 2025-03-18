import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component'; // Ensure HeaderComponent is correctly imported
import { RouterModule } from '@angular/router'; // Import RouterModule here
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterModule, HighchartsChartModule],  // Import RouterModule to enable routing in the root component
  templateUrl: './app.component.html',  // Use the correct template for AppComponent
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular_dashboard';
}
