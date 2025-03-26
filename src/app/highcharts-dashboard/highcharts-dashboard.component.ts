import { Component, OnDestroy } from '@angular/core';
import { SexPieChartComponent } from '../sex-pie-chart/sex-pie-chart.component';
import { AgeBarChartComponent } from '../age-bar-chart/age-bar-chart.component';

@Component({
  selector: 'app-highcharts-dashboard',
  imports: [
    AgeBarChartComponent,
    SexPieChartComponent,
  ],
  templateUrl: './highcharts-dashboard.component.html',
  styleUrl: './highcharts-dashboard.component.css'
})
export class HighchartsDashboardComponent  {

}
