import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AgeBarChartComponent } from '../age-bar-chart/age-bar-chart.component';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, AgeBarChartComponent],  // Import the HeaderComponent and AgeBarChartComponent
  templateUrl: './dashboard.component.html',  // Reference the HTML file
  styleUrls: ['./dashboard.component.css'],  // Reference the CSS file
})
export class DashboardComponent {}
