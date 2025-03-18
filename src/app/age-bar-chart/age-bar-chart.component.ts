import { Component } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { AgeService } from '../services/age.service';

@Component({
  selector: 'app-age-bar-chart',
  imports: [
    HighchartsChartModule,
    AgeService
  ],
  templateUrl: './age-bar-chart.component.html',
  styleUrl: './age-bar-chart.component.css'
})
export class AgeBarChartComponent {
  Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart:{
      type: 'column'
    },
    title: {
      text: 'Age Bar Chart'
    },
    xAxis: {
      categories: ['A', 'B', 'C']
    },
    yAxis: {
      title: {
        text: 'Age'
      }
    },
    series: [{
      data: [1, 2, 3],
      type: 'line',
    }]
  }
}
