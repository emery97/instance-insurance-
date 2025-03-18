import { Component } from '@angular/core';
import { AgeBarChartComponent } from '../age-bar-chart/age-bar-chart.component';
import { AgeService } from '../services/age.service';
import { SexPieChartComponent } from '../sex-pie-chart/sex-pie-chart.component';
import { BmiDrillDownComponent } from '../bmi-drill-down/bmi-drill-down.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    AgeBarChartComponent,
    SexPieChartComponent,
    BmiDrillDownComponent
  ],
  providers: [AgeService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent { }
