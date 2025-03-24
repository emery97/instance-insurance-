import { Component } from '@angular/core';
import { AgeBarChartComponent } from '../age-bar-chart/age-bar-chart.component';
import { AgeService } from '../services/age.service';
import { SexPieChartComponent } from '../sex-pie-chart/sex-pie-chart.component';
import { BmiDrillDownComponent } from '../bmi-vs-age-scatter-plot/bmi-vs-age-scatter-plot.component';
import { BmiPerRegionComponent } from '../bmi-per-region/bmi-per-region.component';
import { SgBmiPerRegionComponent } from '../sg-bmi-per-region/sg-bmi-per-region.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    AgeBarChartComponent,
    SexPieChartComponent,
    BmiDrillDownComponent,
    BmiPerRegionComponent,
    SgBmiPerRegionComponent,
  ],
  providers: [AgeService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent { }
