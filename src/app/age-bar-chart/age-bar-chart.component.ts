import { Component, OnInit,OnDestroy } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { AgeService } from '../services/age.service';

@Component({
  selector: 'app-age-bar-chart',
  imports: [
    HighchartsChartModule,
  ],
  standalone: true, 
  providers: [AgeService],
  templateUrl: './age-bar-chart.component.html',
  styleUrl: './age-bar-chart.component.css'
})

export class AgeBarChartComponent implements OnInit, OnDestroy {
  Highcharts = Highcharts;
  chartOptions: any = {};
  chart: Highcharts.Chart | undefined;

  constructor(private ageService: AgeService) {}

  ngOnInit() {
    this.ageService.getAgeData().subscribe((data) => {
      const ageGroups = data.map((item: any) => item.age_group);
      const customerCounts = data.map((item: any) => Number(item.customers));
      this.setChartOptions(ageGroups, customerCounts);
  
      // Check if chartOptions is set before initializing the chart
      if (this.chartOptions && Object.keys(this.chartOptions).length > 0) {
        this.chart = Highcharts.chart('age-bar-chart', this.chartOptions);
      }
    });
  }
  

  setChartOptions(ageGroups: string[], customerCounts: number[]) {
    this.chartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Age Bar Chart'
      },
      xAxis: {
        categories: ageGroups
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Number of Customers'
        }
      },
      series: [{
        name: 'Customers',
        data: customerCounts
      }]
    };
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy(); // Properly destroy the chart when the component is destroyed
    }
  }

}
