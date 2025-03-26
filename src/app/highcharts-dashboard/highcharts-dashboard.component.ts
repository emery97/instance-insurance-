import { Component, OnDestroy } from '@angular/core';
import { SexPieChartComponent } from '../sex-pie-chart/sex-pie-chart.component';
import { AgeBarChartComponent } from '../age-bar-chart/age-bar-chart.component';
import { BmiDrillDownComponent } from '../bmi-vs-age-scatter-plot/bmi-vs-age-scatter-plot.component';

@Component({
  selector: 'app-highcharts-dashboard',
  imports: [
    AgeBarChartComponent,
    SexPieChartComponent,
    BmiDrillDownComponent,
  ],
  templateUrl: './highcharts-dashboard.component.html',
  styleUrl: './highcharts-dashboard.component.css'
})
export class HighchartsDashboardComponent  {

}
