import { Component } from '@angular/core';
import { AgeBarChartComponent } from '../age-bar-chart/age-bar-chart.component';
import { AgeService } from '../services/age.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    AgeBarChartComponent,
  ],
  providers: [AgeService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent { }
