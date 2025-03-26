import { Component } from '@angular/core';
import { SgBmiPerRegionComponent } from '../sg-bmi-per-region/sg-bmi-per-region.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { piecewise } from 'd3';

@Component({
  selector: 'app-dashboard',
  imports: [
    SgBmiPerRegionComponent,
    BarChartComponent,
    PieChartComponent,
  ],
  providers: [],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent { }
