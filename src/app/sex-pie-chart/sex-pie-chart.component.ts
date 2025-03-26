import { Component, OnInit, OnDestroy } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { SexService } from '../services/sex.service';

@Component({
  selector: 'app-sex-pie-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  providers: [SexService],
  templateUrl: './sex-pie-chart.component.html',
  styleUrls: ['./sex-pie-chart.component.css']
})
export class SexPieChartComponent implements OnInit, OnDestroy {
  Highcharts = Highcharts;
  chartOptions: any = {};

  chart: Highcharts.Chart | undefined;

  constructor(private sexService: SexService) { }

  ngOnInit() {
    this.sexService.getSexData().subscribe(data => {
      const sexGroups = data.map((item: { sex: string }) => item.sex);
      const customerCounts = data.map((item: { count: number }) => item.count);
      this.setChartOptions(sexGroups, customerCounts);

      // Check if chartOptions is set before initializing the chart
      if (this.chartOptions && Object.keys(this.chartOptions).length > 0) {
        this.chart = Highcharts.chart('sex-pie-chart', this.chartOptions);
      }
    });
  }

  setChartOptions(sexGroups: string[], customerCounts: number[]) {
    const chartData = sexGroups.map((group, index) => ({
      name: group,
      y: Number(customerCounts[index])
    }));

    this.chartOptions = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Gender Distribution Pie Chart'
      },
      tooltip: {
        headerFormat: '',
        pointFormat:
          '<span style="color:{point.color}">\u25cf</span> ' +
          '{point.name}: <b>{point.percentage:.1f}%</b>' // Format to 1 decimal place
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          borderWidth: 2,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
            distance: 20
          }
        }
      },

      series: [{
        enableMouseTracking: true,
        colorByPoint: true,
        data: chartData
      }]
    };
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy(); // Properly destroy the chart when the component is destroyed
    }
  }
}
