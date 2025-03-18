import { Component } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { AgeService } from '../services/age.service';

@Component({
  selector: 'app-age-bar-chart',
  imports: [
    HighchartsChartModule,
  ],
  providers: [AgeService],
  templateUrl: './age-bar-chart.component.html',
  styleUrl: './age-bar-chart.component.css'
})
export class AgeBarChartComponent {
  Highcharts = Highcharts;
  ageData: any = [];
  chartOptions: any = {};
  constructor(private ageService: AgeService) { }

  ngOnInit() {
    this.ageService.getAgeData().subscribe(data => {
      // Mapping the age group and customer counts
      const ageGroups = data.map((item: any) => item.age_group);
      const customerCounts = data.map((item: any) => Number(item.customers));
      this.setChartOptions(ageGroups, customerCounts);
    });
  }

  setChartOptions(ageGroups: string[], customerCounts: number[]) {
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Age Bar Chart',
      },
      xAxis: {
        categories: ageGroups,  // Age groups on the x-axis
      },
      yAxis: {
        title: {
          text: 'Number of Customers',
        },
        min: 0,  // Ensuring the y-axis starts from 0
        tickInterval: 50,  // Adjust the interval if necessary
      },
      series: [{
        name: 'Number of Customers',
        data: customerCounts,  // The number of customers should populate the y-values
      }],
    };
  }

}
